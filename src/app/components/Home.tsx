import React from 'react'
import Header from './Header'
import CarouselRestaurant from './CarouselRestaurant'
import { getRestaurantHome, getSysteParameter } from '../actions/home.api'
import { IRestaurant } from '../interface/restaurant.interface'
import CarouselBanner from './RestaurantDeals'
import SearchRestaurant from './SearchRestaurant'
import { mockRestaurants } from './mockData'
import TopRestaurantAddress from './TopRestaurantAddress'
import YouFind from './YouLookingForRestaurant'
import Image from 'next/image'
import RestaurantDeals from './RestaurantDeals'
import { SystemParameterEnum } from '../utils/ListSystemParameter'
import YouLookingForRestaurant from './YouLookingForRestaurant'
import Footer from './Footer'
const HomePage = async () => {
  const res = await getSysteParameter()

  if (res.statusCode !== 200 || !res.data) {
    return <div>Không có dữ liệu</div>
  }
  const bannerHeader = res.data.find(
    (p) => p.sys_para_id === SystemParameterEnum.LOGOHEADER.sys_para_id
  )?.sys_para_value

  return (
    <div>
      {bannerHeader && <Header image={JSON.parse(bannerHeader)} />}
      <div className='px-[100px] mt-10 h-auto'>
        {res.data.find((p) => p.sys_para_id === SystemParameterEnum.RESTAURANTDEAL.sys_para_id)?.sys_para_value &&
          JSON.parse(
            res.data.find((p) => p.sys_para_id === SystemParameterEnum.RESTAURANTDEAL.sys_para_id)?.sys_para_value ||
              '[]'
          )
            .sort((a: any, b: any) => a.order - b.order)
            .map((item: any, index: number) => <RestaurantDeals key={index} {...item} />)}
        <SearchRestaurant />
        {res.data.find((p) => p.sys_para_id === SystemParameterEnum.TOPRESTAURANTADDRESS.sys_para_id)?.sys_para_value &&
          JSON.parse(
            res.data.find((p) => p.sys_para_id === SystemParameterEnum.TOPRESTAURANTADDRESS.sys_para_id)
              ?.sys_para_value || '[]'
          )
            .sort((a: any, b: any) => a.order - b.order)
            .map((item: any, index: number) => <TopRestaurantAddress key={index} {...item} />)}

        {res.data.find((p) => p.sys_para_id === SystemParameterEnum.YOULOOKINGFOR.sys_para_id)?.sys_para_value &&
          JSON.parse(
            res.data.find((p) => p.sys_para_id === SystemParameterEnum.YOULOOKINGFOR.sys_para_id)?.sys_para_value ||
              '[]'
          )
            .sort((a: any, b: any) => a.order - b.order)
            .map((item: any, index: number) => <YouLookingForRestaurant key={index} {...item} />)}

        {res.data.find((p) => p.sys_para_id === SystemParameterEnum.SLIDETOPHOME.sys_para_id)?.sys_para_value &&
          JSON.parse(
            res.data.find((p) => p.sys_para_id === SystemParameterEnum.SLIDETOPHOME.sys_para_id)?.sys_para_value || '[]'
          )
            .data.sort((a: any, b: any) => a.order - b.order)
            .map((item: any, index: number) => <CarouselRestaurant key={index} {...item} />)}

        <div className='mt-7 flex flex-col gap-5'>
          {res.data.find((p) => p.sys_para_id === SystemParameterEnum.BANNERCENTERHOME.sys_para_id)?.sys_para_value &&
            JSON.parse(
              res.data.find((p) => p.sys_para_id === SystemParameterEnum.BANNERCENTERHOME.sys_para_id)
                ?.sys_para_value || '[]'
            )
              .sort((a: any, b: any) => a.order - b.order)
              .map((item: any, index: number) => (
                <Image key={index} src={item.image_cloud} width={1920} height={1080} alt='vuducbo' />
              ))}
        </div>

        {res.data.find((p) => p.sys_para_id === SystemParameterEnum.SLIDEBOTTOMHOME.sys_para_id)?.sys_para_value &&
          JSON.parse(
            res.data.find((p) => p.sys_para_id === SystemParameterEnum.SLIDEBOTTOMHOME.sys_para_id)?.sys_para_value ||
              '[]'
          )
            .data.sort((a: any, b: any) => a.order - b.order)
            .map((item: any, index: number) => <CarouselRestaurant key={index} {...item} />)}
      </div>
      <Footer />
    </div>
  )
}

export default HomePage
