import { IRestaurant } from '@/app/interface/restaurant.interface';
import { getArtilceRestaurant, getCategoryBlogRestaurant, IArticleRestaurant, ICategoryBlogRestaurant } from '../api';
import BlockBlogClient from './BlockBlogClient';


interface Props {
  inforRestaurant: IRestaurant;
  catBlogRestaurant?: IBackendRes<ICategoryBlogRestaurant[]>;
  articleRestaurant: IBackendRes<IArticleRestaurant[]>
}

export default async function BlockBlog({ inforRestaurant, articleRestaurant, catBlogRestaurant }: Props) {

  if (!articleRestaurant || articleRestaurant.statusCode !== 200 || !articleRestaurant.data || articleRestaurant.data.length === 0) {
    return (
      <div>
        <BlockBlogClient articles={[]} />
        <div className="text-center text-gray-500 mt-4">Không có bài viết nào để hiển thị.</div>
      </div>
    );
  }

  return (
    <div>
      <BlockBlogClient articles={articleRestaurant.data} />
    </div>
  );
}