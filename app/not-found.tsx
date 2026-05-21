import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <div className="text-8xl font-black text-teal mb-4 opacity-20">404</div>
        <h1 className="text-2xl font-bold text-txt1 mb-2">Page not found</h1>
        <p className="text-txt2 text-sm mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/home"
          className="px-5 py-2.5 rounded-xl bg-teal text-dark-bg
                     font-semibold text-sm hover:bg-teal-dark transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  )
}