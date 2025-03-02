import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { IRestaurant } from '../../interface/restaurant.interface'
import CarouselRestaurantClient from './CarouselRestaurantCatClient'
import { getListRestaurantByCategory } from '../api'
import { Card, CardContent } from '@/components/ui/card'

interface IProps {
  link: string
  order: number
  idCate: string
  title: string
}

export default async function CarouselRestaurantCat({ link, order, idCate, title }: IProps) {
  let listRestaurantSelected: IRestaurant[] = []
  const res: IBackendRes<IRestaurant[]> = await getListRestaurantByCategory(idCate)
  if (res.statusCode === 200 && res.data) {
    listRestaurantSelected = res.data
  }

  return listRestaurantSelected.length > 4 ? (
    <Card>
      <CardContent>
        <div className='mt-10'>
          <div className='flex justify-between items-center'>
            <Label className='font-semibold text-3xl px-2'>{title}</Label>
            <Link href={link} className='font-semibold italic'>
              Xem thêm
            </Link>
          </div>
          <hr className='my-3 mx-2 font-semibold' />
          <CarouselRestaurantClient listRestaurantSelected={listRestaurantSelected} />
        </div>
      </CardContent>
    </Card>
  ) : null
}
