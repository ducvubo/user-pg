import { ChevronRight, CircleDollarSign, List, MapPin, PhoneCall, MessageCircleQuestion, MessageCircle } from 'lucide-react'
import React from 'react'
import { IRestaurant } from '@/app/interface/restaurant.interface'
import { getArtilceRestaurant, getFoodRestaurant, getListCombo, getListDish, getRoomRestaurant, getSpecialOffer } from '../api'
import { buildPriceRestaurant } from '@/app/utils'
import BannerAndGallery from './BannerAndGallery'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import OrderTable from './OrderTable'
import FoodList from './FoodList'
import ComboList from './ComboList'
import DishList from './DishList'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import ListFeedBackBookTable from './ListFeedBackBookTable'
import Link from 'next/link'
import BlockBlog from './BlockBlog'
import RoomList from './RoomList'
import ListFeedBackOrderFood from './ListFeedBackOrderFood'
import ListFeedBackOrderFoodCombo from './ListFeedBackOrderFoodCombo'
import ListFeedBackBookRoom from './ListFeedBackBookRoom'

interface IProps {
  restaurant: IRestaurant
  slug: string
}

export interface ISpecialOffer {
  spo_id: string
  spo_title: string
  spo_description: string
}

export default async function InforRestaurant({ restaurant, slug }: IProps) {
  const [listFood, listSpecialOffer, listCombo, listDish, articleRestaurant, roomRestaurant] = await Promise.all([
    // const [listFood, listSpecialOffer, listCombo, listDish, roomRestaurant] = await Promise.all([
    getFoodRestaurant(restaurant._id),
    getSpecialOffer(restaurant._id),
    getListCombo(restaurant._id),
    getListDish(restaurant._id),
    getArtilceRestaurant(restaurant._id),
    getRoomRestaurant(restaurant._id)
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
    <div className='bg-[#e6eaed] min-h-screen pb-10'>
      <div className='bg-white h-auto min-h-10 px-4 sm:px-6 md:px-8 lg:px-[100px] flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 py-2'>
        <span className='text-xs sm:text-sm md:text-base'>Trang chủ</span>
        <ChevronRight size={12} strokeWidth={3} className='sm:w-4 sm:h-4 md:w-5 md:h-5 shrink-0' />
        <span className='text-xs sm:text-sm md:text-base'>{restaurant.restaurant_address.address_province.name}</span>
        <ChevronRight size={12} strokeWidth={3} className='sm:w-4 sm:h-4 md:w-5 md:h-5 shrink-0' />
        <span className='text-xs sm:text-sm md:text-base'>{restaurant.restaurant_address.address_district.name}</span>
        <ChevronRight size={12} strokeWidth={3} className='sm:w-4 sm:h-4 md:w-5 md:h-5 shrink-0' />
        <span className='text-xs sm:text-sm md:text-base'>{restaurant.restaurant_address.address_ward.name}</span>
      </div>

      <BannerAndGallery
        bannerImage={restaurant.restaurant_banner.image_cloud}
        restaurantImages={restaurant.restaurant_image}
        restaurant_id={restaurant._id}
      />

      <div className='flex flex-col lg:flex-row gap-3 px-4 md:px-8 lg:px-[100px] mt-3'>
        <div className='w-full lg:w-[67%] flex flex-col gap-3'>
          <Card>
            <CardContent className='p-4'>
              {/* <div className='flex justify-between'> */}
              <h1 className='font-semibold text-xl md:text-2xl'>{restaurant.restaurant_name}</h1>
              {/* <AddLikeRestaurant restaurantId={restaurant._id} /> */}
              {/* </div> */}
              <div className='flex items-center mt-3'>
                <MapPin size={16} />
                <span className='ml-1 text-sm md:text-base'>
                  Địa chỉ: {restaurant.restaurant_address.address_specific}
                </span>
              </div>
              <div className='flex items-center mt-2'>
                <CircleDollarSign size={16} />
                <span className='ml-1 font-semibold text-red-500 text-sm md:text-base'>
                  {buildPriceRestaurant(restaurant.restaurant_price)}
                </span>
              </div>
              <div className='flex items-center mt-2'>
                <PhoneCall size={16} />
                <span className='ml-1 font-semibold text-red-500 text-sm md:text-base'>
                  {restaurant.restaurant_phone}
                </span>
              </div>
              <Link href={`/hoi-dap-nha-hang/${slug}`} target='_blank' className='flex items-center mt-2'>
                <MessageCircleQuestion size={16} />
                <span className='ml-1 font-semibold text-red-500 text-sm md:text-base'>
                  Hỏi đáp
                </span>
              </Link>
              <Link href={`/ket-noi-nha-hang?id=${restaurant._id}`} target='_blank' className='flex items-center mt-2'>
                <MessageCircle size={16} />
                <span className='ml-1 font-semibold text-red-500 text-sm md:text-base'>
                  Kết nối
                </span>
              </Link>
              <hr className='border-gray-300 my-3' />
              <div className='flex flex-wrap gap-2'>
                {restaurant.restaurant_type.map((type, index) => (
                  <div
                    key={index}
                    className='text-xs md:text-sm px-2 py-1 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100'
                  >
                    {type.restaurant_type_name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className='block md:hidden'>
            <CardHeader className='font-bold text-xl md:text-2xl text-center'>{restaurant.restaurant_name}</CardHeader>
            <CardContent>
              <OrderTable restaurant={restaurant} />
              <div className='mt-4 text-center'>
                <span className='text-sm md:text-base'>
                  Hoặc gọi tới: <span className='font-semibold text-lg md:text-xl'>{restaurant.restaurant_phone}</span>
                </span>
                <p className='text-xs md:text-sm'>Để đặt chỗ và được tư vấn</p>
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
          {roomRestaurant.statusCode === 200 && roomRestaurant.data && roomRestaurant.data.length > 0 && (
            <Card>
              <CardContent>
                <RoomList rooms={roomRestaurant.data} />
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className='mt-3'>
              <span className='font-bold text-xl md:text-2xl'>Giới thiệu về nhà hàng</span>
              <div
                className='text-sm md:text-base'
                dangerouslySetInnerHTML={{ __html: restaurant.restaurant_description }}
              />
            </CardContent>
          </Card>
        </div>

        <div className='w-full lg:w-[33%] flex flex-col gap-3'>
          <Card className='hidden md:block'>
            <CardHeader className='font-bold text-xl md:text-2xl text-center'>{restaurant.restaurant_name}</CardHeader>
            <CardContent>
              <OrderTable restaurant={restaurant} />
              <div className='mt-4 text-center'>
                <span className='text-sm md:text-base'>
                  Hoặc gọi tới: <span className='font-semibold text-lg md:text-xl'>{restaurant.restaurant_phone}</span>
                </span>
                <p className='text-xs md:text-sm'>Để đặt chỗ và được tư vấn</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='mt-4'>
              <span className='font-semibold text-sm md:text-base uppercase'>Giờ hoạt động</span>
              <ul className='list-disc ml-4 mt-2'>
                {groupHoursByDay(restaurant.restaurant_hours).map((item, index) => (
                  <li key={index} className='text-xs md:text-sm font-semibold'>
                    {item.day_of_week}:
                    <span className='font-normal'>
                      {item.times.map((time, idx) => (
                        <span key={idx} className='ml-1'>
                          {time.open} - {time.close}
                          {idx < item.times.length - 1 && ' và '}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
              <hr className='border-gray-300 my-3' />
              <span className='font-semibold text-sm md:text-base uppercase'>Tiện ích</span>
              {restaurant.restaurant_amenity.map((amenity, index) => (
                <div key={index} className='flex gap-2 mt-1'>
                  <div className='w-5 md:w-6'>
                    <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 24 24' fill='none'>
                      <path
                        d='M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM15.2197 8.96967L10.75 13.4393L8.78033 11.4697C8.48744 11.1768 8.01256 11.1768 7.71967 11.4697C7.42678 11.7626 7.42678 12.2374 7.71967 12.5303L10.2197 15.0303C10.5126 15.3232 10.9874 15.3232 11.2803 15.0303L16.2803 10.0303C16.5732 9.73744 16.5732 9.26256 16.2803 8.96967C15.9874 8.67678 15.5126 8.67678 15.2197 8.96967Z'
                        fill='#4CAF50'
                      />
                    </svg>
                  </div>
                  <span className='text-xs md:text-sm line-clamp-1'>{amenity.amenity_name}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          {listSpecialOffer.statusCode === 200 && listSpecialOffer.data && listSpecialOffer.data.length > 0 && (
            <Card>
              <CardContent className='mt-4'>
                <span className='font-semibold text-sm md:text-base uppercase'>Ưu đãi đặc biệt</span>
                <ul className='flex flex-col gap-3 mt-2'>
                  {listSpecialOffer.data.map((offer, index) => (
                    <li key={index} className='border border-gray-300 p-2 rounded-lg'>
                      <span className='font-semibold text-sm md:text-base'>{offer.spo_title}</span>
                      <div className='text-xs md:text-sm' dangerouslySetInnerHTML={{ __html: offer.spo_description }} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className='mt-3'>
              <span className='font-bold text-xl md:text-2xl'>Mô tả</span>
              <div
                className='text-sm md:text-base'
                dangerouslySetInnerHTML={{ __html: restaurant.restaurant_overview }}
              />
            </CardContent>
          </Card>

          <Card className='!p-2'>
            <CardHeader className='text-xl font-bold mb-6 text-center'>Feedback của khách hàng</CardHeader>
            <CardContent className='p-2'>
              <Accordion type='single' collapsible className='w-full'>
                <AccordionItem value='item-1'>
                  <AccordionTrigger className='font-semibold'>Feedback đặt bàn</AccordionTrigger>
                  <AccordionContent>
                    <ListFeedBackBookTable restaurantId={restaurant._id} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value='item-2'>
                  <AccordionTrigger className='font-semibold'>Feedback đặt món</AccordionTrigger>
                  <AccordionContent>
                    <ListFeedBackOrderFood restaurantId={restaurant._id} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value='item-3'>
                  <AccordionTrigger className='font-semibold'>Feedback đặt combo</AccordionTrigger>
                  <AccordionContent>
                    <ListFeedBackOrderFoodCombo restaurantId={restaurant._id} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value='item-4'>
                  <AccordionTrigger className='font-semibold'>Feedback đặt phòng</AccordionTrigger>
                  <AccordionContent>
                    <ListFeedBackBookRoom restaurantId={restaurant._id} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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

      <div className='mt-3 px-4 md:px-8 lg:px-[100px] flex flex-col gap-3'>
        {
          articleRestaurant && articleRestaurant.data && articleRestaurant.data?.length > 0 && (
            <Card>
              <CardContent>
                <BlockBlog inforRestaurant={restaurant} articleRestaurant={articleRestaurant} />
              </CardContent>
            </Card>
          )
        }
      </div>
    </div>
  )
}