import { IArticleRestaurant } from '@/app/nha-hang/api';
import React from 'react';
import Image from 'next/image';

interface IProps {
  article: IArticleRestaurant;
}

interface ImageContent {
  imageLink: string;
  imageName: string;
  imageDescription: string;
  id: string | null;
}

interface ImageLink {
  image_cloud: string;
  image_custom: string;
}

const parseImage = (imageString: string): ImageLink => {
  try {
    const parsed = JSON.parse(imageString);
    return {
      image_cloud: parsed.image_cloud || '',
      image_custom: parsed.image_custom || '',
    };
  } catch (error) {
    console.error('Error parsing image JSON:', error);
    return { image_cloud: '', image_custom: '' };
  }
};

const parseImageLink = (imageLinkString: string): ImageLink => {
  try {
    const parsed = JSON.parse(imageLinkString);
    return {
      image_cloud: parsed.image_cloud || '',
      image_custom: parsed.image_custom || '',
    };
  } catch (error) {
    console.error('Error parsing imageLink JSON:', error);
    return { image_cloud: '', image_custom: '' };
  }
};

const parseContent = (contentString: string): ImageContent[] => {
  try {
    const parsed = JSON.parse(contentString);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error('Error parsing atlContent JSON:', error);
    return [];
  }
};

export default async function ArticleImage({ article }: IProps) {
  const { imageCustom } = parseImage(article.atlImage) as any;

  const imageContents = parseContent(article.atlContent);

  const publishedDate = new Date(article.atlPublishedTime).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="article-container max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{article.atlTitle}</h1>

      <div className="text-gray-500 text-sm mb-4">
        <span>Đăng ngày: {publishedDate}</span> | <span>Lượt xem: {article.atlView}</span>
      </div>

     
      {imageCustom && (
        <div className="mb-6">
          <Image
            src={imageCustom}
            alt={article.atlTitle}
            width={800}
            height={400}
            className="w-full h-auto object-cover rounded-lg"
            priority
          />
        </div>
      )}

      {imageContents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {imageContents.map((imageContent, index) => {
            const { image_custom } = parseImageLink(imageContent.imageLink);
            return (
              <div key={index} className="border rounded-lg p-4">
                {image_custom && (
                  <Image
                    src={image_custom}
                    alt={imageContent.imageName || `Image ${index + 1}`}
                    width={300}
                    height={300}
                    className="w-full h-auto object-cover rounded-lg mb-2"
                  />
                )}
                <h3 className="text-lg font-semibold">{imageContent.imageName}</h3>
                <p className="text-gray-600">{imageContent.imageDescription}</p>
              </div>
            );
          })}
        </div>
      )}

      {article.listArticleRelated && article.listArticleRelated.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Bài viết liên quan</h2>
          <ul className="space-y-2">
            {article.listArticleRelated.map((relatedArticle) => (
              <li key={relatedArticle.atlId}>
                <a
                  href={`/nha-hang/${relatedArticle.atlSlug}`}
                  className="text-blue-600 hover:underline"
                >
                  {relatedArticle.atlTitle}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}