"use client"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("devsphere-theme") || "dark"
    setTheme(savedTheme)
    
    const root = window.document.documentElement
    if (savedTheme === "light") {
      root.classList.add("light")
      root.classList.remove("dark")
    } else {
      root.classList.add("dark")
      root.classList.remove("light")
    }
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const root = window.document.documentElement
    const nextTheme = theme === "dark" ? "light" : "dark"
    
    setTheme(nextTheme)
    localStorage.setItem("devsphere-theme", nextTheme)

    if (nextTheme === "light") {
      root.classList.add("light")
      root.classList.remove("dark")
    } else {
      root.classList.add("dark")
      root.classList.remove("light")
    }
  }

  if (!mounted) return <div className="w-9 h-9 rounded-lg bg-dark-side border border-dark-border" />

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 flex items-center justify-center rounded-lg
                 border border-teal/40 bg-teal/10 text-teal
                 hover:bg-teal hover:text-dark-bg hover:border-teal
                 transition-all duration-200 shrink-0 cursor-pointer"
    >
      {theme === "dark" ? (
        <Sun size={15} strokeWidth={2} />
      ) : (
        <Moon size={15} strokeWidth={2} />
      )}
    </button>
  )
}