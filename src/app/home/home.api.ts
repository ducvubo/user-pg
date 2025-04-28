'use server'
import { sendRequest } from '@/lib/api'
import { IRestaurant } from '../interface/restaurant.interface'
import { SystemParameterEnum } from '../utils/ListSystemParameter'

const URL_SERVER = process.env.URL_SERVER

export interface ICategory {
  _id: string
  category_name: string
  category_icon: string

  category_slug: string

  category_description: string

  category_status: 'enable' | 'disable'
}

export interface IAmentities {
  _id: string
  amenity_name: string
}

export interface IRestaurantTypes {
  _id: string
  restaurant_type_name: string
}

export interface ISystemParameter {
  sys_para_description: string
  sys_para_id: string
  sys_para_value: string
}
export const getRestaurantHome = async (query: object) => {
  const res: IBackendRes<IRestaurant[]> = await sendRequest({
    url: `${URL_SERVER}/restaurants/home`,
    method: 'GET',
    queryParams: query,
    nextOption: {
      next: { revalidate: 3600 }
    }
  })
  return res
}

export const getAmentities = async () => {
  const res: IBackendRes<any[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/amenities`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const getRestaurantTypes = async () => {
  const res: IBackendRes<IRestaurantTypes[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurant-type`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const getAllCategoryName = async () => {
  const res: IBackendRes<ICategory[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/category`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const getSysteParameter = async () => {
  const res: IBackendRes<ISystemParameter[]> = await sendRequest({
    url: `${process.env.URL_SERVER_USER}/system-parameter`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const GetRestaurantById = async (id: string) => {
  const res: IBackendRes<IRestaurant> = await sendRequest({
    url: `${URL_SERVER}/restaurants/get-restaurant-by-id/${id}`,
    method: 'GET',
    nextOption: {
      revalidate: 3600
    }
  })
  return res
}

export const GetRestaurantByIds = async (restaurant_ids: string[]) => {
  const res: IBackendRes<IRestaurant[]> = await sendRequest({
    url: `${URL_SERVER}/restaurants/get-restaurant-by-ids`,
    method: 'POST',
    body: { restaurant_ids }
  })
  return res
}

export const GetCategoryByIds = async (category_ids: string[]) => {
  const res: IBackendRes<ICategory[]> = await sendRequest({
    url: `${URL_SERVER}/category/get-category-by-ids`,
    method: 'POST',
    body: { category_ids }
  })
  return res
}

export const getSysteParameterById = async (id: string) => {
  const res: IBackendRes<ISystemParameter> = await sendRequest({
    url: `${process.env.URL_SERVER_USER}/system-parameter/${id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const createTokenSync = async () => {
  const res: IBackendRes<string> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/sync/create-token`,
    method: 'POST',
  })
  return res
}

export const getMenuHeaderPato = async () => {
  const res: IBackendRes<ISystemParameter> = await sendRequest({
    url: `${process.env.URL_SERVER_USER}/system-parameter/${SystemParameterEnum.MENU_HEADER.sys_para_id}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}