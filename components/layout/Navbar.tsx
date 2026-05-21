"use client"
import Link from "next/link"
import { Search, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import ThemeToggle from "@/components/ThemeToggle"
import { logout, getMe } from "@/lib/api"
import SearchBar from "@/components/SearchBar"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)

 
  useEffect(() => {
    const checkUser = () => {
      try {
        const stored = localStorage.getItem('user')
        if (stored) {
          const parsed = JSON.parse(stored)
          setUser(parsed)
        } else {
          const token = localStorage.getItem('token')
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]))
            setUser({ username: payload.username || 'user', id: payload.userId })
          }
        }
      } catch { }
    }
    checkUser()
    window.addEventListener('storage', checkUser)
    return () => window.removeEventListener('storage', checkUser)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14
                   bg-dark-nav border-b border-dark-border
                   flex items-center px-4 gap-3">

      {/* Logo */}
      <Link href="/home"
        className="text-lg font-bold text-teal shrink-0
                   hover:text-teal-light transition-colors">
        Dev<span className="text-txt1">Sphere</span>
      </Link>

      {/* Search */}
      <SearchBar />

      <div className="ml-auto flex items-center gap-2">
        {/* Create Post */}
        {user && (
          <Link href="/create"
            className="flex items-center gap-1.5 text-sm font-semibold
                       px-3 py-1.5 rounded-lg bg-teal text-dark-bg
                       hover:bg-teal-dark transition-colors shrink-0">
            <Plus size={14} /> Post
          </Link>
        )}

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Avatar → goes to profile, click name to logout */}
        {user ? (
          <div className="flex items-center gap-1">
            <Link href={`/u/${user.username}`}
              title={`View profile — @${user.username}`}
              className="w-9 h-9 rounded-full bg-indigo text-white
                         text-sm font-bold flex items-center justify-center
                         hover:bg-indigo-soft transition-colors shrink-0
                         border-2 border-indigo/50 hover:border-indigo">
              {user.username?.[0]?.toUpperCase() ?? 'U'}
            </Link>
          </div>
        ) : (
          <Link href="/login"
            className="text-sm font-semibold px-3 py-1.5 rounded-lg
                       bg-teal/10 text-teal border border-teal/30
                       hover:bg-teal hover:text-dark-bg transition-colors">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}