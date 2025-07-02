'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { IRestaurant } from '@/app/interface/restaurant.interface'
import { IComboFood } from '@/app/nha-hang/_component/ComboList'
import { calcPriceShipingGHTK, calcPriceShippingGHN } from '@/app/dat-mon-an/order.food.api'
import { CreateOrderFoodCombo, IOrderFoodCombo } from '../order.combo.interface'
import { createOrderFoodCombo } from '../order.combo.api'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

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
  shippingMethod: z.string().min(1, 'Vui lòng chọn phương thức giao hàng'),
})

type FormData = z.infer<typeof formSchema>

interface Props {
  slug: string
  quantity: number
  inforCombo: IComboFood
  restaurant: IRestaurant
}

export default function PageOrderCombo({ inforCombo, quantity, restaurant, slug }: Props) {
  const router = useRouter()
  const totalPrice = inforCombo.fcb_price * quantity
  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [shippingFeeGHTK, setShippingFeeGHTK] = useState<number | null>(null)
  const [shippingFeeGHN, setShippingFeeGHN] = useState<number | null>(null)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
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
      shippingMethod: '',
    },
  })

  const formProvince = watch('province')
  const formDistrict = watch('district')
  const formWard = watch('ward')
  const formShippingMethod = watch('shippingMethod')

  let comboImages: { image_cloud: string; image_custom: string }[] = []
  try {
    comboImages = JSON.parse(inforCombo.fcb_image || '[]')
    if (!Array.isArray(comboImages)) {
      comboImages = [comboImages]
    }
  } catch (error) {
    console.error('Error parsing combo images:', error)
    comboImages = []
  }

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
        headers: { Token: '3b43de66-111c-11f0-8686-8669292be81e' },
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
          headers: { Token: '3b43de66-111c-11f0-8686-8669292be81e' },
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
            headers: { Token: '3b43de66-111c-11f0-8686-8669292be81e' },
          }
        )
        const data = await response.json()
        setWards(data.data)
        setValue('ward', '')
      }
      fetchWards()
    }
  }, [formDistrict, setValue])

  const calculateShippingFee = useCallback(async () => {
    if (!formProvince || !formDistrict || !formWard || !formShippingMethod) return

    const provinceName = provinces.find((p) => p.ProvinceID === parseInt(formProvince))?.ProvinceName
    const districtName = districts.find((d) => d.DistrictID === parseInt(formDistrict))?.DistrictName

    // GHTK Shipping Fee
    const ghtkRequestBody = {
      pick_province: restaurant.restaurant_address.address_province.name,
      pick_district: restaurant.restaurant_address.address_district.name,
      province: provinceName,
      district: districtName,
      address: '',
      weight: 1000,
      value: totalPrice,
      transport: formShippingMethod === 'standard' ? 'road' : 'fly',
      deliver_option: 'none',
      tags: [1],
    }

    try {
      const ghtkData = await calcPriceShipingGHTK(ghtkRequestBody)
      if (ghtkData.success) {
        setShippingFeeGHTK(ghtkData.fee.fee)
      } else {
        setShippingFeeGHTK(null)
      }
    } catch (error) {
      console.error('Lỗi khi tính phí GHTK:', error)
      setShippingFeeGHTK(null)
    }

    // GHN Shipping Fee
    const ghnRequestBody = {
      from_district_id: restaurant.restaurant_address.address_district.id, // Assuming id is available
      to_district_id: parseInt(formDistrict),
      to_ward_code: formWard,
      service_type_id: formShippingMethod === 'standard' ? 2 : 1, // Adjust based on your API
      weight: 1000,
      length: 20,
      width: 20,
      height: 10,
      insurance_value: totalPrice,
    }

    try {
      const ghnData = await calcPriceShippingGHN(ghnRequestBody)
      if (ghnData.code === 200) {
        setShippingFeeGHN(ghnData.data.total)
      } else {
        setShippingFeeGHN(null)
      }
    } catch (error) {
      console.error('Lỗi khi tính phí GHN:', error)
      setShippingFeeGHN(null)
    }
  }, [formProvince, formDistrict, formWard, formShippingMethod, totalPrice, provinces, districts, restaurant])

  useEffect(() => {
    if (formProvince && formDistrict && formWard && formShippingMethod) {
      calculateShippingFee()
    }
  }, [formProvince, formDistrict, formWard, formShippingMethod, calculateShippingFee])
  const onSubmit = async (data: FormData) => {
    try {
      const provinceName = provinces.find((p) => p.ProvinceID === parseInt(data.province))?.ProvinceName
      const districtName = districts.find((d) => d.DistrictID === parseInt(data.district))?.DistrictName
      const wardName = wards.find((w) => w.WardCode === data.ward)?.WardName
      const payload: CreateOrderFoodCombo = {
        od_cb_link_confirm: `${process.env.NEXT_PUBLIC_URL_CLIENT}/xac-nhan-dat-combo`,
        od_cb_price_shipping: (shippingFeeGHN ? shippingFeeGHN : shippingFeeGHTK) || 0,
        od_cb_type_shipping: shippingFeeGHN ? 'GHN' : 'GHTK',
        od_cb_user_id: 0,
        od_cb_user_name: data.customerName,
        od_cb_user_phone: data.phone,
        od_cb_user_email: data.email,
        od_cb_user_address: data.addressDetail,
        od_cb_user_province: provinceName || '',
        od_cb_user_district: districtName || '',
        od_cb_user_ward: wardName || '',
        od_cb_user_note: data.note,
        order_food_combo_items: [{
          fcb_id: inforCombo.fcb_id,
          fcbi_combo: inforCombo.fcbi_combo.map((item) => item.fcbi_id),
          od_cb_it_quantity: quantity,
        }],
        od_cb_res_id: inforCombo.fcb_res_id,
      }

      const res: IBackendRes<IOrderFoodCombo> = await createOrderFoodCombo(payload)

      if (res.statusCode === 201 || res.statusCode === 200) {
        toast({
          title: 'Thành công',
          description: 'Đặt combo thành công, vui lòng xác nhận qua email của bạn.',
          variant: 'default'
        })
        router.push('/combo-da-dat')
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
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Đặt hàng: {inforCombo.fcb_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {comboImages.length > 0 ? (
            <div className="relative w-full h-64">
              <Image
                src={comboImages[0].image_custom}
                alt={inforCombo.fcb_name}
                fill
                className="object-cover rounded-md"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md">
              <span className="text-gray-500">Không có hình ảnh</span>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Giá combo:</span>
              <span>{inforCombo.fcb_price.toLocaleString('vi-VN')} VNĐ</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Số lượng:</span>
              <Badge variant="outline">{quantity}</Badge>
            </div>
          </div>
          {inforCombo.fcbi_combo && inforCombo.fcbi_combo.length > 0 && (
            <div className="space-y-2">
              <Label className="font-semibold">Món ăn trong combo:</Label>
              <ul className="list-disc pl-5 space-y-1">
                {inforCombo.fcbi_combo.map((item) => {
                  let foodImages: { image_cloud: string; image_custom: string }[] = []
                  try {
                    foodImages = JSON.parse(item.fcbi_food.food_image || '[]')
                    if (!Array.isArray(foodImages)) {
                      foodImages = [foodImages]
                    }
                  } catch (error) {
                    console.error(`Error parsing food images for ${item.fcbi_food.food_name}:`, error)
                    foodImages = []
                  }

                  return (
                    <li key={item.fcbi_id} className="flex items-center gap-2">
                      {foodImages.length > 0 ? (
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <Image
                            src={foodImages[0].image_custom}
                            alt={item.fcbi_food.food_name}
                            fill
                            className="object-cover rounded-sm"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-sm flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-gray-500">N/A</span>
                        </div>
                      )}
                      <span>
                        {item.fcbi_food.food_name} (x{item.fcbi_quantity})
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold">
            <span>Tổng cộng:</span>
            <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="customerName">Họ và tên</Label>
              <Input id="customerName" placeholder="Nhập họ và tên" {...register('customerName')} />
              {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" type="tel" placeholder="Nhập số điện thoại" {...register('phone')} />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Nhập email" {...register('email')} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="province">Tỉnh/Thành</Label>
              <Select onValueChange={(value) => setValue('province', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tỉnh/thành" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.ProvinceID} value={province.ProvinceID.toString()}>
                      {province.ProvinceName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>}
            </div>

            <div>
              <Label htmlFor="district">Quận/Huyện</Label>
              <Select onValueChange={(value) => setValue('district', value)} disabled={!formProvince}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.DistrictID} value={district.DistrictID.toString()}>
                      {district.DistrictName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
            </div>

            <div>
              <Label htmlFor="ward">Phường/Xã</Label>
              <Select onValueChange={(value) => setValue('ward', value)} disabled={!formDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phường/xã" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((ward) => (
                    <SelectItem key={ward.WardCode} value={ward.WardCode}>
                      {ward.WardName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ward && <p className="text-red-500 text-sm mt-1">{errors.ward.message}</p>}
            </div>

            <div>
              <Label htmlFor="addressDetail">Địa chỉ chi tiết</Label>
              <Input id="addressDetail" placeholder="Số nhà, tên đường..." {...register('addressDetail')} />
              {errors.addressDetail && <p className="text-red-500 text-sm mt-1">{errors.addressDetail.message}</p>}
            </div>

            <div>
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea id="note" placeholder="Ghi chú thêm (nếu có)" {...register('note')} />
            </div>

            <div>
              <Label htmlFor="shippingMethod">Phương thức giao hàng</Label>
              <Select onValueChange={(value) => setValue('shippingMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phương thức giao hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Giao hàng tiêu chuẩn</SelectItem>
                  <SelectItem value="express">Giao hàng nhanh</SelectItem>
                </SelectContent>
              </Select>
              {errors.shippingMethod && <p className="text-red-500 text-sm mt-1">{errors.shippingMethod.message}</p>}
            </div>

            {(shippingFeeGHN !== null || shippingFeeGHTK !== null) && (
              <div className="space-y-2">
                {shippingFeeGHTK !== null && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Phí giao hàng:</span>
                    <span>{shippingFeeGHTK.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                )}
                {shippingFeeGHN !== null && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Phí giao hàng GHN:</span>
                    <span>{shippingFeeGHN.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                )}
                {/* <div className="flex justify-between font-semibold">
                  <span>Phí giao hàng (thấp nhất):</span>
                  <span>
                    {Math.min(shippingFeeGHN || Infinity, shippingFeeGHTK || Infinity).toLocaleString('vi-VN')} VNĐ
                  </span>
                </div> */}
              </div>
            )}
            {(shippingFeeGHN !== null || shippingFeeGHTK !== null) && (
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng (bao gồm phí giao):</span>
                <span>
                  {(totalPrice + Math.min(shippingFeeGHN || Infinity, shippingFeeGHTK || Infinity)).toLocaleString(
                    'vi-VN'
                  )}{' '}
                  VNĐ
                </span>
              </div>
            )}

            <Button type="submit" className="w-full">
              Xác nhận đặt hàng
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}