import ComboList, { IComboFood } from '@/app/nha-hang/_component/ComboList'
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
import { IRestaurant } from '@/app/interface/restaurant.interface'
import Image from 'next/image'
import Link from 'next/link'
import ComboFoodClient from './ComboFoodClient'
import { Card, CardContent } from '@/components/ui/card'
import { CircleDollarSign, MapPin, PhoneCall } from 'lucide-react'
import { buildPriceRestaurant } from '@/app/utils'
import FoodList from '@/app/nha-hang/_component/FoodList'

interface IProps {
  comboFood: IComboFood
  listFood?: IFoodRestaurant[]
  listCombo?: IComboFood[]
  restaurant: IRestaurant
}

export default function PageInforComboFood({ comboFood, restaurant, listCombo, listFood }: IProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const isComboSoldOut = comboFood.fcb_state === 'soldOut'

  const comboImages = JSON.parse(comboFood.fcb_image)

  return (
    <div className='w-full px-4 md:px-8 lg:px-[100px] bg-[#e6eaed] py-5 flex flex-col gap-4'>
      <Card className='bg-white h-auto p-4'>
        <Link
          href={`/nha-hang/${restaurant.restaurant_slug}`}
          className='w-full rounded-md overflow-hidden flex flex-col sm:flex-row gap-3 justify-start items-center'
        >
          <Image
            src={restaurant?.restaurant_banner.image_cloud}
            alt={restaurant?.restaurant_name || 'Restaurant'}
            width={128}
            height={128}
            className='w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg'
          />
          <div className='flex flex-col gap-2 w-full'>
            <div className='flex justify-between'>
              <h1 className='font-semibold text-lg sm:text-xl'>{restaurant.restaurant_name}</h1>
            </div>
            <div className='flex items-center'>
              <MapPin size={16} />
              <span className='ml-1 text-xs sm:text-sm'>Địa chỉ: {restaurant.restaurant_address.address_specific}</span>
            </div>
            <div className='flex items-center'>
              <CircleDollarSign size={16} />
              <span className='ml-1 font-semibold text-red-500 text-xs sm:text-sm'>
                {buildPriceRestaurant(restaurant.restaurant_price)}
              </span>
            </div>
            <div className='flex items-center'>
              <PhoneCall size={16} />
              <span className='ml-1 font-semibold text-red-500 text-xs sm:text-sm'>{restaurant.restaurant_phone}</span>
            </div>
          </div>
        </Link>
      </Card>
      <div className='bg-white rounded-lg shadow-md p-5'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='md:w-1/2'>
            <ComboFoodClient comboImages={comboImages} comboFood={comboFood} isComboSoldOut={isComboSoldOut} />
          </div>

          <div className='md:w-1/2 flex flex-col gap-2'>
            <h1 className='text-2xl font-bold text-gray-800'>{comboFood.fcb_name}</h1>

            <div className='flex items-center gap-2'>
              <span className='text-xl font-semibold text-red-500'>{formatPrice(comboFood.fcb_price)}</span>
            </div>

            <div className='text-sm text-gray-600'>
              <p>
                <span className='font-semibold'>Gọi ngay:</span>
                <a href='tel:1900633045' className='text-blue-500 hover:underline'>
                  {restaurant.restaurant_phone}
                </a>
              </p>
            </div>

            <div className='text-sm'>
              <p className='font-semibold'>Giờ bán:</p>
              <p className='text-gray-600'>
                {comboFood.fcb_open_time} - {comboFood.fcb_close_time}
              </p>
            </div>

            <div className='text-sm'>
              <p className='font-semibold'>Ghi chú:</p>
              <p className='text-gray-600'>{comboFood.fcb_note}</p>
            </div>

            <div className='text-sm'>
              <p className='font-semibold mb-1'>Món ăn trong combo:</p>
              <div className='space-y-3'>
                {comboFood.fcbi_combo.map((item) => {
                  const images = JSON.parse(item.fcbi_food.food_image)
                  const firstImage = images[0]?.image_cloud || 'https://via.placeholder.com/50'

                  return (
                    <Link
                      href={`/mon-an/${item.fcbi_food.food_slug}`}
                      key={item.fcbi_id}
                      className='border-b pb-2 flex gap-3'
                    >
                      <div className='relative w-12 h-12 flex-shrink-0'>
                        <Image
                          src={firstImage}
                          alt={item.fcbi_food.food_name}
                          layout='fill'
                          objectFit='cover'
                          className='rounded'
                        />
                      </div>
                      <div className='flex-1'>
                        <div className='flex justify-between items-center'>
                          <span className='font-medium text-gray-700'>
                            {item.fcbi_food.food_name} (x{item.fcbi_quantity})
                          </span>
                          <span className='text-red-500'>{formatPrice(item.fcbi_food.food_price)}</span>
                        </div>
                        <span className='text-gray-600 text-xs mt-1'>{item.fcbi_food.food_note}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            <ComboFoodClient
              comboImages={comboImages}
              comboFood={comboFood}
              isComboSoldOut={isComboSoldOut}
              showButtons
            />
          </div>
        </div>

        <div className='mt-4 text-sm'>
          <div className='text-gray-600' dangerouslySetInnerHTML={{ __html: comboFood.fcb_description }} />
        </div>
      </div>
      {listCombo && listCombo.length > 0 && (
        <Card>
          <CardContent>
            <ComboList comboFoods={listCombo} />
          </CardContent>
        </Card>
      )}
      {listFood && listFood.length > 0 && (
        <Card>
          <CardContent>
            <FoodList foods={listFood} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
