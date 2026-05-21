"use client"
import { useParams } from "next/navigation"
import { Hash } from "lucide-react"

export default function TagPage() {
  const { name } = useParams()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3 bg-dark-card border border-dark-border rounded-xl p-5">
        <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center text-teal">
          <Hash size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-txt1">#{name}</h1>
          <p className="text-xs text-txt2">Browsing all verified tech logs labeled under standard label #{name}</p>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center text-txt2 text-sm italic">
        No threads tagged under #{name} are indexable at this moment.
      </div>
    </div>
  )
}