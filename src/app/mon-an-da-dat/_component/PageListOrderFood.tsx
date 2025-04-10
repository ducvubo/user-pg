

// 'use client'

// import React, { useCallback, useEffect, useState } from 'react'
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { CalendarIcon, ChevronDown } from "lucide-react"
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"
// import { getListOrderFood, guestCancelOrderFood, guestComplaintDoneOrderFood, guestComplaintOrderFood, guestFeedbackOrderFood, guestReceiveOrderFood } from '@/app/mon-an-da-dat/list.order.food.api'
// import { IOrderFood } from '@/app/dat-mon-an/order.food.api'
// import { IRestaurant } from '@/app/interface/restaurant.interface'
// import { GetRestaurantByIds } from '@/app/home/home.api'
// import Link from 'next/link'
// import Image from 'next/image'
// import { Textarea } from "@/components/ui/textarea"
// import { toast } from '@/hooks/use-toast' // Assuming you have a toast utility
// import debounce from 'lodash/debounce'
// import { deleteCookiesAndRedirect } from '@/app/actions/action'
// import { useSearchParams } from 'next/navigation'
// import { Calendar } from '@/components/ui/calendar'
// import { Label } from '@/components/ui/label'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { cn } from '@/lib/utils'
// import { addDays } from 'date-fns'
// import { vi } from 'date-fns/locale'
// import { Input } from '@/components/ui/input'
// import { Pagination } from '@/components/Pagination'

// const formatVietnameseDate = (date: Date) => {
//   const day = date.getDate()
//   const month = date.getMonth() + 1
//   const year = date.getFullYear()
//   const hours = String(date.getHours()).padStart(2, '0')
//   const minutes = String(date.getMinutes()).padStart(2, '0')
//   return `${hours}:${minutes} ${day}/${month}/${year}`
// }


// export default function PageListOrderFood() {
//   const [orders, setOrders] = useState<IOrderFood[]>([])
//   const [loading, setLoading] = useState(true)
//   const [listRestaurant, setListRestaurant] = useState<IRestaurant[]>([])
//   const [feedbackContent, setFeedbackContent] = useState<{ [key: string]: string }>({})
//   const [feedbackStar, setFeedbackStar] = useState<{ [key: string]: 1 | 2 | 3 | 4 | 5 }>({})
//   const today = new Date();
//   const defaultToDate = new Date(today.setHours(0, 0, 0, 0));
//   const defaultFromDate = new Date(defaultToDate);
//   defaultFromDate.setDate(defaultFromDate.getDate() + 70);
//   const [toDate, setToDate] = useState<Date>(defaultToDate);
//   const [fromDate, setFromDate] = useState<Date>(defaultFromDate);
//   const [pageIndex, setPageIndex] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [query, setQuery] = useState('');
//   const [status, setStatus] = useState<string>('all');
//   const [meta, setMeta] = useState<{
//     pageIndex: number;
//     pageSize: number;
//     totalPage: number;
//     totalItem: number;
//   }>({
//     pageIndex: 1,
//     pageSize: 10,
//     totalPage: 1,
//     totalItem: 0,
//   });
//   const searchParam = useSearchParams().get('a');

//   const handleSelectFromDate = (date: Date | undefined) => {
//     if (date) {
//       const newDate = new Date(date);
//       newDate.setHours(23);
//       newDate.setMinutes(59);
//       newDate.setSeconds(0);
//       setFromDate(newDate);
//     }
//   };

//   const handleSelectToDate = (date: Date | undefined) => {
//     if (date) {
//       const newDate = new Date(date);
//       newDate.setHours(0);
//       newDate.setMinutes(0);
//       newDate.setSeconds(0);
//       setToDate(newDate);
//     }
//   };

//   const debouncedFindListOrder = useCallback(
//     debounce(() => {
//       fetchOrders();
//     }, 300),
//     [toDate, fromDate, pageIndex, pageSize, query, status]
//   );

//   useEffect(() => {
//     debouncedFindListOrder();
//     return () => {
//       debouncedFindListOrder.cancel();
//     };
//   }, [toDate, fromDate, pageIndex, pageSize, query, status, debouncedFindListOrder]);

//   useEffect(() => {
//     debouncedFindListOrder();
//     return () => {
//       debouncedFindListOrder.cancel();
//     };
//   }, [searchParam]);

//   const fetchOrders = async () => {
//     try {
//       const res: IBackendRes<IModelPaginate<IOrderFood>> = await getListOrderFood({
//         pageSize: pageSize,
//         pageIndex: pageIndex,
//         q: query,
//         status: status,
//         toDate: toDate,
//         fromDate: fromDate,
//       })
//       if (res.statusCode === 200 || res.statusCode === 201) {
//         if (res.data && res.data.result) {
//           setOrders(res.data.result)
//           setMeta({
//             pageIndex: res.data.meta.pageIndex,
//             pageSize: res.data.meta.pageSize,
//             totalPage: res.data.meta.totalPage,
//             totalItem: res.data.meta.totalItem,
//           })
//           setPageIndex(res.data.meta.pageIndex)
//           setPageSize(res.data.meta.pageSize)
//           const listIdRestaurant = res.data.result.map((order) => order.od_res_id)
//           const resRestaurant: IBackendRes<IRestaurant[]> = await GetRestaurantByIds(listIdRestaurant)
//           if (resRestaurant.statusCode === 201 && resRestaurant.data) {
//             setListRestaurant(resRestaurant.data)
//           } else {
//             setListRestaurant([])
//           }
//         } else {
//           setOrders([])
//         }
//       } else {
//         setOrders([])
//       }
//     } catch (error) {
//       console.error('Error fetching orders:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchOrders()
//   }, [])

//   const getStatusVariant = (status: string) => {
//     switch (status) {
//       case 'waiting_confirm_customer':
//         return 'default'
//       case 'over_time_customer':
//         return 'destructive'
//       case 'delivered_customer':
//       case 'received_customer':
//       case 'complaint_done':
//         return 'secondary'
//       default:
//         return 'secondary'
//     }
//   }

//   const getTextStatus = (status: string) => {
//     const statusMap: any = {
//       waiting_confirm_customer: 'Chờ xác nhận từ khách hàng',
//       over_time_customer: 'Quá hạn xác nhận từ khách hàng',
//       waiting_confirm_restaurant: 'Chờ nhà hàng xác nhận',
//       waiting_shipping: 'Chờ giao hàng',
//       shipping: 'Đang giao hàng',
//       delivered_customer: 'Đã giao hàng đến khách hàng',
//       received_customer: 'Khách hàng đã nhận hàng',
//       cancel_customer: 'Khách hàng đã hủy đơn hàng',
//       cancel_restaurant: 'Nhà hàng đã hủy đơn hàng',
//       complaint: 'Khiếu nại',
//       complaint_done: 'Khiếu nại đã giải quyết',
//     }
//     return statusMap[status] || status
//   }

//   // Handle Cancel Order
//   const handleCancelOrder = async (od_id: string, od_res_id: string) => {
//     const res = await guestCancelOrderFood({ od_id, od_res_id });
//     if (res.statusCode === 200) {
//       toast({
//         title: 'Thành công',
//         description: 'Đơn hàng đã được hủy.',
//         variant: 'default',
//       });
//       fetchOrders();
//     } else {
//       toast({
//         title: 'Thất bại',
//         description: res.message || 'Không thể hủy đơn hàng.',
//         variant: 'destructive',
//       });
//     }
//   };

//   // Handle Receive Order
//   const handleReceiveOrder = async (od_id: string, od_res_id: string) => {
//     const res = await guestReceiveOrderFood({ od_id, od_res_id });
//     if (res.statusCode === 200) {
//       toast({
//         title: 'Thành công',
//         description: 'Đã xác nhận nhận hàng.',
//         variant: 'default',
//       });
//       fetchOrders();
//     } else {
//       toast({
//         title: 'Thất bại',
//         description: res.message || 'Không thể xác nhận nhận hàng.',
//         variant: 'destructive',
//       });
//     }
//   };

//   // Handle Complaint
//   const handleComplaint = async (od_id: string, od_res_id: string) => {
//     const res = await guestComplaintOrderFood({ od_id, od_res_id });
//     if (res.statusCode === 200) {
//       toast({
//         title: 'Thành công',
//         description: 'Đã gửi khiếu nại.',
//         variant: 'default',
//       });
//       fetchOrders();
//     } else {
//       toast({
//         title: 'Thất bại',
//         description: res.message || 'Không thể gửi khiếu nại.',
//         variant: 'destructive',
//       });
//     }
//   };

//   // Handle Complaint Done
//   const handleComplaintDone = async (od_id: string, od_res_id: string) => {
//     const res = await guestComplaintDoneOrderFood({ od_id, od_res_id });
//     if (res.statusCode === 200) {
//       toast({
//         title: 'Thành công',
//         description: 'Khiếu nại đã được giải quyết.',
//         variant: 'default',
//       });
//       fetchOrders();
//     } else {
//       toast({
//         title: 'Thất bại',
//         description: res.message || 'Không thể đánh dấu khiếu nại đã giải quyết.',
//         variant: 'destructive',
//       });
//     }
//   };

//   // Handle Feedback
//   const handleFeedback = async (od_id: string, od_res_id: string) => {
//     const content = feedbackContent[od_id] || '';
//     const star = feedbackStar[od_id] || 5;

//     if (!content.trim()) {
//       toast({
//         title: 'Lỗi',
//         description: 'Vui lòng nhập nội dung phản hồi.',
//         variant: 'destructive',
//       });
//       return;
//     }

//     const res = await guestFeedbackOrderFood({ od_id, od_res_id, od_feed_content: content, od_feed_star: star });
//     if (res.statusCode === 200) {
//       toast({
//         title: 'Thành công',
//         description: 'Phản hồi đã được gửi.',
//         variant: 'default',
//       });
//       setFeedbackContent((prev) => ({ ...prev, [od_id]: '' }));
//       setFeedbackStar((prev) => ({ ...prev, [od_id]: 5 }));
//       fetchOrders();
//     } else {
//       toast({
//         title: 'Thất bại',
//         description: res.message || 'Không thể gửi phản hồi.',
//         variant: 'destructive',
//       });
//     }
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>
//   }

//   return (
//     <div className="container px-4 md:px-8 lg:px-[100px] mt-5">
//       <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Danh sách đơn hàng</h1>
//       <div className="flex gap-4 mt-2 flex-wrap">
//         <div className="flex gap-2 items-center">
//           <Label className="mt-2">Từ</Label>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant={'outline'}
//                 className={cn('w-[180px] justify-start text-left font-normal', !toDate && 'text-muted-foreground')}
//               >
//                 <CalendarIcon className="mr-2 h-4 w-4" />
//                 {toDate ? formatVietnameseDate(toDate) : <span>Pick a date</span>}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
//               <Select onValueChange={(value) => handleSelectToDate(addDays(new Date(), parseInt(value)))}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Chọn" />
//                 </SelectTrigger>
//                 <SelectContent position="popper">
//                   <SelectItem value="0">Ngày hôm này</SelectItem>
//                   <SelectItem value="-1">Ngày hôm qua</SelectItem>
//                   <SelectItem value="-3">3 ngày trước</SelectItem>
//                   <SelectItem value="-7">7 ngày trước</SelectItem>
//                 </SelectContent>
//               </Select>
//               <div className="rounded-md border">
//                 <Calendar mode="single" selected={toDate} onSelect={handleSelectToDate} locale={vi} />
//               </div>
//             </PopoverContent>
//           </Popover>
//         </div>

//         <div className="flex gap-2 items-center">
//           <Label className="mt-2">Đến</Label>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant={'outline'}
//                 className={cn('w-[180px] justify-start text-left font-normal', !fromDate && 'text-muted-foreground')}
//               >
//                 <CalendarIcon className="mr-2 h-4 w-4" />
//                 {fromDate ? formatVietnameseDate(fromDate) : <span>Pick a date</span>}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
//               <Select onValueChange={(value) => handleSelectFromDate(addDays(new Date(), parseInt(value)))}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Chọn" />
//                 </SelectTrigger>
//                 <SelectContent position="popper">
//                   <SelectItem value="0">Ngày hôm này</SelectItem>
//                   <SelectItem value="-1">Ngày hôm qua</SelectItem>
//                   <SelectItem value="-3">3 ngày trước</SelectItem>
//                   <SelectItem value="-7">7 ngày trước</SelectItem>
//                 </SelectContent>
//               </Select>
//               <div className="rounded-md border">
//                 <Calendar mode="single" selected={fromDate} onSelect={handleSelectFromDate} locale={vi} />
//               </div>
//             </PopoverContent>
//           </Popover>
//         </div>

//         <div className="flex gap-2 items-center">
//           <Label className="mt-2">Tìm kiếm</Label>
//           <Input
//             placeholder="Nhập từ khóa tìm kiếm..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="w-[200px]"
//           />
//         </div>

//         <div className="flex gap-2 items-center">
//           <Label className="mt-2">Trạng thái</Label>
//           <Select value={status} onValueChange={setStatus}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Chọn trạng thái" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">Tất cả</SelectItem>
//               <SelectItem value="waiting_confirm_customer">Chờ xác nhận từ khách hàng</SelectItem>
//               <SelectItem value="over_time_customer">Quá hạn xác nhận từ khách hàng</SelectItem>
//               <SelectItem value="waiting_confirm_restaurant">Chờ nhà hàng xác nhận</SelectItem>
//               <SelectItem value="waiting_shipping">Chờ giao hàng</SelectItem>
//               <SelectItem value="shipping">Đang giao hàng</SelectItem>
//               <SelectItem value="delivered_customer">Đã giao hàng đến khách hàng</SelectItem>
//               <SelectItem value="received_customer">Khách hàng đã nhận hàng</SelectItem>
//               <SelectItem value="cancel_customer">Khách hàng đã hủy đơn hàng</SelectItem>
//               <SelectItem value="cancel_restaurant">Nhà hàng đã hủy đơn hàng</SelectItem>
//               <SelectItem value="complaint">Khiếu nại</SelectItem>
//               <SelectItem value="complaint_done">Khiếu nại đã giải quyết</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//       <div className="grid gap-3 sm:gap-4 mt-2">
//         {orders.map((order) => {
//           const total = order.orderItems.reduce((sum, item) => {
//             const options = item.foodSnap.fsnp_options
//               ? JSON.parse(item.foodSnap.fsnp_options)
//               : [];
//             const optionsTotal = options.reduce((optSum: number, opt: any) => optSum + opt.fopt_price, 0);
//             const itemTotal = (item.foodSnap.fsnp_price + optionsTotal) * item.od_it_quantity;
//             return sum + itemTotal;
//           }, 0) + order.od_price_shipping;

//           const attributes = order.od_atribute ? JSON.parse(order.od_atribute) : [];
//           const restaurant = listRestaurant.find((res) => res._id === order.od_res_id);

//           return (
//             <Card key={order.od_id} className="shadow-md">
//               <CardContent className="p-3 sm:p-4">
//                 <Separator className="my-2" />
//                 <div className="flex flex-wrap">
//                   <div className="flex gap-1 mb-4 w-1/2">
//                     <Link
//                       href={
//                         restaurant && restaurant?.restaurant_slug
//                           ? 'nha-hang/' + restaurant.restaurant_slug
//                           : '/'
//                       }
//                       className="w-28 h-28 rounded-md overflow-hidden flex-shrink-0"
//                     >
//                       {restaurant && (
//                         <Image
//                           src={restaurant?.restaurant_banner.image_cloud}
//                           alt={restaurant?.restaurant_name || 'Restaurant'}
//                           width={100}
//                           height={100}
//                           className="w-full h-full object-cover"
//                         />
//                       )}
//                     </Link>
//                     <Link
//                       href={
//                         restaurant && restaurant?.restaurant_slug
//                           ? 'nha-hang/' + restaurant.restaurant_slug
//                           : '/'
//                       }
//                       className="flex-1 w-full"
//                     >
//                       <h3 className="text-base md:text-lg font-semibold text-gray-800">
//                         {restaurant?.restaurant_name}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         Địa chỉ: {restaurant ? restaurant.restaurant_address.address_specific : ''}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         Phản hồi: {order.od_feed_reply || 'Chưa có phản hồi'}
//                       </p>
//                       <div className='flex  gap-2 mt-2'>
//                         <p className="text-xs sm:text-sm text-muted-foreground">Trạng thái</p>
//                         <Badge variant={getStatusVariant(order.od_status)} className="text-xs sm:text-sm">
//                           {getTextStatus(order.od_status)}
//                         </Badge>
//                       </div>
//                     </Link>
//                   </div>
//                   <div className="grid grid-rows-1 sm:grid-rows-2 gap-1 mb-4 w-1/2">
//                     <div className="flex gap-1">
//                       <p className="text-xs sm:text-sm text-muted-foreground">Tên người nhận:</p>
//                       <p className="font-medium sm:text-sm text-xs">{order.od_user_name} - {order.od_user_phone}</p>
//                     </div>
//                     <div className="flex gap-1">
//                       <p className="text-xs sm:text-sm text-muted-foreground">Thời gian đặt hàng:</p>
//                       <p className="font-medium sm:text-sm text-xs">
//                         {new Date(order.od_created_at).toLocaleString('vi-VN')}
//                       </p>
//                     </div>
//                     <div className="flex gap-1">
//                       <p className="text-xs sm:text-sm text-muted-foreground">Địa chỉ:</p>
//                       <p className="font-medium sm:text-sm text-xs">
//                         {order.od_user_address}, P.{order.od_user_ward}, Q.{order.od_user_district}, T.{order.od_user_province}
//                       </p>
//                     </div>
//                     <div className="flex gap-1">
//                       <p className="text-xs sm:text-sm text-muted-foreground">Phí giao hàng:</p>
//                       <p className="font-medium sm:text-sm text-xs">
//                         {new Intl.NumberFormat('vi-VN', {
//                           style: 'currency',
//                           currency: 'VND'
//                         }).format(order.od_price_shipping)}
//                       </p>
//                     </div>
//                     <div className="flex gap-1">
//                       <p className="text-xs sm:text-sm text-muted-foreground">Feedback:</p>
//                       <p className="font-medium sm:text-sm text-xs">
//                         {order.od_feed_star} ⭐ - {order.od_feed_content || 'Chưa có phản hồi'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <Separator className="my-2" />
//                 <Accordion type="single" collapsible className="w-full">
//                   <AccordionItem value="order-items">
//                     <AccordionTrigger>
//                       <div className="flex justify-between items-center w-full">
//                         <p className="text-xs sm:text-sm font-medium">Danh sách món ăn</p>
//                         <p className="text-xs sm:text-sm font-medium">
//                           Tổng hóa đơn: {new Intl.NumberFormat('vi-VN', {
//                             style: 'currency',
//                             currency: 'VND'
//                           }).format(total)}
//                         </p>
//                       </div>
//                     </AccordionTrigger>
//                     <AccordionContent>
//                       {order.orderItems.length > 0 ? (
//                         <div className="space-y-3 max-h-[300px] overflow-y-auto">
//                           {order.orderItems.map((item, index) => {
//                             const options = item.foodSnap.fsnp_options
//                               ? JSON.parse(item.foodSnap.fsnp_options)
//                               : [];

//                             const optionTotal = options.reduce((sum: number, opt: any) => sum + opt.fopt_price, 0);
//                             const itemTotal = (item.foodSnap.fsnp_price + optionTotal) * item.od_it_quantity;

//                             return (
//                               <div key={item.od_it_id} className="flex items-center gap-2 sm:gap-3">
//                                 <Avatar className="h-20 w-20 !rounded-md">
//                                   <AvatarImage
//                                     src={
//                                       item.foodSnap.fsnp_image
//                                         ? JSON.parse(item.foodSnap.fsnp_image)[0]?.image_cloud
//                                         : '/placeholder-image.jpg'
//                                     }
//                                     alt="Food item"
//                                   />
//                                   <AvatarFallback>ITEM</AvatarFallback>
//                                 </Avatar>
//                                 <div className="flex-1">
//                                   <p className="font-medium text-sm sm:text-base">
//                                     {item.foodSnap.fsnp_name} - {new Intl.NumberFormat('vi-VN', {
//                                       style: 'currency',
//                                       currency: 'VND'
//                                     }).format(itemTotal)}
//                                   </p>
//                                   <p className="text-xs sm:text-sm text-muted-foreground">
//                                     Giá: {new Intl.NumberFormat('vi-VN', {
//                                       style: 'currency',
//                                       currency: 'VND'
//                                     }).format(item.foodSnap.fsnp_price)} x {item.od_it_quantity}
//                                   </p>
//                                   {options.length > 0 && (
//                                     <div className="text-xs sm:text-sm text-muted-foreground">
//                                       {options.map((opt: any, optIndex: number) => (
//                                         <p key={optIndex}>
//                                           {opt.fopt_name}: {opt.fopt_attribute} (+{new Intl.NumberFormat('vi-VN', {
//                                             style: 'currency',
//                                             currency: 'VND'
//                                           }).format(opt.fopt_price)})
//                                         </p>
//                                       ))}
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       ) : (
//                         <p className="text-xs sm:text-sm text-muted-foreground">Không có món ăn nào</p>
//                       )}
//                     </AccordionContent>
//                   </AccordionItem>
//                 </Accordion>

//                 {attributes.length > 0 && (
//                   <>
//                     <Separator className="my-2" />
//                     <Accordion type="single" collapsible className="w-full">
//                       <AccordionItem value="attributes">
//                         <AccordionTrigger>
//                           <p className="text-xs sm:text-sm font-medium">Thông tin thêm</p>
//                         </AccordionTrigger>
//                         <AccordionContent>
//                           <div className="p-1 sm:p-2 max-h-[300px] overflow-y-auto">
//                             <div className="after:absolute after:inset-y-0 after:w-px after:bg-gray-500/20 relative pl-6 after:left-0 grid gap-3 sm:gap-4 dark:after:bg-gray-400/20">
//                               {attributes.map((attr: any, index: number) => (
//                                 <div className="grid gap-1 text-xs sm:text-sm relative" key={index}>
//                                   <div className="aspect-square w-3 bg-gray-900 rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-1 dark:bg-gray-50" />
//                                   <div className="font-medium">
//                                     {new Date(attr.time).toLocaleString('vi-VN')} - {attr.type}
//                                   </div>
//                                   <div className="text-gray-500 dark:text-gray-400">
//                                     {attr.description}
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         </AccordionContent>
//                       </AccordionItem>
//                     </Accordion>
//                   </>
//                 )}

//                 <Separator className="my-2" />

//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
//                   <div className="flex flex-wrap gap-2 w-full sm:w-auto">
//                     {order.od_status === 'waiting_confirm_customer' && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="w-full sm:w-auto"
//                         onClick={() => handleCancelOrder(order.od_id, order.od_res_id)}
//                       >
//                         Hủy đơn
//                       </Button>
//                     )}
//                     {order.od_status === 'delivered_customer' && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="w-full sm:w-auto"
//                         onClick={() => handleReceiveOrder(order.od_id, order.od_res_id)}
//                       >
//                         Đã nhận hàng
//                       </Button>
//                     )}
//                     {(order.od_status === 'delivered_customer' || order.od_status === 'received_customer') && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="w-full sm:w-auto"
//                         onClick={() => handleComplaint(order.od_id, order.od_res_id)}
//                       >
//                         Khiếu nại
//                       </Button>
//                     )}
//                     {order.od_status === 'complaint' && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="w-full sm:w-auto"
//                         onClick={() => handleComplaintDone(order.od_id, order.od_res_id)}
//                       >
//                         Đã giải quyết khiếu nại
//                       </Button>
//                     )}
//                   </div>
//                 </div>

//                 {(order.od_status === 'received_customer' || order.od_status === 'complaint_done') && !order.od_feed_content && (
//                   <>
//                     <Separator className="my-2" />
//                     <div className="mt-4">
//                       <p className="text-xs sm:text-sm font-medium mb-2">Gửi phản hồi</p>
//                       <Textarea
//                         value={feedbackContent[order.od_id] || ''}
//                         onChange={(e) =>
//                           setFeedbackContent((prev) => ({ ...prev, [order.od_id]: e.target.value }))
//                         }
//                         placeholder="Nhập phản hồi của bạn..."
//                         className="mb-2"
//                       />
//                       <div className="flex gap-2 mb-2">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <Button
//                             key={star}
//                             variant={feedbackStar[order.od_id] === star ? 'default' : 'outline'}
//                             size="sm"
//                             onClick={() =>
//                               setFeedbackStar((prev) => ({ ...prev, [order.od_id]: star as 1 | 2 | 3 | 4 | 5 }))
//                             }
//                           >
//                             {star} ⭐
//                           </Button>
//                         ))}
//                       </div>
//                       <Button
//                         size="sm"
//                         onClick={() => handleFeedback(order.od_id, order.od_res_id)}
//                         className="w-full sm:w-auto"
//                       >
//                         Gửi phản hồi
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {orders.length === 0 && (
//         <div className="text-center py-4 text-muted-foreground text-sm sm:text-base">
//           Không có đơn hàng nào
//         </div>
//       )}

//       <div className="flex flex-col sm:flex-row justify-between items-center mt-3 sm:mt-4 gap-2 sm:gap-0">
//         <div className="text-xs sm:text-sm text-muted-foreground">
//           Số đơn hàng: {orders.length}
//         </div>
//         <div className='flex justify-center mt-3'>
//           <Pagination
//             meta={{
//               current: pageIndex,
//               pageSize: pageSize,
//               totalPage: meta.totalPage,
//               totalItem: meta.totalItem,
//             }}
//             pageIndex={pageIndex}
//             pageSize={pageSize}
//             setPageIndex={setPageIndex}
//             setPageSize={setPageSize}
//           />
//         </div>
//       </div>


//     </div>
//   );
// }



'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronDown } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getListOrderFood, guestCancelOrderFood, guestComplaintDoneOrderFood, guestComplaintOrderFood, guestFeedbackOrderFood, guestReceiveOrderFood } from '@/app/mon-an-da-dat/list.order.food.api'
import { IOrderFood } from '@/app/dat-mon-an/order.food.api'
import { IRestaurant } from '@/app/interface/restaurant.interface'
import { GetRestaurantByIds } from '@/app/home/home.api'
import Link from 'next/link'
import Image from 'next/image'
import { Textarea } from "@/components/ui/textarea"
import { toast } from '@/hooks/use-toast' // Assuming you have a toast utility
import debounce from 'lodash/debounce'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useSearchParams } from 'next/navigation'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { addDays } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/Pagination'

const formatVietnameseDate = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes} ${day}/${month}/${year}`
}


export default function PageListOrderFood() {
  const [orders, setOrders] = useState<IOrderFood[]>([])
  const [loading, setLoading] = useState(true)
  const [listRestaurant, setListRestaurant] = useState<IRestaurant[]>([])
  const [feedbackContent, setFeedbackContent] = useState<{ [key: string]: string }>({})
  const [feedbackStar, setFeedbackStar] = useState<{ [key: string]: 1 | 2 | 3 | 4 | 5 }>({})
  const today = new Date();
  // const defaultToDate = new Date(today.setHours(0, 0, 0, 0));
  const defaultToDate = new Date();
  defaultToDate.setHours(0, 0, 0, 0);
  defaultToDate.setDate(defaultToDate.getDate() - 10);
  const defaultFromDate = new Date(defaultToDate);
  defaultFromDate.setDate(defaultFromDate.getDate() + 70);
  const [toDate, setToDate] = useState<Date>(defaultToDate);
  const [fromDate, setFromDate] = useState<Date>(defaultFromDate);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [meta, setMeta] = useState<{
    pageIndex: number;
    pageSize: number;
    totalPage: number;
    totalItem: number;
  }>({
    pageIndex: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 0,
  });
  const searchParam = useSearchParams().get('a');

  const handleSelectFromDate = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(23);
      newDate.setMinutes(59);
      newDate.setSeconds(0);
      setFromDate(newDate);
    }
  };

  const handleSelectToDate = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(0);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      setToDate(newDate);
    }
  };

  const debouncedFindListOrder = useCallback(
    debounce(() => {
      fetchOrders();
    }, 300),
    [toDate, fromDate, pageIndex, pageSize, query, status]
  );

  useEffect(() => {
    debouncedFindListOrder();
    return () => {
      debouncedFindListOrder.cancel();
    };
  }, [toDate, fromDate, pageIndex, pageSize, query, status, debouncedFindListOrder]);

  useEffect(() => {
    debouncedFindListOrder();
    return () => {
      debouncedFindListOrder.cancel();
    };
  }, [searchParam]);

  const fetchOrders = async () => {
    try {
      const res: IBackendRes<IModelPaginate<IOrderFood>> = await getListOrderFood({
        pageSize: pageSize,
        pageIndex: pageIndex,
        q: query,
        status: status,
        toDate: toDate,
        fromDate: fromDate,
      })
      if (res.statusCode === 200 || res.statusCode === 201) {
        if (res.data && res.data.result) {
          setOrders(res.data.result)
          setMeta({
            pageIndex: res.data.meta.pageIndex,
            pageSize: res.data.meta.pageSize,
            totalPage: res.data.meta.totalPage,
            totalItem: res.data.meta.totalItem,
          })
          setPageIndex(res.data.meta.pageIndex)
          setPageSize(res.data.meta.pageSize)
          const listIdRestaurant = res.data.result.map((order) => order.od_res_id)
          const resRestaurant: IBackendRes<IRestaurant[]> = await GetRestaurantByIds(listIdRestaurant)
          if (resRestaurant.statusCode === 201 && resRestaurant.data) {
            setListRestaurant(resRestaurant.data)
          } else {
            setListRestaurant([])
          }
        } else {
          setOrders([])
        }
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'waiting_confirm_customer':
        return 'default'
      case 'over_time_customer':
        return 'destructive'
      case 'delivered_customer':
      case 'received_customer':
      case 'complaint_done':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getTextStatus = (status: string) => {
    const statusMap: any = {
      waiting_confirm_customer: 'Chờ xác nhận từ khách hàng',
      over_time_customer: 'Quá hạn xác nhận từ khách hàng',
      waiting_confirm_restaurant: 'Chờ nhà hàng xác nhận',
      waiting_shipping: 'Chờ giao hàng',
      shipping: 'Đang giao hàng',
      delivered_customer: 'Đã giao hàng đến khách hàng',
      received_customer: 'Khách hàng đã nhận hàng',
      cancel_customer: 'Khách hàng đã hủy đơn hàng',
      cancel_restaurant: 'Nhà hàng đã hủy đơn hàng',
      complaint: 'Khiếu nại',
      complaint_done: 'Khiếu nại đã giải quyết',
    }
    return statusMap[status] || status
  }

  // Handle Cancel Order
  const handleCancelOrder = async (od_id: string, od_res_id: string) => {
    const res = await guestCancelOrderFood({ od_id, od_res_id });
    if (res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Đơn hàng đã được hủy.',
        variant: 'default',
      });
      fetchOrders();
    } else {
      toast({
        title: 'Thất bại',
        description: res.message || 'Không thể hủy đơn hàng.',
        variant: 'destructive',
      });
    }
  };

  // Handle Receive Order
  const handleReceiveOrder = async (od_id: string, od_res_id: string) => {
    const res = await guestReceiveOrderFood({ od_id, od_res_id });
    if (res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Đã xác nhận nhận hàng.',
        variant: 'default',
      });
      fetchOrders();
    } else {
      toast({
        title: 'Thất bại',
        description: res.message || 'Không thể xác nhận nhận hàng.',
        variant: 'destructive',
      });
    }
  };

  // Handle Complaint
  const handleComplaint = async (od_id: string, od_res_id: string) => {
    const res = await guestComplaintOrderFood({ od_id, od_res_id });
    if (res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Đã gửi khiếu nại.',
        variant: 'default',
      });
      fetchOrders();
    } else {
      toast({
        title: 'Thất bại',
        description: res.message || 'Không thể gửi khiếu nại.',
        variant: 'destructive',
      });
    }
  };

  // Handle Complaint Done
  const handleComplaintDone = async (od_id: string, od_res_id: string) => {
    const res = await guestComplaintDoneOrderFood({ od_id, od_res_id });
    if (res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Khiếu nại đã được giải quyết.',
        variant: 'default',
      });
      fetchOrders();
    } else {
      toast({
        title: 'Thất bại',
        description: res.message || 'Không thể đánh dấu khiếu nại đã giải quyết.',
        variant: 'destructive',
      });
    }
  };

  // Handle Feedback
  const handleFeedback = async (od_id: string, od_res_id: string) => {
    const content = feedbackContent[od_id] || '';
    const star = feedbackStar[od_id] || 5;

    if (!content.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập nội dung phản hồi.',
        variant: 'destructive',
      });
      return;
    }

    const res = await guestFeedbackOrderFood({ od_id, od_res_id, od_feed_content: content, od_feed_star: star });
    if (res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Phản hồi đã được gửi.',
        variant: 'default',
      });
      setFeedbackContent((prev) => ({ ...prev, [od_id]: '' }));
      setFeedbackStar((prev) => ({ ...prev, [od_id]: 5 }));
      fetchOrders();
    } else {
      toast({
        title: 'Thất bại',
        description: res.message || 'Không thể gửi phản hồi.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Danh sách đơn hàng</h1>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 flex-wrap">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <Label className="mt-2 shrink-0">Từ</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn('w-full sm:w-[180px] justify-start text-left font-normal', !toDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? formatVietnameseDate(toDate) : <span>Chọn ngày</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
              <Select onValueChange={(value) => handleSelectToDate(addDays(new Date(), parseInt(value)))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="0">Ngày hôm này</SelectItem>
                  <SelectItem value="-1">Ngày hôm qua</SelectItem>
                  <SelectItem value="-3">3 ngày trước</SelectItem>
                  <SelectItem value="-7">7 ngày trước</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border">
                <Calendar mode="single" selected={toDate} onSelect={handleSelectToDate} locale={vi} />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <Label className="mt-2 shrink-0">Đến</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn('w-full sm:w-[180px] justify-start text-left font-normal', !fromDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? formatVietnameseDate(fromDate) : <span>Chọn ngày</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
              <Select onValueChange={(value) => handleSelectFromDate(addDays(new Date(), parseInt(value)))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="0">Ngày hôm này</SelectItem>
                  <SelectItem value="-1">Ngày hôm qua</SelectItem>
                  <SelectItem value="-3">3 ngày trước</SelectItem>
                  <SelectItem value="-7">7 ngày trước</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border">
                <Calendar mode="single" selected={fromDate} onSelect={handleSelectFromDate} locale={vi} />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <Label className="mt-2 shrink-0">Tìm kiếm</Label>
          <Input
            placeholder="Nhập từ khóa tìm kiếm..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-[200px]"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <Label className="mt-2 shrink-0">Trạng thái</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="waiting_confirm_customer">Chờ xác nhận từ khách hàng</SelectItem>
              <SelectItem value="over_time_customer">Quá hạn xác nhận từ khách hàng</SelectItem>
              <SelectItem value="waiting_confirm_restaurant">Chờ nhà hàng xác nhận</SelectItem>
              <SelectItem value="waiting_shipping">Chờ giao hàng</SelectItem>
              <SelectItem value="shipping">Đang giao hàng</SelectItem>
              <SelectItem value="delivered_customer">Đã giao hàng đến khách hàng</SelectItem>
              <SelectItem value="received_customer">Khách hàng đã nhận hàng</SelectItem>
              <SelectItem value="cancel_customer">Khách hàng đã hủy đơn hàng</SelectItem>
              <SelectItem value="cancel_restaurant">Nhà hàng đã hủy đơn hàng</SelectItem>
              <SelectItem value="complaint">Khiếu nại</SelectItem>
              <SelectItem value="complaint_done">Khiếu nại đã giải quyết</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid gap-4 sm:gap-6">
        {orders.map((order) => {
          const total = order.orderItems.reduce((sum, item) => {
            const options = item.foodSnap.fsnp_options
              ? JSON.parse(item.foodSnap.fsnp_options)
              : [];
            const optionsTotal = options.reduce((optSum: number, opt: any) => optSum + opt.fopt_price, 0);
            const itemTotal = (item.foodSnap.fsnp_price + optionsTotal) * item.od_it_quantity;
            return sum + itemTotal;
          }, 0) + order.od_price_shipping;

          const attributes = order.od_atribute ? JSON.parse(order.od_atribute) : [];
          const restaurant = listRestaurant.find((res) => res._id === order.od_res_id);

          return (
            <Card key={order.od_id} className="shadow-md">
              <CardContent className="p-4 sm:p-6">
                <Separator className="my-3" />

                {/* Restaurant and Order Info */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex gap-3 w-full md:w-1/2">
                    <Link
                      href={restaurant?.restaurant_slug ? `/nha-hang/${restaurant.restaurant_slug}` : '/'}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden flex-shrink-0"
                    >
                      {restaurant && (
                        <Image
                          src={restaurant.restaurant_banner.image_cloud}
                          alt={restaurant.restaurant_name || 'Restaurant'}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </Link>
                    <div className="flex-1">
                      <Link href={restaurant?.restaurant_slug ? `/nha-hang/${restaurant.restaurant_slug}` : '/'}>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
                          {restaurant?.restaurant_name}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                        Địa chỉ: {restaurant ? restaurant.restaurant_address.address_specific : ''}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                        Phản hồi: {order.od_feed_reply || 'Chưa có phản hồi'}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <p className="text-xs sm:text-sm text-muted-foreground">Trạng thái</p>
                        <Badge variant={getStatusVariant(order.od_status)} className="text-xs sm:text-sm">
                          {getTextStatus(order.od_status)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2 w-full md:w-1/2 text-xs sm:text-sm">
                    <div className="flex flex-col sm:flex-row gap-1">
                      <p className="text-muted-foreground shrink-0">Tên người nhận:</p>
                      <p className="font-medium">{order.od_user_name} - {order.od_user_phone}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1">
                      <p className="text-muted-foreground shrink-0">Thời gian đặt hàng:</p>
                      <p className="font-medium">{new Date(order.od_created_at).toLocaleString('vi-VN')}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1">
                      <p className="text-muted-foreground shrink-0">Địa chỉ:</p>
                      <p className="font-medium line-clamp-2">
                        {order.od_user_address}, P.{order.od_user_ward}, Q.{order.od_user_district}, T.{order.od_user_province}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1">
                      <p className="text-muted-foreground shrink-0">Phí giao hàng:</p>
                      <p className="font-medium">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.od_price_shipping)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1">
                      <p className="text-muted-foreground shrink-0">Feedback:</p>
                      <p className="font-medium">
                        {order.od_feed_star} ⭐ - {order.od_feed_content || 'Chưa có phản hồi'}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-3" />

                {/* Order Items */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="order-items">
                    <AccordionTrigger>
                      <div className="flex justify-between items-center w-full text-xs sm:text-sm font-medium">
                        <span>Danh sách món ăn</span>
                        <span>
                          Tổng hóa đơn: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {order.orderItems.length > 0 ? (
                        <div className="space-y-4 max-h-[300px] overflow-y-auto">
                          {order.orderItems.map((item) => {
                            const options = item.foodSnap.fsnp_options
                              ? JSON.parse(item.foodSnap.fsnp_options)
                              : [];
                            const optionTotal = options.reduce((sum: number, opt: any) => sum + opt.fopt_price, 0);
                            const itemTotal = (item.foodSnap.fsnp_price + optionTotal) * item.od_it_quantity;

                            return (
                              <div key={item.od_it_id} className="flex gap-3">
                                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 !rounded-md flex-shrink-0">
                                  <AvatarImage
                                    src={item.foodSnap.fsnp_image ? JSON.parse(item.foodSnap.fsnp_image)[0]?.image_cloud : '/placeholder-image.jpg'}
                                    alt="Food item"
                                  />
                                  <AvatarFallback>ITEM</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="font-medium text-sm sm:text-base line-clamp-1">
                                    {item.foodSnap.fsnp_name} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(itemTotal)}
                                  </p>
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.foodSnap.fsnp_price)} x {item.od_it_quantity}
                                  </p>
                                  {options.length > 0 && (
                                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                                      {options.map((opt: any, optIndex: number) => (
                                        <p key={optIndex} className="line-clamp-1">
                                          {opt.fopt_name}: {opt.fopt_attribute} (+{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(opt.fopt_price)})
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-muted-foreground">Không có món ăn nào</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Attributes */}
                {attributes.length > 0 && (
                  <>
                    <Separator className="my-3" />
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="attributes">
                        <AccordionTrigger>
                          <p className="text-xs sm:text-sm font-medium">Thông tin thêm</p>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="p-2 max-h-[300px] overflow-y-auto">
                            <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-gray-500/20 after:left-0 grid gap-4">
                              {attributes.map((attr: any, index: number) => (
                                <div className="grid gap-1 text-xs sm:text-sm relative" key={index}>
                                  <div className="aspect-square w-3 bg-gray-900 rounded-full absolute left-0 -translate-x-[29.5px] top-1" />
                                  <div className="font-medium line-clamp-1">
                                    {new Date(attr.time).toLocaleString('vi-VN')} - {attr.type}
                                  </div>
                                  <div className="text-gray-500 line-clamp-2">{attr.description}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </>
                )}

                <Separator className="my-3" />

                {/* Actions and Feedback */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {order.od_status === 'waiting_confirm_customer' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleCancelOrder(order.od_id, order.od_res_id)}
                      >
                        Hủy đơn
                      </Button>
                    )}
                    {order.od_status === 'delivered_customer' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleReceiveOrder(order.od_id, order.od_res_id)}
                      >
                        Đã nhận hàng
                      </Button>
                    )}
                    {(order.od_status === 'delivered_customer' || order.od_status === 'received_customer') && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleComplaint(order.od_id, order.od_res_id)}
                      >
                        Khiếu nại
                      </Button>
                    )}
                    {order.od_status === 'complaint' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleComplaintDone(order.od_id, order.od_res_id)}
                      >
                        Đã giải quyết khiếu nại
                      </Button>
                    )}
                  </div>

                  {(order.od_status === 'received_customer' || order.od_status === 'complaint_done') && !order.od_feed_content && (
                    <div className="space-y-3">
                      <p className="text-xs sm:text-sm font-medium">Gửi phản hồi</p>
                      <Textarea
                        value={feedbackContent[order.od_id] || ''}
                        onChange={(e) => setFeedbackContent((prev) => ({ ...prev, [order.od_id]: e.target.value }))}
                        placeholder="Nhập phản hồi của bạn..."
                      />
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant={feedbackStar[order.od_id] === star ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFeedbackStar((prev) => ({ ...prev, [order.od_id]: star as 1 | 2 | 3 | 4 | 5 }))}
                          >
                            {star} ⭐
                          </Button>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleFeedback(order.od_id, order.od_res_id)}
                        className="w-full sm:w-auto"
                      >
                        Gửi phản hồi
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-6 text-muted-foreground text-sm sm:text-base">
          Không có đơn hàng nào
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="text-xs sm:text-sm text-muted-foreground">
          Số đơn hàng: {orders.length}
        </div>
        <div className="flex justify-center">
          <Pagination
            meta={{
              current: pageIndex,
              pageSize: pageSize,
              totalPage: meta.totalPage,
              totalItem: meta.totalItem,
            }}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
          />
        </div>
      </div>
    </div>
  );
}