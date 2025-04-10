'use server'

import { sendRequest } from "@/lib/api";

export interface CreateOrderFoodItemDto {
  food_id: string;
  food_options?: string[];
  od_it_quantity: number;
}

export interface CreateOrderFoodDto {
  od_res_id: string;
  od_user_id?: number;
  od_user_name: string;
  od_user_phone: string;
  od_user_email: string;
  od_user_address: string;
  od_user_province: string;
  od_user_district: string;
  od_user_ward: string;
  od_user_note?: string;
  od_type_shipping: 'GHN' | 'GHTK';
  od_price_shipping: number;
  od_link_confirm: string;
  order_food_items?: CreateOrderFoodItemDto[];
}

export interface IOrderFood {
  od_id: string;
  od_res_id: string;
  od_user_id: string;
  id_user_guest: string;
  od_user_name: string;
  od_user_phone: string;
  od_user_email: string;
  od_user_address: string;
  od_user_province: string;
  od_user_district: string;
  od_user_ward: string;
  od_user_note: string;

  od_status:
  | 'waiting_confirm_customer'
  | 'over_time_customer'
  | 'waiting_confirm_restaurant'
  | 'waiting_shipping'
  | 'shipping'
  | 'delivered_customer'
  | 'received_customer'
  | 'cancel_customer'
  | 'cancel_restaurant'
  | 'complaint'
  | 'complaint_done';

  od_type_shipping: 'GHN' | 'GHTK';
  od_price_shipping: number;
  od_atribute: string;
  od_feed_star: 0 | 1 | 2 | 3 | 4 | 5;
  od_feed_content: string;
  od_feed_reply: string;
  od_feed_view: 'active' | 'disable';
  od_created_at: Date;
  orderItems: IOrderFoodItem[];
}

export interface IOrderFoodItem {
  od_it_id: string;
  od_res_id: string;
  od_id: string; 
  fsnp_id: string;
  od_it_quantity: number;
  foodSnap: IFoodSnap; 
}
export interface IFoodSnap {
  fsnp_id: string;
  food_id: string;
  food_cat_id: string;
  fsnp_res_id: string;

  fsnp_name: string;
  fsnp_slug: string;
  fsnp_description: string;
  fsnp_price: number;
  fsnp_image: string;
  fsnp_note: string;
  fsnp_options: string;
}


export const calcPriceShipingGHTK = async (requestBody: any) => {
  console.log('🚀 ~ calcPriceShipingGHTK ~ requestBody:')
  const response = await fetch('https://services.giaohangtietkiem.vn/services/shipment/fee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Token: '1K1tp2IaUYgYNyfnz0Jduxscm8f14oL0oMzStb1'
    },
    body: JSON.stringify(requestBody)
  })
  const data = await response.json()
  return data
}

export const calcPriceShippingGHN = async (requestBody: any) => {
  console.log('🚀 ~ calcPriceShippingGHN ~ requestBody:', requestBody)
  const response = await fetch('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Token: '3b43de66-111c-11f0-8686-8669292be81e'
    },
    body: JSON.stringify(requestBody)
  })
  const data = await response.json()
  return data
}

export const createOrderFood = async (createOrderFoodDto: CreateOrderFoodDto) => {
  const res: IBackendRes<IOrderFood> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/create-order-food`,
    method: 'POST',
    body: createOrderFoodDto,
  })

  return res
}
