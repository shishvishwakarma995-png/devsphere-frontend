const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

async function req(url: string, opts: RequestInit = {}) {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') : null
  const res = await fetch(`${BASE}${url}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

// Posts
export const getPosts = (sort = 'hot') => req(`/api/posts?sort=${sort}`)
export const getPost = (id: string) => req(`/api/posts/${id}`)
export const createPost = (data: any) => req('/api/posts', { method: 'POST', body: JSON.stringify(data) })
export const votePost = (id: string, type: string) => req(`/api/posts/${id}/vote`, { method: 'POST', body: JSON.stringify({ type }) })
export const getComments = (id: string) => req(`/api/posts/${id}/comments`)
export const addComment = (id: string, content: string) => req(`/api/posts/${id}/comments`, { method: 'POST', body: JSON.stringify({ content }) })

// Communities
export const getCommunities = () => req('/api/communities')
export const getCommunity = (slug: string) => req(`/api/communities/${slug}`)
export const createCommunity = (data: any) => req('/api/communities', { method: 'POST', body: JSON.stringify(data) })

// Auth
export async function login(email: string, password: string) {
  const data = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  if (data.token) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    window.dispatchEvent(new Event('storage'))
    document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`
  }
  return data
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  document.cookie = 'token=; path=/; max-age=0'
  window.location.href = '/login'
}

export function getMe() {
  try {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  } catch { return null }
}

export async function register(email: string, username: string, password: string) {
  return req('/api/auth/register', {
    method: 'POST', body: JSON.stringify({ email, username, password })
  })
}

export const getUserProfile = (username: string) => req(`/api/users/${username}`)
export const getMyProfile = () => req('/api/users/me/profile')
export const updateProfile = (data: any) => req('/api/users/me', { method: 'PUT', body: JSON.stringify(data) })
export const followUser = (username: string) => req(`/api/users/${username}/follow`, { method: 'POST' })
export const search = (q: string) => req(`/api/search?q=${encodeURIComponent(q)}`)

// Bookmarks
export const getBookmarks = () => req('/api/bookmarks')
export const toggleBookmark = (postId: string) => req(`/api/bookmarks/${postId}`, { method: 'POST' })
export const joinCommunity = (slug: string) => req(`/api/communities/${slug}/join`, { method: 'POST' })
export const getMyCommunities = () => req('/api/communities/my/list')
export const getUser = (username: string) => req(`/api/users/${username}`)
export const deletePost = (id: string) => req(`/api/posts/${id}`, { method: 'DELETE' })

// ✅ Fixed — uses BASE instead of hardcoded localhost
export async function createComment(postId: string, content: string) {
  return req(`/api/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}