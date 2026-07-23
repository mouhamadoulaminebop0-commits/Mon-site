import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  Menu,
  Play,
  Search,
  Sparkles,
  Terminal,
  Users,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import LessonView from "./LessonView";
import { flattenLessons, fullLessonId, lessonCount } from "./lessons";
import VideosSection from "./VideosSection";
import Playground from "./Playground";

type Course = {
  id: string;
  title: string;
  category: "Web" | "Données" | "Logiciel";
  level: string;
  duration: string;
  lessons: number;
  accent: string;
  ink: string;
  monogram: string;
  code: string[];
  description: string;
  modules: string[];
};

const courses: Course[] = [
  {
    id: "javascript",
    title: "JavaScript moderne",
    category: "Web",
    level: "Débutant",
    duration: "18 h",
    lessons: 42,
    accent: "#F4D35E",
    ink: "#171717",
    monogram: "JS",
    code: ["const idée = 'web';", "apprendre(idée);", "console.log('go');"],
    description: "Maîtrisez le langage incontournable du web en construisant des projets concrets dès la première leçon.",
    modules: ["Les bases du langage", "DOM et événements", "Asynchrone et API", "Projet final"],
  },
  {
    id: "python",
    title: "Python de A à Z",
    category: "Données",
    level: "Débutant",
    duration: "16 h",
    lessons: 36,
    accent: "#9FD7D1",
    ink: "#102A2A",
    monogram: "Py",
    code: ["def progresser(jour):", "  return jour + 1", "print(progresser(1))"],
    description: "Apprenez une syntaxe claire, automatisez vos tâches et posez les bases de la data science.",
    modules: ["Syntaxe essentielle", "Fonctions et objets", "Fichiers et données", "Projet d'automatisation"],
  },
  {
    id: "html-css",
    title: "HTML & CSS créatif",
    category: "Web",
    level: "Débutant",
    duration: "12 h",
    lessons: 28,
    accent: "#F3A683",
    ink: "#361B11",
    monogram: "<> ",
    code: ["<main class='idée'>", "  Créer. Tester.", "</main>"],
    description: "Structurez et stylisez des interfaces accessibles, responsives et agréables à utiliser.",
    modules: ["HTML sémantique", "Maîtriser CSS", "Responsive design", "Portfolio personnel"],
  },
  {
    id: "sql",
    title: "SQL & bases de données",
    category: "Données",
    level: "Intermédiaire",
    duration: "10 h",
    lessons: 24,
    accent: "#B8B6E8",
    ink: "#24204C",
    monogram: "SQL",
    code: ["SELECT compétence", "FROM parcours", "WHERE acquis = true;"],
    description: "Interrogez, organisez et exploitez les données avec des requêtes efficaces et lisibles.",
    modules: ["Modèle relationnel", "Requêtes SQL", "Jointures et agrégats", "Cas métier"],
  },
  {
    id: "java",
    title: "Java orienté objet",
    category: "Logiciel",
    level: "Intermédiaire",
    duration: "22 h",
    lessons: 48,
    accent: "#A9C5F7",
    ink: "#162E55",
    monogram: "Jv",
    code: ["class Projet {", "  void construire()", "  { progresser(); }"],
    description: "Concevez des applications robustes en comprenant réellement la programmation orientée objet.",
    modules: ["Fondamentaux Java", "Objets et héritage", "Collections et flux", "Application complète"],
  },
  {
    id: "c",
    title: "Le langage C",
    category: "Logiciel",
    level: "Avancé",
    duration: "20 h",
    lessons: 40,
    accent: "#D0E6A5",
    ink: "#253315",
    monogram: "C",
    code: ["#include <stdio.h>", "int main(void) {", "  return 0;", "}"],
    description: "Comprenez la mémoire, les pointeurs et les mécanismes qui se cachent derrière vos programmes.",
    modules: ["Compiler en C", "Mémoire et pointeurs", "Structures de données", "Projet système"],
  },
];

const filters = ["Tous", "Web", "Données", "Logiciel"] as const;

function Logo({ light = false, onHome }: { light?: boolean; onHome?: () => void }) {
  return (
    <a href="#accueil" onClick={(event) => { event.preventDefault(); onHome?.(); }} className="group flex items-center gap-2.5" aria-label="CodeCampus, accueil">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff6b47] text-white transition-transform duration-300 group-hover:rotate-12">
        <Code2 size={19} strokeWidth={2.4} />
      </span>
      <span className={`font-display text-[17px] font-extrabold tracking-[-0.04em] ${light ? "text-white" : "text-[#111820]"}`}>
        CODECAMPUS
      </span>
    </a>
  );
}

function ModalShell({ children, onClose, label }: { children: React.ReactNode; onClose: () => void; label: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#07111c]/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        initial={{ opacity: 0, y: 35, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 25, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[28px] bg-[#f7f4ed] p-7 shadow-2xl sm:rounded-[28px] sm:p-10"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-[#111820] transition hover:bg-black/10"
          aria-label="Fermer"
        >
          <X size={19} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

function CourseModal({ course, onClose, onOpenLessons, progress }: { course: Course; onClose: () => void; onOpenLessons: () => void; progress: number }) {
  return (
    <ModalShell onClose={onClose} label={`Détails du cours ${course.title}`}>
      <div
        className="mb-7 flex h-24 w-24 items-center justify-center rounded-[24px] font-mono text-2xl font-bold"
        style={{ backgroundColor: course.accent, color: course.ink }}
      >
        {course.monogram}
      </div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#ff5f3b]">{course.category} / {course.level}</p>
      <h2 className="font-display pr-8 text-4xl font-bold tracking-[-0.045em] text-[#111820]">{course.title}</h2>
      <p className="mt-4 text-base leading-7 text-[#5d6268]">{course.description}</p>

      {progress > 0 && (
        <div className="mt-6 rounded-2xl bg-black/[0.04] p-4">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-[#3a3f45]">
            <span>Votre progression</span>
            <span className="text-[#e95332]">{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
            <div className="h-full rounded-full bg-[#ff6b47]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="mt-7 border-y border-black/10 py-6">
        <p className="mb-4 text-sm font-bold text-[#111820]">Au programme</p>
        <div className="space-y-3">
          {course.modules.map((module, index) => (
            <div key={module} className="flex items-center gap-3 text-sm text-[#42484f]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111820] text-[10px] font-bold text-white">{index + 1}</span>
              {module}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-[#5d6268]"><Clock3 size={16} /> {lessonCount(course.id)} leçons interactives</span>
        <button onClick={onOpenLessons} className="button-primary justify-center">
          {progress > 0 ? "Reprendre les leçons" : "Commencer les leçons"} <ArrowRight size={17} />
        </button>
      </div>
    </ModalShell>
  );
}

function OrientationModal({ onClose, onResult }: { onClose: () => void; onResult: (category: string) => void }) {
  const [step, setStep] = useState(0);
  const questions = [
    {
      title: "Qu'avez-vous envie de créer ?",
      choices: [
        ["Des sites et interfaces", "Web"],
        ["Analyser des données", "Données"],
        ["Des applications robustes", "Logiciel"],
      ],
    },
    {
      title: "Quel est votre niveau actuel ?",
      choices: [
        ["Je pars de zéro", "Débutant"],
        ["Je connais les bases", "Intermédiaire"],
        ["Je veux me spécialiser", "Avancé"],
      ],
    },
  ];

  const choose = (value: string) => {
    if (step === 0) {
      onResult(value);
      setStep(1);
    } else {
      setStep(2);
    }
  };

  return (
    <ModalShell onClose={onClose} label="Test d'orientation">
      {step < 2 ? (
        <>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff5f3b]">Question {step + 1} sur 2</p>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-black/10">
            <motion.div className="h-full bg-[#ff6b47]" animate={{ width: `${(step + 1) * 50}%` }} />
          </div>
          <h2 className="font-display mt-8 max-w-md text-4xl font-bold tracking-[-0.045em] text-[#111820]">{questions[step].title}</h2>
          <div className="mt-8 space-y-3">
            {questions[step].choices.map(([label, value]) => (
              <button
                key={value}
                onClick={() => choose(value)}
                className="group flex w-full items-center justify-between rounded-2xl border border-black/10 bg-white/50 px-5 py-4 text-left font-semibold text-[#252b31] transition hover:border-[#ff6b47] hover:bg-white"
              >
                {label} <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="py-4 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d0e6a5] text-[#253315]"><Check size={28} /></span>
          <h2 className="font-display mt-6 text-4xl font-bold tracking-[-0.045em] text-[#111820]">Votre parcours est prêt.</h2>
          <p className="mx-auto mt-4 max-w-sm leading-7 text-[#5d6268]">Nous avons sélectionné les cours les plus adaptés à votre objectif. Retrouvez-les juste en dessous.</p>
          <button onClick={onClose} className="button-primary mx-auto mt-7">Voir ma sélection <ArrowRight size={17} /></button>
        </div>
      )}
    </ModalShell>
  );
}

function LoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSuccess();
  };
  return (
    <ModalShell onClose={onClose} label="Connexion">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff5f3b]">Bon retour parmi nous</p>
      <h2 className="font-display mt-3 text-4xl font-bold tracking-[-0.045em] text-[#111820]">Reprenez là où vous vous êtes arrêté.</h2>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block text-sm font-semibold text-[#30363c]">
          Adresse e-mail
          <input required type="email" placeholder="vous@exemple.fr" className="form-input" />
        </label>
        <label className="block text-sm font-semibold text-[#30363c]">
          Mot de passe
          <input required type="password" placeholder="8 caractères minimum" minLength={8} className="form-input" />
        </label>
        <button type="submit" className="button-primary mt-2 w-full justify-center">Se connecter <ArrowRight size={17} /></button>
      </form>
      <p className="mt-5 text-center text-sm text-[#70757a]">Pas encore de compte ? <button onClick={onSuccess} className="font-bold text-[#111820] underline decoration-[#ff6b47] underline-offset-4">Créer un compte</button></p>
    </ModalShell>
  );
}

export default function App() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Tous");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showOrientation, setShowOrientation] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [lessonCourse, setLessonCourse] = useState<Course | null>(null);
  const [page, setPage] = useState<"accueil" | "cours" | "exercices">("accueil");
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem("codecampus-progress");
      return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });
  const { scrollY } = useScroll();

  useEffect(() => {
    try {
      localStorage.setItem("codecampus-progress", JSON.stringify([...completed]));
    } catch {
      /* ignore */
    }
  }, [completed]);

  useEffect(() => {
    if (lessonCourse) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [lessonCourse]);

  const progressFor = (courseId: string) => {
    const total = lessonCount(courseId);
    if (!total) return 0;
    const done = flattenLessons(courseId).filter((f) =>
      completed.has(fullLessonId(courseId, f.lessonId)),
    ).length;
    return Math.round((done / total) * 100);
  };

  const markComplete = (id: string) => {
    setCompleted((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleComplete = (id: string) => {
    const wasNew = !completed.has(id);
    markComplete(id);
    if (wasNew) notify("Leçon terminée — bien joué ! 🎉");
  };
  const heroY = useTransform(scrollY, [0, 850], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 700], [1, 0.2]);

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.toLocaleLowerCase();
    return courses.filter((course) => {
      const matchesCategory = activeFilter === "Tous" || course.category === activeFilter;
      const matchesQuery = !normalizedQuery || `${course.title} ${course.category} ${course.level}`.toLocaleLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeFilter, query]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };

  const selectOrientation = (category: string) => {
    setActiveFilter(category as (typeof filters)[number]);
  };

  const goPage = (next: "accueil" | "cours" | "exercices") => {
    setPage(next);
    setMobileMenu(false);
    setShowSearch(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goSection = (id: string) => {
    setPage("accueil");
    setMobileMenu(false);
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 70);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#111820] selection:bg-[#ff6b47] selection:text-white">
      <header className={`absolute inset-x-0 top-0 z-50 border-b border-white/15 transition-colors ${page === "cours" ? "bg-[#0b1722]" : ""}`}>
        <div className="page-shell flex h-[76px] items-center justify-between">
          <Logo light onHome={() => goPage("accueil")} />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
            <button onClick={() => goPage("accueil")} className={`nav-link ${page === "accueil" ? "!text-white" : ""}`}>Accueil</button>
            <button onClick={() => goPage("cours")} className={`nav-link ${page === "cours" ? "!text-white" : ""}`}>Cours</button>
            <button onClick={() => goPage("exercices")} className={`nav-link ${page === "exercices" ? "!text-white" : ""}`}>Exercices</button>
            <button onClick={() => goSection("methode")} className="nav-link">Méthode</button>
            <button onClick={() => goSection("videos")} className="nav-link">Vidéos</button>
            <button onClick={() => goSection("communaute")} className="nav-link">Communauté</button>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <button onClick={() => setShowSearch((value) => !value)} className="icon-button-dark" aria-label="Rechercher">
              <Search size={18} />
            </button>
            <button onClick={() => setShowLogin(true)} className="rounded-full px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10">Se connecter</button>
            <button onClick={() => setShowOrientation(true)} className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#111820] transition hover:bg-[#ff6b47] hover:text-white">Je me lance</button>
          </div>
          <button onClick={() => setMobileMenu((value) => !value)} className="icon-button-dark md:hidden" aria-label="Ouvrir le menu">
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <AnimatePresence>
          {showSearch && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 72, opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/10 bg-[#08121d]/95 backdrop-blur-xl">
              <div className="page-shell flex h-[72px] items-center gap-3">
                <Search size={18} className="text-white/60" />
                <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher JavaScript, Python, SQL..." className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/45" />
                <button onClick={() => goPage("cours")} className="text-sm font-bold text-[#ff896d]">Voir</button>
              </div>
            </motion.div>
          )}
          {mobileMenu && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="border-t border-white/10 bg-[#08121d] px-5 py-6 md:hidden">
              <div className="flex flex-col gap-5 text-white">
                <button onClick={() => goPage("accueil")} className="text-left font-semibold">Accueil</button>
                <button onClick={() => goPage("cours")} className="text-left font-semibold">Cours</button>
                <button onClick={() => goPage("exercices")} className="text-left font-semibold">Exercices</button>
                <button onClick={() => goSection("methode")} className="text-left font-semibold">Notre méthode</button>
                <button onClick={() => goSection("videos")} className="text-left font-semibold">Vidéos</button>
                <button onClick={() => goSection("communaute")} className="text-left font-semibold">Communauté</button>
                <button onClick={() => { setMobileMenu(false); setShowLogin(true); }} className="text-left font-semibold">Se connecter</button>
                <button onClick={() => { setMobileMenu(false); setShowOrientation(true); }} className="button-primary mt-1 w-full justify-center">Je me lance <ArrowRight size={17} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section id="accueil" style={{ display: page === "accueil" ? undefined : "none" }} className="relative flex min-h-[780px] items-end overflow-hidden bg-[#07111c] md:min-h-[850px] md:items-center">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
            <img src="/images/codecampus-hero.jpg" alt="Développeur apprenant à coder devant son écran" className="hero-image h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,11,18,.93)_0%,rgba(4,11,18,.74)_43%,rgba(4,11,18,.14)_74%),linear-gradient(0deg,rgba(4,11,18,.78)_0%,transparent_45%)]" />
          </motion.div>
          <div className="page-shell relative z-10 w-full pb-16 pt-36 md:pb-0 md:pt-20">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }} className="max-w-[720px] text-white">
              <motion.p variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#ff896d]">
                <span className="h-px w-8 bg-[#ff6b47]" /> La tech s'apprend en la pratiquant
              </motion.p>
              <motion.h1 variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65 } } }} className="font-display text-[clamp(4.3rem,10.5vw,8.8rem)] font-extrabold leading-[0.78] tracking-[-0.075em]">
                Code<br /><span className="text-[#ff6b47]">Campus.</span>
              </motion.h1>
              <motion.p variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} className="mt-8 max-w-[540px] text-[clamp(1.15rem,2vw,1.45rem)] font-medium leading-relaxed text-white/82">
                Apprenez les langages qui construisent le monde numérique. À votre rythme, mais jamais seul.
              </motion.p>
              <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => setShowOrientation(true)} className="button-primary justify-center sm:justify-start">Trouver mon parcours <ArrowRight size={18} /></button>
                <button onClick={() => goPage("cours")} className="button-ghost justify-center sm:justify-start"><Play size={17} fill="currentColor" /> Explorer les cours</button>
              </motion.div>
            </motion.div>
          </div>
          <motion.a initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} href="#cours" onClick={(event) => { event.preventDefault(); goPage("cours"); }} className="absolute bottom-10 right-8 z-10 hidden cursor-pointer items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/60 transition hover:text-white lg:flex">
            Découvrir <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25"><ChevronDown size={18} /></span>
          </motion.a>
        </section>

        <section id="cours" style={{ display: page === "cours" ? undefined : "none" }} className="scroll-mt-8 min-h-screen bg-[#f7f4ed] pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="page-shell">
            <button onClick={() => goPage("accueil")} className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-[#3a3f45] transition hover:border-[#ff6b47] hover:text-[#e84e2b]">
              <ArrowLeft size={14} /> Retour à l'accueil
            </button>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.45 }} className="flex flex-col justify-between gap-8 border-b border-black/10 pb-9 md:flex-row md:items-end">
              <div>
                <p className="section-kicker">Le bon point de départ</p>
                <h2 className="section-title max-w-[720px]">Votre prochain langage commence ici.</h2>
              </div>
              <p className="max-w-sm text-base leading-7 text-[#656a6e]">Des cours courts, de vrais projets et un éditeur intégré pour passer de la théorie à l'action.</p>
            </motion.div>

            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Filtrer les cours">
                {filters.map((filter) => (
                  <button key={filter} onClick={() => setActiveFilter(filter)} className={`filter-link ${activeFilter === filter ? "filter-link-active" : ""}`}>
                    {filter}
                  </button>
                ))}
              </div>
              <label className="flex w-full max-w-[280px] items-center gap-2 border-b border-black/20 py-2 text-[#777b7f] focus-within:border-[#ff6b47] sm:w-auto">
                <Search size={16} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un cours" className="w-full bg-transparent text-sm outline-none placeholder:text-[#8a8e91]" />
              </label>
            </div>

            <motion.div layout className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredCourses.map((course, index) => (
                  <motion.article
                    layout
                    key={course.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.05 }}
                    className="course-item group"
                  >
                    <button onClick={() => setSelectedCourse(course)} className="block w-full text-left" aria-label={`Découvrir ${course.title}`}>
                      <div className="course-visual relative overflow-hidden" style={{ backgroundColor: course.accent, color: course.ink }}>
                        <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-current/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] opacity-60">
                          <span>lesson_{String(index + 1).padStart(2, "0")}</span>
                          <span>{course.category}</span>
                        </div>
                        <span className="absolute right-5 top-16 font-mono text-5xl font-bold tracking-[-0.08em] opacity-90 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">{course.monogram}</span>
                        <div className="absolute bottom-6 left-5 font-mono text-[12px] leading-6 opacity-60">
                          {course.code.map((line) => <div key={line}>{line}</div>)}
                        </div>
                        <span className="absolute bottom-5 right-5 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-[#111820] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowRight size={18} /></span>
                      </div>
                      <div className="pt-5">
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-[#85898c]">
                          <span>{course.level}</span><span className="h-1 w-1 rounded-full bg-[#ff6b47]" /><span>{course.duration}</span>
                        </div>
                        <h3 className="font-display mt-2 text-[25px] font-bold tracking-[-0.04em] text-[#111820] transition-colors group-hover:text-[#e84e2b]">{course.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6a6e72]">{course.description}</p>
                        {progressFor(course.id) > 0 ? (
                          <div className="mt-4">
                            <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-[#9aa0a4]">
                              <span>{progressFor(course.id) === 100 ? "Cours terminé" : "En cours"}</span>
                              <span className="text-[#e95332]">{progressFor(course.id)}%</span>
                            </div>
                            <div className="h-1 overflow-hidden rounded-full bg-black/10">
                              <div className="h-full rounded-full bg-[#ff6b47]" style={{ width: `${progressFor(course.id)}%` }} />
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9aa0a4] opacity-0 transition group-hover:opacity-100">
                            <span className="h-1 w-1 rounded-full bg-[#ff6b47]" /> {lessonCount(course.id)} leçons
                          </div>
                        )}
                      </div>
                    </button>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
            {filteredCourses.length === 0 && (
              <div className="py-24 text-center">
                <Terminal className="mx-auto text-[#a6a6a0]" size={36} />
                <p className="mt-4 font-semibold text-[#555b60]">Aucun cours ne correspond à votre recherche.</p>
                <button onClick={() => { setQuery(""); setActiveFilter("Tous"); }} className="mt-3 text-sm font-bold text-[#e84e2b] underline underline-offset-4">Réinitialiser les filtres</button>
              </div>
            )}
          </div>
        </section>

        <section id="methode" style={{ display: page === "accueil" ? undefined : "none" }} className="overflow-hidden bg-[#0b1722] py-24 text-white md:py-32">
          <div className="page-shell grid items-center gap-16 lg:grid-cols-[0.86fr_1.14fr] lg:gap-24">
            <motion.div initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.35 }}>
              <p className="section-kicker">Apprendre autrement</p>
              <h2 className="font-display mt-4 text-[clamp(2.8rem,5vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.06em]">Moins de blabla.<br />Plus de code.</h2>
              <p className="mt-7 max-w-md text-base leading-7 text-white/60">Chaque notion est immédiatement mise en pratique dans votre navigateur. Vous écrivez, testez et comprenez vraiment.</p>
              <div className="mt-10 space-y-6 border-t border-white/12 pt-8">
                {[
                  [BookOpen, "Une progression claire", "Des leçons de 15 minutes qui vont à l'essentiel."],
                  [Terminal, "Un éditeur dans le navigateur", "Aucune installation. Votre code prend vie immédiatement."],
                  [Users, "Des mentors disponibles", "Un blocage ? La communauté vous aide à avancer."],
                ].map(([Icon, title, text]) => {
                  const FeatureIcon = Icon as typeof BookOpen;
                  return (
                    <div key={title as string} className="flex gap-4">
                      <FeatureIcon size={20} className="mt-0.5 shrink-0 text-[#ff7655]" />
                      <div><h3 className="font-bold">{title as string}</h3><p className="mt-1 text-sm leading-6 text-white/50">{text as string}</p></div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65 }} className="code-window overflow-hidden rounded-[22px] border border-white/12 bg-[#071019] shadow-2xl shadow-black/30">
              <div className="flex h-12 items-center justify-between border-b border-white/10 px-5">
                <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ff6b47]" /><span className="h-2.5 w-2.5 rounded-full bg-[#f4d35e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#9fd7d1]" /></div>
                <span className="font-mono text-[11px] text-white/35">mon_premier_projet.js</span>
                <Play size={14} fill="currentColor" className="text-[#9fd7d1]" />
              </div>
              <div className="grid min-h-[410px] md:grid-cols-[1.15fr_.85fr]">
                <div className="overflow-hidden border-b border-white/10 p-6 font-mono text-[13px] leading-8 md:border-b-0 md:border-r">
                  <p><span className="code-number">1</span><span className="text-[#c792ea]">const</span> <span className="text-[#82aaff]">étudiant</span> = &#123;</p>
                  <p><span className="code-number">2</span>&nbsp;&nbsp;nom: <span className="text-[#c3e88d]">'Alex'</span>,</p>
                  <p><span className="code-number">3</span>&nbsp;&nbsp;objectif: <span className="text-[#c3e88d]">'Développeur'</span>,</p>
                  <p><span className="code-number">4</span>&nbsp;&nbsp;progression: <span className="text-[#f78c6c]">0</span>,</p>
                  <p><span className="code-number">5</span>&#125;;</p>
                  <p><span className="code-number">6</span></p>
                  <p><span className="code-number">7</span><span className="text-[#c792ea]">while</span> (étudiant.<span className="text-[#82aaff]">progresse</span>) &#123;</p>
                  <p><span className="code-number">8</span>&nbsp;&nbsp;étudiant.progression<span className="text-[#89ddff]">++</span>;</p>
                  <p><span className="code-number">9</span>&#125;</p>
                  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="ml-[31px] inline-block h-5 w-0.5 translate-y-1 bg-[#ff7655]" />
                </div>
                <div className="flex items-center justify-center bg-[#0f1d29] p-8">
                  <div className="text-center">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#9fd7d1]/30 bg-[#9fd7d1]/10">
                      <Code2 size={38} className="text-[#9fd7d1]" />
                    </motion.div>
                    <p className="font-display mt-5 text-xl font-bold">Ça fonctionne !</p>
                    <p className="mt-2 text-xs leading-5 text-white/40">Votre premier programme<br />est en ligne.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {page === "accueil" && <VideosSection />}

        <section id="communaute" style={{ display: page === "accueil" ? undefined : "none" }} className="bg-[#ff6b47] py-24 md:py-32">
          <div className="page-shell text-center">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.4 }}>
              <Sparkles className="mx-auto mb-7 text-[#70220e]" size={30} />
              <h2 className="font-display mx-auto max-w-[900px] text-[clamp(3rem,7.5vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.07em] text-[#17130f]">Un futur dans la tech commence par une ligne de code.</h2>
              <p className="mx-auto mt-8 max-w-lg text-lg leading-8 text-[#5b271a]">Faites le test en deux minutes et obtenez un parcours adapté à vos envies et à votre niveau.</p>
              <button onClick={() => setShowOrientation(true)} className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#101820] px-7 py-4 text-sm font-bold text-white transition hover:scale-[1.03] hover:bg-black">Trouver mon parcours <ArrowRight size={18} /></button>
            </motion.div>
          </div>
        </section>

        {page === "exercices" && <Playground />}
      </main>

      <footer className="bg-[#07111c] py-16 text-white">
        <div className="page-shell">
          <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-[1.3fr_.7fr_.7fr]">
            <div>
              <Logo light />
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/48">Une plateforme française pour apprendre à coder par la pratique, quel que soit votre point de départ.</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">Explorer</p>
              <div className="mt-5 flex flex-col gap-3 text-sm text-white/68"><button onClick={() => goPage("cours")} className="text-left hover:text-white">Tous les cours</button><button onClick={() => goPage("exercices")} className="text-left hover:text-white">Exercices</button><button onClick={() => goSection("videos")} className="text-left hover:text-white">Vidéos</button><button onClick={() => goSection("methode")} className="text-left hover:text-white">La méthode</button><button onClick={() => setShowOrientation(true)} className="text-left hover:text-white">Test d'orientation</button></div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">Plateforme</p>
              <div className="mt-5 flex flex-col gap-3 text-sm text-white/68"><button onClick={() => goSection("communaute")} className="text-left hover:text-white">Communauté</button><button onClick={() => notify("La page d'aide arrive bientôt.")} className="text-left hover:text-white">Centre d'aide</button><button onClick={() => notify("Merci pour votre intérêt !")} className="text-left hover:text-white">Nous rejoindre</button></div>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-7 text-xs text-white/32 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 CodeCampus. Apprendre, créer, partager.</p>
            <div className="flex gap-5"><button onClick={() => notify("Mentions légales")}>Mentions légales</button><button onClick={() => notify("Vos données restent privées.")}>Confidentialité</button></div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedCourse && (
          <CourseModal
            course={selectedCourse}
            progress={progressFor(selectedCourse.id)}
            onClose={() => setSelectedCourse(null)}
            onOpenLessons={() => {
              const course = selectedCourse;
              setSelectedCourse(null);
              setLessonCourse(course);
            }}
          />
        )}
        {lessonCourse && (
          <LessonView
            course={lessonCourse}
            completedIds={completed}
            onComplete={handleComplete}
            onClose={() => setLessonCourse(null)}
          />
        )}
        {showOrientation && <OrientationModal onClose={() => { setShowOrientation(false); goPage("cours"); }} onResult={selectOrientation} />}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={() => { setShowLogin(false); notify("Votre espace apprenant est prêt."); }} />}
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 15, x: "-50%" }} className="fixed bottom-6 left-1/2 z-[120] flex items-center gap-3 rounded-full bg-[#111820] px-5 py-3 text-sm font-semibold text-white shadow-xl">
            <Check size={17} className="text-[#9fd7d1]" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}