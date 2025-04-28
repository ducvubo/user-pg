'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { IRestaurant } from '@/app/interface/restaurant.interface'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { calcPriceShipingGHTK, calcPriceShippingGHN, createOrderFood } from '../order.food.api'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { CreateOrderFoodDto, IOrderFood } from '../order.food.interface'

const formSchema = z.object({
  customerName: z.string().min(1, 'Họ và tên không được để trống'),
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số'),
  email: z.string().email('Email không hợp lệ').min(1, 'Email không được để trống'),
  province: z.string().min(1, 'Vui lòng chọn tỉnh/thành'),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
  addressDetail: z.string().min(1, 'Địa chỉ chi tiết không được để trống'),
  note: z.string().optional(),
  shippingMethod: z.string().min(1, 'Vui lòng chọn phương thức giao hàng')
})

type FormData = z.infer<typeof formSchema>
type Position = LatLngExpression

interface Props {
  slug: string
  selectedOption: string[]
  quantity: number
  inforFood: IFoodRestaurant
  restaurant: IRestaurant
}

export default function PageOrderFood({ inforFood, quantity, selectedOption, slug, restaurant }: Props) {
  const router = useRouter()

  const foodImages = JSON.parse(inforFood.food_image || '[]')
  const selectedOptionsData = inforFood.fopt_food?.filter((opt) => selectedOption.includes(opt.fopt_id))

  const basePrice = inforFood.food_price || 0
  const optionsPrice = selectedOptionsData?.reduce((sum, opt) => sum + (opt.fopt_price || 0), 0) || 0
  const totalPrice = (basePrice + optionsPrice) * quantity

  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [shippingFeeGHN, setShippingFeeGHN] = useState<number | null>(null)
  const [shippingFeeGHTK, setShippingFeeGHTK] = useState<number | null>(null)


  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      phone: '',
      email: '',
      province: '',
      district: '',
      ward: '',
      addressDetail: '',
      note: '',
      shippingMethod: ''
    }
  })

  const formProvince = watch('province')
  const formDistrict = watch('district')
  const formWard = watch('ward')
  const formShippingMethod = watch('shippingMethod')

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
        headers: { Token: '3b43de66-111c-11f0-8686-8669292be81e' }
      })
      const data = await response.json()
      setProvinces(data.data)
    }
    fetchProvinces()
  }, [])

  useEffect(() => {
    if (formProvince) {
      const fetchDistricts = async () => {
        const response = await fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
          headers: { Token: '3b43de66-111c-11f0-8686-8669292be81e' }
        })
        const data = await response.json()
        const filteredDistricts = data.data.filter((d: any) => d.ProvinceID === parseInt(formProvince))
        setDistricts(filteredDistricts)
        setWards([])
        setValue('district', '')
        setValue('ward', '')
      }
      fetchDistricts()
    }
  }, [formProvince, setValue])

  useEffect(() => {
    if (formDistrict) {
      const fetchWards = async () => {
        const response = await fetch(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${formDistrict}`,
          {
            headers: { Token: '3b43de66-111c-11f0-8686-8669292be81e' }
          }
        )
        const data = await response.json()
        setWards(data.data)
        setValue('ward', '')
      }
      fetchWards()
    }
  }, [formDistrict, setValue])

  const calculateShippingFeeGHTK = useCallback(async () => {
    if (!formProvince || !formDistrict || !formWard || !formShippingMethod) return

    const provinceName = provinces.find((p) => p.ProvinceID === parseInt(formProvince))?.ProvinceName
    const districtName = districts.find((d) => d.DistrictID === parseInt(formDistrict))?.DistrictName

    const requestBody = {
      pick_province: restaurant.restaurant_address.address_province.name,
      pick_district: restaurant.restaurant_address.address_district.name,
      province: provinceName,
      district: districtName,
      address: '',
      weight: 1000,
      value: totalPrice,
      transport: formShippingMethod === 'standard' ? 'road' : 'fly',
      deliver_option: 'none',
      tags: [1]
    }

    try {
      const data = await calcPriceShipingGHTK(requestBody)
      if (data.success) {
        setShippingFeeGHTK(data.fee.fee)
      } else {
        setShippingFeeGHTK(null)
      }
    } catch (error) {
      console.error('Lỗi khi tính phí GHTK:', error)
      setShippingFeeGHTK(null)
    }
  }, [formProvince, formDistrict, formWard, formShippingMethod, totalPrice, provinces, districts])

  useEffect(() => {
    if (formProvince && formDistrict && formWard && formShippingMethod) {
      calculateShippingFeeGHTK()
    }
  }, [formProvince, formDistrict, formWard, formShippingMethod, calculateShippingFeeGHTK])

  const onSubmit = async (data: FormData) => {
    try {
      const provinceName = provinces.find((p) => p.ProvinceID === parseInt(data.province))?.ProvinceName
      const districtName = districts.find((d) => d.DistrictID === parseInt(data.district))?.DistrictName
      const wardName = wards.find((w) => w.WardCode === data.ward)?.WardName
      const payload: CreateOrderFoodDto = {
        od_link_confirm: `${process.env.NEXT_PUBLIC_URL_CLIENT}/xac-nhan-dat-mon-an`,
        od_price_shipping: (shippingFeeGHN ? shippingFeeGHN : shippingFeeGHTK) || 0,
        od_type_shipping: shippingFeeGHN ? 'GHN' : 'GHTK',
        od_user_id: 0,
        od_user_name: data.customerName,
        od_user_phone: data.phone,
        od_user_email: data.email,
        od_user_address: data.addressDetail,
        od_user_province: provinceName || '',
        od_user_district: districtName || '',
        od_user_ward: wardName || '',
        od_user_note: data.note,
        order_food_items: [{
          food_id: inforFood.food_id,
          od_it_quantity: quantity,
          food_options: selectedOptionsData?.map((opt) => opt.fopt_id) || [],
        }],
        od_res_id: inforFood.food_res_id,
      }

      const res: IBackendRes<IOrderFood> = await createOrderFood(payload)

      if (res.statusCode === 201 || res.statusCode === 200) {
        toast({
          title: 'Thành công',
          description: 'Đặt món thành công, vui lòng xác nhận qua email của bạn.',
          variant: 'default'
        })
        router.push('/mon-an-da-dat')
        return
      }
      if (res.statusCode === 400) {
        if (Array.isArray(res.message)) {
          res.message.map((item: string) => {
            toast({
              title: 'Thất bại',
              description: item,
              variant: 'destructive'
            })
          })
        } else {
          toast({
            title: 'Thất bại',
            description: res.message,
            variant: 'destructive'
          })
        }
        return
      } else {
        toast({
          title: 'Thất bại',
          description: 'Đặt món thất bại',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Lỗi khi gửi form:', error)
    }
  }

  return (
    <div className=' mx-auto py-8 px-4'>
      <Card className='max-w-2xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Đặt hàng: {inforFood.food_name}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {foodImages.length > 0 && (
            <div className='relative w-full h-64'>
              <Image
                src={foodImages[0].image_custom}
                alt={inforFood.food_name}
                fill
                className='object-cover rounded-md'
              />
            </div>
          )}
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='font-semibold'>Giá cơ bản:</span>
              <span>{basePrice.toLocaleString('vi-VN')} VNĐ</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-semibold'>Số lượng:</span>
              <Badge variant='outline'>{quantity}</Badge>
            </div>
          </div>
          {selectedOptionsData && selectedOptionsData.length > 0 && (
            <div className='space-y-2'>
              <Label className='font-semibold'>Tùy chọn:</Label>
              <ul className='list-disc pl-5'>
                {selectedOptionsData.map((opt) => {
                  let optioneImage = []
                  try {
                    optioneImage = JSON.parse(opt.fopt_image || '[]')
                    if (!Array.isArray(optioneImage)) {
                      optioneImage = [optioneImage]
                    }
                  } catch (error) {
                    console.error(`Error parsing food images for ${opt.fopt_name}:`, error)
                    optioneImage = []
                  }
                  return (
                    <li key={opt.fopt_id} className='flex my-1 justify-between'>
                      <div className='flex'>
                        {optioneImage.length > 0 ? (
                          <div className="relative w-10 h-10 flex-shrink-0">
                            <Image
                              src={optioneImage[0].image_custom}
                              alt={opt.fopt_name}
                              fill
                              className="object-cover rounded-sm"
                              sizes="100px"
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 rounded-sm flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-gray-500">N/A</span>
                          </div>
                        )}
                        <span className='mt-1 font-semibold ml-2'>
                          {opt.fopt_name} ({opt.fopt_attribute})
                        </span>
                      </div>

                      <span>{opt.fopt_price.toLocaleString('vi-VN')} VNĐ</span>
                    </li>
                  )
                }
                )}
              </ul>
            </div>
          )}
          <div className='flex justify-between text-lg font-bold'>
            <span>Tổng cộng:</span>
            <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Label htmlFor='customerName'>Họ và tên</Label>
              <Input id='customerName' placeholder='Nhập họ và tên' {...register('customerName')} />
              {errors.customerName && <p className='text-red-500 text-sm mt-1'>{errors.customerName.message}</p>}
            </div>
            <div>
              <Label htmlFor='phone'>Số điện thoại</Label>
              <Input id='phone' type='tel' placeholder='Nhập số điện thoại' {...register('phone')} />
              {errors.phone && <p className='text-red-500 text-sm mt-1'>{errors.phone.message}</p>}
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' placeholder='Nhập email' {...register('email')} />
              {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor='province'>Tỉnh/Thành</Label>
              <Select onValueChange={(value) => setValue('province', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Chọn tỉnh/thành' />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.ProvinceID} value={province.ProvinceID.toString()}>
                      {province.ProvinceName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.province && <p className='text-red-500 text-sm mt-1'>{errors.province.message}</p>}
            </div>

            <div>
              <Label htmlFor='district'>Quận/Huyện</Label>
              <Select onValueChange={(value) => setValue('district', value)} disabled={!formProvince}>
                <SelectTrigger>
                  <SelectValue placeholder='Chọn quận/huyện' />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.DistrictID} value={district.DistrictID.toString()}>
                      {district.DistrictName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.district && <p className='text-red-500 text-sm mt-1'>{errors.district.message}</p>}
            </div>

            <div>
              <Label htmlFor='ward'>Phường/Xã</Label>
              <Select onValueChange={(value) => setValue('ward', value)} disabled={!formDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder='Chọn phường/xã' />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((ward) => (
                    <SelectItem key={ward.WardCode} value={ward.WardCode}>
                      {ward.WardName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ward && <p className='text-red-500 text-sm mt-1'>{errors.ward.message}</p>}
            </div>

            <div>
              <Label htmlFor='addressDetail'>Địa chỉ chi tiết</Label>
              <Input id='addressDetail' placeholder='Số nhà, tên đường...' {...register('addressDetail')} />
              {errors.addressDetail && <p className='text-red-500 text-sm mt-1'>{errors.addressDetail.message}</p>}
            </div>

            <div>
              <Label htmlFor='note'>Ghi chú</Label>
              <Textarea id='note' placeholder='Ghi chú thêm (nếu có)' {...register('note')} />
            </div>

            <div>
              <Label htmlFor='shippingMethod'>Phương thức giao hàng</Label>
              <Select onValueChange={(value) => setValue('shippingMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Chọn phương thức giao hàng' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='standard'>Giao hàng tiêu chuẩn</SelectItem>
                  <SelectItem value='express'>Giao hàng nhanh</SelectItem>
                </SelectContent>
              </Select>
              {errors.shippingMethod && <p className='text-red-500 text-sm mt-1'>{errors.shippingMethod.message}</p>}
            </div>

            {shippingFeeGHTK !== null && (
              <div className='flex justify-between'>
                <span className='font-semibold'>Phí giao hàng:</span>
                <span>{shippingFeeGHTK.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            )}
            {(shippingFeeGHN !== null || shippingFeeGHTK !== null) && (
              <div className='flex justify-between text-lg font-bold'>
                <span>Tổng cộng (bao gồm phí giao):</span>
                <span>
                  {(totalPrice + Math.min(shippingFeeGHN || Infinity, shippingFeeGHTK || Infinity)).toLocaleString(
                    'vi-VN'
                  )}{' '}
                  VNĐ
                </span>
              </div>
            )}

            <Button type='submit' className='w-full'>
              Xác nhận đặt hàng
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
