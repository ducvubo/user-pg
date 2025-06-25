'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
import { IComboFood } from '@/app/nha-hang/_component/ComboList'
import { IRestaurant } from '@/app/interface/restaurant.interface'
import { calcPriceShipingGHTK, calcPriceShippingGHN, createOrderFood } from '@/app/dat-mon-an/order.food.api'
import { CreateOrderFoodDto, IOrderFood } from '../../dat-mon-an/order.food.interface'
import { CreateOrderFoodCombo, IOrderFoodCombo } from '../../dat-combo-mon-an/order.combo.interface'
import { createOrderFoodCombo } from '../../dat-combo-mon-an/order.combo.api'

// Extend IFoodRestaurant to include quantity and selected_options
interface CartFoodItem extends IFoodRestaurant {
  quantity: number
  selected_options: string[]
}

// Extend IComboFood to include quantity
interface CartComboItem extends IComboFood {
  quantity: number
}

interface CheckoutFormProps {
  foodItems: CartFoodItem[]
  comboItems: CartComboItem[]
  restaurants: IRestaurant[]
}

// Định nghĩa schema cho form
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

export default function CheckoutForm({ foodItems, comboItems, restaurants }: CheckoutFormProps) {
  const router = useRouter()
  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [shippingFeeGHTK, setShippingFeeGHTK] = useState<{ [key: string]: number }>({})
  const [shippingFeeGHN, setShippingFeeGHN] = useState<{ [key: string]: number }>({})

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

  // Tính tổng giá tiền của từng nhà hàng
  const calculateTotalByRestaurant = () => {
    const totals: { [key: string]: number } = {}

    // Tổng giá cho món ăn
    foodItems.forEach((food) => {
      const resId = food.food_res_id
      const foodPrice = food.food_price * food.quantity
      const optionsPrice = food.fopt_food?.reduce((optSum, opt) => {
        if (food.selected_options?.includes(opt.fopt_id)) {
          return optSum + (opt.fopt_price || 0)
        }
        return optSum
      }, 0) || 0
      const totalFoodPrice = foodPrice + optionsPrice * food.quantity
      totals[resId] = (totals[resId] || 0) + totalFoodPrice
    })

    // Tổng giá cho combo
    comboItems.forEach((combo) => {
      const resId = combo.fcb_res_id
      const totalComboPrice = combo.fcb_price * combo.quantity
      totals[resId] = (totals[resId] || 0) + totalComboPrice
    })

    return totals
  }

  const totalsByRestaurant = calculateTotalByRestaurant()

  // Tính tổng giá toàn bộ (không bao gồm phí ship)
  const calculateSubTotal = () => {
    return Object.values(totalsByRestaurant).reduce((sum, total) => sum + total, 0)
  }

  // Tính tổng phí ship
  const calculateShippingTotal = () => {
    return Object.values(shippingFeeGHTK).reduce((sum, fee) => sum + (fee || 0), 0) // Sử dụng GHTK làm mặc định
  }

  // Tính tổng giá cuối cùng (bao gồm phí ship)
  const calculateGrandTotal = () => {
    return calculateSubTotal() + calculateShippingTotal()
  }

  // Fetch danh sách tỉnh/thành
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

  // Fetch danh sách quận/huyện
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

  // Fetch danh sách phường/xã
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

  // Tính phí ship cho từng nhà hàng
  const calculateShippingFee = useCallback(async () => {
    if (!formProvince || !formDistrict || !formWard || !formShippingMethod) return

    const provinceName = provinces.find((p) => p.ProvinceID === parseInt(formProvince))?.ProvinceName
    const districtName = districts.find((d) => d.DistrictID === parseInt(formDistrict))?.DistrictName

    // Nhóm món ăn và combo theo nhà hàng
    const restaurantGroups: { [key: string]: { foods: CartFoodItem[]; combos: CartComboItem[] } } = {}

    foodItems.forEach((food) => {
      const resId = food.food_res_id
      if (!restaurantGroups[resId]) {
        restaurantGroups[resId] = { foods: [], combos: [] }
      }
      restaurantGroups[resId].foods.push(food)
    })

    comboItems.forEach((combo) => {
      const resId = combo.fcb_res_id
      if (!restaurantGroups[resId]) {
        restaurantGroups[resId] = { foods: [], combos: [] }
      }
      restaurantGroups[resId].combos.push(combo)
    })

    const ghtkFees: { [key: string]: number } = {}
    const ghnFees: { [key: string]: number } = {}

    for (const resId in restaurantGroups) {
      const group = restaurantGroups[resId]
      const totalPriceForRes = totalsByRestaurant[resId] || 0

      // Tìm thông tin nhà hàng
      const restaurant = restaurants.find((res) => res._id === resId)
      if (!restaurant || !restaurant.restaurant_address) continue

      // GHTK Shipping Fee
      const ghtkRequestBody = {
        pick_province: restaurant.restaurant_address.address_province?.name || '',
        pick_district: restaurant.restaurant_address.address_district?.name || '',
        province: provinceName,
        district: districtName,
        address: '',
        weight: 1000, // Giả định trọng lượng mặc định
        value: totalPriceForRes,
        transport: formShippingMethod === 'standard' ? 'road' : 'fly',
        deliver_option: 'none',
        tags: [1],
      }

      try {
        const ghtkData = await calcPriceShipingGHTK(ghtkRequestBody)
        if (ghtkData.success) {
          ghtkFees[resId] = ghtkData.fee.fee
        } else {
          ghtkFees[resId] = 0
        }
      } catch (error) {
        console.error(`Lỗi khi tính phí GHTK cho nhà hàng ${resId}:`, error)
        ghtkFees[resId] = 0
      }

      // GHN Shipping Fee
      const ghnRequestBody = {
        from_district_id: restaurant.restaurant_address.address_district?.id || 0,
        to_district_id: parseInt(formDistrict),
        to_ward_code: formWard,
        service_type_id: formShippingMethod === 'standard' ? 2 : 1,
        weight: 1000,
        length: 20,
        width: 20,
        height: 10,
        insurance_value: totalPriceForRes,
      }

      try {
        const ghnData = await calcPriceShippingGHN(ghnRequestBody)
        if (ghnData.code === 200) {
          ghnFees[resId] = ghnData.data.total
        } else {
          ghnFees[resId] = 0
        }
      } catch (error) {
        console.error(`Lỗi khi tính phí GHN cho nhà hàng ${resId}:`, error)
        ghnFees[resId] = 0
      }
    }

    setShippingFeeGHTK(ghtkFees)
    setShippingFeeGHN(ghnFees)
  }, [formProvince, formDistrict, formWard, formShippingMethod, foodItems, comboItems, restaurants, provinces, districts])

  useEffect(() => {
    if (formProvince && formDistrict && formWard && formShippingMethod) {
      calculateShippingFee()
    }
  }, [formProvince, formDistrict, formWard, formShippingMethod, calculateShippingFee])

  // Xử lý gửi form
  const onSubmit = async (data: FormData) => {
    try {
      const provinceName = provinces.find((p) => p.ProvinceID === parseInt(data.province))?.ProvinceName
      const districtName = districts.find((d) => d.DistrictID === parseInt(data.district))?.DistrictName
      const wardName = wards.find((w) => w.WardCode === data.ward)?.WardName

      // Nhóm món ăn theo nhà hàng
      const foodOrdersByRestaurant: { [key: string]: CartFoodItem[] } = {}
      foodItems.forEach((food) => {
        const resId = food.food_res_id
        if (!foodOrdersByRestaurant[resId]) {
          foodOrdersByRestaurant[resId] = []
        }
        foodOrdersByRestaurant[resId].push(food)
      })

      // Nhóm combo theo nhà hàng
      const comboOrdersByRestaurant: { [key: string]: CartComboItem[] } = {}
      comboItems.forEach((combo) => {
        const resId = combo.fcb_res_id
        if (!comboOrdersByRestaurant[resId]) {
          comboOrdersByRestaurant[resId] = []
        }
        comboOrdersByRestaurant[resId].push(combo)
      })

      // Tạo mảng orderFoods
      const orderFoods: CreateOrderFoodDto[] = []
      for (const resId in foodOrdersByRestaurant) {
        const foods = foodOrdersByRestaurant[resId]
        const orderFood: CreateOrderFoodDto = {
          od_link_confirm: `${process.env.NEXT_PUBLIC_URL_CLIENT}/xac-nhan-dat-mon-an`,
          od_price_shipping: Math.floor((shippingFeeGHN[resId] || shippingFeeGHTK[resId]) / 2) || 0,
          od_type_shipping: shippingFeeGHN[resId] ? 'GHN' : 'GHTK',
          od_user_id: 0,
          od_user_name: data.customerName,
          od_user_phone: data.phone,
          od_user_email: data.email,
          od_user_address: data.addressDetail,
          od_user_province: provinceName || '',
          od_user_district: districtName || '',
          od_user_ward: wardName || '',
          od_user_note: data.note,
          order_food_items: foods.map((food) => ({
            food_id: food.food_id,
            od_it_quantity: food.quantity,
            food_options: food.selected_options,
          })),
          od_res_id: resId,
        }
        orderFoods.push(orderFood)
      }

      // Tạo mảng orderCombos
      const orderCombos: CreateOrderFoodCombo[] = []
      for (const resId in comboOrdersByRestaurant) {
        const combos = comboOrdersByRestaurant[resId]
        const orderCombo: CreateOrderFoodCombo = {
          od_cb_link_confirm: `${process.env.NEXT_PUBLIC_URL_CLIENT}/xac-nhan-dat-combo`,
          od_cb_price_shipping: Math.floor((shippingFeeGHN[resId] || shippingFeeGHTK[resId]) / 2) || 0,
          od_cb_type_shipping: shippingFeeGHN[resId] ? 'GHN' : 'GHTK',
          od_cb_user_id: 0,
          od_cb_user_name: data.customerName,
          od_cb_user_phone: data.phone,
          od_cb_user_email: data.email,
          od_cb_user_address: data.addressDetail,
          od_cb_user_province: provinceName || '',
          od_cb_user_district: districtName || '',
          od_cb_user_ward: wardName || '',
          od_cb_user_note: data.note,
          order_food_combo_items: combos.map((combo) => ({
            fcb_id: combo.fcb_id,
            fcbi_combo: combo.fcbi_combo.map((item) => item.fcbi_id),
            od_cb_it_quantity: combo.quantity,
          })),
          od_cb_res_id: resId,
        }
        orderCombos.push(orderCombo)
      }

      console.log('orderFoods:', orderFoods)
      console.log('orderCombos:', orderCombos);


      const foodPromises = orderFoods.map(async (order) => {
        const res: IBackendRes<IOrderFood> = await createOrderFood(order)
        return { type: 'food', res, resId: order.od_res_id }
      })

      const comboPromises = orderCombos.map(async (order) => {
        const res: IBackendRes<IOrderFoodCombo> = await createOrderFoodCombo(order)
        return { type: 'combo', res, resId: order.od_cb_res_id }
      })

      const results = await Promise.all([...foodPromises, ...comboPromises])

      // Kiểm tra kết quả
      const errors: string[] = []
      results.forEach(({ type, res, resId }) => {
        console.log("🚀 ~ results.forEach ~ res:", res)
        const restaurant = restaurants.find((res) => res._id === resId)
        const restaurantName = restaurant?.restaurant_name || `Nhà hàng ${resId}`

        if (res.statusCode === 201 || res.statusCode === 200) {
          toast({
            title: 'Thành công',
            description: `Đặt ${type === 'food' ? 'món ăn' : 'combo'} từ ${restaurantName} thành công, vui lòng xác nhận qua email của bạn.`,
            variant: 'default',
          })
        } else if (res.statusCode === 400 && res.message) {
          if (Array.isArray(res.message)) {
            res.message.forEach((item: string) => {
              errors.push(`${restaurantName}: ${item}`)
            })
          } else {
            errors.push(`${restaurantName}: ${res.message}`)
          }
        } else {
          errors.push(`${restaurantName}: Đặt ${type === 'food' ? 'món ăn' : 'combo'} thất bại`)
        }
      })

      // Hiển thị thông báo lỗi nếu có
      if (errors.length > 0) {
        errors.forEach((error) => {
          toast({
            title: 'Thất bại',
            description: error,
            variant: 'destructive',
          })
        })
      }

      // Nếu không có lỗi, chuyển hướng đến trang đơn hàng đã đặt
      if (errors.length === 0) {
        router.push('/mon-an-da-dat')
      }
    } catch (error) {
      console.error('Lỗi khi gửi form:', error)
      toast({
        title: 'Thất bại',
        description: 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="mt-6">
      <CardContent className="space-y-6 pt-6">
        <h2 className="text-xl font-semibold">Thông tin giao hàng</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label className="font-semibold">Họ và tên</Label>
            <Input placeholder="Nhập họ và tên" {...register('customerName')} />
            {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>}
          </div>
          <div>
            <Label className="font-semibold">Số điện thoại</Label>
            <Input type="tel" placeholder="Nhập số điện thoại" {...register('phone')} />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <Label className="font-semibold">Email</Label>
            <Input type="email" placeholder="Nhập email" {...register('email')} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label className="font-semibold">Tỉnh/Thành</Label>
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
            <Label className="font-semibold">Quận/Huyện</Label>
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
            <Label className="font-semibold">Phường/Xã</Label>
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
            <Label className="font-semibold">Địa chỉ chi tiết</Label>
            <Input placeholder="Số nhà, tên đường..." {...register('addressDetail')} />
            {errors.addressDetail && <p className="text-red-500 text-sm mt-1">{errors.addressDetail.message}</p>}
          </div>
          <div>
            <Label className="font-semibold">Ghi chú</Label>
            <Textarea placeholder="Ghi chú thêm (nếu có)" {...register('note')} />
          </div>
          <div>
            <Label className="font-semibold">Phương thức giao hàng</Label>
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

          {/* Hiển thị tổng tiền hàng và phí ship theo từng nhà hàng */}
          <div className="space-y-4">
            {Object.keys(totalsByRestaurant).map((resId) => {
              const restaurant = restaurants.find((res) => res._id === resId)
              return (
                <div key={resId} className="border-t pt-4">
                  <h3 className="text-lg font-semibold">{restaurant?.restaurant_name || `Nhà hàng ${resId}`}</h3>
                  <div className="flex justify-between mt-2">
                    <span>Tổng tiền hàng:</span>
                    <span>{totalsByRestaurant[resId].toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  {shippingFeeGHTK[resId] !== undefined && (
                    <div className="flex justify-between mt-1">
                      <span>Phí giao hàng (GHTK):</span>
                      <span>{shippingFeeGHTK[resId].toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                  )}
                  {shippingFeeGHN[resId] !== undefined && (
                    <div className="flex justify-between mt-1">
                      <span>Phí giao hàng (GHN):</span>
                      <span>{shippingFeeGHN[resId].toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Tổng cộng */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Tổng tiền hàng:</span>
              <span>{calculateSubTotal().toLocaleString('vi-VN')} VNĐ</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Tổng phí giao hàng:</span>
              <span>{calculateShippingTotal().toLocaleString('vi-VN')} VNĐ</span>
            </div>
            <div className="flex justify-between text-xl font-bold">
              <span>Tổng cộng:</span>
              <span>{calculateGrandTotal().toLocaleString('vi-VN')} VNĐ</span>
            </div>
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            Đặt hàng
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}