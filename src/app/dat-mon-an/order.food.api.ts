'use server'

import { sendRequest } from "@/lib/api";
import { CreateOrderFoodDto, IOrderFood } from "./order.food.interface";




export const calcPriceShipingGHTK = async (requestBody: any) => {
  const response = await fetch('https://services.giaohangtietkiem.vn/services/shipment/fee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Token: '1K1tp2IaUYgYNyfnz0Jduxscm8f14oL0oMzStb1'
    },
    body: JSON.stringify(requestBody)
  })
  const data = await response.json()
  console.log('data', data);
  return data
}

export const calcPriceShippingGHN = async (requestBody: any) => {
  const response = await fetch('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Token: '3b43de66-111c-11f0-8686-8669292be81e'
    },
    body: JSON.stringify(requestBody)
  })
  const data = await response.json()
  console.log('data', data);
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
