import md5 from 'md5'
import { RestaurantPrice } from '../interface/restaurant.interface'

const getRandomNonce = (num: number) => {
  return Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, num - 1))
}

const keyToken = process.env.KEY_SECRET_API_ENDPOINT
const versionToken = 'v1'
export function genSignEndPoint() {
  const headers: any = {}
  const stime = Date.now()
  const nonce = getRandomNonce(20).toString()

  headers.stime = stime
  headers.nonce = nonce

  const sortKeys: string[] = []
  for (const key in headers) {
    if (key !== 'sign') {
      sortKeys.push(key)
    }
  }
  sortKeys.sort()
  let headersString = ''
  sortKeys.forEach((key) => {
    headersString += key + headers[key]
  })

  const sign = md5(headersString + keyToken + versionToken).toString()

  return {
    sign: sign,
    version: versionToken,
    nonce: nonce,
    stime: stime.toString()
  }
}
export const replaceDimensions = (url: string, newHeight: number, newWidth: number) => {
  // Sử dụng Regular Expression để thay thế giá trị h và w trong URL
  const updatedUrl = url.replace(/h_\d+/, `h_${newHeight}`).replace(/w_\d+/, `w_${newWidth}`)
  return updatedUrl
}

export const buildPriceRestaurant = (restaurantPrice: RestaurantPrice) => {
  const { restaurant_price_min, restaurant_price_max, restaurant_price_amount, restaurant_price_option } =
    restaurantPrice

  if (restaurant_price_option === 'range') {
    return `Khoảng ${restaurant_price_min.toLocaleString()}đ - ${restaurant_price_max.toLocaleString()}đ`
  }

  if (restaurant_price_option === 'up') {
    return `Trên ${restaurant_price_amount.toLocaleString()}đ`
  }

  if (restaurant_price_option === 'down') {
    return `Dưới ${restaurant_price_amount.toLocaleString()}đ`
  }
  return 'Ưu đãi hấp dẫn'
}
