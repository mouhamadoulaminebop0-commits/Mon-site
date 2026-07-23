import { motion } from "framer-motion";
import { ArrowUpRight, Play, PlayCircle, Search } from "lucide-react";
import { useState } from "react";
import {
  recommendedChannels,
  thumbUrl,
  videoCatalog,
  videoLanguages,
  watchUrl,
} from "./videos";

function labelFor(courseId: string) {
  return videoLanguages.find((l) => l.id === courseId)?.label ?? courseId;
}

export default function VideosSection() {
  const [lang, setLang] = useState<string>("Tous");

  const allVideos = Object.entries(videoCatalog).flatMap(([courseId, list]) =>
    list.map((video) => ({ ...video, courseId })),
  );
  const filtered = lang === "Tous" ? allVideos : allVideos.filter((v) => v.courseId === lang);

  return (
    <section id="videos" className="scroll-mt-8 overflow-hidden bg-[#0b1722] py-24 text-white md:py-32">
      <div className="page-shell">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-col justify-between gap-8 border-b border-white/10 pb-9 md:flex-row md:items-end"
        >
          <div>
            <p className="section-kicker">Apprendre en vidéo</p>
            <h2 className="font-display mt-3 max-w-[680px] text-[clamp(2.6rem,5vw,4.6rem)] font-bold leading-[0.98] tracking-[-0.055em]">
              Les meilleures vidéos francophones.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-white/55">
            Une sélection de cours en français pour comprendre chaque langage. Les vidéos s'ouvrent sur YouTube, dans un nouvel onglet, pour une lecture toujours disponible.
          </p>
        </motion.div>

        {/* Onglets de filtrage */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          {videoLanguages.map((item) => (
            <button
              key={item.id}
              onClick={() => setLang(item.id)}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                lang === item.id
                  ? "border-[#ff6b47] bg-[#ff6b47] text-[#15120f]"
                  : "border-white/15 text-white/65 hover:border-white/35 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Grille de vidéos */}
        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video) => (
            <motion.a
              layout
              key={`${video.courseId}-${video.id}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3 }}
              href={watchUrl(video.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition hover:border-white/25 hover:bg-white/[0.06]"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={thumbUrl(video.id)}
                  alt={video.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                  {labelFor(video.courseId)}
                </span>
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition group-hover:bg-[#ff6b47] group-hover:text-[#15120f]">
                  <ArrowUpRight size={15} />
                </span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff6b47] text-[#15120f] shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play size={22} fill="currentColor" />
                  </span>
                </span>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 text-sm font-bold leading-6 text-white transition-colors group-hover:text-[#ff896d]">
                  {video.title}
                </h3>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-white/45">
                  <PlayCircle size={13} className="text-[#ff5b5b]" /> {video.channel}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Chaînes recommandées */}
        <div className="mt-16 border-t border-white/10 pt-10">
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/40">
            <PlayCircle size={15} className="text-[#ff5b5b]" /> Chaînes francophones recommandées
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedChannels.map((channel) => (
              <a
                key={channel.name}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:border-[#ff6b47]/60 hover:bg-white/[0.06]"
              >
                <div>
                  <p className="flex items-center gap-2 text-sm font-bold text-white">
                    {channel.name}
                    {!channel.direct && <Search size={12} className="text-white/35" aria-label="Recherche" />}
                  </p>
                  <p className="mt-0.5 text-xs text-white/45">{channel.topics}</p>
                </div>
                <ArrowUpRight size={18} className="shrink-0 text-white/40 transition group-hover:text-[#ff896d]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
