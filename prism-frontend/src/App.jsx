import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Analytics } from '@vercel/analytics/react';

const PLATFORMS = [
  { id: "twitter", label: "𝕏 / Twitter", icon: "𝕏", color: "#8b5cf6" },
  { id: "linkedin", label: "LinkedIn", icon: "in", color: "#3b82f6" },
  { id: "instagram", label: "Instagram", icon: "◎", color: "#d946ef" },
  { id: "newsletter", label: "Newsletter", icon: "✦", color: "#06b6d4" },
];

const TONES = [
  { id: "professional", label: "Professional", icon: "💼" },
  { id: "casual", label: "Casual", icon: "☕" },
  { id: "witty", label: "Witty & Bold", icon: "⚡" },
  { id: "educational", label: "Educational", icon: "🎓" },
  { id: "inspirational", label: "Inspirational", icon: "✨" },
  { id: "storyteller", label: "Storyteller", icon: "📖" },
];

const TONE_DESCRIPTIONS = {
  professional: "professional yet conversational — authoritative but approachable",
  casual: "relaxed and friendly — like texting a smart friend",
  witty: "bold, punchy, and opinionated — hot takes with substance",
  educational: "clear and informative — breaks down complex ideas simply",
  inspirational: "motivating and uplifting — connects ideas to bigger purpose",
  storyteller: "narrative-driven — turns insights into compelling micro-stories",
};

const PLATFORM_STYLES = {
  twitter: { color: "#8b5cf6", dim: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.15)", glow: "rgba(139,92,246,0.06)" },
  linkedin: { color: "#3b82f6", dim: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.15)", glow: "rgba(59,130,246,0.06)" },
  instagram: { color: "#d946ef", dim: "rgba(217,70,239,0.08)", border: "rgba(217,70,239,0.15)", glow: "rgba(217,70,239,0.06)" },
  newsletter: { color: "#06b6d4", dim: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.15)", glow: "rgba(6,182,212,0.06)" },
};

// Grab the Railway URL from Vercel's environment variables, or fall back to localhost for local development
const HOST_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_BASE = `${HOST_URL}/api/v1`;

/* ── Particle data (module-level, never re-creates) ── */
const PARTICLE_DATA = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 20 + 15,
  delay: Math.random() * -20,
  color: ["rgba(139,92,246,0.4)", "rgba(6,182,212,0.3)", "rgba(217,70,239,0.3)"][i % 3],
}));

/* ═══════════════════════════════════════════
   Particles (memoized)
   ═══════════════════════════════════════════ */
const Particles = memo(function Particles() {
  return (
    <div className="particle-field">
      {PARTICLE_DATA.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: `${p.size}px`, height: `${p.size}px`,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
});

/* ═══════════════════════════════════════════
   Splash Intro
   ═══════════════════════════════════════════ */
function SplashIntro({ onComplete }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 2400);
    const t2 = setTimeout(() => onComplete(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div className={`splash ${exiting ? "exit" : ""}`}>
      <svg className="splash-prism" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
        <polygon className="tri-fill" points="60,10 10,110 110,110" fill="url(#triGrad)" />
        <polygon className="tri-stroke" points="60,10 10,110 110,110" fill="none" stroke="url(#triGrad)" strokeWidth="2" strokeLinejoin="round" />
      </svg>

      <div className="splash-beam">
        <div className="beam-white" />
        <div className="beam-spectrum ray-1" />
        <div className="beam-spectrum ray-2" />
        <div className="beam-spectrum ray-3" />
        <div className="beam-spectrum ray-4" />
      </div>

      <span className="splash-title font-display text-sm font-bold text-prism-gradient tracking-[0.3em] uppercase">
        Prism
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Scroll-triggered Fade
   ═══════════════════════════════════════════ */
function FadeSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fade-section ${visible ? "visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Animated Subtitle (word by word)
   ═══════════════════════════════════════════ */
function AnimatedSubtitle({ text, baseDelay = 900 }) {
  const words = text.split(" ");
  return (
    <p className="font-body text-base sm:text-lg text-white/30 max-w-sm leading-relaxed" style={{ perspective: "600px" }}>
      {words.map((word, i) => (
        <span
          key={i}
          className="word-stagger"
          style={{ animationDelay: `${baseDelay + i * 60}ms` }}
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

/* ═══════════════════════════════════════════
   Prism Logo + Creator Card
   ═══════════════════════════════════════════ */
function PrismLogo() {
  const [hovered, setHovered] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const hideTimer = useRef(null);

  const handleEnter = () => {
    clearTimeout(hideTimer.current);
    setHovered(true);
    setCardVisible(true);
  };

  const handleLeave = () => {
    setHovered(false);
    hideTimer.current = setTimeout(() => setCardVisible(false), 400);
  };

  return (
    <div
      className="creator-card-wrapper"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="flex items-center gap-3">
        <div
          className="relative w-10 h-10"
          style={{
            transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
            transform: hovered ? "rotate(15deg) scale(1.1)" : "rotate(0)",
          }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4, #d946ef)", clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
          <div className="absolute inset-[3px]" style={{ background: "#08080f", clipPath: "polygon(50% 8%, 5% 97%, 95% 97%)" }} />
          <div className="absolute inset-[6px]" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.4), rgba(6,182,212,0.3))", clipPath: "polygon(50% 15%, 10% 95%, 90% 95%)", transition: "opacity 0.3s ease", opacity: hovered ? 1 : 0.5 }} />
        </div>
        <span className="font-display text-xl font-extrabold text-prism-gradient tracking-tight">
          PRISM
        </span>
      </div>

      <div
        className={`creator-card ${cardVisible ? "show" : ""}`}
        onMouseEnter={() => { clearTimeout(hideTimer.current); setCardVisible(true); }}
        onMouseLeave={handleLeave}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px]" style={{ background: "rgba(139,92,246,0.15)", color: "#8b5cf6" }}>
            ◈
          </div>
          <span className="font-display text-xs font-bold text-white/80">Lixeron</span>
        </div>
        <p className="font-body text-xs text-white/40 leading-relaxed mb-4">
          CS student at <span className="text-white/60">UAB</span> who builds things like this for fun.
          Cybersecurity track. Self-taught in DevOps, Linux, and cloud infra.
        </p>
        <div className="flex flex-wrap gap-2">
          <a href="https://github.com/lixeron" target="_blank" rel="noopener noreferrer" className="creator-link font-mono">
            <span>◈</span> GitHub
          </a>
          <a href="https://lixeron.vercel.app" target="_blank" rel="noopener noreferrer" className="creator-link font-mono">
            <span>◉</span> Portfolio
          </a>
        </div>
      </div>
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
    chipRef.current.style.setProperty("--mouse-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    chipRef.current.style.setProperty("--mouse-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <button
      ref={chipRef}
      onClick={() => onToggle(platform.id)}
      onMouseMove={handleMouse}
      className={`chip px-5 py-2.5 rounded-xl font-body text-sm font-medium border transition-all duration-300
        ${selected ? "chip-active border-prism-violet/50 text-white" : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/70 hover:border-white/15"}`}
    >
      <span className="platform-icon mr-2" style={{ background: selected ? `${platform.color}20` : "transparent", color: selected ? platform.color : "inherit" }}>
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
        ${copied ? "btn-copy-success" : "border-white/10 bg-white/[0.03] text-white/50 hover:border-prism-violet/40 hover:text-white hover:bg-white/[0.06]"}`}
    >
      {copied ? "✓ Copied" : "⎘ Copy"}
    </button>
  );
}

/* ═══════════════════════════════════════════
   Result Card (redesigned)
   ═══════════════════════════════════════════ */
function ResultCard({ platform, content, index }) {
  const meta = PLATFORMS.find((p) => p.id === platform);
  const style = PLATFORM_STYLES[platform] || PLATFORM_STYLES.twitter;

  return (
    <div
      className="stagger-in result-card"
      style={{
        animationDelay: `${index * 120}ms`,
        "--card-color": style.color,
        "--card-color-dim": style.dim,
        "--card-color-border": style.border,
        "--card-glow": style.glow,
      }}
    >
      <div className="result-card-inner">
        {/* Accent bar */}
        <div className="result-card-accent" style={{ background: `linear-gradient(90deg, ${style.color}, transparent 80%)` }} />

        {/* Header */}
        <div className="result-card-header">
          <div className="result-platform-badge" style={{ background: style.dim, borderColor: style.border }}>
            <div className="result-platform-icon" style={{ background: `${style.color}18`, color: style.color }}>
              {meta?.icon}
            </div>
            <span className="font-display text-xs font-bold text-white/90 tracking-wide">
              {meta?.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-white/15">
              {content.length} chars
            </span>
            <CopyButton text={content} />
          </div>
        </div>

        {/* Body */}
        <div className="result-card-body">
          <div className="font-body text-[13px] text-white/65 leading-[1.85] whitespace-pre-wrap">
            {content}
          </div>
        </div>

        {/* Corner glow */}
        <div className="result-card-corner" style={{ background: `radial-gradient(circle at 100% 100%, ${style.dim}, transparent 70%)` }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Loader
   ═══════════════════════════════════════════ */
function Loader() {
  const msgs = ["Extracting transcript...", "Understanding context...", "Crafting platform-native posts...", "Polishing the output..."];
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx((i) => (i + 1) % msgs.length), 3000); return () => clearInterval(t); }, []);

  return (
    <div className="flex flex-col items-center gap-8 py-20">
      <div className="prism-loader-wrapper">
        <div className="prism-loader-ring" />
        <div className="prism-loader-ring" />
        <div className="prism-loader-ring" />
      </div>
      <p className="font-body text-sm text-white/30" key={idx} style={{ animation: "stagger-reveal 0.5s ease forwards" }}>
        {msgs[idx]}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Error
   ═══════════════════════════════════════════ */
function ErrorDisplay({ message, onDismiss }) {
  return (
    <div className="result-card" style={{ "--card-color": "rgba(239,68,68,0.5)", "--card-color-dim": "rgba(239,68,68,0.06)" }}>
      <div className="result-card-inner p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <span className="text-red-400/80 text-base mt-0.5">✕</span>
            <div>
              <p className="font-body text-sm text-red-300/80 font-medium">Generation failed</p>
              <p className="font-body text-xs text-red-300/40 mt-1 leading-relaxed">{message}</p>
            </div>
          </div>
          <button onClick={onDismiss} className="text-white/20 hover:text-white/50 transition-colors text-sm">✕</button>
        </div>
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
  const [tone, setTone] = useState("professional");
  const [context, setContext] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("prism-visited"));
  const resultsRef = useRef(null);

  const dismissSplash = useCallback(() => {
    setShowSplash(false);
    sessionStorage.setItem("prism-visited", "1");
  }, []);

  const toggle = (id) => setPlatforms((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const isYT = (u) => /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/.test(u);

  const generate = async () => {
    const videoIdMatch = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    const cleanUrl = videoIdMatch
      ? `https://www.youtube.com/watch?v=${videoIdMatch[1]}`
      : url;
    if (!cleanUrl.trim() || !isYT(cleanUrl) || platforms.length === 0) return;
    setLoading(true); setError(null); setResults(null);

    try {
      const res = await fetch(`${API_BASE}/repurpose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          url: cleanUrl.trim(), 
          platforms, 
          tone: TONE_DESCRIPTIONS[tone] || tone, 
          context: context.trim()
         }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || `Request failed (${res.status})`);
      }
      
      const data = await res.json();
      setVideoTitle(data.video_title);
      setResults(data.platforms);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {showSplash && <SplashIntro onComplete={dismissSplash} />}

      <div className="bg-mesh"><div className="mesh-orb" /><div className="mesh-orb" /><div className="mesh-orb" /></div>
      <div className="noise-overlay" />
      <Particles />
      <Analytics />

      <div className="relative z-10 max-w-2xl mx-auto px-6 sm:px-8">
        {/* Nav */}
        <header className="flex items-center justify-between pt-10 pb-24">
          <PrismLogo />
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-white/15 tracking-widest uppercase">Beta</span>
            <div className="w-1.5 h-1.5 rounded-full bg-prism-emerald/60 animate-pulse" />
          </div>
        </header>

        {/* Hero */}
        <section className="mb-16">
          <h1 className="font-display leading-[1.1] mb-6">
            <span className="hero-line">
              <span className="hero-line-inner text-[clamp(2.2rem,6.5vw,4rem)] font-black text-white" style={{ animationDelay: "0.2s" }}>
                Content in.
              </span>
            </span>
            <span className="hero-line">
              <span className="hero-line-inner hero-underline text-[clamp(2.2rem,6.5vw,4rem)] font-black text-prism-gradient" style={{ animationDelay: "0.5s" }}>
                Posts out.
              </span>
            </span>
          </h1>
          <AnimatedSubtitle text="Paste a YouTube URL. Get a week of social content in seconds." />
        </section>

        {/* Input */}
        <FadeSection delay={100}>
          <div className="input-wrapper mb-3">
            <div className="input-inner flex gap-3 p-2">
              <input
                type="url" value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generate()}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 bg-transparent px-5 py-3.5 font-body text-white placeholder-white/20 outline-none text-base"
              />
              <button
                onClick={generate}
                disabled={!url.trim() || !isYT(url) || platforms.length === 0 || loading}
                className="btn-generate px-7 py-3.5 rounded-xl font-display text-xs font-bold text-white disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Working
                  </span>
                ) : "Generate →"}
              </button>
            </div>
          </div>
          {url.trim() && !isYT(url) && (
            <p className="font-mono text-[11px] text-red-400/50 ml-5">Needs a valid YouTube URL</p>
          )}
        </FadeSection>

        {/* Platforms */}
        <FadeSection delay={250} className="mt-8 mb-8">
          <p className="section-label">Output platforms</p>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <PlatformChip key={p.id} platform={p} selected={platforms.includes(p.id)} onToggle={toggle} />
            ))}
          </div>
        </FadeSection>

        {/* Tone */}
        <FadeSection delay={350} className="mb-8">
          <p className="section-label">Tone</p>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`chip px-4 py-2 rounded-xl font-body text-sm font-medium border transition-all duration-300
                  ${tone === t.id ? "chip-active border-prism-violet/50 text-white" : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/70 hover:border-white/15"}`}
              >
                <span className="mr-1.5">{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </FadeSection>

        {/* Brand Voice */}
        <FadeSection delay={400} className="mb-16">
          <button
            onClick={() => setShowContext(!showContext)}
            className="section-label hover:text-white/60 transition-colors"
            style={{ cursor: "pointer", border: "none", background: "none", padding: 0 }}
          >
            <span style={{ display: "inline-block", transition: "transform 0.2s", transform: showContext ? "rotate(90deg)" : "rotate(0)" }}>▸</span>
            Brand voice notes
            <span className="font-body text-[10px] text-white/20 normal-case tracking-normal ml-1">(optional)</span>
          </button>

          {showContext && (
            <div className="mt-3" style={{ animation: "stagger-reveal 0.4s ease forwards" }}>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. 'I'm a fitness creator who uses humor and pop culture refs. My audience is 18-30. No corporate jargon.'"
                rows={3}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-3.5 font-body text-sm text-white/70 placeholder-white/20 outline-none resize-none transition-all duration-300 focus:border-prism-violet/30 focus:bg-white/[0.05]"
              />
              <p className="font-mono text-[10px] text-white/20 mt-2 ml-1">
                Prism adapts output to match your voice
              </p>
            </div>
          )}
        </FadeSection>

        {loading && <Loader />}

        {error && (
          <FadeSection className="mb-8">
            <ErrorDisplay message={error} onDismiss={() => setError(null)} />
          </FadeSection>
        )}

        {results && (
          <section ref={resultsRef} className="pb-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="hr-gradient flex-1" />
              <span className="font-mono text-[10px] text-white/25 shrink-0 max-w-[220px] truncate">{videoTitle}</span>
              <div className="hr-gradient flex-1" />
            </div>

            <div className="space-y-6">
              {results.map((r, i) => (
                <ResultCard key={r.platform} platform={r.platform} content={r.content} index={i} />
              ))}
            </div>

            <div className="text-center mt-12 stagger-in" style={{ animationDelay: `${results.length * 120 + 200}ms` }}>
              <button
                onClick={() => { setResults(null); setUrl(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="font-body text-xs text-white/25 hover:text-white/50 transition-colors border-b border-white/10 hover:border-white/25 pb-0.5"
              >
                Generate another ↑
              </button>
            </div>
          </section>
        )}

        {!results && !loading && (
          <footer className="text-center pt-24 pb-12">
            <div className="hr-gradient mb-8 max-w-[100px] mx-auto" />
            <p className="font-mono text-[10px] text-white/10 tracking-widest">PRISM © 2026</p>
          </footer>
        )}
      </div>
    </div>
  );
}
