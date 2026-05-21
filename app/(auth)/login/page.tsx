"use client"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { login, register } from "@/lib/api"

function LoginContent() {
  const router = useRouter()
  const params = useSearchParams()
  const [mode, setMode] = useState<'login'|'register'>('login')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', username: '', password: ''
  })
  const set = (k: string, v: string) => setForm(f => ({...f,[k]:v}))

  const handleSubmit = async () => {
    setError(''); setSuccess('')
    if (!form.email || !form.password) {
      setError('Please fill in all required fields'); return
    }
    setLoading(true)
    try {
      if (mode === 'register') {
        if (!form.username) { setError('Username is required'); return }
        await register(form.email, form.username, form.password)
        setSuccess('Account created! Please sign in.')
        setMode('login')
        setForm(f => ({...f, password: ''}))
      } else {
        await login(form.email, form.password)
        const from = params.get('from') || '/home'
        router.push(from)
      }
    } catch (e: any) {
      setError(e.message?.includes('Invalid')
        ? 'Invalid email or password'
        : e.message || 'Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight:'100vh', display:'flex',
      flexDirection:'column', alignItems:'center',
      justifyContent:'center', padding:'24px',
      background:'#060D1A'
    }}>

      {/* Logo */}
      <Link href="/" style={{
        fontSize:'24px', fontWeight:800,
        color:'#2DD4BF', textDecoration:'none',
        marginBottom:'8px', letterSpacing:'-0.5px'
      }}>
        Dev<span style={{color:'#E2F0FF'}}>Sphere</span>
      </Link>
      <p style={{fontSize:'13px', color:'#5D7A9A', marginBottom:'32px'}}>
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </p>

      {/* Card */}
      <div style={{
        width:'100%', maxWidth:'420px',
        background:'#0A1628',
        border:'0.5px solid #1E3050',
        borderRadius:'16px', padding:'32px'
      }}>

        {/* Mode tabs */}
        <div style={{
          display:'flex', background:'#060D1A',
          borderRadius:'10px', padding:'4px', marginBottom:'24px'
        }}>
          {(['login','register'] as const).map(m => (
            <button key={m} onClick={() => {setMode(m);setError('');setSuccess('')}}
              style={{
                flex:1, padding:'9px', borderRadius:'7px',
                border:'none', cursor:'pointer', fontSize:'13px',
                fontWeight:600, transition:'all 0.15s', textTransform:'capitalize',
                background: mode===m ? '#2DD4BF' : 'transparent',
                color: mode===m ? '#060D1A' : '#5D7A9A'
              }}>
              {m}
            </button>
          ))}
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
          {mode === 'register' && (
            <div>
              <label style={{fontSize:'12px', color:'#5D7A9A', display:'block', marginBottom:'6px'}}>
                Username *
              </label>
              <input value={form.username} onChange={e=>set('username',e.target.value)}
                placeholder="your_username"
                style={{
                  width:'100%', background:'#060D1A',
                  border:'0.5px solid #1E3050', color:'#E2F0FF',
                  borderRadius:'8px', padding:'11px 14px',
                  fontSize:'13px', outline:'none',
                  boxSizing:'border-box'
                }}
              />
            </div>
          )}

          <div>
            <label style={{fontSize:'12px', color:'#5D7A9A', display:'block', marginBottom:'6px'}}>
              Email address *
            </label>
            <input type="email" value={form.email}
              onChange={e=>set('email',e.target.value)}
              placeholder="you@example.com"
              style={{
                width:'100%', background:'#060D1A',
                border:'0.5px solid #1E3050', color:'#E2F0FF',
                borderRadius:'8px', padding:'11px 14px',
                fontSize:'13px', outline:'none',
                boxSizing:'border-box'
              }}
            />
          </div>

          <div>
            <label style={{fontSize:'12px', color:'#5D7A9A', display:'block', marginBottom:'6px'}}>
              Password *
            </label>
            <div style={{position:'relative'}}>
              <input type={showPw?'text':'password'}
                value={form.password}
                onChange={e=>set('password',e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
                placeholder="6+ characters"
                style={{
                  width:'100%', background:'#060D1A',
                  border:'0.5px solid #1E3050', color:'#E2F0FF',
                  borderRadius:'8px', padding:'11px 40px 11px 14px',
                  fontSize:'13px', outline:'none',
                  boxSizing:'border-box'
                }}
              />
              <button onClick={()=>setShowPw(!showPw)} style={{
                position:'absolute', right:'12px', top:'50%',
                transform:'translateY(-50%)', background:'none',
                border:'none', cursor:'pointer', color:'#5D7A9A'
              }}>
                {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p style={{fontSize:'12px', color:'#F87171', textAlign:'center', marginTop:'12px'}}>
            {error}
          </p>
        )}
        {success && (
          <p style={{fontSize:'12px', color:'#2DD4BF', textAlign:'center', marginTop:'12px'}}>
            ✓ {success}
          </p>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width:'100%', marginTop:'20px',
          padding:'13px', borderRadius:'10px',
          border:'none', cursor:'pointer',
          background: loading ? '#14B8A6' : '#2DD4BF',
          color:'#060D1A', fontSize:'14px', fontWeight:700,
          display:'flex', alignItems:'center',
          justifyContent:'center', gap:'8px',
          opacity: loading ? 0.8 : 1
        }}>
          {loading && <Loader2 size={14} className="animate-spin"/>}
          {loading ? 'Please wait...'
            : mode === 'login' ? 'Sign in →' : 'Create account →'}
        </button>

        <p style={{fontSize:'12px', color:'#5D7A9A', textAlign:'center', marginTop:'16px'}}>
          {mode === 'login'
            ? <>No account?{" "}<button onClick={()=>setMode('register')} style={{color:'#2DD4BF',background:'none',border:'none',cursor:'pointer',fontWeight:600}}>Create one free</button></>
            : <>Already have an account?{" "}<button onClick={()=>setMode('login')} style={{color:'#2DD4BF',background:'none',border:'none',cursor:'pointer',fontWeight:600}}>Sign in</button></>
          }
        </p>
      </div>

      {/* Trust badges */}
      <div style={{
        display:'flex', gap:'20px', marginTop:'24px', flexWrap:'wrap',
        justifyContent:'center'
      }}>
        {['✓ Free forever', '✓ No credit card', '✓ Open source'].map(t => (
          <span key={t} style={{fontSize:'12px', color:'#2D4A6A'}}>{t}</span>
        ))}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}