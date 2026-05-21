"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Users, Code, Check } from "lucide-react"

export default function CommunityPage() {
  const { slug } = useParams()
  const [joined, setJoined] = useState(false)
  const [count, setCount] = useState(142)

  // Sync memory cache on route parameters change
  useEffect(() => {
    if (slug) {
      const isCurrentlyJoined = localStorage.getItem(`joined-c-${slug}`) === "true"
      setJoined(isCurrentlyJoined)
      setCount(isCurrentlyJoined ? 143 : 142)
    }
  }, [slug])

  const handleJoinToggle = () => {
    const nextState = !joined
    setJoined(nextState)
    setCount(prev => nextState ? prev + 1 : prev - 1)
    
    // Write directly into local application cache storage
    localStorage.setItem(`joined-c-${slug}`, nextState ? "true" : "false")
    
    // Fire a global window message to instantly notify the client sidebar
    window.dispatchEvent(new Event("sync-sidebar-spaces"))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {/* Header Block Banner */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-teal/10 text-teal border border-teal/20 rounded-xl flex items-center justify-center font-bold text-2xl uppercase">
            {slug ? String(slug).substring(0, 2) : "C"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-txt1">c/{slug || "community"}</h1>
            <p className="text-xs text-txt2">Welcome to the tracking hub for developers collaborating inside c/{slug}.</p>
          </div>
        </div>

        {/* Empty State Mock Feed */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center space-y-2">
          <Code className="mx-auto text-txt2 opacity-40" size={32} />
          <h3 className="text-sm font-semibold text-txt1">No feeds published here yet</h3>
          <p className="text-xs text-txt2 max-w-xs mx-auto">Be the pioneer and initialize the conversation right now!</p>
        </div>
      </div>

      {/* Details Side Meta Wrapper Widget */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-5 h-fit space-y-4">
        <h2 className="text-sm font-bold text-txt1">About Community</h2>
        <p className="text-xs text-txt2 leading-relaxed">
          A verified digital community segment active inside the DevSphere system engine.
        </p>
        <div className="flex items-center gap-2 text-xs text-txt1 font-medium">
          <Users size={16} className="text-teal" />
          <span>{count} Devs active</span>
        </div>
        
        <button 
          onClick={handleJoinToggle}
          className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
            joined 
              ? "bg-teal/10 text-teal border border-teal/20 text-teal" 
              : "bg-teal text-dark-bg font-bold hover:opacity-95"
          }`}
        >
          {joined ? "✓ Joined" : "Join Space"}
        </button>
      </div>
    </div>
  )
}