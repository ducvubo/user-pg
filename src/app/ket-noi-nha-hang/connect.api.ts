'use server';

import { sendRequest } from "@/lib/api";
import { IRestaurant } from "../interface/restaurant.interface";

export const searchRestaurantByName = async ({ name }: { name: string }) => {
  const res: IBackendRes<IRestaurant[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants/search-login-employee`,
    method: 'GET',
    queryParams: {
      search: name
    }
  })

  return res;
}

export const getRestaurantById = async ({ id }: { id: string }) => {
  const res: IBackendRes<IRestaurant> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants/get-restaurant-by-id/${id}`,
    method: 'GET',
  })

  return res;
}