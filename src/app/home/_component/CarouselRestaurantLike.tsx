import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { IRestaurant } from '../../interface/restaurant.interface'
import { GetRestaurantById, GetRestaurantByIds } from '../home.api'
import CarouselRestaurantClient from './CarouselRestaurantClient'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { getCookie } from '@/app/nha-hang/api'

interface IProps {
  link: string
  order: number
  title: string
}

export default async function CarouselRestaurantLike({ link = '#', order, title }: IProps) {
  const listLikedRestaurant: RequestCookie | undefined = await getCookie('listLikedRestaurant');
  let listRestaurantSelected: IRestaurant[] = []
  if (listLikedRestaurant && listLikedRestaurant.value) {
    const listLikedRestaurantArr = JSON.parse(listLikedRestaurant.value);
    const res: IBackendRes<IRestaurant[]> = await GetRestaurantByIds(listLikedRestaurantArr)
    if (res.statusCode === 201 && res.data) {
      listRestaurantSelected = res.data
    }
  }

  return (
    <div className='mt-10'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
        <Label className='font-semibold text-xl sm:text-2xl md:text-3xl'>{title}</Label>
        <Link
          href={link}
          className='font-semibold italic text-sm sm:text-base md:text-lg text-blue-500 hover:underline'
        >
          Xem thêm
        </Link>
      </div>
      <hr className='my-3 font-semibold' />
      <CarouselRestaurantClient listRestaurantSelected={listRestaurantSelected} />
    </div>
  )
}
