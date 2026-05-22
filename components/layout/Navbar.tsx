"use client"
import Link from "next/link"
import { Plus, LogOut, User, Settings } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import ThemeToggle from "@/components/ThemeToggle"
import { logout, getMe } from "@/lib/api"
import SearchBar from "@/components/SearchBar"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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

        {/* Avatar with dropdown */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              title={`@${user.username}`}
              className="w-9 h-9 rounded-full bg-indigo text-white
                         text-sm font-bold flex items-center justify-center
                         hover:bg-indigo-soft transition-colors shrink-0
                         border-2 border-indigo/50 hover:border-indigo">
              {user.username?.[0]?.toUpperCase() ?? 'U'}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-11 w-48
                              bg-dark-card border border-dark-border
                              rounded-xl shadow-xl z-50 overflow-hidden
                              animate-in fade-in slide-in-from-top-2">

                {/* User info */}
                <div className="px-4 py-3 border-b border-dark-border">
                  <p className="text-xs font-bold text-txt1">@{user.username}</p>
                  {user.email && <p className="text-xs text-txt2 truncate">{user.email}</p>}
                </div>

                {/* Links */}
                <div className="py-1">
                  <Link
                    href={`/u/${user.username}`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5
                               text-sm text-txt2 hover:text-txt1
                               hover:bg-dark-border transition-colors">
                    <User size={14} />
                    View Profile
                  </Link>

                  <Link
                    href={`/u/${user.username}/settings`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5
                               text-sm text-txt2 hover:text-txt1
                               hover:bg-dark-border transition-colors">
                    <Settings size={14} />
                    Settings
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-dark-border py-1">
                  <button
                    onClick={() => { setDropdownOpen(false); logout() }}
                    className="flex items-center gap-2.5 px-4 py-2.5 w-full
                               text-sm text-red-400 hover:text-red-300
                               hover:bg-red-500/10 transition-colors">
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
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