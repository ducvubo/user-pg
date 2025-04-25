'use server'

import { sendRequest } from '@/lib/api'
import { IFoodRestaurant } from '../interface/food-restaurant.interface'
import { IRoom } from '../nha-hang/api'
import { IBookRoomEntity } from '../danh-sach-dat-phong/list.book.room.api';


export interface IAmenity {
  ame_id: string;
  ame_res_id: string;
  ame_name: string;
  ame_price: number;
  ame_note: string;
  ame_description: string;
  ame_status: 'enable' | 'disable';
}

export interface IMenuItem {
  mitems_id: string;
  mitems_res_id: string;
  mitems_name: string;
  mitems_price: number;
  mitems_image: string;
  mitems_note: string;
  mitems_description: string;
  mitems_status: 'enable' | 'disable';
}

export interface ICreateBookRoomDto {
  bkr_res_id: string;
  bkr_ame: string;
  bkr_email: string;
  bkr_phone: string;
  bkr_time_start: string;
  bkr_time_end: string;
  bkr_note: string;
  menu_items?: ICreateBookRoomMenu[];
  amenities?: ICreateBookRoomAmenity[];
  bkr_link_confirm: string;
}

export interface ICreateBookRoomMenu {
  menu_id: string;
  bkr_menu_quantity: number;
}

export interface ICreateBookRoomAmenity {
  amenity_id: string;
  bkr_amenity_quantity: number;
}



export const getRoomById = async (id: string) => {
  const res: IBackendRes<IRoom> = await sendRequest({
    url: `${process.env.URL_SERVER_ROOM}/rooms/infor-room/${id}`,
    method: 'GET'
  })
  return res
}

export const getMenuItemByRestaurantId = async (restaurantId: string) => {
  const res: IBackendRes<IMenuItem[]> = await sendRequest({
    url: `${process.env.URL_SERVER_ROOM}/menu-items/menu-by-restaurant/${restaurantId}`,
    method: 'GET'
  })
  return res
}

export const getAmenityByRestaurantId = async (restaurantId: string) => {
  const res: IBackendRes<IAmenity[]> = await sendRequest({
    url: `${process.env.URL_SERVER_ROOM}/amenities/ame-by-restaurant/${restaurantId}`,
    method: 'GET'
  })
  return res
}

export const createBookRoom = async (data: ICreateBookRoomDto) => {
  const res: IBackendRes<IBookRoomEntity> = await sendRequest({
    url: `${process.env.URL_SERVER_ROOM}/book-room/create-book-room`,
    method: 'POST',
    body: data
  })
  return res
}