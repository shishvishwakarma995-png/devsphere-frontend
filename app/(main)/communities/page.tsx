"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, Plus } from "lucide-react"

export default function CommunitiesDirectoryPage() {
  const [communities, setCommunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulated fetch of all communities. Replace with your actual database API call later!
    setTimeout(() => {
      setCommunities([
        { id: "1", name: "Open Source", slug: "open-source", members: 142, desc: "A place for building collaborative software." },
        { id: "2", name: "DevOps", slug: "devops", members: 98, desc: "CI/CD pipelines, Docker, Kubernetes, and cloud infrastructure." },
        { id: "3", name: "Next.js Pioneers", slug: "nextjs", members: 320, desc: "The ultimate hub for App Router and React patterns." },
        { id: "4", name: "Rustaceans", slug: "rust", members: 74, desc: "Safe, fast, and memory-efficient systems programming." }
      ])
      setLoading(false)
    }, 400)
  }, [])

  if (loading) return <div className="p-8 text-txt2 text-center">Scanning DevSphere ecosystem...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-txt1">Explore Communities</h1>
          <p className="text-xs text-txt2">Find your tech stack peers and join dedicated hubs.</p>
        </div>
        <Link href="/communities/create" className="flex items-center gap-1 bg-indigo text-white px-4 py-2 text-xs font-semibold rounded-lg hover:bg-indigo/90 transition-colors">
          <Plus size={14} /> Create Space
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {communities.map((c) => (
          <div key={c.id} className="bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col justify-between hover:border-indigo/40 transition-all">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo/10 text-indigo rounded-lg flex items-center justify-center font-bold text-sm">
                  c/
                </div>
                <Link href={`/c/${c.slug}`} className="font-bold text-txt1 hover:text-indigo transition-colors text-base">
                  c/{c.slug}
                </Link>
              </div>
              <p className="text-xs text-txt2 line-clamp-2 leading-relaxed">{c.desc}</p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-dark-border/40">
              <span className="flex items-center gap-1 text-xs text-txt2 font-mono">
                <Users size={14} className="text-teal" /> {c.members} devs
              </span>
              <Link href={`/c/${c.slug}`} className="text-xs bg-dark-border text-txt1 hover:bg-indigo hover:text-white px-3 py-1.5 rounded-md font-medium transition-all">
                View Space
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}