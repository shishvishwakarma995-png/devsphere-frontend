"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Code2, Users, TrendingUp,
         MessageSquare, Hash, Zap } from "lucide-react"

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const FEATURES = [
  {
    icon: Code2,
    title: 'Code Posts',
    desc: 'Share code snippets with syntax highlighting. Get feedback from the community.',
    color: 'text-teal', bg: 'bg-teal/10 border-teal/20'
  },
  {
    icon: Users,
    title: 'Developer Profiles',
    desc: 'LinkedIn-style profiles with skills, bio, and your post history.',
    color: 'text-indigo-soft', bg: 'bg-indigo/10 border-indigo/20'
  },
  {
    icon: TrendingUp,
    title: 'Smart Sorting',
    desc: 'Hot, New, Top, Rising — algorithm-powered feeds so best content surfaces first.',
    color: 'text-teal', bg: 'bg-teal/10 border-teal/20'
  },
  {
    icon: MessageSquare,
    title: 'Discussions',
    desc: 'Comment on posts, vote on ideas, and engage with tech communities.',
    color: 'text-indigo-soft', bg: 'bg-indigo/10 border-indigo/20'
  },
  {
    icon: Hash,
    title: 'Tag System',
    desc: 'Every post is tagged. Browse by technology — #React, #TypeScript, #AI.',
    color: 'text-teal', bg: 'bg-teal/10 border-teal/20'
  },
  {
    icon: Zap,
    title: 'Real-time Feed',
    desc: 'Trending tags refresh every 60s. Stay on top of what devs are talking about.',
    color: 'text-indigo-soft', bg: 'bg-indigo/10 border-indigo/20'
  },
]

export default function LandingPage() {
  const [stats, setStats] = useState({ posts: 0, communities: 0, users: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    fetch(`${BASE}/api/stats`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen"
         style={{background:'#060D1A'}}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4
                     border-b border-dark-border/50 max-w-6xl mx-auto">
        <span className="text-xl font-bold text-teal">
          Dev<span className="text-txt1">Sphere</span>
        </span>
        <div className="flex items-center gap-3">
          <Link href="/login"
            className="text-sm text-txt2 hover:text-teal transition-colors">
            Sign in
          </Link>
          <Link href="/login"
            className="text-sm font-semibold px-4 py-2 rounded-lg
                       bg-teal text-dark-bg hover:bg-teal-dark transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center"
           style={{
             opacity: visible ? 1 : 0,
             transform: visible ? 'translateY(0)' : 'translateY(20px)',
             transition: 'all 0.6s ease'
           }}>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                       border border-teal/30 bg-teal/10 text-teal text-xs
                       font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"/>
          Built for developers, by developers
        </div>

        <h1 className="text-5xl font-bold text-txt1 mb-5 leading-tight">
          Where{" "}
          <span style={{
            background: 'linear-gradient(90deg, #2DD4BF, #818CF8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            tech minds
          </span>
          {" "}connect
        </h1>

        <p className="text-lg text-txt2 mb-8 max-w-2xl mx-auto leading-relaxed">
          DevSphere is a community platform for developers — share code,
          discuss ideas, vote on solutions, and grow your professional network.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/login"
            className="flex items-center gap-2 px-6 py-3 rounded-xl
                       bg-teal text-dark-bg font-bold text-base
                       hover:bg-teal-dark transition-all
                       hover:shadow-lg hover:shadow-teal/20">
            Start for free <ArrowRight size={16}/>
          </Link>
          <Link href="/login"
            className="px-6 py-3 rounded-xl border border-dark-border
                       text-txt2 font-medium text-base
                       hover:border-teal hover:text-teal transition-all">
            Browse posts
          </Link>
        </div>
      </div>

      {/* Live Stats */}
      <div className="max-w-3xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Posts',       value: stats.posts,       suffix: '' },
            { label: 'Communities', value: stats.communities, suffix: '' },
            { label: 'Developers',  value: stats.users,       suffix: '' },
          ].map(s => (
            <div key={s.label}
              className="text-center bg-dark-card border border-dark-border
                         rounded-xl py-5 px-4">
              <div className="text-3xl font-bold text-teal mb-1">
                {s.value}{s.suffix}
              </div>
              <div className="text-sm text-txt2">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-bold text-txt1 text-center mb-3">
          Everything a developer needs
        </h2>
        <p className="text-txt2 text-center mb-10 text-sm">
          Built with Next.js, Express, and PostgreSQL
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title}
              className="bg-dark-card border border-dark-border
                         rounded-xl p-5 hover:border-teal/30
                         transition-all hover:-translate-y-0.5"
              style={{
                animationDelay: `${i * 0.1}s`,
                opacity: visible ? 1 : 0,
                transition: `all 0.5s ease ${i * 0.08}s`
              }}>
              <div className={`w-10 h-10 rounded-xl border flex items-center
                              justify-center mb-3 ${f.bg}`}>
                <f.icon size={18} className={f.color}/>
              </div>
              <h3 className="font-semibold text-txt1 mb-1 text-sm">{f.title}</h3>
              <p className="text-xs text-txt2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-6 pb-24 text-center">
        <div className="bg-dark-card border border-teal/20 rounded-2xl p-10"
             style={{background:'linear-gradient(135deg,#060D1A,#0A1628)'}}>
          <h2 className="text-2xl font-bold text-txt1 mb-3">
            Ready to join the community?
          </h2>
          <p className="text-txt2 text-sm mb-6">
            Free forever. No credit card needed.
          </p>
          <Link href="/login"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl
                       bg-teal text-dark-bg font-bold
                       hover:bg-teal-dark transition-all">
            Create your account <ArrowRight size={16}/>
          </Link>
        </div>
      </div>
    </div>
  )
}