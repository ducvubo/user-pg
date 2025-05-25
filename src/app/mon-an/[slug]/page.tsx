import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getFoodBySlug } from '../food.api';
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'; // Đảm bảo import đúng
import PageInforFood from '../_component/PageInforFood';
import { getFoodRestaurant, getListCombo } from '@/app/nha-hang/api';
import { GetRestaurantById } from '@/app/home/home.api';

const ToastServer = dynamic(() => import('@/components/ToastServer'), { ssr: true });

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

// *** HÀM generateMetadata: TẠO METADATA ĐỘNG CHUẨN SEO ***
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolveParams = await params
  const slug = resolveParams.slug;
  const foodRes = await getFoodBySlug(slug);

  if (foodRes.statusCode !== 200 || !foodRes.data) {
    return {
      title: 'Món ăn không tìm thấy - PATO',
      description: 'Xin lỗi, chúng tôi không tìm thấy thông tin cho món ăn này tại PATO.',
      robots: 'noindex, nofollow', // Quan trọng: Ngăn Google index trang lỗi
    };
  }

  const food = foodRes.data;

  // Làm sạch mô tả và cắt ngắn cho SEO description
  const cleanDescription = food.food_description
    ? food.food_description.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
    : `Khám phá món ${food.food_name} thơm ngon, chuẩn vị tại PATO.`;

  // URL ảnh mặc định nếu không có ảnh từ API
  const imageUrl = food.food_image || 'https://res.cloudinary.com/dkjasvlw6/image/upload/v1741005120/default/jjkajlyw8vrdtdg7ut06.webp';
  const canonicalUrl = `https://pato.taphoaictu.id.vn/food/${food.food_slug}`;

  return {
    // Tiêu đề trang: Tên món ăn, giá, thương hiệu, và loại hình nhà hàng
    title: `${food.food_name} - Giá ${food.food_price.toLocaleString('vi-VN')} VNĐ | PATO - Nhà Hàng Nướng Lẩu Lục Nam Bắc Giang`,
    // Mô tả trang: Hấp dẫn, chứa từ khóa, khuyến khích hành động
    description: `Thưởng thức ${food.food_name} đặc sắc của PATO: ${cleanDescription} Đặt món ngay để trải nghiệm hương vị đích thực!`,
    // Từ khóa: Rộng hơn, bao gồm vị trí và loại hình món ăn
    keywords: `${food.food_name}, ${food.food_name} PATO, ${food.food_name} Lục Nam, món ăn PATO, nướng Lục Nam, lẩu Lục Nam, đặc sản Lục Nam, nhà hàng Bắc Giang, ${food.food_cat_id}`, // Cần map food_cat_id sang tên danh mục thực tế
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl, // Đặt canonical URL rõ ràng
    },
    openGraph: {
      title: `${food.food_name} - PATO Nhà Hàng Nướng Lẩu`,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: 'PATO Nhà Hàng',
      images: [
        {
          url: imageUrl,
          width: 1200, // Kích thước khuyến nghị cho Open Graph (1200x630)
          height: 630,
          alt: `Hình ảnh món ${food.food_name} tại PATO`,
        },
      ],
      locale: 'vi_VN',
      type: 'website', // Đặt type là 'product' để có rich snippets về sản phẩm
    },
    twitter: {
      card: 'summary_large_image',
      title: `${food.food_name} - PATO Nướng Lẩu`,
      description: cleanDescription,
      images: [imageUrl],
    },
  };
}

// Component chính của trang chi tiết món ăn
export default async function FoodDetail({ params }: PageProps) {
  const resolveParams = await params
  const slug = resolveParams.slug;
  const foodRes = await getFoodBySlug(slug);

  if (foodRes.statusCode !== 200 || !foodRes.data) {
    return <ToastServer message='Không tìm thấy món ăn' title='Lỗi' variant='destructive' />;
  }

  const foodData: IFoodRestaurant = foodRes.data;
  const foodResId = foodData.food_res_id;

  // Gọi API song song để tối ưu tốc độ
  const [restaurant, listFood, listCombo] = await Promise.all([
    GetRestaurantById(foodResId),
    getFoodRestaurant(foodResId),
    getListCombo(foodResId),
  ]);

  // Cấu hình Structured Data (Schema.org) cho Product
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": foodData.food_name,
    "description": foodData.food_description.replace(/<[^>]*>/g, ''), // Đảm bảo mô tả không có HTML tags
    "image": foodData.food_image,
    "url": `https://pato.taphoaictu.id.vn/mon-an/${foodData.food_slug}`,
    "brand": {
      "@type": "Brand",
      "name": "PATO - Nhà Hàng Nướng & Lẩu"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "VND",
      "price": foodData.food_price.toString(),
      "itemCondition": "https://schema.org/NewCondition",
      "availability": foodData.food_state === 'inStock' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "PATO - Nhà Hàng Nướng & Lẩu",
        "url": "https://pato.taphoaictu.id.vn" // Thêm URL của PATO
      }
    },
    // Thêm đánh giá nếu có (rất quan trọng cho rich snippets)
    // "aggregateRating": {
    //   "@type": "AggregateRating",
    //   "ratingValue": "4.8", // Giá trị trung bình của rating
    //   "reviewCount": "120" // Tổng số lượng review
    // },
    // "review": [ // Ví dụ về một review cụ thể
    //   {
    //     "@type": "Review",
    //     "reviewRating": {
    //       "@type": "Rating",
    //       "ratingValue": "5"
    //     },
    //     "author": {
    //       "@type": "Person",
    //       "name": "Nguyễn Thị A"
    //     },
    //     "reviewBody": "Món nướng thực sự rất ngon và đậm đà, không gian ấm cúng. Sẽ quay lại!"
    //   }
    // ]
  };

  return (
    <>
      {/* Script cho Structured Data (Product Schema) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {restaurant.statusCode === 200 && restaurant.data && (
        <PageInforFood
          restaurant={restaurant.data}
          listCombo={listCombo.data || []}
          listFood={listFood.data || []}
          food={foodData} // Sử dụng foodData đã lấy
        />
      )}
    </>
  );
}