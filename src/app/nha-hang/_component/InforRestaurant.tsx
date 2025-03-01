import { ChevronRight, CircleDollarSign, List, MapPin, PhoneCall } from 'lucide-react'
import React from 'react'
import { IRestaurant } from '@/app/interface/restaurant.interface'
import { getCategoryRestaurant, getCookie, getFoodRestaurant, getListCombo, getListDish, getSpecialOffer } from '../api'
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
import Image from 'next/image'
import { buildPriceRestaurant, replaceDimensions } from '@/app/utils'
import ShowMoreImages from './BannerAndGallery'
import BannerAndGallery from './BannerAndGallery'
import CategoryBlock, { ICategoryRestaurant } from '@/app/components/CategoryBlock'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import OrderTable from './OrderTable'
import FoodList from './FoodList'
import ComboList, { IComboFood } from './ComboList'
import DishList from './DishList'
import { cookies } from 'next/headers'
import CarouselRestaurant from '@/app/home/_component/CarouselRestaurant'
import CarouselRestaurantCat from './CarouselRestaurantCat'
import Footer from '@/app/home/_component/Footer'
interface IProps {
  restaurant: IRestaurant
}

export interface ISpecialOffer {
  spo_id: string
  spo_title: string
  spo_description: string
}

export default async function InforRestaurant({ restaurant }: IProps) {
  // const restaurantIds = await addRestaurantToCookie(restaurant._id)
  const listIdView = await getCookie('restaurantIds')
  let restaurantIds: string[] = listIdView?.value
    ? JSON.parse(listIdView.value).filter((t: string) => t !== restaurant._id)
    : []

  const [listFood, listCategory, listSpecialOffer, listCombo, listDish] = await Promise.all([
    getFoodRestaurant(restaurant._id),
    getCategoryRestaurant(restaurant._id),
    getSpecialOffer(restaurant._id),
    getListCombo(restaurant._id),
    getListDish(restaurant._id)
  ])

  const groupHoursByDay = (hours: { close: string; open: string; day_of_week: string }[]) => {
    const grouped: { [key: string]: { open: string; close: string }[] } = {}

    hours.forEach((hour) => {
      if (!grouped[hour.day_of_week]) {
        grouped[hour.day_of_week] = []
      }
      grouped[hour.day_of_week].push({ open: hour.open, close: hour.close })
    })

    return Object.keys(grouped).map((day) => ({
      day_of_week: day,
      times: grouped[day]
    }))
  }
  return (
    <div className='bg-[#e6eaed] h-auto'>
      <div className='bg-white h-10 px-[100px] flex items-center gap-4'>
        <span className='text-sm'>Trang chủ</span>
        <ChevronRight size={16} strokeWidth={3} />
        <span className='text-sm'>{restaurant.restaurant_address.address_province.name}</span>
        <ChevronRight size={16} strokeWidth={3} />
        <span className='text-sm'>{restaurant.restaurant_address.address_district.name}</span>
        <ChevronRight size={16} strokeWidth={3} />
        <span className='text-sm'>{restaurant.restaurant_address.address_ward.name}</span>
      </div>

      {listCategory.statusCode === 200 && listCategory.data && listCategory.data.length > 0 && (
        <CategoryBlock categories={listCategory.data} />
      )}

      <BannerAndGallery
        bannerImage={restaurant.restaurant_banner.image_cloud}
        restaurantImages={restaurant.restaurant_image}
        restaurant_id={restaurant._id}
      />
      <div className='flex gap-3 px-[100px] mt-3' style={{ alignItems: 'flex-start' }}>
        <div className='w-[67%] rounded-lg flex flex-col gap-3'>
          <Card>
            <CardContent>
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
                <div className='flex mt-3'>
                  <PhoneCall size={20} />
                  <span className='ml-1 font-semibold text-red-500'>{restaurant.restaurant_phone}</span>
                </div>
              </div>
              <hr className='border-gray-300 border-t-1' />
              <div className='flex flex-wrap gap-2 mt-2'>
                {restaurant.restaurant_type.map((type, index) => (
                  <div
                    key={index}
                    className='truncate cursor-pointer text-sm px-2 py-1 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100'
                  >
                    {type.restaurant_type_name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {listCombo.statusCode === 200 && listCombo.data && listCombo.data.length > 0 && (
            <Card>
              <CardContent>
                <ComboList comboFoods={listCombo.data} />
              </CardContent>
            </Card>
          )}
          {listFood.statusCode === 200 && listFood.data && listFood.data.length > 0 && (
            <Card>
              <CardContent>
                <FoodList foods={listFood.data} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className='mt-3'>
              <span className='font-bold text-2xl'>Giới thiệu về nhà hàng</span>
              <div
                dangerouslySetInnerHTML={{
                  __html: restaurant.restaurant_description
                }}
              ></div>
            </CardContent>
          </Card>
        </div>

        <div className='w-[33%] rounded-lg flex flex-col gap-3'>
          <Card>
            <CardHeader className='font-bold text-2xl text-center'>{restaurant.restaurant_name} </CardHeader>
            <CardContent>
              <OrderTable />
              <div className='mt-4 flex flex-col justify-center items-center'>
                <span className=''>
                  Hoặc gọi tới: <span className='font-semibold text-xl'>{restaurant.restaurant_phone}</span>{' '}
                </span>
                <span>Để đặt chỗ và được tư vấn</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='mt-4'>
              <span className='font-semibold text-base uppercase'>Giờ hoạt động</span>
              <ul style={{ listStyleType: 'disc' }}>
                {groupHoursByDay(restaurant.restaurant_hours).map((item, index) => (
                  <li key={index} className='font-semibold text-sm ml-4 mt-1'>
                    {item.day_of_week}:
                    <span className='font-normal'>
                      {item.times.map((time, idx) => (
                        <span className='ml-1' key={idx}>
                          {time.open} - {time.close}
                          {idx < item.times.length - 1 && ' và '}
                        </span>
                      ))}
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
          {listSpecialOffer.statusCode === 200 && listSpecialOffer.data && listSpecialOffer.data.length > 0 && (
            <Card>
              <CardContent className='mt-4'>
                <span className='font-semibold text-base uppercase'>Ưu đãi đặc biệt</span>
                <ul className='flex flex-col gap-3'>
                  {listSpecialOffer.data.map((offer, index) => (
                    <li key={index} className='mt-1 flex flex-col gap-2 border border-gray-300 p-2 rounded-lg'>
                      <span className='font-semibold'>{offer.spo_title}</span>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: offer.spo_description
                        }}
                      ></div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className='mt-3'>
              <span className='font-bold text-2xl'>Mô tả</span>
              <div
                dangerouslySetInnerHTML={{
                  __html: restaurant.restaurant_overview
                }}
              ></div>
            </CardContent>
          </Card>
          {listDish.statusCode === 200 && listDish.data && listDish.data.length > 0 && (
            <Card>
              <CardContent>
                <DishList dishes={listDish.data} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <div className='mt-3 px-[100px]'>
        <Card>
          <CardContent>
            <CarouselRestaurant
              link='/'
              order={5}
              selectedRestaurant={restaurantIds}
              title='Danh sách nhà hàng đã xem'
            />
          </CardContent>
        </Card>
        <div className='flex flex-col gap-3 mt-3'>
          {restaurant.restaurant_category &&
            restaurant.restaurant_category.length > 0 &&
            restaurant.restaurant_category.map((cate, index) => {
              return (
                <CarouselRestaurantCat
                  idCate={cate._id}
                  key={index}
                  link={`/danh-muc/${cate._id}`}
                  order={5}
                  title={cate.category_name}
                />
              )
            })}
        </div>
      </div>
      <Footer />
    </div>
  )
}
