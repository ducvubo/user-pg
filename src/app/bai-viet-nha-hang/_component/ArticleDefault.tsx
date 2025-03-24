import { IArticleRestaurant } from '@/app/nha-hang/api';
import React from 'react';
import Image from 'next/image';

interface IProps {
  article: IArticleRestaurant;
}

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

const parseContent = (contentString: string) => {
  try {
    const parsed = JSON.parse(contentString);
    return parsed.content || '';
  } catch (error) {
    console.error('Error parsing atlContent JSON:', error);
    return '';
  }
};

const sanitizeHTML = (html: string) => {
  return html;
};

export default async function ArticleDefault({ article }: IProps) {
  const { imageCustom } = parseImage(article.atlImage);

  const content = parseContent(article.atlContent);

  const sanitizedContent = sanitizeHTML(content);

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

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />

      {/* Danh sách bài viết liên quan (nếu có) */}
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