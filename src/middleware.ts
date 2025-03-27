import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export function middleware(request: NextRequest) {
  const idUserGuest = request.cookies.get('id_user_guest')?.value
  const idUserNumber = request.cookies.get('id_user_number')?.value
  const restaurantIds = request.cookies.get('restaurantIds')?.value
  const listLikedRestaurant = request.cookies.get('listLikedRestaurant')?.value

  const response = NextResponse.next();

  if (!idUserGuest) {
    response.cookies.set('id_user_guest', 'guest-id-' + uuidv4(), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 năm
    });
  }

  if (!idUserNumber) {
    response.cookies.set('id_user_number', Math.floor(10000 + Math.random() * 90000).toString(), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 năm
    });
  }

  if (!restaurantIds) {
    response.cookies.set('restaurantIds', JSON.stringify([]), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 năm
    });
  }

  if (!listLikedRestaurant) {
    response.cookies.set('listLikedRestaurant', JSON.stringify([]), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 năm
    });
  }


  return response;
}

export const config = {
  matcher: '/:path*'
}
