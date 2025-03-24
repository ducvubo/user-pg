import { IRestaurant } from '@/app/interface/restaurant.interface';
import { getArtilceRestaurant, getCategoryBlogRestaurant, IArticleRestaurant, ICategoryBlogRestaurant } from '../api';
import BlockBlogClient from './BlockBlogClient';


interface Props {
  inforRestaurant: IRestaurant;
}

export default async function BlockBlog({ inforRestaurant }: Props) {
  const catBlogRestaurant: IBackendRes<ICategoryBlogRestaurant[]> = await getCategoryBlogRestaurant(inforRestaurant._id);
  const articleRestaurant: IBackendRes<IArticleRestaurant[]> = await getArtilceRestaurant(inforRestaurant._id);

  if (!catBlogRestaurant || catBlogRestaurant.statusCode !== 200 || !catBlogRestaurant.data || catBlogRestaurant.data.length === 0) {
    return <div className="text-center text-gray-500">Không có danh mục nào để hiển thị.</div>;
  }

  if (!articleRestaurant || articleRestaurant.statusCode !== 200 || !articleRestaurant.data || articleRestaurant.data.length === 0) {
    return (
      <div>
        {catBlogRestaurant && catBlogRestaurant.data && catBlogRestaurant.data.length > 0 && (
          <BlockBlogClient categories={catBlogRestaurant.data} articles={[]} />
        )}
        <div className="text-center text-gray-500 mt-4">Không có bài viết nào để hiển thị.</div>
      </div>
    );
  }

  return (
    <div>
      {catBlogRestaurant && catBlogRestaurant.data && catBlogRestaurant.data.length > 0 && (
        <BlockBlogClient categories={catBlogRestaurant.data} articles={articleRestaurant.data} />
      )}
    </div>
  );
}