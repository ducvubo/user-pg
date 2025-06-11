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
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Plus, X, CalendarIcon } from 'lucide-react';
import { IRoom } from '@/app/nha-hang/api';
import { IRestaurant } from '@/app/interface/restaurant.interface';
import { createBookRoom, IAmenity, ICreateBookRoomDto, IMenuItem } from '../book.room.api';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IBookRoom } from '@/app/phong-da-dat/book.room.interface';

// Thành phần DateTimePicker24h
function DateTimePicker24h({ value, onChange }: { value?: Date; onChange: (date: Date | undefined) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      if (value) {
        selectedDate.setHours(value.getHours());
        selectedDate.setMinutes(value.getMinutes());
      }
      onChange(selectedDate);
    }
  };

  const handleTimeChange = (type: "hour" | "minute", timeValue: string) => {
    const currentDate = value ? new Date(value) : new Date();
    if (type === "hour") {
      currentDate.setHours(parseInt(timeValue));
    } else if (type === "minute") {
      currentDate.setMinutes(parseInt(timeValue));
    }
    onChange(currentDate);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "MM/dd/yyyy HH:mm") : <span>MM/DD/YYYY hh:mm</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={value && value.getHours() === hour ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={value && value.getMinutes() === minute ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("minute", minute.toString())}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Schema cho form
const formSchema = z.object({
  customerName: z.string().min(1, 'Họ và tên không được để trống'),
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 chữ số').regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số'),
  email: z.string().email('Email không hợp lệ').min(1, 'Email không được để trống'),
  note: z.string().optional(),
  bkr_time_start: z.date({ required_error: 'Thời gian bắt đầu không được để trống' }),
  bkr_time_end: z.date({ required_error: 'Thời gian kết thúc không được để trống' }),
}).refine((data) => data.bkr_time_end > data.bkr_time_start, {
  message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
  path: ['bkr_time_end'],
});

type FormData = z.infer<typeof formSchema>;

interface TableRow {
  id: string; // UUID cho dòng
  selectedId: string; // ID của amenity hoặc menuItem
  type: 'amenity' | 'menuItem' | '';
  quantity: number;
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

  const generateUUID = () => crypto.randomUUID();

  // State cho bảng tiện ích
  const initialAmenityRows: TableRow[] = [
    { id: generateUUID(), selectedId: '', type: '', quantity: 1 },
  ];
  const [amenityRows, setAmenityRows] = useState<TableRow[]>(initialAmenityRows);

  // State cho bảng món ăn
  const initialMenuItemRows: TableRow[] = [
    { id: generateUUID(), selectedId: '', type: '', quantity: 1 },
  ];
  const [menuItemRows, setMenuItemRows] = useState<TableRow[]>(initialMenuItemRows);

  const amenitiesToUse = listAmenity.length > 0 ? listAmenity : [];
  const menuItemsToUse = listMenuItems.length > 0 ? listMenuItems : [];

  // State để quản lý trạng thái mở của Combobox
  const [openAmenity, setOpenAmenity] = useState<{ [key: string]: boolean }>({});
  const [openMenuItem, setOpenMenuItem] = useState<{ [key: string]: boolean }>({});

  // State cho thời gian bắt đầu và kết thúc
  const [bkrTimeStart, setBkrTimeStart] = useState<Date | undefined>(undefined);
  const [bkrTimeEnd, setBkrTimeEnd] = useState<Date | undefined>(undefined);

  // Xử lý chọn mục (chung cho cả hai bảng)
  const handleSelectItem = (
    rowId: string,
    value: string,
    setRows: React.Dispatch<React.SetStateAction<TableRow[]>>,
    type: 'amenity' | 'menuItem',
    setOpen: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
  ) => {
    const [_, id] = value.split(':');
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, selectedId: id, type } : row
      )
    );
    setOpen((prev) => ({ ...prev, [rowId]: false }));
  };

  // Xử lý thay đổi số lượng (chung cho cả hai bảng)
  const handleQuantityChange = (
    rowId: string,
    quantity: number,
    setRows: React.Dispatch<React.SetStateAction<TableRow[]>>
  ) => {
    if (quantity < 1) return;
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, quantity } : row
      )
    );
  };

  // Xử lý thêm dòng (chung cho cả hai bảng)
  const handleAddRow = (setRows: React.Dispatch<React.SetStateAction<TableRow[]>>) => {
    setRows((prev) => [
      ...prev,
      { id: generateUUID(), selectedId: '', type: '', quantity: 1 },
    ]);
  };

  // Xử lý xóa dòng (chung cho cả hai bảng)
  const handleRemoveRow = (
    rowId: string,
    setRows: React.Dispatch<React.SetStateAction<TableRow[]>>,
    rows: TableRow[]
  ) => {
    setRows((prev) => prev.filter((row) => row.id !== rowId));
    if (rows.length === 1) {
      setRows([{ id: generateUUID(), selectedId: '', type: '', quantity: 1 }]);
    }
  };

  // Tính giá cho một dòng
  const getRowPrice = (row: TableRow) => {
    if (!row.selectedId || !row.type) return 0;
    if (row.type === 'amenity') {
      const amenity = amenitiesToUse.find((a) => a.ame_id === row.selectedId);
      return amenity ? amenity.ame_price : 0;
    } else {
      const menuItem = menuItemsToUse.find((m) => m.mitems_id === row.selectedId);
      return menuItem ? Number(menuItem.mitems_price) : 0;
    }
  };

  // Tính tổng tiền cho một dòng
  const getRowTotal = (row: TableRow) => {
    return getRowPrice(row) * row.quantity;
  };

  // Lấy tên hiển thị cho Combobox
  const getDisplayName = (row: TableRow) => {
    if (!row.selectedId || !row.type) return '';
    if (row.type === 'amenity') {
      const amenity = amenitiesToUse.find((a) => a.ame_id === row.selectedId);
      return amenity ? amenity.ame_name : '';
    } else {
      const menuItem = menuItemsToUse.find((m) => m.mitems_id === row.selectedId);
      return menuItem ? menuItem.mitems_name : '';
    }
  };

  // Tính tổng giá tiện ích
  const amenitiesPrice = amenityRows
    .filter((row) => row.type === 'amenity' && row.selectedId)
    .reduce((sum, row) => {
      const amenity = amenitiesToUse.find((a) => a.ame_id === row.selectedId);
      return sum + (amenity ? amenity.ame_price * row.quantity : 0);
    }, 0);

  // Tính tổng giá món ăn
  const menuItemsPrice = menuItemRows
    .filter((row) => row.type === 'menuItem' && row.selectedId)
    .reduce((sum, row) => {
      const menuItem = menuItemsToUse.find((m) => m.mitems_id === row.selectedId);
      return sum + (menuItem ? Number(menuItem.mitems_price) * row.quantity : 0);
    }, 0);

  const totalPrice = basePrice + amenitiesPrice + menuItemsPrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      phone: '',
      email: '',
      note: '',
      bkr_time_start: undefined,
      bkr_time_end: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const payload: ICreateBookRoomDto = {
        bkr_res_id: restaurant._id,
        bkr_ame: data.customerName,
        bkr_email: data.email,
        bkr_note: data.note,
        bkr_phone: data.phone,
        bkr_time_start: data.bkr_time_start,
        bkr_time_end: data.bkr_time_end,
        amenities: amenityRows
          .filter((row) => row.type === 'amenity' && row.selectedId)
          .map((row) => ({
            amenity_id: row.selectedId,
            bkr_amenity_quantity: row.quantity,
          })),
        menu_items: menuItemRows
          .filter((row) => row.type === 'menuItem' && row.selectedId)
          .map((row) => ({
            menu_id: row.selectedId,
            bkr_menu_quantity: row.quantity,
          })),
        bkr_link_confirm: `${process.env.NEXT_PUBLIC_URL_CLIENT}/xac-nhan-dat-phong`,
      };

      const res: IBackendRes<IBookRoom> = await createBookRoom(payload);
      console.log("🚀 ~ onSubmit ~ res:", res)
      if (res.statusCode === 201 || res.statusCode === 200) {
        toast({
          title: 'Thành công',
          description: 'Đặt phòng thành công!',
          variant: 'default'
        });
        router.push('/phong-da-dat');
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
          description: 'Đặt phòng thất bại',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Lỗi khi gửi form:', error)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
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
              <span className="font-semibold">Giá cọc:</span>
              <span>{formatPrice(roomRes.room_deposit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Giá phòng:</span>
              <span>{formatPrice(basePrice)}</span>
            </div>

          </div>

          {/* Bảng tiện ích */}
          <div className="space-y-2">
            <Label className="font-semibold">Tiện ích:</Label>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Chọn tiện ích</th>
                    <th className="border p-2 text-left hidden sm:table-cell">Giá</th>
                    <th className="border p-2 text-left">Số lượng</th>
                    <th className="border p-2 text-left hidden sm:table-cell">Tổng tiền</th>
                    <th className="border p-2 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {amenityRows.map((row) => (
                    <tr key={row.id} className="border">
                      <td className="border p-2">
                        <Popover
                          open={openAmenity[row.id] || false}
                          onOpenChange={(open) =>
                            setOpenAmenity((prev) => ({ ...prev, [row.id]: open }))
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] sm:w-[200px] justify-between",
                                !row.selectedId && "text-muted-foreground"
                              )}
                            >
                              {row.selectedId ? getDisplayName(row) : "Chọn tiện ích"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] sm:w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Tìm tiện ích..." />
                              <CommandEmpty>Không tìm thấy tiện ích.</CommandEmpty>
                              <CommandGroup>
                                {amenitiesToUse.map((amenity) => (
                                  <CommandItem
                                    key={`amenity-${amenity.ame_id}`}
                                    value={amenity.ame_name}
                                    onSelect={() => {
                                      handleSelectItem(
                                        row.id,
                                        `amenity:${amenity.ame_id}`,
                                        setAmenityRows,
                                        'amenity',
                                        setOpenAmenity
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        row.selectedId === amenity.ame_id ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {amenity.ame_name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </td>
                      <td className="border p-2 hidden sm:table-cell">{formatPrice(getRowPrice(row))}</td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          min="1"
                          value={row.quantity}
                          onChange={(e) => handleQuantityChange(row.id, Number(e.target.value), setAmenityRows)}
                          className="w-20"
                          disabled={!row.selectedId}
                        />
                      </td>
                      <td className="border p-2 hidden sm:table-cell">{formatPrice(getRowTotal(row))}</td>
                      <td className="border p-2 flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAddRow(setAmenityRows)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        {amenityRows.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveRow(row.id, setAmenityRows, amenityRows)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bảng món ăn */}
          <div className="space-y-2">
            <Label className="font-semibold">Món ăn:</Label>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Chọn món ăn</th>
                    <th className="border p-2 text-left hidden sm:table-cell">Giá</th>
                    <th className="border p-2 text-left">Số lượng</th>
                    <th className="border p-2 text-left hidden sm:table-cell">Tổng tiền</th>
                    <th className="border p-2 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItemRows.map((row) => (
                    <tr key={row.id} className="border">
                      <td className="border p-2">
                        <Popover
                          open={openMenuItem[row.id] || false}
                          onOpenChange={(open) =>
                            setOpenMenuItem((prev) => ({ ...prev, [row.id]: open }))
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] sm:w-[200px] justify-between",
                                !row.selectedId && "text-muted-foreground"
                              )}
                            >
                              {row.selectedId ? getDisplayName(row) : "Chọn món ăn"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] sm:w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Tìm món ăn..." />
                              <CommandEmpty>Không tìm thấy món ăn.</CommandEmpty>
                              <CommandGroup>
                                {menuItemsToUse.map((menuItem) => (
                                  <CommandItem
                                    key={`menuItem-${menuItem.mitems_id}`}
                                    value={menuItem.mitems_name}
                                    onSelect={() => {
                                      handleSelectItem(
                                        row.id,
                                        `menuItem:${menuItem.mitems_id}`,
                                        setMenuItemRows,
                                        'menuItem',
                                        setOpenMenuItem
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        row.selectedId === menuItem.mitems_id ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {menuItem.mitems_name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </td>
                      <td className="border p-2 hidden sm:table-cell">{formatPrice(getRowPrice(row))}</td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          min="1"
                          value={row.quantity}
                          onChange={(e) => handleQuantityChange(row.id, Number(e.target.value), setMenuItemRows)}
                          className="w-20"
                          disabled={!row.selectedId}
                        />
                      </td>
                      <td className="border p-2 hidden sm:table-cell">{formatPrice(getRowTotal(row))}</td>
                      <td className="border p-2 flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAddRow(setMenuItemRows)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        {menuItemRows.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveRow(row.id, setMenuItemRows, menuItemRows)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hiển thị tổng giá */}
          {(amenityRows.some((row) => row.selectedId) || menuItemRows.some((row) => row.selectedId)) && (
            <div className="space-y-2 mt-4">
              {amenitiesPrice > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold">Tổng giá tiện ích:</span>
                  <span>{formatPrice(amenitiesPrice)}</span>
                </div>
              )}
              {menuItemsPrice > 0 && (
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
              <Label htmlFor="bkr_time_start">Thời gian bắt đầu</Label>
              <DateTimePicker24h
                value={bkrTimeStart}
                onChange={(date) => {
                  setBkrTimeStart(date);
                  setValue('bkr_time_start', date!, { shouldValidate: true });
                }}
              />
              {errors.bkr_time_start && (
                <p className="text-red-500 text-sm mt-1">{errors.bkr_time_start.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="bkr_time_end">Thời gian kết thúc</Label>
              <DateTimePicker24h
                value={bkrTimeEnd}
                onChange={(date) => {
                  setBkrTimeEnd(date);
                  setValue('bkr_time_end', date!, { shouldValidate: true });
                }}
              />
              {errors.bkr_time_end && (
                <p className="text-red-500 text-sm mt-1">{errors.bkr_time_end.message}</p>
              )}
            </div>
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