// 'use client';
// import React, { useState, useEffect, useCallback } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
// import { LatLngExpression } from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import Image from 'next/image';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { IRestaurant } from '@/app/interface/restaurant.interface';

// const formSchema = z.object({
//   customerName: z.string().min(1, 'Họ và tên không được để trống'),
//   phone: z
//     .string()
//     .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
//     .regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số'),
//   email: z.string().email('Email không hợp lệ').min(1, 'Email không được để trống'),
//   address: z.string().min(1, 'Địa chỉ không được để trống'),
//   note: z.string().optional(),
// });

// type FormData = z.infer<typeof formSchema>;

// type Position = LatLngExpression;

// interface Props {
//   slug: string;
//   selectedOption: string[];
//   quantity: number;
//   inforFood: IFoodRestaurant;
//   restaurant: IRestaurant;
// }

// export default function PageOrderFood({ inforFood, quantity, selectedOption, slug, restaurant }: Props) {
//   console.log("🚀 ~ PageOrderFood ~ restaurant:", restaurant)
//   const foodImages = JSON.parse(inforFood.food_image || '[]');
//   const selectedOptionsData = inforFood.fopt_food?.filter((opt) => selectedOption.includes(opt.fopt_id));

//   const basePrice = inforFood.food_price || 0;
//   const optionsPrice = selectedOptionsData?.reduce((sum, opt) => sum + (opt.fopt_price || 0), 0) || 0;
//   const totalPrice = (basePrice + optionsPrice) * quantity;

//   const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [locationError, setLocationError] = useState<string | null>(null);
//   const [marker, setMarker] = useState<Position | null>(null);
//   const [currentPosition, setCurrentPosition] = useState<Position | any>([21.0285, 105.8542]); // Default: Hà Nội
//   const [suggestions, setSuggestions] = useState<any[]>([]); // State cho danh sách gợi ý
//   const [showSuggestions, setShowSuggestions] = useState<boolean>(false); // Hiển thị/ẩn gợi ý

//   // Khởi tạo React Hook Form
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       customerName: '',
//       phone: '',
//       email: '',
//       address: '',
//       note: '',
//     },
//   });

//   // Theo dõi giá trị của address từ form
//   const formAddress = watch('address');

//   // Hàm lấy địa chỉ từ tọa độ (reverse geocoding)
//   const getAddressFromCoordinates = async (lat: number, lng: number) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=vi`
//       );
//       const data = await response.json();
//       if (data && data.display_name) {
//         setValue('address', data.display_name); // Cập nhật địa chỉ vào form
//         setLocation({ latitude: lat, longitude: lng });
//       } else {
//         setValue('address', 'Không thể xác định địa chỉ');
//         setLocationError('Không thể xác định địa chỉ');
//       }
//     } catch (error) {
//       console.error('Lỗi khi lấy địa chỉ:', error);
//       setValue('address', 'Lỗi khi lấy địa chỉ');
//       setLocationError('Lỗi khi lấy địa chỉ');
//     }
//   };

//   // Hàm tìm tọa độ từ địa chỉ (forward geocoding)
//   const getCoordinatesFromAddress = async (query: string) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
//           query
//         )}&format=json&addressdetails=1&accept-language=vi&limit=1`
//       );
//       const data = await response.json();
//       if (data && data.length > 0) {
//         const { lat, lon } = data[0];
//         const newPosition: Position = [parseFloat(lat), parseFloat(lon)];
//         setMarker(newPosition);
//         setCurrentPosition(newPosition);
//         setValue('address', data[0].display_name);
//         setLocation({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
//         setLocationError(null);
//         setShowSuggestions(false);
//       } else {
//         setLocationError('Không tìm thấy địa chỉ. Vui lòng thử lại.');
//       }
//     } catch (error) {
//       console.error('Lỗi khi tìm địa chỉ:', error);
//       setLocationError('Lỗi khi tìm địa chỉ. Vui lòng thử lại.');
//     }
//   };

//   // Hàm lấy gợi ý địa chỉ (debounced)
//   const fetchSuggestions = useCallback(async (query: string) => {
//     if (!query.trim()) {
//       setSuggestions([]);
//       setShowSuggestions(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
//           query
//         )}&format=json&addressdetails=1&accept-language=vi&limit=10`
//       );
//       const data = await response.json();
//       console.log('🚀 ~ fetchSuggestions ~ query:', query);
//       console.log('🚀 ~ fetchSuggestions ~ data:', data);
//       if (data && data.length > 0) {
//         setSuggestions(data);
//         setShowSuggestions(true);
//       } else {
//         setSuggestions([]);
//         setShowSuggestions(false);
//       }
//     } catch (error) {
//       console.error('Lỗi khi lấy gợi ý:', error);
//       setSuggestions([]);
//       setShowSuggestions(false);
//     }
//   }, []);

//   // Debounce fetchSuggestions để tránh gọi API quá nhiều
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchSuggestions(formAddress);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [formAddress, fetchSuggestions]);

//   // Xử lý khi người dùng nhập vào ô tìm kiếm
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setShowSuggestions(true); // Hiển thị gợi ý khi người dùng bắt đầu nhập
//   };

//   // Xử lý khi người dùng chọn một gợi ý
//   const handleSuggestionClick = (suggestion: any) => {
//     const newPosition: Position = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)];
//     setMarker(newPosition);
//     setCurrentPosition(newPosition);
//     setValue('address', suggestion.display_name);
//     setLocation({ latitude: parseFloat(suggestion.lat), longitude: parseFloat(suggestion.lon) });
//     setShowSuggestions(false);
//     setLocationError(null);
//   };

//   // Xử lý khi người dùng nhấn Enter hoặc nút tìm kiếm
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (formAddress.trim()) {
//       getCoordinatesFromAddress(formAddress);
//     }
//   };

//   // Lấy vị trí hiện tại của người dùng
//   const getUserLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude, accuracy } = position.coords;
//           const newPosition: Position = [latitude, longitude];
//           setCurrentPosition(newPosition);
//           setMarker(newPosition);
//           setLocationError(null);
//           await getAddressFromCoordinates(latitude, longitude);

//           if (accuracy > 100) {
//             setLocationError(
//               'Độ chính xác vị trí thấp (sai số: ' +
//               accuracy.toFixed(0) +
//               'm). Vui lòng bật GPS hoặc kiểm tra lại.'
//             );
//           }
//         },
//         (error) => {
//           let errorMessage = '';
//           switch (error.code) {
//             case error.PERMISSION_DENIED:
//               errorMessage = 'Bạn đã từ chối cấp quyền truy cập vị trí.';
//               break;
//             case error.POSITION_UNAVAILABLE:
//               errorMessage = 'Không thể xác định vị trí.';
//               break;
//             case error.TIMEOUT:
//               errorMessage = 'Yêu cầu lấy vị trí quá thời gian.';
//               break;
//             default:
//               errorMessage = 'Đã xảy ra lỗi khi lấy vị trí.';
//               break;
//           }
//           setLocationError(errorMessage);
//           const defaultPosition: Position = [21.0285, 105.8542]; // Hà Nội
//           setCurrentPosition(defaultPosition);
//           setMarker(defaultPosition);
//           getAddressFromCoordinates(21.0285, 105.8542);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 10000,
//           maximumAge: 0,
//         }
//       );
//     } else {
//       setLocationError('Trình duyệt của bạn không hỗ trợ Geolocation.');
//       const defaultPosition: Position = [21.0285, 105.8542]; // Hà Nội
//       setCurrentPosition(defaultPosition);
//       setMarker(defaultPosition);
//       getAddressFromCoordinates(21.0285, 105.8542);
//     }
//   };

//   // Component để xử lý sự kiện trên bản đồ
//   const LocationMarker: React.FC = () => {
//     const map = useMap();

//     useMapEvents({
//       click(e) {
//         const newMarker: Position = [e.latlng.lat, e.latlng.lng];
//         setMarker(newMarker);
//         getAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
//         setLocationError(null);
//         map.setView(newMarker, 20);
//       },
//     });

//     useEffect(() => {
//       if (currentPosition) {
//         map.setView(currentPosition, 20);
//       }
//     }, [currentPosition, map]);

//     return null;
//   };

//   // Xử lý submit form
//   const onSubmit = (data: FormData) => {
//     console.log('🚀 ~ Form submitted with data:', { ...data, location });
//     // Thêm logic gửi dữ liệu lên server ở đây (ví dụ: gọi API)
//   };

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <Card className="max-w-2xl mx-auto">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold">Đặt hàng: {inforFood.food_name}</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {foodImages.length > 0 && (
//             <div className="relative w-full h-64">
//               <Image
//                 src={foodImages[0].image_custom}
//                 alt={inforFood.food_name}
//                 fill
//                 className="object-cover rounded-md"
//               />
//             </div>
//           )}

//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <span className="font-semibold">Giá cơ bản:</span>
//               <span>{basePrice.toLocaleString('vi-VN')} VNĐ</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="font-semibold">Số lượng:</span>
//               <Badge variant="outline">{quantity}</Badge>
//             </div>
//           </div>

//           {selectedOptionsData && selectedOptionsData.length > 0 && (
//             <div className="space-y-2">
//               <Label className="font-semibold">Tùy chọn:</Label>
//               <ul className="list-disc pl-5">
//                 {selectedOptionsData.map((opt) => (
//                   <li key={opt.fopt_id} className="flex justify-between">
//                     <span>
//                       {opt.fopt_name} ({opt.fopt_attribute})
//                     </span>
//                     <span>{opt.fopt_price.toLocaleString('vi-VN')} VNĐ</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <div className="flex justify-between text-lg font-bold">
//             <span>Tổng cộng:</span>
//             <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
//           </div>

//           {/* Form với React Hook Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <Label htmlFor="customerName">Họ và tên</Label>
//               <Input id="customerName" placeholder="Nhập họ và tên" {...register('customerName')} />
//               {errors.customerName && (
//                 <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
//               )}
//             </div>
//             <div>
//               <Label htmlFor="phone">Số điện thoại</Label>
//               <Input id="phone" type="tel" placeholder="Nhập số điện thoại" {...register('phone')} />
//               {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
//             </div>
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" placeholder="Nhập email" {...register('email')} />
//               {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//             </div>
//             <div>
//               <Label htmlFor="address">Địa chỉ giao hàng</Label>
//               <div className="space-y-2 relative">
//                 <div className="relative z-50">
//                   <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
//                     <Input
//                       id="address"
//                       placeholder="Nhập địa chỉ hoặc chọn trên bản đồ (VD: 123 Đường Láng, Hà Nội)"
//                       {...register('address')}
//                       onChange={(e) => {
//                         register('address').onChange(e); // Gọi onChange của React Hook Form
//                         handleInputChange(e); // Gọi hàm xử lý gợi ý
//                       }}
//                       className="w-full"
//                     />
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         getUserLocation();
//                       }}
//                       className="w-full sm:w-auto"
//                     >
//                       Lấy vị trí
//                     </Button>
//                   </div>

//                   {/* Danh sách gợi ý */}
//                   {showSuggestions && suggestions.length > 0 && (
//                     <ul className="absolute top-12 left-0 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md z-50 list-none p-0 m-0">
//                       {suggestions.map((suggestion, index) => (
//                         <li
//                           key={index}
//                           onClick={() => handleSuggestionClick(suggestion)}
//                           className="p-2 cursor-pointer border-b border-gray-200 hover:bg-gray-100"
//                         >
//                           {suggestion.display_name}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>

//                 {errors.address && (
//                   <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
//                 )}
//               </div>

//               {/* Hiển thị thông báo lỗi nếu có */}
//               {locationError && (
//                 <Alert variant="destructive" className="mt-2">
//                   <AlertDescription>{locationError}</AlertDescription>
//                 </Alert>
//               )}

//               {/* Bản đồ */}
//               <div className="mt-4 w-full h-64 sm:h-80 relative z-0">
//                 <MapContainer
//                   center={currentPosition}
//                   zoom={20}
//                   style={{ height: '100%', width: '100%' }}
//                 >
//                   <TileLayer
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                   />
//                   {marker && (
//                     <Marker position={marker}>
//                       <Popup>
//                         {marker === currentPosition
//                           ? 'Vị trí hiện tại của bạn'
//                           : 'Địa điểm được ghim'}
//                         <br />
//                         {formAddress || 'Đang tải địa chỉ...'}
//                       </Popup>
//                     </Marker>
//                   )}
//                   <LocationMarker />
//                 </MapContainer>
//               </div>
//             </div>
//             <div>
//               <Label htmlFor="note">Ghi chú</Label>
//               <Textarea id="note" placeholder="Ghi chú thêm (nếu có)" {...register('note')} />
//               {errors.note && <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>}
//             </div>
//             <Button type="submit" className="w-full">
//               Xác nhận đặt hàng
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }









// 'use client'
// import React, { useState, useEffect, useCallback } from 'react'
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
// import { LatLngExpression } from 'leaflet'
// import 'leaflet/dist/leaflet.css'
// import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { Badge } from '@/components/ui/badge'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import Image from 'next/image'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import * as z from 'zod'
// import { IRestaurant } from '@/app/interface/restaurant.interface'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { calcPriceShipingGHTK, calcPriceShippingGHN } from '../order.food.api'

// const formSchema = z.object({
//   customerName: z.string().min(1, 'Họ và tên không được để trống'),
//   phone: z
//     .string()
//     .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
//     .regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số'),
//   email: z.string().email('Email không hợp lệ').min(1, 'Email không được để trống'),
//   province: z.string().min(1, 'Vui lòng chọn tỉnh/thành'),
//   district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
//   ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
//   addressDetail: z.string().min(1, 'Địa chỉ chi tiết không được để trống'),
//   note: z.string().optional(),
//   shippingMethod: z.string().min(1, 'Vui lòng chọn phương thức giao hàng')
// })

// type FormData = z.infer<typeof formSchema>
// type Position = LatLngExpression

// interface Props {
//   slug: string
//   selectedOption: string[]
//   quantity: number
//   inforFood: IFoodRestaurant
//   restaurant: IRestaurant
// }

// export default function PageOrderFood({ inforFood, quantity, selectedOption, slug, restaurant }: Props) {
//   const foodImages = JSON.parse(inforFood.food_image || '[]')
//   const selectedOptionsData = inforFood.fopt_food?.filter((opt) => selectedOption.includes(opt.fopt_id))

//   const basePrice = inforFood.food_price || 0
//   const optionsPrice = selectedOptionsData?.reduce((sum, opt) => sum + (opt.fopt_price || 0), 0) || 0
//   const totalPrice = (basePrice + optionsPrice) * quantity

//   const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
//   const [locationError, setLocationError] = useState<string | null>(null)
//   const [marker, setMarker] = useState<Position | null>(null)
//   const [currentPosition, setCurrentPosition] = useState<Position>([21.0285, 105.8542]) // Default: Hà Nội
//   const [provinces, setProvinces] = useState<any[]>([])
//   const [districts, setDistricts] = useState<any[]>([])
//   const [wards, setWards] = useState<any[]>([])
//   const [shippingFeeGHN, setShippingFeeGHN] = useState<number | null>(null)
//   const [shippingFeeGHTK, setShippingFeeGHTK] = useState<number | null>(null)

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       customerName: '',
//       phone: '',
//       email: '',
//       province: '',
//       district: '',
//       ward: '',
//       addressDetail: '',
//       note: '',
//       shippingMethod: ''
//     }
//   })

//   const formProvince = watch('province')
//   const formDistrict = watch('district')
//   const formWard = watch('ward')
//   const formShippingMethod = watch('shippingMethod')

//   useEffect(() => {
//     const fetchProvinces = async () => {
//       const response = await fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
//         headers: { Token: '3b43de66-111c-11f0-8686-8669292be81e' }
//       })
//       const data = await response.json()
//       setProvinces(data.data)
//     }
//     fetchProvinces()
//   }, [])

//   useEffect(() => {
//     if (formProvince) {
//       const fetchDistricts = async () => {
//         const response = await fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
//           headers: { Token: '3b43de66-111c-11f0-8686-8669292be81e' }
//         })
//         const data = await response.json()
//         const filteredDistricts = data.data.filter((d: any) => d.ProvinceID === parseInt(formProvince))
//         setDistricts(filteredDistricts)
//         setWards([])
//         setValue('district', '')
//         setValue('ward', '')
//       }
//       fetchDistricts()
//     }
//   }, [formProvince, setValue])

//   useEffect(() => {
//     if (formDistrict) {
//       const fetchWards = async () => {
//         const response = await fetch(
//           `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${formDistrict}`,
//           {
//             headers: { Token: '3b43de66-111c-11f0-8686-8669292be81e' }
//           }
//         )
//         const data = await response.json()
//         setWards(data.data)
//         setValue('ward', '')
//       }
//       fetchWards()
//     }
//   }, [formDistrict, setValue])

//   const calculateShippingFeeGHTK = useCallback(async () => {
//     if (!formProvince || !formDistrict || !formWard || !formShippingMethod) return

//     const provinceName = provinces.find((p) => p.ProvinceID === parseInt(formProvince))?.ProvinceName
//     const districtName = districts.find((d) => d.DistrictID === parseInt(formDistrict))?.DistrictName

//     const requestBody = {
//       pick_province: restaurant.restaurant_address.address_province.name,
//       pick_district: restaurant.restaurant_address.address_district.name,
//       province: provinceName,
//       district: districtName,
//       address: '',
//       weight: 1000,
//       value: totalPrice,
//       transport: formShippingMethod === 'standard' ? 'road' : 'fly',
//       deliver_option: 'none',
//       tags: [1]
//     }

//     try {
//       const data = await calcPriceShipingGHTK(requestBody)
//       if (data.success) {
//         setShippingFeeGHTK(data.fee.fee)
//       } else {
//         setShippingFeeGHTK(null)
//         setLocationError('Không thể tính phí GHTK')
//       }
//     } catch (error) {
//       console.error('Lỗi khi tính phí GHTK:', error)
//       setShippingFeeGHTK(null)
//     }
//   }, [formProvince, formDistrict, formWard, formShippingMethod, totalPrice, provinces, districts])

//   useEffect(() => {
//     if (formProvince && formDistrict && formWard && formShippingMethod) {
//       calculateShippingFeeGHTK()
//     }
//   }, [formProvince, formDistrict, formWard, formShippingMethod, calculateShippingFeeGHTK])

//   const onSubmit = (data: FormData) => {
//     console.log('🚀 ~ Form submitted with data:', { ...data, shippingFeeGHN, shippingFeeGHTK })
//   }

//   return (
//     <div className='container mx-auto py-8 px-4'>
//       <Card className='max-w-2xl mx-auto'>
//         <CardHeader>
//           <CardTitle className='text-2xl font-bold'>Đặt hàng: {inforFood.food_name}</CardTitle>
//         </CardHeader>
//         <CardContent className='space-y-6'>
//           {foodImages.length > 0 && (
//             <div className='relative w-full h-64'>
//               <Image
//                 src={foodImages[0].image_custom}
//                 alt={inforFood.food_name}
//                 fill
//                 className='object-cover rounded-md'
//               />
//             </div>
//           )}
//           <div className='space-y-2'>
//             <div className='flex justify-between'>
//               <span className='font-semibold'>Giá cơ bản:</span>
//               <span>{basePrice.toLocaleString('vi-VN')} VNĐ</span>
//             </div>
//             <div className='flex justify-between'>
//               <span className='font-semibold'>Số lượng:</span>
//               <Badge variant='outline'>{quantity}</Badge>
//             </div>
//           </div>
//           {selectedOptionsData && selectedOptionsData.length > 0 && (
//             <div className='space-y-2'>
//               <Label className='font-semibold'>Tùy chọn:</Label>
//               <ul className='list-disc pl-5'>
//                 {selectedOptionsData.map((opt) => (
//                   <li key={opt.fopt_id} className='flex justify-between'>
//                     <span>
//                       {opt.fopt_name} ({opt.fopt_attribute})
//                     </span>
//                     <span>{opt.fopt_price.toLocaleString('vi-VN')} VNĐ</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           <div className='flex justify-between text-lg font-bold'>
//             <span>Tổng cộng:</span>
//             <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
//             <div>
//               <Label htmlFor='customerName'>Họ và tên</Label>
//               <Input id='customerName' placeholder='Nhập họ và tên' {...register('customerName')} />
//               {errors.customerName && <p className='text-red-500 text-sm mt-1'>{errors.customerName.message}</p>}
//             </div>
//             <div>
//               <Label htmlFor='phone'>Số điện thoại</Label>
//               <Input id='phone' type='tel' placeholder='Nhập số điện thoại' {...register('phone')} />
//               {errors.phone && <p className='text-red-500 text-sm mt-1'>{errors.phone.message}</p>}
//             </div>
//             <div>
//               <Label htmlFor='email'>Email</Label>
//               <Input id='email' type='email' placeholder='Nhập email' {...register('email')} />
//               {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
//             </div>

//             <div>
//               <Label htmlFor='province'>Tỉnh/Thành</Label>
//               <Select onValueChange={(value) => setValue('province', value)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder='Chọn tỉnh/thành' />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {provinces.map((province) => (
//                     <SelectItem key={province.ProvinceID} value={province.ProvinceID.toString()}>
//                       {province.ProvinceName}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {errors.province && <p className='text-red-500 text-sm mt-1'>{errors.province.message}</p>}
//             </div>

//             <div>
//               <Label htmlFor='district'>Quận/Huyện</Label>
//               <Select onValueChange={(value) => setValue('district', value)} disabled={!formProvince}>
//                 <SelectTrigger>
//                   <SelectValue placeholder='Chọn quận/huyện' />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {districts.map((district) => (
//                     <SelectItem key={district.DistrictID} value={district.DistrictID.toString()}>
//                       {district.DistrictName}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {errors.district && <p className='text-red-500 text-sm mt-1'>{errors.district.message}</p>}
//             </div>

//             <div>
//               <Label htmlFor='ward'>Phường/Xã</Label>
//               <Select onValueChange={(value) => setValue('ward', value)} disabled={!formDistrict}>
//                 <SelectTrigger>
//                   <SelectValue placeholder='Chọn phường/xã' />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {wards.map((ward) => (
//                     <SelectItem key={ward.WardCode} value={ward.WardCode}>
//                       {ward.WardName}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {errors.ward && <p className='text-red-500 text-sm mt-1'>{errors.ward.message}</p>}
//             </div>

//             <div>
//               <Label htmlFor='addressDetail'>Địa chỉ chi tiết</Label>
//               <Input id='addressDetail' placeholder='Số nhà, tên đường...' {...register('addressDetail')} />
//               {errors.addressDetail && <p className='text-red-500 text-sm mt-1'>{errors.addressDetail.message}</p>}
//             </div>

//             <div>
//               <Label htmlFor='note'>Ghi chú</Label>
//               <Textarea id='note' placeholder='Ghi chú thêm (nếu có)' {...register('note')} />
//             </div>

//             <div>
//               <Label htmlFor='shippingMethod'>Phương thức giao hàng</Label>
//               <Select onValueChange={(value) => setValue('shippingMethod', value)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder='Chọn phương thức giao hàng' />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value='standard'>Giao hàng tiêu chuẩn</SelectItem>
//                   <SelectItem value='express'>Giao hàng nhanh</SelectItem>
//                 </SelectContent>
//               </Select>
//               {errors.shippingMethod && <p className='text-red-500 text-sm mt-1'>{errors.shippingMethod.message}</p>}
//             </div>

//             {shippingFeeGHTK !== null && (
//               <div className='flex justify-between'>
//                 <span className='font-semibold'>Phí giao hàng:</span>
//                 <span>{shippingFeeGHTK.toLocaleString('vi-VN')} VNĐ</span>
//               </div>
//             )}
//             {(shippingFeeGHN !== null || shippingFeeGHTK !== null) && (
//               <div className='flex justify-between text-lg font-bold'>
//                 <span>Tổng cộng (bao gồm phí giao):</span>
//                 <span>
//                   {(totalPrice + Math.min(shippingFeeGHN || Infinity, shippingFeeGHTK || Infinity)).toLocaleString(
//                     'vi-VN'
//                   )}{' '}
//                   VNĐ
//                 </span>
//               </div>
//             )}

//             <Button type='submit' className='w-full'>
//               Xác nhận đặt hàng
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
