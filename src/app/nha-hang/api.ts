'use server'
import { ICategoryRestaurant } from '../components/CategoryRestaurantBlock'
import { IFoodRestaurant } from '../interface/food-restaurant.interface'
import { IRestaurant } from '../interface/restaurant.interface'
import { ISpecialOffer } from './_component/InforRestaurant'
import { IComboFood } from './_component/ComboList'
import { IDish } from './_component/DishList'
import { cookies } from 'next/headers'
import { sendRequest } from '@/lib/api'

const URL_SERVER = process.env.URL_SERVER
const URL_SERVER_ORDER = process.env.URL_SERVER_ORDER

export interface ICreateBookTable {
  _id?: string
  book_tb_user_id?: string
  book_tb_restaurant_id: string
  book_tb_email: string
  book_tb_phone: string
  book_tb_name: string
  book_tb_date: Date
  book_tb_hour: string
  book_tb_number_adults: number
  book_tb_number_children: number
  book_tb_note?: string
  book_tb_redirect_url: string
  restaurant?: IRestaurant
  createdAt?: string
  book_tb_status?: string
  book_tb_star?: number
  book_tb_note_res?: string
  book_tb_feedback_restaurant?: string
  book_tb_feedback?: string
  book_tb_details?: IBookTableDetail[]
}

export interface IBookTableDetail {
  book_tb_detail_name: string
  book_tb_detail_status: string
  date_of_now: Date
}

export interface ICategoryBlogRestaurant {
  catId: string
  catName: string
  catSlug: string
}

export interface IArticleRestaurant {
  atlId: string
  catId: string
  atlTitle: string
  atlDescription: string
  atlSlug: string
  atlImage: string
  atlType: string | "DEFAULT"
  atlContent: string
  atlPublishedTime: number
  atlView: number
  listArticleRelated: any[]
}

export interface IRoom {
  room_id: string;
  room_res_id: string;
  room_name: string;
  room_fix_ame: string;
  room_max_guest: number;
  room_base_price: number;
  room_deposit: number;
  room_area: string;
  room_note: string;
  room_images: string;
  room_description: string;
  room_status: 'enable' | 'disable';
}


export const getRestaurantBySlug = async (slug: string) => {
  const res: IBackendRes<IRestaurant> = await sendRequest({
    url: `${URL_SERVER}/restaurants/slug/${slug}`,
    method: 'GET'
  })
  return res
}

export const getFoodRestaurant = async (restaurantId: string) => {
  const res: IBackendRes<IFoodRestaurant[]> = await sendRequest({
    url: `${URL_SERVER_ORDER}/food-restaurant/list-food/${restaurantId}`,
    method: 'GET'
  })
  return res
}

export const getCategoryRestaurant = async (restaurantId: string) => {
  const res: IBackendRes<ICategoryRestaurant[]> = await sendRequest({
    url: `${URL_SERVER}/category-restaurant/all-category/${restaurantId}`,
    method: 'GET'
  })
  return res
}

export const getRoomRestaurant = async (restaurantId: string) => {
  const res: IBackendRes<IRoom[]> = await sendRequest({
    url: `${process.env.URL_SERVER_ROOM}/rooms/room-by-restaurant/${restaurantId}`,
    method: 'GET'
  })
  return res
}

export const getSpecialOffer = async (restaurantId: string) => {
  const res: IBackendRes<ISpecialOffer[]> = await sendRequest({
    url: `${URL_SERVER_ORDER}/special-offers/list-special-offer/${restaurantId}`,
    method: 'GET'
  })
  return res
}

export const getListCombo = async (restaurantId: string) => {
  const res: IBackendRes<IComboFood[]> = await sendRequest({
    url: `${URL_SERVER_ORDER}/combo-food-res/list-combo-food/${restaurantId}`,
    method: 'GET'
  })
  return res
}

export const getListDish = async (restaurantId: string) => {
  const res: IBackendRes<IDish[]> = await sendRequest({
    url: `${URL_SERVER}/dishes/list-dish-restaurant/${restaurantId}`,
    method: 'GET'
  })
  return res
}

export const getCookie = async (name: string) => {
  const cookieStore = await cookies()
  return cookieStore.get(name)
}

export const addRestaurantToCookie = async (restaurantId: string) => {
  const cookie = await cookies()
  const restaurantListCookie = cookie.get('restaurantIds')?.value

  if (restaurantListCookie && !restaurantListCookie.includes(restaurantId)) {
    const listId = JSON.parse(restaurantListCookie)
    listId.push(restaurantId)

    if (listId.length > 15) {
      listId.pop()
    }

    await cookie.set('restaurantIds', JSON.stringify(listId), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10,
    })
  }

  return true
}

export const getListRestaurantByCategory = async (categoryId: string) => {
  const res: IBackendRes<IRestaurant[]> = await sendRequest({
    url: `${URL_SERVER}/restaurants/restaurant-by-id-cat/${categoryId}`,
    method: 'GET'
  })
  return res
}

export const createBookTable = async (data: ICreateBookTable) => {
  const res: IBackendRes<ICreateBookTable> = await sendRequest({
    url: `${URL_SERVER}/book-table`,
    method: 'POST',
    body: data
  })
  return res
}

export const getFeedBackBookTable = async ({
  restaurantId,
  pageSize,
  pageIndex,
  start
}: {
  restaurantId: string
  pageSize: string
  pageIndex: string
  start: number
}) => {
  const res: IBackendRes<IModelPaginate<ICreateBookTable>> = await sendRequest({
    url: `${URL_SERVER}/book-table/list-feedback_book_tb/${restaurantId}`,
    method: 'GET',
    queryParams: {
      pageIndex,
      pageSize,
      star: start,
    }
  })
  return res
}

//  @Get('/get-list-feedback-order-food')
//   @ResponseMessage('Lấy danh sách đánh giá thành công')
//   async getListFeedbackOrderFood(
//     @Query('pageIndex') pageIndex: string,
//     @Query('pageSize') pageSize: string,
//     @Query('star') star: string,
//     @Query('restaurant_id') restaurant_id: string
//   ): Promise<ResultPagination<OrderFoodEntity>> {
//     return await this.orderFoodService.getListFeedbackOrderFood({ pageIndex: +pageIndex, pageSize: +pageSize, star, restaurant_id });
//   }


export const getFeedBackOrderFood = async ({
  restaurantId,
  pageSize,
  pageIndex,
  start
}: {
  restaurantId: string
  pageSize: string
  pageIndex: string
  start: number
}) => {
  console.log("🚀 ~ start:", start)
  const res: IBackendRes<IModelPaginate<{
    od_id: string
    od_feed_star: number
    od_feed_content: string
    od_feed_reply: string
  }>> = await sendRequest({
    url: `${URL_SERVER_ORDER}/order-food/get-list-feedback-order-food/${restaurantId}`,
    method: 'GET',
    queryParams: {
      pageIndex,
      pageSize,
      star: start,
    }
  })
  return res
}

export const getFeedBackOrderFoodCombo = async ({
  restaurantId,
  pageSize,
  pageIndex,
  start
}: {
  restaurantId: string
  pageSize: string
  pageIndex: string
  start: number
}) => {
  const res: IBackendRes<IModelPaginate<{
    od_cb_id: string
    od_cb_feed_star: number
    od_cb_feed_content: string
    od_cb_feed_reply: string
  }>> = await sendRequest({
    url: `${URL_SERVER_ORDER}/order-food-combo/get-list-feedback-order-food-combo/${restaurantId}`,
    method: 'GET',
    queryParams: {
      pageIndex,
      pageSize,
      star: start,
    }
  })
  return res
}


export const getFeedBackBookRoom = async ({
  restaurantId,
  pageSize,
  pageIndex,
  start
}: {
  restaurantId: string
  pageSize: string
  pageIndex: string
  start: number
}) => {
  const res: IBackendRes<IModelPaginate<{
    bkr_id: string
    bkr_feedback: string
    bkr_reply: string
    bkr_star: number
  }>> = await sendRequest({
    url: `${process.env.URL_SERVER_ROOM}/book-room/restaurant-feedback-list/${restaurantId}`,
    method: 'GET',
    queryParams: {
      pageIndex,
      pageSize,
      star: start,
    }
  })
  return res
}

export const addRestaurantLike = async (restaurantId: string) => {
  const listLikedRestaurant = await getCookie('listLikedRestaurant');

  let listLikedRestaurantArr: string[] = [];

  if (listLikedRestaurant && listLikedRestaurant.value) {
    listLikedRestaurantArr = JSON.parse(listLikedRestaurant.value);

    if (listLikedRestaurantArr.includes(restaurantId)) {
      return {
        success: true,
        message: 'Restaurant already in favorites',
        list: listLikedRestaurantArr
      };
    }
  }

  listLikedRestaurantArr.unshift(restaurantId);

  if (listLikedRestaurantArr.length > 15) {
    listLikedRestaurantArr.pop();
  }

  const cookieStore = await cookies();
  cookieStore.set('listLikedRestaurant', JSON.stringify(listLikedRestaurantArr), {
    path: '/',
    maxAge: 60 * 60 * 24 * 365 * 10,
  });
}

export const removeRestaurantLike = async (restaurantId: string) => {
  const listLikedRestaurant = await getCookie('listLikedRestaurant');
  let listLikedRestaurantArr: string[] = [];
  if (listLikedRestaurant && listLikedRestaurant.value) {
    listLikedRestaurantArr = JSON.parse(listLikedRestaurant.value);
    listLikedRestaurantArr = listLikedRestaurantArr.filter((item) => item !== restaurantId);
  }
  const cookieStore = await cookies();
  cookieStore.set('listLikedRestaurant', JSON.stringify(listLikedRestaurantArr), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30000,
    sameSite: 'strict',
  });
}

export const findRecommendRestaurant = async (id_user?: string) => {
  const listLikedRestaurant = await getCookie('listLikedRestaurant');
  const listViewedRestaurant = await getCookie('restaurantIds');
  const res: IBackendRes<IRestaurant[]> = await sendRequest({
    url: `${URL_SERVER}/restaurants/recommend-restaurants`,
    method: 'POST',
    body: {
      id_user: id_user,
      list_like: listLikedRestaurant?.value ? JSON.parse(listLikedRestaurant.value) : [],
      list_view: listViewedRestaurant?.value ? JSON.parse(listViewedRestaurant.value) : []
    }
  })
  return res
}

export const getCategoryBlogRestaurant = async (restaurantId: string) => {
  const res: IBackendRes<ICategoryBlogRestaurant[]> = await sendRequest({
    url: `${process.env.URL_SERVER_BLOG}/categories/all-category-view`,
    method: 'GET',
    queryParams: {
      resId: restaurantId
    }
  })
  return res
}

export const getArtilceRestaurant = async (restaurantId: string) => {
  console.log("🚀 ~ getArtilceRestaurant ~ restaurantId:", restaurantId)
  const res: IBackendRes<IArticleRestaurant[]> = await sendRequest({
    url: `${process.env.URL_SERVER_BLOG}/articles/all-article-view`,
    method: 'GET',
    queryParams: {
      resId: restaurantId
    }
  })
  return res
}

export const addFoodToCart = async ({ food_id }: { food_id: string }) => {
  const res: IBackendRes<boolean> = await sendRequest({
    url: `${URL_SERVER_ORDER}/food-restaurant/add-food-to-cart`,
    method: 'POST',
    queryParams: { food_id }
  })
  return res
}

export const addComboToCart = async ({ fcb_id }: { fcb_id: string }) => {
  const res: IBackendRes<boolean> = await sendRequest({
    url: `${URL_SERVER_ORDER}/combo-food-res/add-combo-food-to-cart`,
    method: 'POST',
    queryParams: { fcb_id }
  })
  return res
}