import React from 'react'
import CarouselRestaurant from './CarouselRestaurant'
import { GetCategoryByIds, getSysteParameter } from '../home.api'
import SearchRestaurant from './SearchRestaurant'
import TopRestaurantAddress from './TopRestaurantAddress'
import Image from 'next/image'
import RestaurantDeals from './RestaurantDeals'
import { SystemParameterEnum } from '../../utils/ListSystemParameter'
import YouLookingForRestaurant from './YouLookingForRestaurant'
import Link from 'next/link'
import CategoryBlock from '@/app/components/CategoryBlock'
const HomePage = async () => {
  const res = await getSysteParameter()

  if (res.statusCode !== 200 || !res.data) {
    return <div>Không có dữ liệu</div>
  }

  const catIds = res.data.find((p) => p.sys_para_id === SystemParameterEnum.CATHOME.sys_para_id)?.sys_para_value
  const resListCategory = await GetCategoryByIds(catIds ? JSON.parse(catIds).data : [])
  return (
    <div>
      {resListCategory.statusCode !== 200 && resListCategory.data && (
        <CategoryBlock categories={resListCategory.data} />
      )}
      <div className='px-4 md:px-8 lg:px-[100px] mt-10 h-auto'>
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
                <Link href={item.link} className='flex flex-col gap-5' key={index}>
                  <Image key={index} src={item.image_cloud} width={1920} height={1080} alt='vuducbo' />
                </Link>
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
    </div>
  )
}

export default HomePage
