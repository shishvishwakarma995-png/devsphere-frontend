import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function RootPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  if (token) redirect("/home")

  let stats = { posts: 0, communities: 0, users: 0 }
  try {
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/stats`, { next: { revalidate: 10 } })
    if (apiRes.ok) {
      stats = await apiRes.json()
    }
  } catch (e) {
    console.error("Failed to fetch stats on landing page:", e)
  }

  return (
    <div style={{ background: '#060D1A', minHeight: '100vh', overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .fade-up-1 { animation: fadeUp 0.7s ease 0.1s both; }
        .fade-up-2 { animation: fadeUp 0.7s ease 0.25s both; }
        .fade-up-3 { animation: fadeUp 0.7s ease 0.4s both; }
        .fade-up-4 { animation: fadeUp 0.7s ease 0.55s both; }
        .fade-in   { animation: fadeIn 1s ease 0.2s both; }
        .float     { animation: float 4s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #2DD4BF, #818CF8, #2DD4BF);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .card-hover {
          transition: transform 0.2s, border-color 0.2s;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(45,212,191,0.3) !important;
        }
        .glow-btn {
          box-shadow: 0 0 20px rgba(45,212,191,0.3);
          transition: all 0.2s;
        }
        .glow-btn:hover {
          box-shadow: 0 0 35px rgba(45,212,191,0.5);
          transform: translateY(-1px);
        }
      `}</style>

      {/* BG orbs */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{
          position:'absolute', top:'-20%', left:'-10%',
          width:'500px', height:'500px', borderRadius:'50%',
          background:'radial-gradient(circle, #2DD4BF08, transparent 70%)',
          animation:'spin-slow 20s linear infinite'
        }}/>
        <div style={{
          position:'absolute', bottom:'-10%', right:'-10%',
          width:'600px', height:'600px', borderRadius:'50%',
          background:'radial-gradient(circle, #6366F108, transparent 70%)'
        }}/>
      </div>

      {/* Navbar */}
      <nav style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'18px 32px', borderBottom:'0.5px solid #1E3050',
        position:'sticky', top:0, zIndex:50,
        background:'rgba(6,13,26,0.8)', backdropFilter:'blur(12px)'
      }} className="fade-in">
        <span style={{ fontSize:'20px', fontWeight:700, color:'#2DD4BF', letterSpacing:'-0.5px' }}>
          Dev<span style={{ color:'#E2F0FF' }}>Sphere</span>
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <Link href="/login" style={{
            fontSize:'14px', color:'#5D7A9A', textDecoration:'none',
            padding:'8px 16px', borderRadius:'8px',
            transition:'color 0.2s'
          }}>Sign in</Link>
          <Link href="/login" style={{
            fontSize:'14px', fontWeight:600, color:'#060D1A',
            background:'#2DD4BF', padding:'8px 20px', borderRadius:'10px',
            textDecoration:'none'
          }} className="glow-btn">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        maxWidth:'800px', margin:'0 auto', padding:'80px 24px 60px',
        textAlign:'center', position:'relative', zIndex:1
      }}>
        {/* Live badge */}
        <div className="fade-up-1" style={{
          display:'inline-flex', alignItems:'center', gap:'8px',
          padding:'6px 16px', borderRadius:'20px',
          border:'0.5px solid rgba(45,212,191,0.3)',
          background:'rgba(45,212,191,0.08)', marginBottom:'28px'
        }}>
          <div style={{ position:'relative', display:'flex' }}>
            <div style={{
              width:'8px', height:'8px', borderRadius:'50%', background:'#2DD4BF',
              position:'relative', zIndex:1
            }}/>
            <div style={{
              position:'absolute', inset:'-2px', borderRadius:'50%',
              border:'2px solid #2DD4BF',
              animation:'pulse-ring 1.5s ease infinite'
            }}/>
          </div>
          <span style={{ fontSize:'12px', color:'#2DD4BF', fontWeight:500 }}>
            Built for developers · Open to all
          </span>
        </div>

        {/* Main headline */}
        <h1 className="fade-up-2" style={{
          fontSize:'56px', fontWeight:800, lineHeight:1.1,
          color:'#E2F0FF', marginBottom:'20px', letterSpacing:'-1px'
        }}>
          Where{' '}
          <span className="shimmer-text">tech minds</span>
          <br/>connect & grow
        </h1>

        <p className="fade-up-3" style={{
          fontSize:'17px', color:'#5D7A9A', marginBottom:'28px',
          lineHeight:1.7, maxWidth:'560px', margin:'0 auto 28px'
        }}>
          Share code, discuss ideas, vote on solutions. DevSphere is the community
          platform built by developers, for developers.
        </p>

        {/* Real-time stats banner */}
        <div className="fade-up-3" style={{
          display:'flex', gap:'32px', justifyContent:'center',
          marginBottom:'40px', background:'rgba(45,212,191,0.02)',
          border:'0.5px solid rgba(45,212,191,0.15)', borderRadius:'16px',
          padding:'16px 24px', maxWidth:'480px', margin:'0 auto 36px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize:'20px', fontWeight:800, color:'#2DD4BF' }}>{stats.users || 0}</div>
            <div style={{ fontSize:'10px', color:'#5D7A9A', textTransform:'uppercase', fontWeight:600, letterSpacing:'0.5px', marginTop:'2px' }}>Developers</div>
          </div>
          <div style={{ width:'1px', background:'#1E3050' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize:'20px', fontWeight:800, color:'#818CF8' }}>{stats.communities || 0}</div>
            <div style={{ fontSize:'10px', color:'#5D7A9A', textTransform:'uppercase', fontWeight:600, letterSpacing:'0.5px', marginTop:'2px' }}>Communities</div>
          </div>
          <div style={{ width:'1px', background:'#1E3050' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize:'20px', fontWeight:800, color:'#2DD4BF' }}>{stats.posts || 0}</div>
            <div style={{ fontSize:'10px', color:'#5D7A9A', textTransform:'uppercase', fontWeight:600, letterSpacing:'0.5px', marginTop:'2px' }}>Discussions</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="fade-up-4" style={{
          display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap'
        }}>
          <Link href="/login" style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            fontSize:'15px', fontWeight:700, color:'#060D1A',
            background:'#2DD4BF', padding:'14px 28px', borderRadius:'12px',
            textDecoration:'none'
          }} className="glow-btn">
            Start for free →
          </Link>
          <Link href="/login" style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            fontSize:'15px', fontWeight:500, color:'#5D7A9A',
            border:'0.5px solid #1E3050', padding:'14px 28px', borderRadius:'12px',
            textDecoration:'none', transition:'all 0.2s'
          }}>
            View communities
          </Link>
        </div>
      </div>

      {/* Floating mockup */}
      <div className="float fade-in" style={{
        maxWidth:'700px', margin:'0 auto 80px', padding:'0 24px',
        position:'relative', zIndex:1
      }}>
        <div style={{
          background:'#0A1628', border:'0.5px solid #1E3050',
          borderRadius:'16px', overflow:'hidden',
          boxShadow:'0 40px 80px rgba(0,0,0,0.5), 0 0 0 0.5px #2DD4BF20'
        }}>
          {/* Mock navbar */}
          <div style={{
            background:'#040C18', padding:'12px 20px',
            borderBottom:'0.5px solid #1E3050',
            display:'flex', alignItems:'center', gap:'12px'
          }}>
            <span style={{ fontSize:'14px', fontWeight:700, color:'#2DD4BF' }}>Dev<span style={{color:'#E2F0FF'}}>Sphere</span></span>
            <div style={{ flex:1, background:'#0A1628', height:'28px', borderRadius:'6px', border:'0.5px solid #1E3050' }}/>
            <div style={{ background:'#2DD4BF', color:'#060D1A', fontSize:'11px', fontWeight:600, padding:'5px 12px', borderRadius:'7px' }}>+ Post</div>
            <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'#6366F1' }}/>
          </div>
          {/* Mock posts */}
          {[
            { tag:'TypeScript', title:'Advanced TypeScript patterns every dev should know', votes:847, color:'#2DD4BF' },
            { tag:'AI', title:'Building RAG pipelines with LangChain and pgvector', votes:512, color:'#818CF8' },
            { tag:'React', title:'React 19 features that change everything in 2025', votes:394, color:'#2DD4BF' },
          ].map((p, i) => (
            <div key={i} style={{
              padding:'14px 20px',
              borderBottom: i < 2 ? '0.5px solid #1E3050' : 'none',
              display:'flex', alignItems:'center', gap:'12px'
            }}>
              <div style={{ width:'4px', height:'40px', borderRadius:'2px', background:`${p.color}40`, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ marginBottom:'4px' }}>
                  <span style={{
                    fontSize:'9px', padding:'2px 7px', borderRadius:'5px',
                    background:`${p.color}15`, color:p.color,
                    border:`0.5px solid ${p.color}30`, fontWeight:500
                  }}>#{p.tag}</span>
                </div>
                <div style={{ fontSize:'12px', color:'#E2F0FF', fontWeight:500 }}>{p.title}</div>
              </div>
              <div style={{
                display:'flex', alignItems:'center', gap:'5px',
                background:'#0F1E38', border:'0.5px solid #1E3050',
                borderRadius:'8px', padding:'5px 10px'
              }}>
                <span style={{ color:p.color, fontSize:'12px' }}>▲</span>
                <span style={{ color:p.color, fontSize:'12px', fontWeight:700 }}>{p.votes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'0 24px 80px', position:'relative', zIndex:1 }}>
        <h2 style={{ fontSize:'28px', fontWeight:700, color:'#E2F0FF', textAlign:'center', marginBottom:'8px' }}>
          Everything a developer needs
        </h2>
        <p style={{ color:'#5D7A9A', textAlign:'center', marginBottom:'40px', fontSize:'14px' }}>
          One platform. All the tools. Zero noise.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'14px' }}>
          {[
            { emoji:'⚡', title:'Hot Algorithm', desc:'Reddit-style scoring. Best content always surfaces first.' },
            { emoji:'🏘️', title:'Communities', desc:'Join niche tech communities. Create your own in seconds.' },
            { emoji:'👤', title:'Dev Profiles', desc:'LinkedIn-style profiles. Show your skills and posts.' },
            { emoji:'🔍', title:'Smart Search', desc:'Search posts, people, and tags with instant results.' },
            { emoji:'🔖', title:'Bookmarks', desc:'Save posts to read later. Your personal reading list.' },
            { emoji:'🏷️', title:'Tag System', desc:'Browse by #TypeScript, #React, #AI and more.' },
          ].map((f, i) => (
            <div key={i} className="card-hover" style={{
              background:'#0A1628', border:'0.5px solid #1E3050',
              borderRadius:'14px', padding:'20px',
              animationDelay:`${i * 0.08}s`
            }}>
              <div style={{ fontSize:'28px', marginBottom:'10px' }}>{f.emoji}</div>
              <div style={{ fontSize:'13px', fontWeight:600, color:'#E2F0FF', marginBottom:'5px' }}>{f.title}</div>
              <div style={{ fontSize:'12px', color:'#5D7A9A', lineHeight:1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div style={{ textAlign:'center', padding:'40px 24px 80px', position:'relative', zIndex:1 }}>
        <div style={{
          display:'inline-block', padding:'48px 60px',
          background:'linear-gradient(135deg, #0A1628, #0F1E38)',
          border:'0.5px solid rgba(45,212,191,0.2)', borderRadius:'24px'
        }}>
          <h2 style={{ fontSize:'26px', fontWeight:700, color:'#E2F0FF', marginBottom:'8px' }}>
            Ready to join?
          </h2>
          <p style={{ color:'#5D7A9A', marginBottom:'24px', fontSize:'14px' }}>
            Free forever. No credit card needed.
          </p>
          <Link href="/login" style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            fontSize:'15px', fontWeight:700, color:'#060D1A',
            background:'#2DD4BF', padding:'14px 32px', borderRadius:'12px',
            textDecoration:'none'
          }} className="glow-btn">
            Create your account →
          </Link>
        </div>
      </div>
    </div>
  )
}