"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getMyProfile, updateProfile, logout, getMe } from "@/lib/api"
import { Loader2, Save, LogOut, Plus, X } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [form, setForm] = useState({
    name: '', bio: '', headline: '', skills: [] as string[]
  })

  useEffect(() => {
    getMyProfile().then((u: any) => {
      setForm({
        name: u.name || '',
        bio: u.bio || '',
        headline: u.headline || '',
        skills: u.skills || []
      })
      setLoading(false)
    }).catch(() => router.push('/login'))
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !form.skills.includes(s) && form.skills.length < 10) {
      setForm(f => ({ ...f, skills: [...f.skills, s] }))
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) =>
    setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      // Update localStorage user
      const me = getMe()
      if (me) localStorage.setItem('user', JSON.stringify({ ...me, ...form }))
    } catch {} finally { setSaving(false) }
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 size={24} className="animate-spin text-teal"/>
    </div>
  )

  const me = getMe()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-txt1">Settings</h1>
          <p className="text-sm text-txt2 mt-1">Manage your profile and account</p>
        </div>
        <button onClick={logout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg
                     border border-dark-border text-txt2 text-sm
                     hover:border-red-400/50 hover:text-red-400 transition-all">
          <LogOut size={14}/> Logout
        </button>
      </div>

      <div className="space-y-5">

        {/* Avatar preview */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo flex items-center
                          justify-center text-white text-2xl font-bold">
              {me?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-txt1">@{me?.username}</p>
            </div>
          </div>
        </div>

        {/* Profile fields */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-txt1">Profile Info</h2>

          {[
            { key: 'name',     label: 'Display Name',  ph: 'Your full name' },
            { key: 'headline', label: 'Headline',       ph: 'e.g. Full Stack Developer at ...' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-txt2 mb-1.5 block">{f.label}</label>
              <input value={(form as any)[f.key]}
                onChange={e => set(f.key, e.target.value)}
                placeholder={f.ph}
                className="w-full bg-dark-elev border border-dark-border
                           text-txt1 rounded-lg px-3 py-2.5 text-sm
                           placeholder:text-txt3 outline-none
                           focus:border-teal transition-colors" />
            </div>
          ))}

          <div>
            <label className="text-xs text-txt2 mb-1.5 block">Bio</label>
            <textarea value={form.bio} rows={3}
              onChange={e => set('bio', e.target.value)}
              placeholder="Tell the community about yourself..."
              className="w-full bg-dark-elev border border-dark-border
                         text-txt1 rounded-lg px-3 py-2.5 text-sm
                         placeholder:text-txt3 outline-none resize-none
                         focus:border-teal transition-colors" />
          </div>
        </div>

        {/* Skills */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-txt1 mb-3">
            Skills <span className="text-txt3 font-normal">(max 10)</span>
          </h2>
          <div className="flex gap-2 flex-wrap mb-3">
            {form.skills.map(s => (
              <span key={s}
                className="flex items-center gap-1 text-xs px-3 py-1
                           rounded-full bg-teal/10 text-teal border border-teal/20">
                {s}
                <button onClick={() => removeSkill(s)}
                  className="hover:text-red-400 transition-colors ml-0.5">
                  <X size={10}/>
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="Add a skill (e.g. React)..."
              className="flex-1 bg-dark-elev border border-dark-border
                         text-txt1 rounded-lg px-3 py-2 text-sm
                         placeholder:text-txt3 outline-none
                         focus:border-teal transition-colors" />
            <button onClick={addSkill}
              className="px-3 py-2 bg-teal/10 border border-teal/30
                         text-teal rounded-lg hover:bg-teal hover:text-dark-bg
                         transition-all">
              <Plus size={14}/>
            </button>
          </div>
        </div>

        {/* Save button */}
        <button onClick={handleSave} disabled={saving}
          className="w-full py-3 rounded-xl bg-teal text-dark-bg
                     font-semibold text-sm hover:bg-teal-dark transition-colors
                     disabled:opacity-50 flex items-center justify-center gap-2">
          {saving
            ? <><Loader2 size={14} className="animate-spin"/> Saving...</>
            : saved
            ? '✓ Saved!'
            : <><Save size={14}/> Save Changes</>}
        </button>
      </div>
    </div>
  )
}