import { IArticleRestaurant } from '@/app/nha-hang/api'
import { getArticleRestaurantBySlug } from '../article.api'
import ArticleDefault from './ArticleDefault'
import ArticleImage from './ArticleImage'
import ArticleVideo from './ArticleVideo'

interface IProps {
  article: IArticleRestaurant
}

export default async function PageArticleRestaurant({ article }: IProps) {
  return <div className='px-4 md:px-8 lg:px-[100px] mt-10 h-auto'>
    {
      article.atlType === 'DEFAULT' && <ArticleDefault article={article} />
    }
    {
      article.atlType === 'IMAGE' && <ArticleImage article={article} />
    }
    {
      article.atlType === 'VIDEO' && <ArticleVideo article={article} />
    }
  </div>
}
