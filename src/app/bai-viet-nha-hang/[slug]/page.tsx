import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import PageArticleRestaurant from '../_component/PageArticleRestaurant';
import { getArticleRestaurantBySlug } from '../article.api';
import { IArticleRestaurant } from '@/app/nha-hang/api';
const ToastServer = dynamic(() => import('@/components/ToastServer'), {
  ssr: true,
});
const parseImage = (imageString: string) => {
  try {
    const parsed = JSON.parse(imageString);
    return {
      imageCloud: parsed.image_cloud || '',
      imageCustom: parsed.image_custom || '',
    };
  } catch (error) {
    console.error('Error parsing image JSON:', error);
    return { imageCloud: '', imageCustom: '' };
  }
};
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolveParams = await params
  const slug = resolveParams.slug;
  const articleRes = await getArticleRestaurantBySlug(slug);

  if (articleRes.statusCode !== 200 || !articleRes.data) {
    return {
      title: 'Bài viết không tìm thấy - PATO Blog',
      description: 'Xin lỗi, chúng tôi không tìm thấy bài viết này trong blog của PATO.',
      robots: 'noindex, nofollow',
    };
  }

  const article = articleRes.data;

  const cleanDescription = article.atlDescription
    ? article.atlDescription.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
    : `Tìm hiểu về ${article.atlTitle} từ PATO - Nhà hàng nướng lẩu tại Lục Nam Bắc Giang.`;

  const imageUrl = parseImage(article.atlImage).imageCloud || 'https://res.cloudinary.com/dkjasvlw6/image/upload/v1741005120/default/jjkajlyw8vrdtdg7ut06.webp';
  console.log("🚀 ~ generateMetadata ~ imageUrl:", imageUrl)
  const canonicalUrl = `https://pato.taphoaictu.id.vn/bai-viet-nha-hang/${article.atlSlug}`;

  return {
    title: `${article.atlTitle} | PATO - Tin Tức Nướng Lẩu Lục Nam Bắc Giang`,
    description: cleanDescription,
    keywords: `${article.atlTitle}, ${article.atlTitle} PATO, tin tức PATO, blog nhà hàng, nướng Lục Nam, lẩu Bắc Giang, ẩm thực Lục Nam, địa điểm ăn uống Bắc Giang, ${article.catId}`, // Cần map catId sang tên danh mục thực tế
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${article.atlTitle} - PATO Blog`,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: 'PATO Nhà Hàng - Blog',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.atlTitle,
        },
      ],
      locale: 'vi_VN',
      type: 'article',
      publishedTime: new Date(article.atlPublishedTime * 1000).toISOString(),
      authors: ['PATO - Nhà Hàng Nướng Lẩu'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.atlTitle} - PATO Blog`,
      description: cleanDescription,
      images: [imageUrl],
    },
  };
}

export default async function ArticleDetail({ params }: PageProps) {
  const resolveParams = await params
  const slug = resolveParams.slug;
  const articleRes = await getArticleRestaurantBySlug(slug);

  if (articleRes.statusCode !== 200 || !articleRes.data) {
    return (
      <div>
        <ToastServer message='Không tìm thấy bài viết' title='Lỗi' variant='destructive' />
      </div>
    );
  }

  const articleData: IArticleRestaurant = articleRes.data;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleData.atlTitle,
    "image": [
      parseImage(articleData.atlImage).imageCloud || "https://res.cloudinary.com/dkjasvlw6/image/upload/v1741005120/default/jjkajlyw8vrdtdg7ut06.webp",
    ],
    "datePublished": new Date(articleData.atlPublishedTime * 1000).toISOString(),
    // "dateModified": new Date(articleData.atlUpdatedTime * 1000).toISOString(), // Nếu có trường updatedTime
    "author": {
      "@type": "Organization", // Hoặc "Person" nếu có tác giả cụ thể
      "name": "PATO - Nhà Hàng Nướng & Lẩu",
      "url": "https://pato.taphoaictu.id.vn",
    },
    "publisher": {
      "@type": "Organization",
      "name": "PATO - Nhà Hàng Nướng & Lẩu",
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/dkjasvlw6/image/upload/v1741005120/default/jjkajlyw8vrdtdg7ut06.webp", // Logo của PATO
      }
    },
    "description": articleData.atlDescription.replace(/<[^>]*>/g, ''), // Đảm bảo mô tả không có HTML tags
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://pato.taphoaictu.id.vn/bai-viet-nha-hang/${articleData.atlSlug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <PageArticleRestaurant article={articleData} />
    </>
  );
}