import Image from 'next/image'

interface IDishImage {
  image_cloud: string
  image_custom: string
}

interface IDishSale {
  sale_type: 'percentage' | 'fixed'
  sale_value: number
}

export interface IDish {
  _id: string
  dish_restaurant_id: string
  dish_name: string
  dish_image: IDishImage
  dish_price: number
  dish_short_description: string
  dish_sale: IDishSale
  dish_priority: number
  dish_description: string
  dish_note: string
}
interface DishListProps {
  dishes: IDish[]
}

export default function DishList({ dishes }: DishListProps) {
  const calculateSalePrice = (price: number, sale: IDishSale) => {
    if (sale.sale_type === 'percentage') {
      return price * (1 - sale.sale_value / 100)
    }
    return price - sale.sale_value
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Món Ăn Đang Phục Vụ Tại Nhà Hàng</h1>
      <div className='flex flex-col gap-6'>
        {dishes.sort((a,b) => a.dish_priority - b.dish_priority).map((dish) => {
          const salePrice = calculateSalePrice(dish.dish_price, dish.dish_sale)

          return (
            <div
              key={dish._id}
              className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
            >
              {dish.dish_image.image_cloud && (
                <div className='relative w-full h-48'>
                  <Image src={dish.dish_image.image_cloud} alt={dish.dish_name} fill className='object-cover' />
                </div>
              )}
              <div className='p-4'>
                <h2 className='text-xl font-semibold text-gray-800 mb-2'>{dish.dish_name}</h2>
                <div className='flex items-center gap-2 mb-2'>
                  <p className='text-gray-600'>
                    Giá:{' '}
                    <span className={dish.dish_sale.sale_value > 0 ? 'line-through text-gray-400' : ''}>
                      {dish.dish_price.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </p>
                  {dish.dish_sale.sale_value > 0 && (
                    <p className='text-green-600 font-semibold'>
                      Giá sale: {Math.round(salePrice).toLocaleString('vi-VN')} VNĐ
                    </p>
                  )}
                </div>
                {dish.dish_note && <p className='text-sm text-gray-500 mt-1 italic'>Ghi chú: {dish.dish_note}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
