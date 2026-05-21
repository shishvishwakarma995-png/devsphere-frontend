"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, TrendingUp, Plus,
         Users, Bookmark } from "lucide-react"

const NAV = [
  { icon: Home,       href: '/home',      label: 'Home' },
  { icon: TrendingUp, href: '/trending',  label: 'Trending' },
  { icon: Plus,       href: '/create',    label: 'Post',    special: true },
  { icon: Users,      href: '/following', label: 'Following' },
  { icon: Bookmark,   href: '/saved',     label: 'Saved' },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden
                   bg-dark-nav border-t border-dark-border
                   flex items-center justify-around px-2 h-14
                   safe-area-pb">
      {NAV.map(item => {
        const active = pathname === item.href
        if (item.special) return (
          <Link key={item.href} href={item.href}
            className="w-11 h-11 rounded-full bg-teal flex items-center
                       justify-center text-dark-bg hover:bg-teal-dark
                       transition-all shadow-lg shadow-teal/20">
            <Plus size={20}/>
          </Link>
        )
        return (
          <Link key={item.href} href={item.href}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5
                       rounded-lg transition-all">
            <item.icon size={20}
              className={active ? 'text-teal' : 'text-txt3'}/>
            <span className={`text-[9px] font-medium
              ${active ? 'text-teal' : 'text-txt3'}`}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}