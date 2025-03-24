import { IArticleRestaurant } from '@/app/nha-hang/api';
import React from 'react';
import Image from 'next/image';

interface IProps {
  article: IArticleRestaurant;
}

interface VideoContent {
  videoArticleType: 'EMBED' | 'LINK';
  contentVideo: string;
  description: string;
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

const parseContent = (contentString: string): VideoContent => {
  try {
    const parsed = JSON.parse(contentString);
    return {
      videoArticleType: parsed.videoArticleType || 'LINK',
      contentVideo: parsed.contentVideo || '',
      description: parsed.description || '',
    };
  } catch (error) {
    console.error('Error parsing atlContent JSON:', error);
    return { videoArticleType: 'LINK', contentVideo: '', description: '' };
  }
};

const adjustIframeDimensions = (iframeHtml: string): string => {
  let adjustedHtml = iframeHtml
    .replace(/width="[^"]*"/, 'width="100%"')
    .replace(/height="[^"]*"/, '');

  if (!adjustedHtml.includes('class=')) {
    adjustedHtml = adjustedHtml.replace('<iframe', '<iframe class="embed-video"');
  } else {
    adjustedHtml = adjustedHtml.replace('class="', 'class="embed-video ');
  }

  return adjustedHtml;
};

export default async function ArticleVideo({ article }: IProps) {
  const { imageCustom } = parseImage(article.atlImage) as any;

  const videoContent = parseContent(article.atlContent);

  const adjustedContentVideo =
    videoContent.videoArticleType === 'EMBED'
      ? adjustIframeDimensions(videoContent.contentVideo)
      : videoContent.contentVideo;

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

      <div className="mb-6">
        {videoContent.videoArticleType === 'EMBED' ? (
          <div className="relative w-full h-0 pb-[56.25%]">
            <div
              className="absolute top-0 left-0 w-full h-full"
              dangerouslySetInnerHTML={{ __html: adjustedContentVideo }}
            />
          </div>
        ) : (
          <video
            controls
            className="w-full h-auto rounded-lg"
            src={videoContent.contentVideo}
          >
            <source src={videoContent.contentVideo} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ thẻ video.
          </video>
        )}
      </div>

      {videoContent.description && (
        <div className="prose prose-lg max-w-none mb-6">
          <p>{videoContent.description}</p>
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

      <style>{`
        .embed-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }
      `}</style>
    </div>
  );
}