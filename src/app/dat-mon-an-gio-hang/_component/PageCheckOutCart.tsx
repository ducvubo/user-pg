import Image from 'next/image'
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
import { IComboFood } from '@/app/nha-hang/_component/ComboList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getComboById, getFoodById } from '../checkout.cart.api'

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
  searchParams: { cart?: string }
}

export default async function Checkout({ searchParams }: CheckoutProps) {
  // Deserialize cart data from query parameter
  let cart: SimplifiedCart | null = null
  let error: string | null = null

  try {
    const cartData = searchParams.cart
    if (cartData) {
      cart = JSON.parse(decodeURIComponent(cartData))
    } else {
      error = 'Không tìm thấy dữ liệu giỏ hàng.'
    }
  } catch (err) {
    console.error('Error parsing cart data:', err)
    error = 'Không thể đọc dữ liệu giỏ hàng.'
    cart = null
  }

  // Fetch food and combo items
  let foodItems: CartFoodItem[] = []
  let comboItems: CartComboItem[] = []

  if (cart) {
    try {
      // Fetch food items
      const foodPromises = cart.foods.map(async (food) => {
        const res = await getFoodById(food.food_id)
        if (res.statusCode !== 200 || !res.data) {
          throw new Error(res.message || `Failed to fetch food item ${food.food_id}`)
        }
        return { ...res.data, quantity: food.quantity, selected_options: food.selected_options } as CartFoodItem
      })

      // Fetch combo items
      const comboPromises = cart.combos.map(async (combo) => {
        const res = await getComboById(combo.fcb_id)
        if (res.statusCode !== 200 || !res.data) {
          throw new Error(res.message || `Failed to fetch combo item ${combo.fcb_id}`)
        }
        return { ...res.data, quantity: combo.quantity } as CartComboItem
      })

      // Await all promises
      foodItems = await Promise.all(foodPromises)
      comboItems = await Promise.all(comboPromises)
    } catch (err) {
      console.error('Error fetching cart details:', err)
      error = 'Có lỗi khi tải chi tiết giỏ hàng. Vui lòng thử lại.'
    }
  }

  // Calculate total price
  const calculateTotal = () => {
    const foodTotal = foodItems.reduce((sum, food) => {
      const foodPrice = food.food_price * food.quantity
      const optionsPrice = food.fopt_food?.reduce((optSum, opt) => {
        if (food.selected_options?.includes(opt.fopt_id)) {
          return optSum + (opt.fopt_price || 0)
        }
        return optSum
      }, 0) || 0
      return sum + (foodPrice + optionsPrice * food.quantity)
    }, 0)

    const comboTotal = comboItems.reduce((sum, combo) => {
      return sum + (combo.fcb_price * combo.quantity)
    }, 0)

    return (foodTotal + comboTotal).toLocaleString('vi-VN')
  }

  // Render food item
  const renderFoodItem = (food: CartFoodItem) => {
    const images = JSON.parse(food.food_image)
    const primaryImage = images[0]?.image_cloud

    return (
      <div key={food.food_id} className="flex items-start border-b py-4">
        {primaryImage && (
          <div className="relative w-20 h-20 mr-4">
            <Image src={primaryImage} alt={food.food_name} fill className="object-cover rounded" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-base font-semibold">{food.food_name}</h3>
          <p className="text-sm text-gray-600 mt-1">Giá: {food.food_price.toLocaleString('vi-VN')} VNĐ</p>
          <p className="text-sm text-gray-600 mt-1">Số lượng: {food.quantity}</p>
          {food.fopt_food && food.fopt_food.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-700">Tùy chọn đã chọn:</p>
              {food.fopt_food
                .filter((option) => food.selected_options.includes(option.fopt_id))
                .map((option) => (
                  <div key={option.fopt_id} className="text-xs text-gray-600 py-1">
                    {option.fopt_name} ({option.fopt_attribute}) - {option.fopt_price.toLocaleString('vi-VN')} VNĐ
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render combo item
  const renderComboItem = (combo: CartComboItem) => {
    const images = JSON.parse(combo.fcb_image)
    const primaryImage = images.image_cloud

    return (
      <div key={combo.fcb_id} className="flex items-start border-b py-4">
        {primaryImage && (
          <div className="relative w-20 h-20 mr-4">
            <Image src={primaryImage} alt={combo.fcb_name} fill className="object-cover rounded" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-base font-semibold">{combo.fcb_name}</h3>
          <p className="text-sm text-gray-600 mt-1">Giá: {combo.fcb_price.toLocaleString('vi-VN')} VNĐ</p>
          <p className="text-sm text-gray-600 mt-1">Số lượng: {combo.quantity}</p>
          {combo.fcbi_combo && combo.fcbi_combo.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-700">Bao gồm:</p>
              {combo.fcbi_combo.map((item: any) => (
                <div key={item.fcbi_id} className="text-xs text-gray-600 py-1">
                  {item.fcbi_food.food_name} (x{item.fcbi_quantity})
                </div>
              ))}
            </div>
          )}
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
    <div className="container px-4 md:px-8 lg:px-[100px] mt-5 py-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Thanh toán</h1>
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết giỏ hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {foodItems.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Món ăn</h2>
              {foodItems.map(renderFoodItem)}
            </div>
          )}
          {comboItems.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Combo</h2>
              {comboItems.map(renderComboItem)}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-semibold">
          Tổng cộng: {calculateTotal()} VNĐ
        </p>
        <form action="/api/process-payment" method="POST">
          <input type="hidden" name="cart" value={encodeURIComponent(JSON.stringify(cart))} />
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Xác nhận thanh toán
          </Button>
        </form>
      </div>
    </div>
  )
}