const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function getJwtToken(email: string): Promise<string> {
  const res = await fetch(`${API_URL}/jwt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error('Failed to get token')
  const data = await res.json()
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('booknook_token', data.token)
  }
  return data.token
}

function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('booknook_token')
  }
  return null
}

function authHeaders(): HeadersInit {
  const token = getStoredToken()
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}

export async function fetchBooks(options?: { sort?: string; limit?: number }) {
  const params = new URLSearchParams()
  if (options?.sort) params.set('sort', options.sort)
  if (options?.limit) params.set('limit', String(options.limit))
  const res = await fetch(`${API_URL}/books?${params}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch books')
  return res.json()
}

export async function fetchBook(id: string) {
  const res = await fetch(`${API_URL}/books/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch book')
  return res.json()
}

export async function addBook(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to add book')
  }
  return res.json()
}

export async function updateBook(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to update book')
  }
  return res.json()
}

export async function deleteBook(id: string) {
  const res = await fetch(`${API_URL}/books/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to delete book')
  }
  return res.json()
}

export async function borrowBook(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/borrows`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || err.error || 'Failed to borrow book')
  }
  return res.json()
}

export async function fetchBorrows(email: string) {
  const token = getStoredToken()
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
  const res = await fetch(`${API_URL}/borrows?email=${encodeURIComponent(email)}`, {
    cache: 'no-store',
    headers,
  })
  if (!res.ok) throw new Error('Failed to fetch borrows')
  return res.json()
}

export async function returnBook(borrowId: string) {
  const token = getStoredToken()
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
  const res = await fetch(`${API_URL}/borrows/${borrowId}`, {
    method: 'DELETE',
    headers,
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || err.error || 'Failed to return book')
  }
  return res.json()
}



export async function fetchMyBooks(email: string) {
 
  let token = getStoredToken()

  if (!token) {
    token = await getJwtToken(email)
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  }

  const url = `${API_URL}/my-books?email=${encodeURIComponent(email)}`

  const res = await fetch(url, {
    cache: 'no-store',
    headers,
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(
      `Failed to fetch your books: ${res.status} ${errorText}`
    )
  }

  return res.json()
}



export async function uploadImageToImgbb(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
  if (!apiKey) throw new Error('imgbb API key not configured')
  const formData = new FormData()
  formData.append('image', file)
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Image upload failed')
  const data = await res.json()
  return data.data.url
}
