import Image from 'next/image'
import Link from 'next/link'
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
import { IComboFood } from '@/app/nha-hang/_component/ComboList'
import { IRestaurant } from '@/app/interface/restaurant.interface'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getComboById, getFoodById } from '../checkout.cart.api'
import { GetRestaurantByIds } from '@/app/home/home.api'
import CheckoutForm from './CheckoutForm'

// Extend IFoodRestaurant to include quantity and selected_options
interface CartFoodItem extends IFoodRestaurant {
  quantity: number
  selected_options: string[]
}

// Extend IComboFood to include quantity
interface CartComboItem extends IComboFood {
  quantity: number
}

interface SimplifiedCart {
  foods: { food_id: string; quantity: number; selected_options: string[] }[]
  combos: { fcb_id: string; quantity: number }[]
}

interface CheckoutProps {
  searchParams?: { cart?: string }
}

export default async function PageCheckOutCart({ searchParams }: CheckoutProps) {
  // Kiểm tra searchParams
  if (!searchParams) {
    return <div className="text-center py-10 text-red-600">Không tìm thấy query parameters.</div>
  }

  // Deserialize cart data từ query parameter
  let cart: SimplifiedCart | null = null
  let error: string | null = null

  try {
    const cartData = searchParams.cart
    if (cartData) {
      cart = JSON.parse(decodeURIComponent(cartData))
    } else {
      error = 'Không tìm thấy dữ liệu giỏ hàng trong query parameters.'
    }
  } catch (err) {
    console.error('Error parsing cart data:', err)
    error = 'Không thể đọc dữ liệu giỏ hàng.'
    cart = null
  }

  // Fetch food và combo items
  let foodItems: CartFoodItem[] = []
  let comboItems: CartComboItem[] = []
  let restaurants: IRestaurant[] = []

  if (cart) {
    try {
      // Fetch food items
      const foodPromises = cart.foods.map(async (food) => {
        const res = await getFoodById(food.food_id)
        if (res.statusCode !== 200 || !res.data) {
          throw new Error(res.message || `Không thể lấy thông tin món ăn ${food.food_id}`)
        }
        return { ...res.data, quantity: food.quantity, selected_options: food.selected_options } as CartFoodItem
      })

      // Fetch combo items
      const comboPromises = cart.combos.map(async (combo) => {
        const res = await getComboById(combo.fcb_id)
        if (res.statusCode !== 200 || !res.data) {
          throw new Error(res.message || `Không thể lấy thông tin combo ${combo.fcb_id}`)
        }
        return { ...res.data, quantity: combo.quantity } as CartComboItem
      })

      // Await tất cả promises
      foodItems = await Promise.all(foodPromises)
      comboItems = await Promise.all(comboPromises)

      // Lấy danh sách restaurant_ids
      const restaurantIds = new Set<string>()
      foodItems.forEach((food) => restaurantIds.add(food.food_res_id))
      comboItems.forEach((combo) => restaurantIds.add(combo.fcb_res_id))

      // Gọi API để lấy thông tin nhà hàng
      const restaurantRes = await GetRestaurantByIds(Array.from(restaurantIds))
      if (restaurantRes.statusCode === 201 && restaurantRes.data) {
        restaurants = restaurantRes.data
      } else {
        throw new Error('Không thể lấy thông tin nhà hàng.')
      }
    } catch (err) {
      console.error('Error fetching cart details or restaurants:', err)
      error = 'Có lỗi khi tải chi tiết giỏ hàng hoặc thông tin nhà hàng. Vui lòng thử lại.'
    }
  }

  // Nhóm foodItems và comboItems theo nhà hàng
  const restaurantGroups: { [key: string]: { foods: CartFoodItem[]; combos: CartComboItem[] } } = {}
  foodItems.forEach((food) => {
    const resId = food.food_res_id
    if (!restaurantGroups[resId]) {
      restaurantGroups[resId] = { foods: [], combos: [] }
    }
    restaurantGroups[resId].foods.push(food)
  })
  comboItems.forEach((combo) => {
    const resId = combo.fcb_res_id
    if (!restaurantGroups[resId]) {
      restaurantGroups[resId] = { foods: [], combos: [] }
    }
    restaurantGroups[resId].combos.push(combo)
  })

  // Hàm render food item
  const renderFoodItem = (food: CartFoodItem) => {
    const images = JSON.parse(food.food_image)
    const primaryImage = images[0]?.image_cloud

    return (
      <div
        key={food.food_id}
        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
      >
        {primaryImage && (
          <Link href={`/mon-an/${food.food_slug}`} target="_blank">
            <div className="relative w-full h-24">
              <Image src={primaryImage} alt={food.food_name} fill className="object-cover" />
            </div>
          </Link>
        )}
        <div className="p-2">
          <Link href={`/mon-an/${food.food_slug}`} target="_blank">
            <h3 className="text-xs font-medium text-gray-800 mb-1 line-clamp-1">{food.food_name}</h3>
            <p className="text-[11px] text-gray-600 mb-1">Giá: {food.food_price.toLocaleString('vi-VN')} VNĐ</p>
            <p className="text-[11px] text-gray-500">Số lượng: {food.quantity}</p>
            {food.fopt_food && food.fopt_food.length > 0 && (
              <div className="mt-1">
                <p className="text-[10px] font-medium text-gray-700">Tùy chọn:</p>
                {food.fopt_food
                  .filter((option) => food.selected_options.includes(option.fopt_id))
                  .map((option) => (
                    <div key={option.fopt_id} className="text-[10px] text-gray-600 line-clamp-1">
                      {option.fopt_name} ({option.fopt_attribute}) - {option.fopt_price.toLocaleString('vi-VN')} VNĐ
                    </div>
                  ))}
              </div>
            )}
          </Link>
        </div>
      </div>
    )
  }

  // Hàm render combo item
  const renderComboItem = (combo: CartComboItem) => {
    const images = JSON.parse(combo.fcb_image)
    const primaryImage = images.image_cloud

    return (
      <div
        key={combo.fcb_id}
        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
      >
        {primaryImage && (
          <Link href={`/combo-mon-an/${combo.fcb_slug}`} target="_blank">
            <div className="relative w-full h-24">
              <Image src={primaryImage} alt={combo.fcb_name} fill className="object-cover" />
            </div>
          </Link>
        )}
        <div className="p-2">
          <Link href={`/combo-mon-an/${combo.fcb_slug}`} target="_blank">
            <h3 className="text-xs font-medium text-gray-800 mb-1 line-clamp-1">{combo.fcb_name}</h3>
            <p className="text-[11px] text-gray-600 mb-1">Giá: {combo.fcb_price.toLocaleString('vi-VN')} VNĐ</p>
            <p className="text-[11px] text-gray-500">Số lượng: {combo.quantity}</p>
            {combo.fcbi_combo && combo.fcbi_combo.length > 0 && (
              <div className="mt-1">
                <p className="text-[10px] font-medium text-gray-700">Bao gồm:</p>
                {combo.fcbi_combo.map((item: any) => (
                  <div key={item.fcbi_id} className="text-[10px] text-gray-600 line-clamp-1">
                    {item.fcbi_food.food_name} (x{item.fcbi_quantity})
                  </div>
                ))}
              </div>
            )}
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>
  }

  if (!cart || (foodItems.length === 0 && comboItems.length === 0)) {
    return <div className="text-center py-10">Giỏ hàng trống.</div>
  }

  return (
    <div className=" px-4 md:px-8 lg:px-[100px] mt-5 py-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Thanh toán</h1>
      {Object.keys(restaurantGroups).map((resId) => {
        const restaurant = restaurants.find((res) => res._id === resId)
        const { foods, combos } = restaurantGroups[resId]

        return (
          <Card key={resId} className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{restaurant?.restaurant_name || `Nhà hàng ${resId}`}</CardTitle>
              {restaurant?.restaurant_address && (
                <p className="text-sm text-gray-600">
                  Địa chỉ: {restaurant.restaurant_address.address_specific}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {foods.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-base font-semibold mb-2">Món ăn</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {foods.map(renderFoodItem)}
                  </div>
                </div>
              )}
              {combos.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold mb-2">Combo</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {combos.map(renderComboItem)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
      <CheckoutForm foodItems={foodItems} comboItems={comboItems} restaurants={restaurants} />
    </div>
  )
}