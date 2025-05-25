import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { GetRestaurantById } from '@/app/home/home.api';
import { getAmenityByRestaurantId, getMenuItemByRestaurantId, getRoomById } from '../room.api';
import PageInforRoom from '../_component/PageInforRoom';
import { IRoom } from '@/app/nha-hang/api';

const ToastServer = dynamic(() => import('@/components/ToastServer'), { ssr: true });

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}
// *** HÀM generateMetadata: TẠO METADATA ĐỘNG CHUẨN SEO CHO PHÒNG ***
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolveParams = await params
  const slug = resolveParams.slug;
  const roomRes = await getRoomById(slug);

  if (roomRes.statusCode !== 200 || !roomRes.data) {
    return {
      title: 'Phòng không tìm thấy - PATO',
      description: 'Xin lỗi, chúng tôi không tìm thấy thông tin phòng này tại PATO.',
      robots: 'noindex, nofollow', // Ngăn Google lập chỉ mục trang lỗi
    };
  }

  const room = roomRes.data;

  // Làm sạch mô tả và cắt ngắn cho SEO description
  const cleanDescription = room.room_description
    ? room.room_description.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
    : `Thông tin chi tiết về phòng ${room.room_name} tại PATO.`;

  // URL ảnh mặc định nếu không có ảnh từ API
  const imageUrl = room.room_images || 'https://res.cloudinary.com/dkjasvlw6/image/upload/v1741005120/default/jjkajlyw8vrdtdg7ut06.webp'; // Fallback image chung của PATO
  const canonicalUrl = `https://pato.taphoaictu.id.vn/room/${room.room_id}`; // Sử dụng room_id hoặc room_slug nếu có

  return {
    // Tiêu đề trang: Tên phòng, sức chứa, giá, thương hiệu, và vị trí
    title: `Phòng ${room.room_name} - Sức chứa ${room.room_max_guest} người - Giá ${room.room_base_price.toLocaleString('vi-VN')} VNĐ | PATO - Nhà Hàng Nướng Lẩu Lục Nam`,
    // Mô tả trang: Hấp dẫn, tóm tắt thông tin phòng, tiện ích, khuyến khích đặt phòng
    description: `Khám phá phòng ${room.room_name} lý tưởng cho ${room.room_max_guest} người tại PATO. Với không gian ${room.room_area}, tiện nghi hiện đại. ${cleanDescription} Đặt phòng ngay cho sự kiện của bạn!`,
    // Từ khóa: Tên phòng, loại hình phòng, sức chứa, tiện ích, nhà hàng, địa điểm
    keywords: `phòng ${room.room_name}, phòng riêng PATO, đặt phòng nhà hàng, phòng tiệc Lục Nam, không gian riêng Bắc Giang, phòng ăn riêng, ${room.room_max_guest} người, nhà hàng PATO`,
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl, // Đặt canonical URL rõ ràng
    },
    openGraph: {
      title: `Phòng ${room.room_name} - PATO Nhà Hàng`,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: 'PATO Nhà Hàng',
      images: [
        {
          url: imageUrl,
          width: 1200, // Kích thước khuyến nghị cho Open Graph
          height: 630,
          alt: `Hình ảnh phòng ${room.room_name} tại PATO`,
        },
      ],
      locale: 'vi_VN',
      type: 'website', // Hoặc 'business.business_location' nếu bạn muốn chi tiết hơn về địa điểm
    },
    twitter: {
      card: 'summary_large_image',
      title: `Phòng ${room.room_name} - PATO Nướng Lẩu`,
      description: cleanDescription,
      images: [imageUrl],
    },
  };
}

// Component chính của trang chi tiết phòng
export default async function RoomDetail({ params }: PageProps) {
  const resolveParams = await params;
  const slug = resolveParams.slug;
  const roomRes = await getRoomById(slug);

  if (roomRes.statusCode !== 200 || !roomRes.data) {
    return <ToastServer message='Không tìm thấy phòng' title='Lỗi' variant='destructive' />;
  }

  const roomData: IRoom = roomRes.data;
  const roomResId = roomData.room_res_id;

  // Gọi API song song để tối ưu tốc độ
  const [restaurant, listMenuItems, listAmenity] = await Promise.all([
    GetRestaurantById(roomResId),
    getMenuItemByRestaurantId(roomResId), // Giả định đây là menu có sẵn trong phòng/nhà hàng
    getAmenityByRestaurantId(roomResId), // Giả định đây là tiện nghi của phòng
  ]);

  // Cấu hình Structured Data (Schema.org) cho Place/Restaurant (tùy thuộc vào cách bạn muốn thể hiện)
  // Trong trường hợp này, chúng ta có thể sử dụng "Place" hoặc "LocalBusiness" để mô tả phòng.
  const roomSchema = {
    "@context": "https://schema.org",
    "@type": "Room", // Hoặc "Place", "LocalBusiness"
    "name": `Phòng ${roomData.room_name} - PATO`,
    "description": roomData.room_description.replace(/<[^>]*>/g, ''),
    "image": roomData.room_images,
    "url": `https://pato.taphoaictu.id.vn/room/${roomData.room_id}`,
    "containedInPlace": { // Liên kết phòng với nhà hàng
      "@type": "Restaurant",
      "name": "PATO - Nhà Hàng Nướng & Lẩu",
      "url": "https://pato.taphoaictu.id.vn",
      // Có thể thêm address, telephone của nhà hàng nếu có
    },
    "amenityFeature": listAmenity.data?.map(amenity => ({ // Liệt kê tiện nghi
      "@type": "LocationFeatureSpecification",
      "name": amenity.ame_name, // Giả định amenity có ame_name
      "value": true
    })) || [],
    "occupancy": { // Sức chứa của phòng
      "@type": "QuantitativeValue",
      "value": roomData.room_max_guest,
      "unitText": "người"
    },
    "floorSize": { // Diện tích phòng
      "@type": "QuantitativeValue",
      "value": parseFloat(roomData.room_area), // Chuyển đổi sang số nếu cần
      "unitCode": "SQM" // Square Meters
    },
    "hasOfferCatalog": { // Có thể liên kết với các gói/giá thuê phòng
      "@type": "OfferCatalog",
      "name": "Gói thuê phòng",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Thuê phòng theo giờ/buổi"
          },
          "price": roomData.room_base_price.toString(),
          "priceCurrency": "VND"
        }
      ]
    },
    // Trạng thái phòng (nếu có thể đặt trực tuyến)
    "availableAtOrFrom": roomData.room_status === 'enable' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
  };


  return (
    <>
      {/* Script cho Structured Data (Room Schema) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roomSchema) }}
      />

      {restaurant.statusCode === 200 && restaurant.data && (
        <PageInforRoom
          restaurant={restaurant.data}
          roomRes={roomData} // Sử dụng roomData đã lấy
          listAmenity={listAmenity.data || []}
          listMenuItems={listMenuItems.data || []}
        />
      )}
    </>
  );
}