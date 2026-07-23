import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Code2,
  Eye,
  Lightbulb,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  TriangleAlert,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "./utils/cn";
import {
  difficulties,
  exerciseLangs,
  exercises,
  type Exercise,
  type ExerciseLang,
} from "./exercises";

type RunResult = { stdout: string; error: string | null };
type Status = "idle" | "loading" | "pass" | "fail" | "error" | "ran" | "preview";

const SOLVED_KEY = "codecampus-exercises";

function loadSolved(): Set<string> {
  try {
    const raw = localStorage.getItem(SOLVED_KEY);
    return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

const norm = (s: string) =>
  s
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.replace(/\s+$/g, ""))
    .join("\n")
    .trim();

/* ------------------------------ Chargeurs CDN ------------------------------ */

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.dataset.src = src;
    s.onload = () => resolve();
    s.onerror = () =>
      reject(new Error("Impossible de charger le moteur d'exécution (vérifiez votre connexion Internet)."));
    document.head.appendChild(s);
  });
}

let pyReady: Promise<unknown> | null = null;
async function runPython(code: string): Promise<RunResult> {
  if (!pyReady) {
    pyReady = (async () => {
      await loadScript("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");
      return await (window as unknown as { loadPyodide: () => Promise<unknown> }).loadPyodide();
    })();
  }
  const py = (await pyReady) as {
    setStdout: (o: { batched: (s: string) => void }) => void;
    setStderr: (o: { batched: (s: string) => void }) => void;
    runPythonAsync: (c: string) => Promise<unknown>;
  };
  let out = "";
  py.setStdout({ batched: (s: string) => { out += s; } });
  py.setStderr({ batched: (s: string) => { out += s; } });
  try {
    await py.runPythonAsync(code);
    return { stdout: out.replace(/\n+$/, ""), error: null };
  } catch (e) {
    return { stdout: out.replace(/\n+$/, ""), error: e instanceof Error ? e.message : String(e) };
  }
}

let sqlReady: Promise<unknown> | null = null;
async function runSQL(code: string): Promise<RunResult> {
  if (!sqlReady) {
    sqlReady = (async () => {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js");
      return await (
        window as unknown as {
          initSqlJs: (o: { locateFile: (f: string) => string }) => Promise<unknown>;
        }
      ).initSqlJs({
        locateFile: (f) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${f}`,
      });
    })();
  }
  const SQL = (await sqlReady) as {
    Database: new () => {
      exec: (c: string) => { columns: string[]; values: unknown[][] }[];
      close: () => void;
    };
  };
  const db = new SQL.Database();
  let out = "";
  try {
    const res = db.exec(code);
    for (const r of res) {
      out += r.columns.join(" | ") + "\n";
      for (const row of r.values) {
        out += row.map((c) => (c === null ? "NULL" : String(c))).join(" | ") + "\n";
      }
    }
    return { stdout: out.replace(/\n+$/, ""), error: null };
  } catch (e) {
    return { stdout: out, error: e instanceof Error ? e.message : String(e) };
  } finally {
    db.close();
  }
}

function runJS(code: string): Promise<RunResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.style.display = "none";
    const logs: string[] = [];
    let finished = false;

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      iframe.remove();
    };
    const done = (res: RunResult) => {
      if (finished) return;
      finished = true;
      cleanup();
      resolve(res);
    };
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.__codecampus !== true) return;
      if (data.type === "__done") done({ stdout: logs.join("\n"), error: null });
      else if (data.type === "error") done({ stdout: logs.join("\n"), error: String(data.text) });
      else logs.push(String(data.text));
    };

    window.addEventListener("message", onMessage);
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    if (!doc) {
      done({ stdout: "", error: "Impossible de créer l'environnement d'exécution." });
      return;
    }
    doc.open();
    doc.write(
      `<script>
        (function(){
          function send(t, args){
            var text = args.map(function(x){
              try { return typeof x === 'object' ? JSON.stringify(x) : String(x); }
              catch(e){ return String(x); }
            }).join(' ');
            parent.postMessage({ __codecampus: true, type: t, text: text }, '*');
          }
          ['log','info','warn','error'].forEach(function(m){
            var o = console[m];
            console[m] = function(){ send(m, [].slice.call(arguments)); o.apply(console, arguments); };
          });
          window.onerror = function(msg){ send('error', [String(msg)]); };
          try {
            ${code}
          } catch(e){
            send('error', [e && e.message ? e.message : String(e)]);
          }
          setTimeout(function(){ parent.postMessage({ __codecampus: true, type: '__done' }, '*'); }, 0);
        })();
      <\/script>`,
    );
    doc.close();
    window.setTimeout(
      () => done({ stdout: logs.join("\n"), error: "Exécution interrompue : boucle infinie ou délai dépassé." }),
      4000,
    );
  });
}

/* -------------------------------- Éditeur -------------------------------- */

function CodeEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const lineCount = Math.max(value.split("\n").length, 1);

  const syncScroll = () => {
    if (gutterRef.current && taRef.current) {
      gutterRef.current.scrollTop = taRef.current.scrollTop;
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const next = value.slice(0, start) + "  " + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="flex overflow-hidden rounded-xl border border-black/15 bg-[#0c1622] font-mono text-[13px] leading-6">
      <div
        ref={gutterRef}
        aria-hidden
        className="select-none overflow-hidden border-r border-white/10 py-4 pl-3 pr-2 text-right text-white/25"
      >
        {Array.from({ length: lineCount }).map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={handleKey}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        placeholder={placeholder}
        className="h-72 w-full resize-none bg-transparent py-4 pr-4 text-[#dfe7f1] outline-none placeholder:text-white/25 sm:h-[22rem]"
      />
    </div>
  );
}

/* ------------------------------- Playground ------------------------------- */

export default function Playground() {
  const [lang, setLang] = useState<ExerciseLang>("js");
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("Tous");
  const list = useMemo(
    () => exercises.filter((e) => e.lang === lang && (difficulty === "Tous" || e.difficulty === difficulty)),
    [lang, difficulty],
  );
  const [activeId, setActiveId] = useState<string>(list[0].id);
  const active = exercises.find((e) => e.id === activeId) ?? exercises[0];

  const [code, setCode] = useState(active.starter);
  const [result, setResult] = useState<RunResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solved, setSolved] = useState<Set<string>>(() => loadSolved());

  const langMeta = exerciseLangs.find((l) => l.id === active.lang)!;

  // Réinitialise l'éditeur quand on change d'exercice ou de langage.
  useEffect(() => {
    setCode(active.starter);
    setResult(null);
    setStatus("idle");
    setShowHint(false);
    setShowSolution(false);
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Quand on change de langage ou de difficulté, on cible le premier exercice.
  useEffect(() => {
    if (list[0]) setActiveId(list[0].id);
  }, [lang, difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  const markSolved = (id: string) => {
    setSolved((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(SOLVED_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const reset = () => {
    setCode(active.starter);
    setResult(null);
    setStatus("idle");
  };

  const evaluate = (value: string, out: string): "pass" | "fail" | "ran" => {
    if (active.check) return active.check(active.lang === "web" ? value : out) ? "pass" : "fail";
    if (active.expected) return norm(out) === norm(active.expected) ? "pass" : "fail";
    return "ran";
  };

  const run = async () => {
    setShowSolution(false);
    if (active.lang === "web") {
      const verdict = evaluate(code, "");
      setStatus(verdict === "pass" ? "pass" : "preview");
      if (verdict === "pass") markSolved(active.id);
      return;
    }
    if (!langMeta.runnable) {
      setStatus("error");
      setResult({
        stdout: "",
        error:
          "Ce langage compilé ne peut pas s'exécuter directement dans le navigateur. Compare ton code à la solution pour vérifier.",
      });
      return;
    }

    setStatus("loading");
    try {
      const r = active.lang === "js"
        ? await runJS(code)
        : active.lang === "python"
          ? await runPython(code)
          : await runSQL(code);
      setResult(r);
      if (r.error) {
        setStatus("error");
      } else {
        const verdict = evaluate(code, r.stdout);
        setStatus(verdict);
        if (verdict === "pass") markSolved(active.id);
      }
    } catch (e) {
      setStatus("error");
      setResult({ stdout: "", error: e instanceof Error ? e.message : String(e) });
    }
  };

  return (
    <section id="exercices" className="min-h-screen bg-[#0b1722] pt-24 text-white md:pt-28">
      <div className="page-shell pb-20">
        {/* En-tête */}
        <div className="border-b border-white/10 pb-9">
          <p className="section-kicker">Atelier de code</p>
          <h2 className="font-display mt-3 max-w-[760px] text-[clamp(2.4rem,5vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.055em]">
            Codez directement ici.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/55">
            Écrivez votre code, exécutez-le dans le navigateur et obtenez une correction instantanée. JavaScript, HTML/CSS, Python et SQL tournent pour de vrai.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Liste des exercices */}
          <aside className="lg:max-h-[70vh] lg:overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {exerciseLangs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLang(item.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-bold transition",
                    lang === item.id
                      ? "border-[#ff6b47] bg-[#ff6b47] text-[#15120f]"
                      : "border-white/15 text-white/60 hover:border-white/35 hover:text-white",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-bold transition",
                    difficulty === d ? "bg-white/15 text-white" : "text-white/45 hover:text-white",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>

            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-white/35">
              {list.length} exercice{list.length > 1 ? "s" : ""} · {list.filter((e) => solved.has(e.id)).length} réussi{list.filter((e) => solved.has(e.id)).length > 1 ? "s" : ""}
            </p>

            <div className="mt-4 space-y-2">
              {list.map((ex, index) => {
                const isActive = ex.id === activeId;
                const isSolved = solved.has(ex.id);
                return (
                  <button
                    key={ex.id}
                    onClick={() => setActiveId(ex.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition",
                      isActive
                        ? "border-[#ff6b47]/60 bg-white/[0.06]"
                        : "border-white/10 hover:border-white/25 hover:bg-white/[0.03]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                        isSolved
                          ? "bg-[#3fae7f] text-white"
                          : isActive
                            ? "bg-white/15 text-white"
                            : "bg-white/5 text-white/40",
                      )}
                    >
                      {isSolved ? <Check size={13} strokeWidth={3} /> : index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{ex.title}</span>
                      <span className="text-[11px] text-white/40">{ex.difficulty}</span>
                    </span>
                    {!exerciseLangs.find((l) => l.id === ex.lang)!.runnable && (
                      <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/40">
                        Lecture
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Éditeur + sortie */}
          <div className="space-y-4">
            {/* Énoncé */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#ff896d]">
                <Code2 size={15} /> {langMeta.label} · <span className="text-white/50 normal-case tracking-normal">{active.difficulty}</span>
              </div>
              <p className="text-[15px] leading-7 text-white/85">{active.prompt}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold text-white/55">
                🎯 Applique : <span className="text-[#9fd7d1]">{active.concept}</span>
              </p>
            </div>

            {/* Barre d'outils */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={run}
                disabled={status === "loading"}
                className="inline-flex items-center gap-2 rounded-full bg-[#ff6b47] px-5 py-2.5 text-sm font-bold text-[#15120f] transition hover:bg-[#ff8567] disabled:opacity-60"
              >
                {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                {active.lang === "web" ? "Actualiser l'aperçu" : "Exécuter"}
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-bold text-white/75 transition hover:border-white/35 hover:text-white"
              >
                <RotateCcw size={15} /> Réinitialiser
              </button>
              <button
                onClick={() => setShowHint((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-bold text-white/75 transition hover:border-white/35 hover:text-white"
              >
                <Lightbulb size={15} /> Indice
              </button>
              <button
                onClick={() => setShowSolution((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-bold text-white/75 transition hover:border-white/35 hover:text-white"
              >
                <Sparkles size={15} /> Solution
              </button>
            </div>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-start gap-2.5 rounded-xl border border-[#ffd96b]/40 bg-[#fff8e6]/10 px-4 py-3 text-[13px] leading-6 text-[#ffe39a]"
              >
                <Lightbulb size={16} className="mt-0.5 shrink-0 text-[#e0a800]" /> {active.hint}
              </motion.div>
            )}

            {/* Éditeur ou solution */}
            <CodeEditor value={code} onChange={setCode} placeholder="Écris ton code ici…" />

            {showSolution && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-[#3fae7f]/30 bg-[#e9f6ef]/[0.04] p-4">
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#7fe0b0]">
                  <Check size={14} /> Solution proposée
                </p>
                <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[13px] leading-6 text-[#bff0d6]">{active.solution}</pre>
                <button
                  onClick={() => { setCode(active.solution); setShowSolution(false); }}
                  className="mt-3 text-xs font-bold text-[#7fe0b0] underline underline-offset-4"
                >
                  Copier dans l'éditeur
                </button>
              </motion.div>
            )}

            {/* Sortie */}
            <OutputPanel active={active} code={code} result={result} status={status} />
          </div>
        </div>
      </div>
    </section>
  );
}

function OutputPanel({
  active,
  code,
  result,
  status,
}: {
  active: Exercise;
  code: string;
  result: RunResult | null;
  status: Status;
}) {
  const isWeb = active.lang === "web";
  const showPreview = isWeb && (status === "preview" || status === "pass");

  return (
    <div className="overflow-hidden rounded-xl border border-black/15 bg-[#0c1622]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
          {isWeb ? <Eye size={13} /> : <Terminal size={13} />} {isWeb ? "Aperçu" : "Console"}
        </span>
        <StatusBadge status={status} />
      </div>

      <div className="p-4">
        {status === "loading" && (
          <p className="flex items-center gap-2 py-6 text-sm text-white/60">
            <Loader2 size={16} className="animate-spin" /> Chargement du moteur d'exécution…
          </p>
        )}

        {showPreview && (
          <iframe
            title="Aperçu"
            className="h-64 w-full rounded-lg border border-white/10 bg-white"
            srcDoc={code}
            sandbox="allow-scripts"
          />
        )}

        {!showPreview && status !== "loading" && (
          <>
            {result?.error ? (
              <p className="flex items-start gap-2 py-2 font-mono text-[13px] leading-6 text-[#ff9b9b]">
                <TriangleAlert size={15} className="mt-0.5 shrink-0" /> {result.error}
              </p>
            ) : result && result.stdout ? (
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[13px] leading-6 text-[#9fd7d1]">{result.stdout}</pre>
            ) : (
              <p className="py-6 text-center text-sm text-white/35">
                {isWeb ? "Cliquez sur « Actualiser l'aperçu » pour voir le rendu." : "Cliquez sur « Exécuter » pour voir le résultat."}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "idle" || status === "loading") return null;
  const map = {
    pass: { icon: Trophy, text: "Bravo, c'est juste !", cls: "bg-[#3fae7f]/15 text-[#7fe0b0]" },
    fail: { icon: X, text: "Pas encore — recommence", cls: "bg-[#ffd96b]/15 text-[#ffe39a]" },
    error: { icon: TriangleAlert, text: "Erreur", cls: "bg-[#ff5b5b]/15 text-[#ff9b9b]" },
    ran: { icon: ChevronRight, text: "Exécuté sans erreur", cls: "bg-white/10 text-white/60" },
    preview: { icon: Eye, text: "Aperçu", cls: "bg-white/10 text-white/60" },
  } as const;
  const item = map[status];
  const Icon = item.icon;
  return (
    <span className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold", item.cls)}>
      <Icon size={12} /> {item.text}
    </span>
  );
}
