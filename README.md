
# 🌐 DevSphere Frontend

### Where tech minds connect

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-DevSphere-2DD4BF?style=for-the-badge)](https://devsphere.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_16-App_Router-000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com)

A full-featured developer community platform — Reddit meets LinkedIn for developers. 

</div>

---

## ✨ Features

### 🔐 Authentication
- JWT-based login & registration
- Route protection via `proxy.ts` (Next.js 16 middleware)
- Cookie + localStorage token sync
- Auto-redirect logged-in users to feed

### 📝 Content
- Create posts (text, code, link types)
- Upvote / Downvote with toggle logic
- Comments with real-time count
- Delete your own posts
- Bookmark / save posts

### 🏘️ Communities
- Browse all communities
- Create new communities
- Join / Leave with real-time member count
- Dynamic community pages `/c/[slug]`

### 👤 Profiles
- LinkedIn-style developer profiles
- Skills tags, bio, headline
- Follow / Unfollow system
- Follower + following count
- Edit profile at `/settings`

### 🔍 Discovery
- Global search (posts, communities, users)
- 300ms debounce — no over-fetching
- Tag pages at `/tag/[name]`
- Sort: 🔥 Hot · ✦ New · ▲ Top · ◈ Rising
- Hot algorithm: `score = votes / (hours + 2)^1.5`

### 🎨 UI/UX
- **Slate Indigo × Obsidian Teal** — custom fusion theme
- Dark / Light mode toggle
- Skeleton loaders — no blank screens
- Mobile responsive + bottom navigation bar
- Animated landing page with live stats
- Custom scrollbar + page transitions
- 404 page

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16 (App Router) | React framework, SSR, routing |
| **TypeScript** | 5 | Type safety |
| **Tailwind CSS** | v4 | Utility-first styling |
| **SWR** | latest | Data fetching, caching, revalidation |
| **next-themes** | latest | Dark/light mode |
| **lucide-react** | 0.383 | Icon library |

---

## 📁 Folder Structure

```
devsphere-frontend/
│
├── app/
│   ├── (auth)/                    # NO navbar — auth pages only
│   │   ├── layout.tsx             # Clean auth layout
│   │   └── login/page.tsx         # Login + Register
│   │
│   ├── (main)/                    # WITH Navbar + Sidebar
│   │   ├── layout.tsx             # Main app layout
│   │   ├── home/page.tsx          # Home feed
│   │   ├── trending/page.tsx      # Trending posts
│   │   ├── following/page.tsx     # Following feed
│   │   ├── saved/page.tsx         # Bookmarked posts
│   │   ├── create/page.tsx        # Create post form
│   │   ├── settings/page.tsx      # Edit profile
│   │   ├── communities/
│   │   │   ├── page.tsx           # Browse communities
│   │   │   └── create/page.tsx    # Create community
│   │   ├── c/[slug]/page.tsx      # Community detail
│   │   ├── u/[username]/page.tsx  # User profile
│   │   ├── post/[id]/page.tsx     # Post + comments
│   │   └── tag/[name]/page.tsx    # Posts by tag
│   │
│   ├── layout.tsx                 # Root layout (minimal)
│   ├── page.tsx                   # Animated landing page
│   ├── not-found.tsx              # 404 page
│   └── globals.css                # Tailwind v4 theme variables
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx             # Top navigation bar
│   │   ├── Sidebar.tsx            # Left sidebar with communities
│   │   └── MobileNav.tsx          # Bottom nav for mobile
│   ├── PostCard.tsx               # Post card with vote/bookmark/delete
│   ├── CommentsSection.tsx        # Comments list + form
│   ├── SearchBar.tsx              # Debounced global search
│   ├── SkeletonCard.tsx           # Loading skeletons
│   ├── TrendingPanel.tsx          # Right sidebar trending tags
│   ├── ThemeToggle.tsx            # Dark/light toggle
│   └── providers.tsx              # ThemeProvider wrapper
│
├── lib/
│   └── api.ts                     # All API calls to backend
│
├── types/
│   └── index.ts
│
└── proxy.ts                       # Route protection middleware
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- `devsphere-backend` running on `localhost:4000`

### Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/devsphere-frontend.git
cd devsphere-frontend

# Install dependencies
npm install

# Create environment file
echo 'NEXT_PUBLIC_API_URL=http://localhost:4000' > .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Test Accounts
After running the backend seed script:
- **Email:** `test@devsphere.com`
- **Password:** `password123`

---

## 🌐 Deployment (Vercel)

### Step 1 — Push to GitHub
```bash
git add .
git commit -m "feat: complete DevSphere frontend"
git push origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import `devsphere-frontend` from GitHub
3. Add environment variable:
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com` |
4. Click **Deploy**

### Step 3 — Update Backend CORS
After getting your Vercel URL, update `FRONTEND_URL` on Render to your Vercel URL.

---

## 🔗 Related

- **[Backend Repository →](https://github.com/YOUR_USERNAME/devsphere-backend)**
- **[Live Demo →](https://devsphere-frontend-six.vercel.app/)**
- **[API Documentation →](https://devsphere-backend-7zjd.onrender.com)**

---

## 👤 Author

**Shishanki Vishwakarma**

[![GitHub](https://img.shields.io/badge/GitHub-shishvishwakarma995--png-181717?style=flat&logo=github)](https://github.com/shishvishwakarma995-png)


⭐ Star this repo if you found it helpful!

