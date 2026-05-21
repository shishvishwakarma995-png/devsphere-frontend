import Navbar from "@/components/layout/Navbar"
import Sidebar from "@/components/layout/Sidebar"
import MobileNav from "@/components/layout/MobileNav"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#060D1A', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex pt-14">
        <Sidebar />
        <main className="flex-1 lg:ml-52 min-h-screen pb-14 lg:pb-0">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}