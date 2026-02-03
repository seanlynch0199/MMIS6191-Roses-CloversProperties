import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const tokenStore = new Map<string, number>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiry = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    tokenStore.set(token, expiry)

    return NextResponse.json({ token })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
