'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { IRestaurant } from '@/app/interface/restaurant.interface';
import { IAmenity, IMenuItem } from '../book.room.api';
import { IRoom } from '@/app/nha-hang/api';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { MultiSelect } from '@/components/Multipleselect';

// Định nghĩa schema cho form đặt phòng
const formSchema = z.object({
  customerName: z.string().min(1, 'Họ và tên không được để trống'),
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số'),
  email: z.string().email('Email không hợp lệ').min(1, 'Email không được để trống'),
  note: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// Định nghĩa interface cho đơn đặt phòng
interface IOrderRoom {
  order_id: string;
}

interface IBackendRes<T> {
  statusCode: number;
  message: string | string[];
  data?: T;
}

interface CreateOrderRoomDto {
  od_link_confirm: string;
  od_user_id: number;
  od_user_name: string;
  od_user_phone: string;
  od_user_email: string;
  od_user_note?: string;
  order_room_items: {
    room_id: string;
    amenities: string[];
    menuItems: string[];
  }[];
  od_res_id: string;
}

interface Props {
  roomRes: IRoom;
  restaurant: IRestaurant;
  listAmenity: IAmenity[];
  listMenuItems: IMenuItem[];
}

export default function PageBookRoom({ roomRes, restaurant, listAmenity, listMenuItems }: Props) {
  const router = useRouter();

  const roomImages = JSON.parse(roomRes.room_images || '[]');
  const basePrice = roomRes.room_base_price || 0;

  // State để lưu các tiện ích và món ăn đã chọn
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([]);

  // Chuyển listAmenity thành options cho MultiSelect
  const amenityOptions = listAmenity.map((amenity) => ({
    label: `${amenity.ame_name} (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amenity.ame_price)})`,
    value: amenity.ame_id,
  }));

  // Chuyển listMenuItems thành options cho MultiSelect
  const menuItemOptions = listMenuItems.map((menuItem) => ({
    label: `${menuItem.mitems_name} (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(menuItem.mitems_price))})`,
    value: menuItem.mitems_id,
  }));

  // Tính tổng giá tiện ích bổ sung
  const amenitiesPrice = selectedAmenities.reduce((sum, ameId) => {
    const amenity = listAmenity.find((a) => a.ame_id === ameId);
    return sum + (amenity ? amenity.ame_price : 0);
  }, 0);

  // Tính tổng giá món ăn
  const menuItemsPrice = selectedMenuItems.reduce((sum, itemId) => {
    const menuItem = listMenuItems.find((item) => item.mitems_id === itemId);
    return sum + (menuItem ? Number(menuItem.mitems_price) : 0);
  }, 0);

  const totalPrice = basePrice + amenitiesPrice + menuItemsPrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      phone: '',
      email: '',
      note: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const payload: CreateOrderRoomDto = {
        od_link_confirm: `${process.env.NEXT_PUBLIC_URL_CLIENT}/xac-nhan-dat-phong`,
        od_user_id: 0,
        od_user_name: data.customerName,
        od_user_phone: data.phone,
        od_user_email: data.email,
        od_user_note: data.note,
        order_room_items: [
          {
            room_id: roomRes.room_id,
            amenities: selectedAmenities,
            menuItems: selectedMenuItems,
          },
        ],
        od_res_id: roomRes.room_res_id,
      };


    } catch (error) {
      console.error('Lỗi khi gửi form:', error);
      toast({
        title: 'Thất bại',
        description: 'Có lỗi xảy ra khi đặt phòng',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Đặt phòng: {roomRes.room_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {roomImages.length > 0 && (
            <div className="relative w-full h-64">
              <Image
                src={roomImages[0].image_cloud}
                alt={roomRes.room_name}
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Giá phòng:</span>
              <span>{formatPrice(basePrice)}</span>
            </div>
          </div>

          {/* Tiện ích bổ sung với MultiSelect */}
          {listAmenity.length > 0 && (
            <div className="space-y-2">
              <Label className="font-semibold">Tiện ích bổ sung:</Label>
              <MultiSelect
                options={amenityOptions}
                onValueChange={setSelectedAmenities}
                defaultValue={selectedAmenities}
                placeholder="Chọn tiện ích bổ sung"
                variant="secondary"
                animation={0}
                maxCount={5}
              />
              {selectedAmenities.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold">Tổng giá tiện ích:</span>
                  <span>{formatPrice(amenitiesPrice)}</span>
                </div>
              )}
            </div>
          )}

          {listMenuItems.length > 0 && (
            <div className="space-y-2">
              <Label className="font-semibold">Món ăn:</Label>
              <MultiSelect
                options={menuItemOptions}
                onValueChange={setSelectedMenuItems}
                defaultValue={selectedMenuItems}
                placeholder="Chọn món ăn"
                variant="secondary"
                animation={0}
                maxCount={5}
              />
              {selectedMenuItems.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold">Tổng giá món ăn:</span>
                  <span>{formatPrice(menuItemsPrice)}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between text-lg font-bold">
            <span>Tổng cộng:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="customerName">Họ và tên</Label>
              <Input id="customerName" placeholder="Nhập họ và tên" {...register('customerName')} />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
              )}
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
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea id="note" placeholder="Ghi chú thêm (nếu có)" {...register('note')} />
            </div>

            <Button type="submit" className="w-full">
              Xác nhận đặt phòng
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}