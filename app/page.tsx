"use client"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import {
  Terminal, ArrowRight, Shield, Zap, Layers,
  MessageSquare, Radio, Users, TrendingUp,
  Code2, Hash, Star, GitFork, Eye, ChevronDown
} from "lucide-react"

// Animated counter hook
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  const posts = useCounter(1240, 1800, statsVisible)
  const users = useCounter(3800, 2000, statsVisible)
  const communities = useCounter(94, 1500, statsVisible)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!statsRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --teal: #2DD4BF;
          --teal-dim: rgba(45,212,191,0.12);
          --teal-glow: rgba(45,212,191,0.25);
          --blue: #3B82F6;
          --bg: #030812;
          --surface: #080F1E;
          --surface2: #0D1627;
          --border: rgba(255,255,255,0.06);
          --border-bright: rgba(45,212,191,0.2);
          --text: #F0F4FF;
          --muted: #5A7090;
          --muted2: #8BA3C0;
        }

        body { background: var(--bg); }

        .landing-wrap {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        /* NOISE TEXTURE */
        .landing-wrap::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* NAV */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 40px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.3s ease;
        }
        .nav.scrolled {
          background: rgba(3,8,18,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-size: 22px; font-weight: 900;
          color: var(--teal); text-decoration: none;
          letter-spacing: -0.5px;
        }
        .nav-logo span { color: var(--text); }
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-signin {
          color: var(--muted2); font-size: 14px; font-weight: 500;
          text-decoration: none; padding: 8px 16px; border-radius: 6px;
          transition: color 0.2s;
        }
        .nav-signin:hover { color: var(--text); }
        .nav-cta {
          background: var(--teal); color: #030812;
          font-size: 13px; font-weight: 700;
          padding: 9px 20px; border-radius: 6px;
          text-decoration: none; letter-spacing: 0.01em;
          transition: opacity 0.2s, transform 0.2s;
          box-shadow: 0 0 20px var(--teal-glow);
        }
        .nav-cta:hover { opacity: 0.9; transform: translateY(-1px); }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
          position: relative;
          z-index: 1;
        }

        /* Grid bg */
        .hero-grid {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 100%);
        }

        /* Glow orbs */
        .orb {
          position: absolute; border-radius: 50%;
          pointer-events: none; z-index: 0;
          filter: blur(80px);
        }
        .orb-1 {
          width: 600px; height: 300px;
          top: 10%; left: 50%; transform: translateX(-50%);
          background: radial-gradient(ellipse, rgba(45,212,191,0.07) 0%, transparent 70%);
        }
        .orb-2 {
          width: 400px; height: 400px;
          top: 30%; right: -100px;
          background: radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 70%);
        }

        /* Badge */
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(45,212,191,0.06);
          border: 1px solid var(--border-bright);
          color: var(--teal);
          padding: 6px 14px; border-radius: 9999px;
          font-family: 'Space Mono', monospace;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 32px;
          position: relative; z-index: 1;
          animation: fadeDown 0.6s ease both;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 8px var(--teal);
          animation: pulse 2s ease infinite;
        }

        /* Headline */
        .hero-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(44px, 7vw, 88px);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.04em;
          color: var(--text);
          max-width: 900px;
          margin-bottom: 28px;
          position: relative; z-index: 1;
          animation: fadeUp 0.7s 0.1s ease both;
        }
        .hero-h1 .grad {
          background: linear-gradient(135deg, var(--teal) 0%, #60A5FA 60%, var(--teal) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        /* Sub */
        .hero-sub {
          font-size: clamp(15px, 1.5vw, 18px);
          color: var(--muted2);
          line-height: 1.7;
          max-width: 560px;
          margin-bottom: 44px;
          position: relative; z-index: 1;
          animation: fadeUp 0.7s 0.2s ease both;
        }

        /* CTA row */
        .cta-row {
          display: flex; gap: 12px; flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 80px;
          position: relative; z-index: 1;
          animation: fadeUp 0.7s 0.3s ease both;
        }
        .cta-primary {
          background: var(--teal); color: #030812;
          font-size: 15px; font-weight: 700;
          padding: 14px 32px; border-radius: 8px;
          text-decoration: none;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 0 40px var(--teal-glow);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 50px var(--teal-glow);
        }
        .cta-secondary {
          background: var(--surface2); color: var(--text);
          border: 1px solid var(--border);
          font-size: 15px; font-weight: 600;
          padding: 14px 28px; border-radius: 8px;
          text-decoration: none;
          display: flex; align-items: center; gap: 10px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .cta-secondary:hover {
          border-color: var(--border-bright);
          transform: translateY(-2px);
        }

        /* MOCK APP WINDOW */
        .app-window {
          width: 100%; max-width: 900px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px var(--border);
          position: relative; z-index: 1;
          animation: fadeUp 0.8s 0.4s ease both;
        }
        .window-bar {
          background: var(--surface2);
          border-bottom: 1px solid var(--border);
          padding: 12px 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .dot { width: 11px; height: 11px; border-radius: 50%; }
        .window-title {
          font-family: 'Space Mono', monospace;
          font-size: 12px; color: var(--muted);
          margin-left: 6px; flex: 1;
        }
        .window-status {
          font-size: 11px; color: var(--teal);
          background: var(--teal-dim);
          border: 1px solid var(--border-bright);
          padding: 3px 10px; border-radius: 4px;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
        }
        .window-body { padding: 24px; }

        /* Feed preview */
        .feed-post {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          display: flex; gap: 14px;
          transition: border-color 0.2s;
          cursor: default;
        }
        .feed-post:hover { border-color: var(--border-bright); }
        .vote-col {
          display: flex; flex-direction: column;
          align-items: center; gap: 4px;
          font-family: 'Space Mono', monospace;
          font-size: 12px; color: var(--muted);
          min-width: 28px;
        }
        .vote-btn {
          width: 24px; height: 24px; border-radius: 4px;
          background: var(--teal-dim);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; color: var(--teal);
        }
        .post-main { flex: 1; min-width: 0; }
        .post-meta {
          font-size: 11px; color: var(--muted);
          margin-bottom: 6px;
          display: flex; align-items: center; gap: 6px;
          flex-wrap: wrap;
        }
        .community-tag {
          color: var(--teal); font-weight: 600;
        }
        .post-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700;
          color: var(--text); margin-bottom: 8px;
          line-height: 1.3;
        }
        .tag-chip {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 11px; padding: 2px 8px; border-radius: 4px;
          margin-right: 5px;
        }
        .tag-teal {
          color: var(--teal); background: var(--teal-dim);
          border: 1px solid var(--border-bright);
        }
        .tag-blue {
          color: #60A5FA; background: rgba(59,130,246,0.08);
          border: 1px solid rgba(59,130,246,0.2);
        }
        .post-footer {
          font-size: 11px; color: var(--muted);
          display: flex; gap: 14px; margin-top: 8px;
          align-items: center;
        }
        .post-footer-item {
          display: flex; align-items: center; gap: 4px;
        }

        /* STATS */
        .stats-section {
          padding: 80px 24px;
          position: relative; z-index: 1;
          display: flex; justify-content: center;
        }
        .stats-inner {
          width: 100%; max-width: 800px;
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }
        .stat-card {
          background: var(--surface);
          padding: 40px 32px;
          text-align: center;
        }
        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 48px; font-weight: 900;
          color: var(--teal);
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 8px;
        }
        .stat-label {
          font-size: 13px; color: var(--muted2);
          font-weight: 500; letter-spacing: 0.02em;
        }

        /* FEATURES */
        .features-section {
          padding: 80px 24px;
          position: relative; z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
        }
        .section-label {
          font-family: 'Space Mono', monospace;
          font-size: 11px; color: var(--teal);
          letter-spacing: 0.1em; font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .section-label::before {
          content: ''; width: 24px; height: 1px;
          background: var(--teal);
        }
        .section-h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 900; letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 56px;
          max-width: 600px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }
        .feat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 28px;
          transition: border-color 0.25s, transform 0.25s;
          cursor: default;
        }
        .feat-card:hover {
          border-color: var(--border-bright);
          transform: translateY(-3px);
        }
        .feat-icon {
          width: 44px; height: 44px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
        }
        .feat-title {
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 800;
          color: var(--text); margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .feat-desc {
          font-size: 14px; color: var(--muted2);
          line-height: 1.65;
        }

        /* HOW IT WORKS */
        .how-section {
          padding: 80px 24px;
          max-width: 900px;
          margin: 0 auto;
          position: relative; z-index: 1;
        }
        .steps {
          display: flex; flex-direction: column; gap: 0;
          position: relative;
        }
        .steps::before {
          content: '';
          position: absolute;
          left: 22px; top: 44px; bottom: 44px;
          width: 1px;
          background: linear-gradient(to bottom, var(--teal), var(--blue), transparent);
        }
        .step {
          display: flex; gap: 24px; align-items: flex-start;
          padding: 32px 0;
        }
        .step-num {
          width: 44px; height: 44px; border-radius: 50%;
          background: var(--surface2);
          border: 1px solid var(--border-bright);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: 14px; font-weight: 700;
          color: var(--teal);
          flex-shrink: 0; z-index: 1;
        }
        .step-content { padding-top: 8px; }
        .step-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 800;
          color: var(--text); margin-bottom: 8px;
        }
        .step-desc {
          font-size: 14px; color: var(--muted2);
          line-height: 1.65; max-width: 480px;
        }

        /* CTA SECTION */
        .cta-section {
          padding: 100px 24px;
          text-align: center;
          position: relative; z-index: 1;
          max-width: 700px;
          margin: 0 auto;
        }
        .cta-h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 900; letter-spacing: -0.04em;
          color: var(--text); margin-bottom: 20px;
          line-height: 1.1;
        }
        .cta-sub {
          font-size: 16px; color: var(--muted2);
          margin-bottom: 40px; line-height: 1.6;
        }

        /* FOOTER */
        .footer {
          border-top: 1px solid var(--border);
          padding: 32px 40px;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 16px;
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto;
          width: 100%;
        }
        .footer-logo {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 900;
          color: var(--teal); text-decoration: none;
        }
        .footer-logo span { color: var(--text); }
        .footer-links { display: flex; gap: 24px; }
        .footer-link {
          font-size: 13px; color: var(--muted);
          text-decoration: none; transition: color 0.2s;
        }
        .footer-link:hover { color: var(--text); }
        .footer-copy {
          font-size: 12px; color: var(--muted);
          font-family: 'Space Mono', monospace;
        }

        /* ANIMATIONS */
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @media (max-width: 640px) {
          .nav { padding: 0 20px; }
          .stats-inner { grid-template-columns: 1fr; }
          .stat-card { padding: 28px 20px; }
          .steps::before { display: none; }
          .footer { flex-direction: column; text-align: center; }
          .footer-links { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      <div className="landing-wrap">

        {/* NAV */}
        <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
          <Link href="/" className="nav-logo">DevSphere</Link>
          <div className="nav-links">
            <Link href="/login" className="nav-signin">Sign In</Link>
            <Link href="/login" className="nav-cta">Get Started →</Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-grid" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />

          <div className="hero-badge">
            <span className="badge-dot" />
            BUILT FOR DEVELOPERS, BY DEVELOPERS
          </div>

          <h1 className="hero-h1">
            Where Tech Minds<br />
            <span className="grad">Connect & Build</span>
          </h1>

          <p className="hero-sub">
            DevSphere is the developer community platform where you share knowledge,
            discover communities, and grow your network — Reddit meets LinkedIn for engineers.
          </p>

          <div className="cta-row">
            <Link href="/login" className="cta-primary">
              Start for Free <ArrowRight size={18} />
            </Link>
            <a
              href="https://github.com/shishvishwakarma995-png"
              target="_blank" rel="noreferrer"
              className="cta-secondary"
            >
              <Terminal size={16} style={{ color: 'var(--muted)' }} />
              View Source
            </a>
          </div>

          {/* App Window Mock */}
          <div className="app-window" style={{ animation: 'float 6s ease-in-out infinite' }}>
            <div className="window-bar">
              <div className="dot" style={{ background: '#EF4444' }} />
              <div className="dot" style={{ background: '#F59E0B' }} />
              <div className="dot" style={{ background: '#10B981' }} />
              <span className="window-title">devsphere.app/home — feed</span>
              <span className="window-status">● LIVE</span>
            </div>
            <div className="window-body">
              {/* Post 1 */}
              <div className="feed-post">
                <div className="vote-col">
                  <div className="vote-btn">▲</div>
                  <span style={{ color: 'var(--teal)', fontWeight: 700 }}>247</span>
                  <span>▼</span>
                </div>
                <div className="post-main">
                  <div className="post-meta">
                    <span className="community-tag">c/ReactJS</span>
                    <span>·</span>
                    <span>by @devshishanki</span>
                    <span>·</span>
                    <span>2h ago</span>
                  </div>
                  <div className="post-title">React 19 Server Components — Complete Performance Deep Dive</div>
                  <div>
                    <span className="tag-chip tag-teal">#React</span>
                    <span className="tag-chip tag-blue">#Performance</span>
                  </div>
                  <div className="post-footer">
                    <span className="post-footer-item"><MessageSquare size={12} /> 38 comments</span>
                    <span className="post-footer-item"><Star size={12} /> Save</span>
                    <span className="post-footer-item"><GitFork size={12} /> Share</span>
                  </div>
                </div>
              </div>
              {/* Post 2 */}
              <div className="feed-post">
                <div className="vote-col">
                  <div className="vote-btn">▲</div>
                  <span style={{ fontWeight: 700 }}>183</span>
                  <span>▼</span>
                </div>
                <div className="post-main">
                  <div className="post-meta">
                    <span className="community-tag">c/DevOps</span>
                    <span>·</span>
                    <span>by @k8s_ninja</span>
                    <span>·</span>
                    <span>5h ago</span>
                  </div>
                  <div className="post-title">Zero-downtime Kubernetes deployments with Argo Rollouts</div>
                  <div>
                    <span className="tag-chip tag-blue">#Kubernetes</span>
                    <span className="tag-chip tag-teal">#DevOps</span>
                  </div>
                  <div className="post-footer">
                    <span className="post-footer-item"><MessageSquare size={12} /> 21 comments</span>
                    <span className="post-footer-item"><Star size={12} /> Save</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats-section" ref={statsRef}>
          <div className="stats-inner">
            <div className="stat-card">
              <div className="stat-num">{mounted ? posts.toLocaleString() : '0'}+</div>
              <div className="stat-label">Posts shared</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{mounted ? users.toLocaleString() : '0'}+</div>
              <div className="stat-label">Developers joined</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{mounted ? communities : '0'}+</div>
              <div className="stat-label">Communities active</div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features-section">
          <div className="section-label">Platform Features</div>
          <h2 className="section-h2">Everything a developer community needs</h2>
          <div className="features-grid">
            {[
              {
                icon: <Hash size={20} />,
                color: 'rgba(45,212,191,0.1)', iconColor: 'var(--teal)',
                title: 'Developer Communities',
                desc: 'Create or join communities around any tech stack, language, or topic. Your spaces, your rules.'
              },
              {
                icon: <TrendingUp size={20} />,
                color: 'rgba(59,130,246,0.1)', iconColor: '#60A5FA',
                title: 'Smart Hot Algorithm',
                desc: 'Posts ranked by score = votes / (hours + 2)^1.5. Fresh quality content always rises to the top.'
              },
              {
                icon: <Shield size={20} />,
                color: 'rgba(45,212,191,0.1)', iconColor: 'var(--teal)',
                title: 'JWT Auth + Route Guards',
                desc: 'Secure token-based authentication with cookie sync and automatic middleware route protection.'
              },
              {
                icon: <Users size={20} />,
                color: 'rgba(59,130,246,0.1)', iconColor: '#60A5FA',
                title: 'Developer Profiles',
                desc: 'LinkedIn-style profiles with skills, headline, bio, follower counts, and your post history.'
              },
              {
                icon: <Zap size={20} />,
                color: 'rgba(45,212,191,0.1)', iconColor: 'var(--teal)',
                title: 'Instant Search',
                desc: '300ms debounced global search across posts, communities, and users. Find anything instantly.'
              },
              {
                icon: <Code2 size={20} />,
                color: 'rgba(59,130,246,0.1)', iconColor: '#60A5FA',
                title: 'Open Source Stack',
                desc: 'Built on Next.js 16, TypeScript, Prisma, PostgreSQL, Express. Fork it, extend it, own it.'
              },
            ].map((f, i) => (
              <div className="feat-card" key={i}>
                <div className="feat-icon" style={{ background: f.color }}>
                  <span style={{ color: f.iconColor }}>{f.icon}</span>
                </div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-section">
          <div className="section-label">How It Works</div>
          <h2 className="section-h2">Up and running in minutes</h2>
          <div className="steps">
            {[
              {
                n: '01',
                title: 'Create your account',
                desc: 'Sign up with email. No credit card, no friction. Your profile is live instantly.'
              },
              {
                n: '02',
                title: 'Join communities you care about',
                desc: 'Browse communities by language, framework, or domain. Join React, DevOps, Python, AI — whatever drives you.'
              },
              {
                n: '03',
                title: 'Share & discover knowledge',
                desc: 'Post questions, articles, code snippets, and links. Upvote what matters. Comment, discuss, collaborate.'
              },
              {
                n: '04',
                title: 'Build your developer network',
                desc: 'Follow engineers you admire. Get a personalized following feed. Grow your reputation through quality contributions.'
              },
            ].map((s, i) => (
              <div className="step" key={i}>
                <div className="step-num">{s.n}</div>
                <div className="step-content">
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="cta-section">
          <div style={{
            position: 'absolute', top: '20%', left: '50%',
            transform: 'translateX(-50%)',
            width: '400px', height: '200px',
            background: 'radial-gradient(ellipse, rgba(45,212,191,0.06) 0%, transparent 70%)',
            pointerEvents: 'none', zIndex: 0
          }} />
          <h2 className="cta-h2" style={{ position: 'relative', zIndex: 1 }}>
            Ready to join the<br />
            <span style={{
              background: 'linear-gradient(135deg, var(--teal), #60A5FA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>dev community?</span>
          </h2>
          <p className="cta-sub" style={{ position: 'relative', zIndex: 1 }}>
            Free forever. No ads. Open source. Just developers helping developers.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link href="/login" className="cta-primary">
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link href="/home" className="cta-secondary">
              <Eye size={16} style={{ color: 'var(--muted)' }} /> Browse Feed
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
          <div className="footer">
            <Link href="/" className="footer-logo">Dev<span>Sphere</span></Link>
            <div className="footer-links">
              <a
                href="https://github.com/shishvishwakarma995-png"
                target="_blank" rel="noreferrer"
                className="footer-link"
              >GitHub</a>
              <a href="/login" className="footer-link">Sign Up</a>
              <span className="footer-link" style={{ cursor: 'pointer' }}>Privacy</span>
            </div>
            <div className="footer-copy">© 2026 DevSphere</div>
          </div>
        </footer>

      </div>
    </>
  )
}