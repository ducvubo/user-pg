import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ChevronRight, CircleDollarSign, MapPin } from 'lucide-react'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { settings } from '@/app/setting'
import { IRestaurant } from '@/app/interface/restaurant.interface'
import { buildPriceRestaurant, replaceDimensions } from '@/app/utils'
import { getFoodRestaurant } from '../api'
import CarouselFood from '@/app/components/CarouselFood'
import dynamic from 'next/dynamic'
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
import OrderTable from './OrderTable'
const ToastServer = dynamic(() => import('@/components/ToastServer'), {
  ssr: true
})
interface IProps {
  restaurant: IRestaurant
}

export default async function InforRestaurant({ restaurant }: IProps) {
  const listFood: IBackendRes<IFoodRestaurant[]> = await getFoodRestaurant(restaurant._id)
  if (listFood.statusCode !== 200 || !listFood.data) {
    // return (
    //   <div>
    //     <ToastServer message='Không tìm thấy nhà hàng' title='Lỗi' variant='destructive' />
    //   </div>
    // )
  }
  return (
    <div className='bg-[#e6eaed] h-full pb-20'>
      <div className='bg-white h-10 px-[100px] flex items-center gap-4'>
        <span className='text-sm'>Trang chủ</span>
        <ChevronRight size={16} strokeWidth={3} />
        <span className='text-sm'>{restaurant.restaurant_address.address_province.name}</span>
        <ChevronRight size={16} strokeWidth={3} />
        <span className='text-sm'>{restaurant.restaurant_address.address_district.name}</span>
        <ChevronRight size={16} strokeWidth={3} />
        <span className='text-sm'>{restaurant.restaurant_address.address_ward.name}</span>
      </div>

      <div className='flex  gap-2 mt-5 justify-center'>
        <div className='flex flex-col w-[720px] justify-center'>
          <Card className='inline-flex'>
            <CardContent className='flex flex-col mt-5'>
              <div className='flex gap-2'>
                <Image
                  loading='lazy'
                  src={replaceDimensions(restaurant.restaurant_banner.image_custom, 1000, 1000)}
                  alt='vuducbo'
                  width={800}
                  height={800}
                  className='w-[549px] h-[549px] rounded-lg'
                />
                <div className='flex flex-col gap-3'>
                  {restaurant.restaurant_image
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 4)
                    .map((image, index) => (
                      <Image
                        key={index}
                        loading='lazy'
                        src={replaceDimensions(image.image_custom, 1000, 1000)}
                        alt='vuducbo'
                        width={500}
                        height={500}
                        className='w-32 h-32 rounded-lg'
                      />
                    ))}
                </div>
              </div>
              <div className='p-3'>
                <h1 className='font-semibold text-2xl'>{restaurant.restaurant_name}</h1>
                <div className='flex mt-3'>
                  <MapPin size={20} />
                  <span className='ml-1 font-normal'>Địa chỉ: {restaurant.restaurant_address.address_specific}</span>
                </div>
                <div className='flex mt-3'>
                  <CircleDollarSign size={20} />
                  <span className='ml-1 font-semibold text-red-500'>
                    {buildPriceRestaurant(restaurant.restaurant_price)}
                  </span>
                </div>
              </div>
              <hr className='border-gray-300 border-t-1' />
              <div className='flex flex-wrap gap-2 mt-2'>
                {restaurant.restaurant_type.map((type, index) => (
                  <div
                    key={index}
                    className='truncate  cursor-pointer text-sm px-2 py-1 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100'
                  >
                    {type.restaurant_type_name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className='mt-2'>
            <CardContent className='w-auto overflow-hidden'>
              <div dangerouslySetInnerHTML={{ __html: restaurant.restaurant_description }} />
            </CardContent>
          </Card>
          {/* <Card className='mt-2'>
            <CardContent className='w-auto overflow-hidden'>
              <div className='w-full h-[500px]'>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.924224070705!2d105.774349!3d21.036237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab03c4690305%3A0xa18f44f2be3dd1b7!2zTeG7uSDEkMOgIHThu6sgMQ!5e0!3m2!1sen!2s!4v1672208769623!5m2!1sen!2s'
                  width='100%'
                  height='100%'
                  allowFullScreen={true}
                  loading='lazy'
                  style={{ border: 0 }}
                ></iframe>
              </div>
            </CardContent>
          </Card> */}
          <Card className='mt-2'>
            <CardContent className='w-auto overflow-hidden'>
              <CarouselFood listFoodRestaurant={listFood.data} />
            </CardContent>
          </Card>
        </div>

        <div className='flex flex-col gap-2'>
          <Card className='w-80'>
            <CardHeader className='font-bold text-2xl text-center'>{restaurant.restaurant_name} </CardHeader>
            <CardContent>
            <OrderTable/>
              <div className='mt-2 flex flex-col justify-center items-center'>
                <span className=''>
                  Hoặc gọi tới: <span className='font-semibold text-xl'>{settings.phone}</span>{' '}
                </span>
                <span>Để đặt chỗ và được tư vấn</span>
              </div>
            </CardContent>
          </Card>
          <Card className='w-80'>
            <CardContent className='mt-4'>
              <span className='font-semibold text-base uppercase'>Giờ hoạt động</span>
              <ul style={{ listStyleType: 'disc' }}>
                {restaurant.restaurant_hours.map((hour, index) => (
                  <li key={index} className='font-semibold text-sm ml-4 mt-1'>
                    {hour.day_of_week}:
                    <span className='font-normal'>
                      {hour.open} - {hour.close}
                    </span>
                  </li>
                ))}
              </ul>
              <hr className='border-gray-300 border-t-1 mt-2 mb-3' />
              <span className='font-semibold text-base uppercase'>Tiện ích</span>

              {restaurant.restaurant_amenity.map((amenity, index) => (
                <div key={index} className='flex gap-2 mt-1'>
                  <div className='w-6'>
                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
                      <path
                        d='M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM15.2197 8.96967L10.75 13.4393L8.78033 11.4697C8.48744 11.1768 8.01256 11.1768 7.71967 11.4697C7.42678 11.7626 7.42678 12.2374 7.71967 12.5303L10.2197 15.0303C10.5126 15.3232 10.9874 15.3232 11.2803 15.0303L16.2803 10.0303C16.5732 9.73744 16.5732 9.26256 16.2803 8.96967C15.9874 8.67678 15.5126 8.67678 15.2197 8.96967Z'
                        fill='#4CAF50'
                      ></path>
                    </svg>
                  </div>
                  <span className='line-clamp-1'>{amenity.amenity_name}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className='w-80'>
            <CardContent className='w-auto overflow-hidden'>
              <div dangerouslySetInnerHTML={{ __html: restaurant.restaurant_overview }} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
