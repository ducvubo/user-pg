import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export function middleware(request: NextRequest) {
  // Kiểm tra xem cookie 'id_user_guest' đã tồn tại chưa
  const cookie = request.cookies.get('id_user_guest')?.value
  if (!cookie) {
    // Nếu không tồn tại, tạo response và đặt cookie
    const response = NextResponse.next()
    response.cookies.set({
      name: 'id_user_guest',
      value: 'guest-id-' + uuidv4(),
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 năm
      path: '/' // Áp dụng cho tất cả các đường dẫn
    })
    return response
  }
  // Nếu cookie đã tồn tại, tiếp tục request mà không thay đổi
  return NextResponse.next()
}

// Cấu hình middleware để chạy cho tất cả các đường dẫn
export const config = {
  matcher: '/:path*'
}
