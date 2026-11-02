
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const requestHeaders = await headers()
    const cookie = requestHeaders.get('cookie')

    if (!cookie) {
      return NextResponse.json(
        { message: 'No session cookie found. Please login again.' },
        { status: 401 }
      )
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/jwt`,
      {
        method: 'POST',
        headers: {
          Cookie: cookie,
        },
        cache: 'no-store',
      }
    )

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error('JWT proxy error:', error)

    return NextResponse.json(
      { message: 'Failed to generate authentication token' },
      { status: 500 }
    )
  }
}
