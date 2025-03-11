import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get('id_user_guest')?.value
  const idUserNumber = request.cookies.get('id_user_number')?.value

  if (!cookie || !idUserNumber) {
    const response = NextResponse.next()
    response.cookies.set({
      name: 'id_user_guest',
      value: 'guest-id-' + uuidv4(),
      path: '/'
    })
    response.cookies.set({
      name: 'id_user_number',
      value: Math.floor(10000 + Math.random() * 90000).toString(),
      maxAge: 60 * 60 * 24 * 365 * 10,
      path: '/'
    })
    return response
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/:path*'
}
