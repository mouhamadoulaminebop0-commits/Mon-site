import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  GraduationCap,
  Lightbulb,
  ListTree,
  PartyPopper,
  Play,
  PlayCircle,
  RotateCcw,
  Sparkles,
  Terminal,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "./utils/cn";
import { flattenLessons, fullLessonId, type Lesson, type Quiz } from "./lessons";
import { videoCatalog, watchUrl } from "./videos";

/** Sous-ensemble du type Course suffisant pour le lecteur (évite une dépendance circulaire). */
type LessonCourse = {
  id: string;
  title: string;
  monogram: string;
  accent: string;
  ink: string;
  level: string;
};

/* ----------------------------- Coloration syntaxique ----------------------------- */

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while",
  "class", "new", "typeof", "import", "export", "from", "await", "async",
  "of", "in", "try", "catch", "throw", "break", "continue", "switch", "case",
  "default", "do", "void",
  "def", "elif", "True", "False", "None", "print", "range", "with", "as",
  "is", "not", "and", "or", "lambda", "self", "yield", "pass", "del", "global",
  "public", "private", "protected", "static", "int", "double", "float", "char",
  "boolean", "String", "final", "extends", "implements", "this", "super",
  "package", "interface", "abstract", "throws",
  "struct", "include", "unsigned", "long", "short", "signed", "sizeof",
  "malloc", "free", "scanf", "printf", "const",
  "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET",
  "DELETE", "CREATE", "TABLE", "PRIMARY", "KEY", "FOREIGN", "REFERENCES",
  "VARCHAR", "TEXT", "DATE", "BOOLEAN", "NOT", "NULL", "UNIQUE", "DEFAULT",
  "ORDER", "BY", "ASC", "DESC", "LIMIT", "AND", "OR", "LIKE",
]);

const TOKEN_RE =
  /(\/\/[^\n]*|\/\*.*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d[\d_]*\.?\d*\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\w\s$])/g;

function highlight(line: string) {
  const nodes: React.ReactNode[] = [];
  let match: RegExpExecArray | null;
  let i = 0;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(line)) !== null) {
    const [full, comment, str, num, ident, space, punct] = match;
    if (space) {
      nodes.push(space);
      continue;
    }
    if (comment) {
      nodes.push(
        <span key={i++} className="tok-comment">
          {comment}
        </span>,
      );
    } else if (str) {
      nodes.push(
        <span key={i++} className="tok-string">
          {str}
        </span>,
      );
    } else if (num) {
      nodes.push(
        <span key={i++} className="tok-number">
          {num}
        </span>,
      );
    } else if (ident) {
      const isCall = line[TOKEN_RE.lastIndex] === "(";
      if (KEYWORDS.has(ident)) {
        nodes.push(
          <span key={i++} className="tok-keyword">
            {ident}
          </span>,
        );
      } else if (isCall) {
        nodes.push(
          <span key={i++} className="tok-fn">
            {ident}
          </span>,
        );
      } else {
        nodes.push(ident);
      }
    } else if (punct) {
      nodes.push(
        <span key={i++} className="tok-punct">
          {punct}
        </span>,
      );
    } else {
      nodes.push(full);
    }
  }
  return nodes;
}

function CodeBlockView({
  lang,
  lines,
  output,
}: {
  lang: string;
  lines: string[];
  output?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-[#1c2733] bg-[#0c1622] shadow-lg shadow-black/20">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[#9fd7d1]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/45">
            {lang}
          </span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold text-white/55 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check size={13} className="text-[#9fd7d1]" /> : <Copy size={13} />}
          {copied ? "Copié" : "Copier"}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7">
        <code>
          {lines.map((line, idx) => (
            <div key={idx} className="flex">
              <span className="mr-4 inline-block w-5 shrink-0 select-none text-right text-white/20">
                {idx + 1}
              </span>
              <span className="whitespace-pre text-[#dfe7f1]">
                {line.length ? highlight(line) : " "}
              </span>
            </div>
          ))}
        </code>
      </pre>
      {output && (
        <div className="flex items-start gap-2 border-t border-white/10 bg-black/25 px-5 py-3.5">
          <ChevronRight size={15} className="mt-0.5 shrink-0 text-[#ff896d]" />
          <p className="font-mono text-[12px] leading-6 text-[#9fd7d1]">{output}</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------ Quiz ------------------------------------ */

function QuizBlock({ quiz, onPass }: { quiz: Quiz[]; onPass: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = quiz.reduce((acc, q, idx) => acc + (answers[idx] === q.answer ? 1 : 0), 0);
  const allAnswered = quiz.every((_, idx) => answers[idx] !== undefined);

  const submit = () => {
    setSubmitted(true);
    if (score === quiz.length) onPass();
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0ea] text-[#e95332]">
          <Trophy size={18} />
        </span>
        <div>
          <h3 className="font-display text-lg font-bold tracking-tight text-[#111820]">
            Vérifiez votre compréhension
          </h3>
          <p className="text-xs text-[#8a8e91]">{quiz.length} question{quiz.length > 1 ? "s" : ""} · tout bon pour valider la leçon</p>
        </div>
      </div>

      <div className="space-y-7">
        {quiz.map((q, qi) => (
          <div key={qi}>
            <p className="mb-3 text-sm font-semibold text-[#2b3036]">
              {qi + 1}. {q.q}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const chosen = answers[qi] === oi;
                const correct = q.answer === oi;
                const state =
                  !submitted
                    ? chosen
                      ? "sel"
                      : "idle"
                    : correct
                      ? "ok"
                      : chosen
                        ? "bad"
                        : "idle";
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition",
                      state === "idle" && "border-black/10 bg-[#f7f4ed] text-[#4a4f55] hover:border-[#ff6b47]/60",
                      state === "sel" && "border-[#ff6b47] bg-[#fff0ea] text-[#111820]",
                      state === "ok" && "border-[#3fae7f] bg-[#e9f6ef] text-[#1f6b4a]",
                      state === "bad" && "border-[#e25b5b] bg-[#fdeaea] text-[#9c2b2b]",
                    )}
                  >
                    <span>{opt}</span>
                    {submitted && correct && <Check size={16} className="text-[#1f6b4a]" />}
                    {submitted && state === "bad" && <X size={16} className="text-[#9c2b2b]" />}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-start gap-2 rounded-lg bg-[#f7f4ed] px-3 py-2 text-xs leading-5 text-[#54595f]"
              >
                <Lightbulb size={13} className="mt-0.5 shrink-0 text-[#e0a800]" />
                {q.why}
              </motion.p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-7 flex flex-col items-center gap-4 border-t border-black/5 pt-6 sm:flex-row sm:justify-between">
        {submitted ? (
          <p
            className={cn(
              "text-sm font-bold",
              score === quiz.length ? "text-[#1f6b4a]" : "text-[#9c2b2b]",
            )}
          >
            {score === quiz.length
              ? "Parfait, tout est juste ! 🎉"
              : `${score} / ${quiz.length} — réessayez pour valider.`}
          </p>
        ) : (
          <p className="text-xs text-[#9a9ea2]">Répondez à toutes les questions pour valider.</p>
        )}
        <div className="flex gap-2">
          {submitted && (
            <button onClick={reset} className="flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2 text-xs font-bold text-[#4a4f55] transition hover:bg-black/5">
              <RotateCcw size={14} /> Réessayer
            </button>
          )}
          {!submitted && (
            <button
              onClick={submit}
              disabled={!allAnswered}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition",
                allAnswered
                  ? "bg-[#111820] text-white hover:bg-[#242c35]"
                  : "cursor-not-allowed bg-black/10 text-[#9a9ea2]",
              )}
            >
              Valider mes réponses <Check size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Vue leçon --------------------------------- */

export default function LessonView({
  course,
  completedIds,
  onComplete,
  onClose,
}: {
  course: LessonCourse;
  completedIds: Set<string>;
  onComplete: (id: string) => void;
  onClose: () => void;
}) {
  const flat = useMemo(() => flattenLessons(course.id), [course.id]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(() => {
    const items = flattenLessons(course.id);
    const firstIncomplete = items.findIndex(
      (f) => !completedIds.has(fullLessonId(course.id, f.lessonId)),
    );
    return firstIncomplete === -1 ? 0 : firstIncomplete;
  });

  const current = flat[activeIdx];
  const lesson: Lesson = current.lesson;
  const lessonFullId = fullLessonId(course.id, current.lessonId);
  const isDone = completedIds.has(lessonFullId);

  const completedInCourse = flat.filter((f) =>
    completedIds.has(fullLessonId(course.id, f.lessonId)),
  ).length;
  const progress = Math.round((completedInCourse / flat.length) * 100);
  const allDone = completedInCourse === flat.length;

  const goNext = () => {
    if (activeIdx < flat.length - 1) {
      setActiveIdx((i) => i + 1);
      setSidebarOpen(false);
    }
  };
  const goPrev = () => {
    if (activeIdx > 0) {
      setActiveIdx((i) => i - 1);
      setSidebarOpen(false);
    }
  };
  const select = (idx: number) => {
    setActiveIdx(idx);
    setSidebarOpen(false);
  };

  // Remonter en haut du contenu à chaque changement de leçon.
  useEffect(() => {
    document.getElementById("lesson-scroll")?.scrollTo({ top: 0, behavior: "auto" });
  }, [activeIdx]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex flex-col bg-[#f7f4ed]"
    >
      {/* Barre supérieure */}
      <header className="z-20 border-b border-black/10 bg-[#0c1622] text-white">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10"
              aria-label="Fermer les leçons"
            >
              <X size={18} />
            </button>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold"
              style={{ backgroundColor: course.accent, color: course.ink }}
            >
              {course.monogram}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold tracking-tight">{course.title}</p>
              <p className="truncate text-[11px] text-white/45">Leçon {activeIdx + 1} / {flat.length}</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="h-1.5 w-36 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-[#ff6b47]"
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
            <span className="w-9 text-right text-xs font-bold text-white/70">{progress}%</span>
          </div>
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        {/* Volet sommaire (mobile) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 z-30 bg-black/40 lg:hidden"
            />
          )}
        </AnimatePresence>

        <div className="mx-auto grid w-full max-w-[1180px] flex-1 grid-cols-1 lg:grid-cols-[286px_1fr]">
          {/* Sommaire */}
          <aside
            className={cn(
              "absolute inset-y-0 left-0 z-40 w-[280px] shrink-0 overflow-y-auto border-r border-black/10 bg-[#f1ece1] p-5 transition-transform duration-300 lg:static lg:z-auto lg:block lg:w-auto lg:translate-x-0 lg:bg-transparent",
              sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            )}
          >
            <p className="mb-4 flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9a8f7d]">
              <ListTree size={14} /> Sommaire
            </p>
            <nav className="space-y-6">
              {lessonCatalogToModules(course.id).map((group) => (
                <div key={group.module}>
                  <p className="mb-2 px-1 text-xs font-bold text-[#3a3f45]">{group.module}</p>
                  <div className="space-y-0.5">
                    {group.lessons.map((item) => {
                      const idx = flat.findIndex((f) => f.lessonId === item.lessonId);
                      const done = completedIds.has(fullLessonId(course.id, item.lessonId));
                      const active = idx === activeIdx;
                      return (
                        <button
                          key={item.lessonId}
                          onClick={() => select(idx)}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition",
                            active
                              ? "bg-[#111820] text-white"
                              : "text-[#52575d] hover:bg-black/5",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                              done
                                ? "border-[#3fae7f] bg-[#3fae7f] text-white"
                                : active
                                  ? "border-white/40 text-white/80"
                                  : "border-black/15 text-[#9a9ea2]",
                            )}
                          >
                            {done ? <Check size={11} strokeWidth={3} /> : idx + 1}
                          </span>
                          <span className="leading-tight">{item.lesson.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          {/* Contenu */}
          <section id="lesson-scroll" className="relative overflow-y-auto">
            <div className="mx-auto max-w-[720px] px-5 py-8 sm:px-8 sm:py-12">
              {/* Bandeau sommaire mobile */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="mb-6 flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-[#3a3f45] lg:hidden"
              >
                <ListTree size={14} /> Sommaire · {current.module}
              </button>

              <AnimatePresence mode="wait">
                <motion.article
                  key={lessonFullId}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#e95332]">
                    <span>{current.module}</span>
                    {isDone && (
                      <span className="flex items-center gap-1 rounded-full bg-[#e9f6ef] px-2 py-0.5 text-[10px] text-[#1f6b4a]">
                        <Check size={11} strokeWidth={3} /> Terminée
                      </span>
                    )}
                  </div>
                  <h1 className="font-display mt-3 text-3xl font-bold leading-tight tracking-[-0.04em] text-[#111820] sm:text-[40px]">
                    {lesson.title}
                  </h1>
                  <p className="mt-3 flex items-center gap-4 text-sm text-[#8a8e91]">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap size={15} /> {course.level}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={15} /> {lesson.duration}
                    </span>
                  </p>
                  <p className="mt-6 text-[17px] font-medium leading-8 text-[#3f444a]">
                    {lesson.summary}
                  </p>

                  <div className="mt-9 space-y-9">
                    {lesson.sections.map((section, si) => (
                      <div key={si}>
                        <h2 className="font-display text-xl font-bold tracking-tight text-[#111820]">
                          {section.heading}
                        </h2>
                        <div className="mt-3 space-y-3">
                          {section.body.map((para, pi) => (
                            <p key={pi} className="text-[15px] leading-7 text-[#4a4f55]">
                              {para}
                            </p>
                          ))}
                        </div>
                        {section.code && (
                          <div className="mt-4">
                            <CodeBlockView
                              lang={section.code.lang}
                              lines={section.code.lines}
                              output={section.code.output}
                            />
                          </div>
                        )}
                        {section.tip && (
                          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[#ffd96b]/50 bg-[#fff8e6] px-4 py-3.5">
                            <Lightbulb size={17} className="mt-0.5 shrink-0 text-[#e0a800]" />
                            <p className="text-[13px] leading-6 text-[#6b5a1e]">{section.tip}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Points clés */}
                  <div className="mt-10 rounded-3xl border border-[#cde8e2] bg-[#eef8f5] p-6 sm:p-7">
                    <p className="mb-4 flex items-center gap-2 font-display text-base font-bold text-[#15614a]">
                      <CheckCircle2 size={18} /> À retenir
                    </p>
                    <ul className="space-y-2.5">
                      {lesson.keyPoints.map((point, pi) => (
                        <li key={pi} className="flex items-start gap-2.5 text-[14px] leading-6 text-[#2c5e4d]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3fae7f]" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quiz */}
                  <div className="mt-8">
                    <QuizBlock
                      key={lessonFullId}
                      quiz={lesson.quiz}
                      onPass={() => onComplete(lessonFullId)}
                    />
                  </div>

                  {/* Vidéos liées au langage */}
                  {videoCatalog[course.id]?.length > 0 && (
                    <div className="mt-8 rounded-3xl border border-black/10 bg-white p-6 sm:p-7">
                      <p className="mb-4 flex items-center gap-2 font-display text-base font-bold text-[#111820]">
                        <PlayCircle size={18} className="text-[#ff5b5b]" /> À voir en vidéo
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {videoCatalog[course.id].map((v) => (
                          <a
                            key={v.id}
                            href={watchUrl(v.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 rounded-xl border border-black/10 bg-[#f7f4ed] p-3 transition hover:border-[#ff6b47]/50 hover:bg-white"
                          >
                            <span className="relative h-12 w-[5.5rem] shrink-0 overflow-hidden rounded-md">
                              <img
                                src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                              <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                                <Play size={13} fill="currentColor" className="text-white" />
                              </span>
                            </span>
                            <span className="min-w-0">
                              <span className="line-clamp-2 block text-xs font-semibold leading-5 text-[#2b3036] transition group-hover:text-[#e84e2b]">
                                {v.title}
                              </span>
                              <span className="text-[11px] text-[#8a8e91]">{v.channel}</span>
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions de navigation */}
                  <div className="mt-8 flex flex-col gap-3 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      onClick={goPrev}
                      disabled={activeIdx === 0}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-bold transition",
                        activeIdx === 0
                          ? "cursor-not-allowed border-black/5 text-[#bbb]"
                          : "border-black/15 text-[#3a3f45] hover:bg-black/5",
                      )}
                    >
                      <ChevronLeft size={17} /> Précédent
                    </button>

                    {isDone ? (
                      <button
                        onClick={goNext}
                        disabled={activeIdx === flat.length - 1}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition",
                          activeIdx === flat.length - 1
                            ? "cursor-not-allowed bg-black/10 text-[#bbb]"
                            : "bg-[#3fae7f] text-white hover:bg-[#37976b]",
                        )}
                      >
                        {activeIdx === flat.length - 1 ? "Dernière leçon" : "Leçon suivante"}
                        <ChevronRight size={17} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onComplete(lessonFullId)}
                        className="flex items-center justify-center gap-2 rounded-full bg-[#111820] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#242c35]"
                      >
                        <Check size={17} /> Marquer comme terminée
                      </button>
                    )}
                  </div>

                  {allDone && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-8 flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-br from-[#0c1622] to-[#16283a] p-8 text-center text-white"
                    >
                      <PartyPopper size={34} className="text-[#ff896d]" />
                      <h3 className="font-display text-2xl font-bold">Cours terminé, bravo !</h3>
                      <p className="max-w-sm text-sm leading-6 text-white/60">
                        Vous avez bouclé toutes les leçons de {course.title}. Continuez avec un autre langage ou revenez réviser quand vous voulez.
                      </p>
                      <button
                        onClick={onClose}
                        className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#ff6b47] px-5 py-2.5 text-sm font-bold text-[#15120f] transition hover:bg-[#ff8567]"
                      >
                        <ArrowLeft size={16} /> Retour aux cours
                      </button>
                    </motion.div>
                  )}
                </motion.article>
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

/** Helper pour accéder aux modules d'un cours dans le sommaire. */
function lessonCatalogToModules(courseId: string) {
  return flattenLessons(courseId).reduce<
    { module: string; lessons: { lessonId: string; lesson: Lesson }[] }[]
  >((acc, item) => {
    let group = acc.find((g) => g.module === item.module);
    if (!group) {
      group = { module: item.module, lessons: [] };
      acc.push(group);
    }
    group.lessons.push({ lessonId: item.lessonId, lesson: item.lesson });
    return acc;
  }, []);
}
