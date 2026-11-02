
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function getJwtToken(): Promise<string> {
  const res = await fetch(`${API_URL}/jwt`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Authentication failed. Please login again.')
  }

  const data = await res.json()

  if (typeof data.token !== 'string') {
    throw new Error('Invalid token received from server')
  }

  return data.token
}

export async function authFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getJwtToken()

  const headers = new Headers(options.headers)

  headers.set('Authorization', `Bearer ${token}`)

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })
}

// Fetch all books
export async function fetchBooks(options?: {
  sort?: string
  limit?: number
}) {
  const params = new URLSearchParams()

  if (options?.sort) params.set('sort', options.sort)
  if (options?.limit) params.set('limit', String(options.limit))

  const res = await fetch(`${API_URL}/books?${params}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch books')
  }

  return res.json()
}

export async function fetchBook(id: string) {
  const res = await fetch(`${API_URL}/books/${id}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch book')
  }

  return res.json()
}

export async function addBook(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to add book')
  }

  return res.json()
}

export async function updateBook(
  id: string,
  data: Record<string, unknown>
) {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to update book')
  }

  return res.json()
}

export async function deleteBook(id: string) {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to delete book')
  }

  return res.json()
}

export async function borrowBook(data: Record<string, unknown>) {
  const res = await authFetch('/borrows', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(
      err.message || err.error || 'Failed to borrow book'
    )
  }

  return res.json()
}

export async function fetchBorrows(email: string) {
  const res = await authFetch(
    `/borrows?email=${encodeURIComponent(email)}`,
    {
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(
      err.message || err.error || 'Failed to fetch borrows'
    )
  }

  return res.json()
}

export async function returnBook(borrowId: string) {
  const res = await authFetch(`/borrows/${borrowId}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(
      err.message || err.error || 'Failed to return book'
    )
  }

  return res.json()
}

export async function fetchMyBooks(email: string) {
  const res = await authFetch(
    `/my-books?email=${encodeURIComponent(email)}`,
    {
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    const errorText = await res.text()

    throw new Error(
      `Failed to fetch your books: ${res.status} ${errorText}`
    )
  }

  return res.json()
}

export async function uploadImageToImgbb(
  file: File
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY

  if (!apiKey) {
    throw new Error('imgbb API key not configured')
  }

  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!res.ok) {
    throw new Error('Image upload failed')
  }

  const data = await res.json()

  return data.data.url
}
