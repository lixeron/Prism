import { useState, useRef, useEffect, useCallback } from "react";

const PLATFORMS = [
  { id: "twitter", label: "𝕏 / Twitter", icon: "𝕏", color: "#8b5cf6" },
  { id: "linkedin", label: "LinkedIn", icon: "in", color: "#3b82f6" },
  { id: "instagram", label: "Instagram", icon: "◎", color: "#d946ef" },
  { id: "newsletter", label: "Newsletter", icon: "✦", color: "#06b6d4" },
];

const API_BASE = "/api/v1";

/* ═══════════════════════════════════════════
   Custom Cursor
   ═══════════════════════════════════════════ */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onHover = () => ringRef.current?.classList.add("hovering");
    const onLeave = () => ringRef.current?.classList.remove("hovering");

    const animate = () => {
      // Dot follows tightly
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;
      // Ring follows loosely
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.left = `${dotX - 4}px`;
        dotRef.current.style.top = `${dotY - 4}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX - 18}px`;
        ringRef.current.style.top = `${ringY - 18}px`;
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("button, a, input").forEach((el) => {
      el.addEventListener("mouseenter", onHover);
      el.addEventListener("mouseleave", onLeave);
    });

    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

/* ═══════════════════════════════════════════
   Floating Particles
   ═══════════════════════════════════════════ */
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * -20,
    color:
      i % 3 === 0
        ? "rgba(139,92,246,0.4)"
        : i % 3 === 1
        ? "rgba(6,182,212,0.3)"
        : "rgba(217,70,239,0.3)",
  }));

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Scroll-triggered Fade In
   ═══════════════════════════════════════════ */
function FadeSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`fade-section ${visible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Animated Text Reveal
   ═══════════════════════════════════════════ */
function RevealText({ text, className = "", delay = 0 }) {
  return (
    <span className={`reveal-text ${className}`}>
      <span style={{ animationDelay: `${delay}ms` }}>{text}</span>
    </span>
  );
}

/* ═══════════════════════════════════════════
   Prism Logo (animated)
   ═══════════════════════════════════════════ */
function PrismLogo() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-3 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-10 h-10" style={{ transition: "transform 0.4s ease", transform: hovered ? "rotate(15deg) scale(1.1)" : "rotate(0)" }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #8b5cf6, #06b6d4, #d946ef)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            animation: hovered ? "none" : undefined,
          }}
        />
        <div
          className="absolute inset-[3px]"
          style={{
            background: "#08080f",
            clipPath: "polygon(50% 8%, 5% 97%, 95% 97%)",
          }}
        />
        <div
          className="absolute inset-[6px]"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.4), rgba(6,182,212,0.3))",
            clipPath: "polygon(50% 15%, 10% 95%, 90% 95%)",
            transition: "opacity 0.3s ease",
            opacity: hovered ? 1 : 0.5,
          }}
        />
      </div>
      <span className="font-display text-2xl font-extrabold text-prism-gradient tracking-tight">
        PRISM
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Platform Chip
   ═══════════════════════════════════════════ */
function PlatformChip({ platform, selected, onToggle }) {
  const chipRef = useRef(null);

  const handleMouse = (e) => {
    const rect = chipRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    chipRef.current.style.setProperty("--mouse-x", `${x}%`);
    chipRef.current.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <button
      ref={chipRef}
      onClick={() => onToggle(platform.id)}
      onMouseMove={handleMouse}
      className={`chip px-5 py-2.5 rounded-xl font-body text-sm font-medium border transition-all duration-300
        ${selected
          ? "chip-active border-prism-violet/50 text-white"
          : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/70 hover:border-white/15"
        }`}
    >
      <span
        className="platform-icon mr-2"
        style={{
          background: selected ? `${platform.color}20` : "transparent",
          color: selected ? platform.color : "inherit",
        }}
      >
        {platform.icon}
      </span>
      {platform.label}
    </button>
  );
}

/* ═══════════════════════════════════════════
   Copy Button
   ═══════════════════════════════════════════ */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`btn-copy px-4 py-2 rounded-lg font-mono text-xs font-medium border
        ${copied
          ? "btn-copy-success"
          : "border-white/10 bg-white/[0.03] text-white/50 hover:border-prism-violet/40 hover:text-white hover:bg-white/[0.06]"
        }`}
    >
      {copied ? "✓ Copied" : "⎘ Copy"}
    </button>
  );
}

/* ═══════════════════════════════════════════
   Result Card
   ═══════════════════════════════════════════ */
function ResultCard({ platform, content, index }) {
  const meta = PLATFORMS.find((p) => p.id === platform);

  return (
    <div
      className="stagger-in content-card rounded-2xl p-6 sm:p-8"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span
            className="platform-icon text-base"
            style={{ background: `${meta?.color}20`, color: meta?.color }}
          >
            {meta?.icon}
          </span>
          <h3 className="font-display text-base font-bold text-white tracking-wide">
            {meta?.label}
          </h3>
          <span className="font-mono text-[10px] text-white/20 ml-1">
            {content.length} chars
          </span>
        </div>
        <CopyButton text={content} />
      </div>

      <div
        className="font-body text-[13px] text-white/70 leading-[1.8] whitespace-pre-wrap"
        style={{ fontWeight: 400 }}
      >
        {content}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Loader
   ═══════════════════════════════════════════ */
function Loader() {
  const messages = [
    "Extracting transcript...",
    "Understanding context...",
    "Crafting platform-native posts...",
    "Polishing the output...",
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 py-20">
      <div className="prism-loader-wrapper">
        <div className="prism-loader-ring" />
        <div className="prism-loader-ring" />
        <div className="prism-loader-ring" />
      </div>
      <p
        className="font-body text-sm text-white/30 transition-all duration-500"
        key={idx}
        style={{ animation: "stagger-reveal 0.5s ease forwards" }}
      >
        {messages[idx]}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Error
   ═══════════════════════════════════════════ */
function ErrorDisplay({ message, onDismiss }) {
  return (
    <div className="content-card rounded-2xl p-5 border-red-500/20">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-red-400/80 text-base mt-0.5">✕</span>
          <div>
            <p className="font-body text-sm text-red-300/80 font-medium">
              Generation failed
            </p>
            <p className="font-body text-xs text-red-300/40 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-white/20 hover:text-white/50 transition-colors text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main App
   ═══════════════════════════════════════════ */
export default function App() {
  const [url, setUrl] = useState("");
  const [platforms, setPlatforms] = useState(["twitter", "linkedin"]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const resultsRef = useRef(null);

  const toggle = (id) =>
    setPlatforms((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  const isYT = (u) =>
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/.test(u);

  const generate = async () => {
    if (!url.trim() || !isYT(url) || platforms.length === 0) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch(`${API_BASE}/repurpose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), platforms }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setVideoTitle(data.video_title);
      setResults(data.platforms);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <CustomCursor />

      {/* Background layers */}
      <div className="bg-mesh">
        <div className="mesh-orb" />
        <div className="mesh-orb" />
        <div className="mesh-orb" />
      </div>
      <div className="noise-overlay" />
      <Particles />

      {/* ── Content ─────────────────────── */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 sm:px-8">
        {/* Nav */}
        <header className="flex items-center justify-between pt-10 pb-24">
          <PrismLogo />
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-white/15 tracking-widest uppercase">
              Beta
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-prism-emerald/60 animate-pulse" />
          </div>
        </header>

        {/* Hero */}
        <section className="mb-16">
          <h1 className="font-display leading-[1.05] mb-5">
            <RevealText
              text="Content in."
              className="text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold text-white block"
              delay={200}
            />
            <RevealText
              text="Posts out."
              className="text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold text-prism-gradient block"
              delay={500}
            />
          </h1>
          <div className="overflow-hidden">
            <p
              className="font-body text-base sm:text-lg text-white/30 max-w-sm"
              style={{
                animation: "stagger-reveal 0.7s cubic-bezier(0.16,1,0.3,1) 0.8s forwards",
                opacity: 0,
              }}
            >
              Paste a YouTube URL. Get a week of social content in seconds.
            </p>
          </div>
        </section>

        {/* Input */}
        <FadeSection delay={100}>
          <div className="input-wrapper mb-3">
            <div className="input-inner flex gap-3 p-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generate()}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 bg-transparent px-5 py-3.5 font-body text-white placeholder-white/20 outline-none text-base"
              />
              <button
                onClick={generate}
                disabled={
                  !url.trim() || !isYT(url) || platforms.length === 0 || loading
                }
                className="btn-generate px-7 py-3.5 rounded-xl font-display text-sm font-bold text-white disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Working
                  </span>
                ) : (
                  "Generate →"
                )}
              </button>
            </div>
          </div>

          {url.trim() && !isYT(url) && (
            <p className="font-mono text-[11px] text-red-400/50 ml-5">
              Needs a valid YouTube URL
            </p>
          )}
        </FadeSection>

        {/* Platforms */}
        <FadeSection delay={250} className="mt-8 mb-16">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em] mb-3">
            Output platforms
          </p>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <PlatformChip
                key={p.id}
                platform={p}
                selected={platforms.includes(p.id)}
                onToggle={toggle}
              />
            ))}
          </div>
        </FadeSection>

        {/* Loading */}
        {loading && <Loader />}

        {/* Error */}
        {error && (
          <FadeSection className="mb-8">
            <ErrorDisplay message={error} onDismiss={() => setError(null)} />
          </FadeSection>
        )}

        {/* Results */}
        {results && (
          <section ref={resultsRef} className="pb-24">
            {/* Divider with title */}
            <div className="flex items-center gap-4 mb-8">
              <div className="hr-gradient flex-1" />
              <span className="font-mono text-[10px] text-white/25 shrink-0 max-w-[200px] truncate">
                {videoTitle}
              </span>
              <div className="hr-gradient flex-1" />
            </div>

            <div className="space-y-5">
              {results.map((r, i) => (
                <ResultCard
                  key={r.platform}
                  platform={r.platform}
                  content={r.content}
                  index={i}
                />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-12 stagger-in" style={{ animationDelay: `${results.length * 120 + 200}ms` }}>
              <button
                onClick={() => {
                  setResults(null);
                  setUrl("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="font-body text-xs text-white/25 hover:text-white/50 transition-colors border-b border-white/10 hover:border-white/25 pb-0.5"
              >
                Generate another ↑
              </button>
            </div>
          </section>
        )}

        {/* Footer */}
        {!results && !loading && (
          <footer className="text-center pt-24 pb-12">
            <div className="hr-gradient mb-8 max-w-[100px] mx-auto" />
            <p className="font-mono text-[10px] text-white/10 tracking-widest">
              PRISM © 2026
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
