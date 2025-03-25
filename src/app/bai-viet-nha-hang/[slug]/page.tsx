import { IRestaurant } from '@/app/interface/restaurant.interface'
import dynamic from 'next/dynamic'
import PageArticleRestaurant from '../_component/PageArticleRestaurant'
import { getArticleRestaurantBySlug } from '../article.api'
import { IArticleRestaurant } from '@/app/nha-hang/api'
const ToastServer = dynamic(() => import('@/components/ToastServer'), {
  ssr: true
})

interface PageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    [key: string]: string | undefined
  }>
}

export default async function ArticleDetail({ searchParams, params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug
  const article: IBackendRes<IArticleRestaurant> = await getArticleRestaurantBySlug(slug)

  if (article.statusCode !== 200 || !article.data) {
    return (
      <div>
        <ToastServer message='Không tìm thấy bài viết' title='Lỗi' variant='destructive' />
      </div>
    )
  }

  return (
    <>
      <PageArticleRestaurant article={article.data} />
    </>
  )
}
