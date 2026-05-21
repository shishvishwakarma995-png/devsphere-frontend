"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, TrendingUp, Users, Bookmark } from "lucide-react"
import { usePathname } from "next/navigation"
import useSWR from "swr"
import { getMyCommunities } from "@/lib/api"

const NAV_ITEMS = [
  { icon: Home, label: 'Home', href: '/home' },
  { icon: TrendingUp, label: 'Trending', href: '/trending' },
  { icon: Users, label: 'Following', href: '/following' },
  { icon: Bookmark, label: 'Saved', href: '/saved' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [localJoinedSlugs, setLocalJoinedSlugs] = useState<string[]>([])

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
    
    // Function to capture spaces joined locally for live feedback
    const syncLocalSpaces = () => {
      const list: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("joined-c-") && localStorage.getItem(key) === "true") {
          list.push(key.replace("joined-c-", ""))
        }
      }
      setLocalJoinedSlugs(list)
    }

    syncLocalSpaces()
    // Listen to click triggers from the slug page button
    window.addEventListener("sync-sidebar-spaces", syncLocalSpaces)
    return () => window.removeEventListener("sync-sidebar-spaces", syncLocalSpaces)
  }, [])

  const { data: myCommunities } = useSWR(
    isLoggedIn ? 'my-communities' : null, 
    getMyCommunities
  )

  // Merge backend data array with local state so nothing is missed or duplicated
  const backendList = myCommunities || []
  const combinedCommunities = [...backendList]

  // Add spaces that were joined via LocalStorage toggle but aren't in the API response yet
  localJoinedSlugs.forEach(slug => {
    if (!combinedCommunities.some((c: any) => c.slug === slug)) {
      combinedCommunities.push({
        id: slug,
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug: slug
      })
    }
  })

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-14
                      w-52 h-[calc(100vh-3.5rem)] bg-dark-side
                      border-r border-dark-border pt-4 overflow-y-auto">

      {/* Main Nav (All options remain exactly here intact) */}
      <div className="mb-6">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm
                transition-all border-r-2
                ${active
                  ? 'text-teal bg-teal/5 border-teal'
                  : 'text-txt2 border-transparent hover:text-teal hover:bg-teal/5'
                }`}>
              <item.icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* My Communities List Dynamic Rendering Section */}
      <div>
        <p className="px-4 mb-2 text-[10px] font-semibold uppercase
                      tracking-widest text-txt3">
          My Communities
        </p>
        
        {combinedCommunities.length === 0 && (
          <p className="px-4 text-xs text-txt3 leading-relaxed">
            Join communities to see them here
          </p>
        )}
        
        {combinedCommunities.map((c: any) => (
          <Link key={c.slug} href={`/c/${c.slug}`}
            className="flex items-center gap-3 px-4 py-2.5
                       text-sm text-txt2 hover:text-teal hover:bg-teal/5
                       transition-all">
            <span className="w-5 h-5 rounded-md bg-teal/10 border
                            border-teal/20 text-teal text-[10px]
                            font-bold flex items-center justify-center uppercase">
              {c.name ? c.name[0] : 'C'}
            </span>
            <span className="truncate">{c.name || `c/${c.slug}`}</span>
          </Link>
        ))}
      </div>

      {/* Footer Option Button */}
      <div className="mt-auto px-4 py-4 border-t border-dark-border">
        <Link href="/communities/create"
          className="flex items-center gap-2 text-xs text-txt2
               hover:text-teal transition-colors">
          <span className="text-teal font-bold text-base">+</span>
          Create community
        </Link>
      </div>

    </aside>
  )
}