import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getComboFoodBySlug } from '../combo.food.api';
import PageInforComboFood from '../_component/PageInforComboFood';
import { getFoodRestaurant, getListCombo } from '@/app/nha-hang/api';
import { GetRestaurantById } from '@/app/home/home.api';
import { IComboFood } from '@/app/nha-hang/_component/ComboList';

const ToastServer = dynamic(() => import('@/components/ToastServer'), { ssr: true });

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

// *** HÀM generateMetadata: TẠO METADATA ĐỘNG CHUẨN SEO CHO COMBO ***
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolveParams = await params
  const slug = resolveParams.slug;
  const comboFoodRes = await getComboFoodBySlug(slug);

  if (comboFoodRes.statusCode !== 200 || !comboFoodRes.data) {
    return {
      title: 'Combo món ăn không tìm thấy - PATO',
      description: 'Xin lỗi, chúng tôi không tìm thấy thông tin cho gói combo món ăn này tại PATO.',
      robots: 'noindex, nofollow',
    };
  }

  const comboFood = comboFoodRes.data;

  const cleanDescription = comboFood.fcb_description
    ? comboFood.fcb_description.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
    : `Khám phá combo ${comboFood.fcb_name} siêu tiết kiệm và hấp dẫn tại PATO.`;

  const imageUrl = comboFood.fcb_image || 'https://res.cloudinary.com/dkjasvlw6/image/upload/v1741005120/default/jjkajlyw8vrdtdg7ut06.webp';
  const canonicalUrl = `https://pato.taphoaictu.id.vn/combo-mon-an/${comboFood.fcb_slug}`;

  // Lấy tên các món ăn trong combo để tăng cường từ khóa
  const foodNamesInCombo = comboFood.fcbi_combo.map(item => item.fcbi_food.food_name).join(', ');

  return {
    title: `${comboFood.fcb_name} - Tiết kiệm ${comboFood.fcb_price.toLocaleString('vi-VN')} VNĐ | PATO - Nhà Hàng Nướng Lẩu Lục Nam`,
    description: `Combo ${comboFood.fcb_name} cực kỳ hấp dẫn tại PATO, bao gồm ${foodNamesInCombo}. ${cleanDescription} Đặt combo ngay để nhận ưu đãi!`,
    keywords: `${comboFood.fcb_name}, combo ${comboFood.fcb_name} PATO, combo nướng Lục Nam, combo lẩu Bắc Giang, ưu đãi combo, ${foodNamesInCombo}, nhà hàng PATO`,
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${comboFood.fcb_name} - PATO Nhà Hàng Nướng Lẩu`,
      description: `Combo ${comboFood.fcb_name} đặc biệt, ${cleanDescription}`,
      url: canonicalUrl,
      siteName: 'PATO Nhà Hàng',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Hình ảnh combo ${comboFood.fcb_name} tại PATO`,
        },
      ],
      locale: 'vi_VN',
      type: 'website', // Vẫn là 'product' vì đây là một gói sản phẩm
    },
    twitter: {
      card: 'summary_large_image',
      title: `${comboFood.fcb_name} - PATO Ưu Đãi Combo`,
      description: `Combo ${comboFood.fcb_name}: ${cleanDescription}`,
      images: [imageUrl],
    },
  };
}

// Component chính của trang chi tiết combo món ăn
export default async function ComboFoodDetail({ params }: PageProps) {
  const resolveParams = await params
  const slug = resolveParams.slug;
  const comboFoodRes = await getComboFoodBySlug(slug);

  if (comboFoodRes.statusCode !== 200 || !comboFoodRes.data) {
    return <ToastServer message='Không tìm thấy combo món ăn' title='Lỗi' variant='destructive' />;
  }

  const comboFoodData: IComboFood = comboFoodRes.data;
  const comboFoodResId = comboFoodData.fcb_res_id;

  const [restaurant, listFood, listCombo] = await Promise.all([
    GetRestaurantById(comboFoodResId),
    getFoodRestaurant(comboFoodResId),
    getListCombo(comboFoodResId),
  ]);

  // Cấu hình Structured Data (Schema.org) cho Product (Combo)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": comboFoodData.fcb_name,
    "description": comboFoodData.fcb_description.replace(/<[^>]*>/g, ''),
    "image": comboFoodData.fcb_image,
    "url": `https://pato.taphoaictu.id.vn/combo-mon-an/${comboFoodData.fcb_slug}`,
    "brand": {
      "@type": "Brand",
      "name": "PATO - Nhà Hàng Nướng & Lẩu"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "VND",
      "price": comboFoodData.fcb_price.toString(),
      "itemCondition": "https://schema.org/NewCondition",
      "availability": comboFoodData.fcb_state === 'inStock' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "PATO - Nhà Hàng Nướng & Lẩu",
        "url": "https://pato.taphoaictu.id.vn"
      }
    },
    // Nếu có hệ thống đánh giá cho combo
    // "aggregateRating": {
    //   "@type": "AggregateRating",
    //   "ratingValue": "4.9",
    //   "reviewCount": "75"
    // },
    // Để chi tiết các món trong combo (tùy chọn, có thể làm schema phức tạp hơn)
    // "isRelatedTo": comboFoodData.fcbi_combo.map(item => ({
    //     "@type": "Product",
    //     "name": item.fcbi_food.food_name,
    //     "url": `https://pato.taphoaictu.id.vn/food/${item.fcbi_food.food_slug}`
    // }))
  };

  return (
    <>
      {/* Script cho Structured Data (Product Schema) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {restaurant.statusCode === 200 && restaurant.data && (
        <PageInforComboFood
          restaurant={restaurant.data}
          listCombo={listCombo.data || []}
          listFood={listFood.data || []}
          comboFood={comboFoodData}
        />
      )}
    </>
  );
}