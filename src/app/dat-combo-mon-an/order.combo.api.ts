'use server';

import { sendRequest } from "@/lib/api";
import { CreateOrderFoodCombo, IOrderFoodCombo } from "./order.combo.interface";



export const createOrderFoodCombo = async (createOrderCombo: CreateOrderFoodCombo) => {
  const res: IBackendRes<IOrderFoodCombo> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/create-order-food-combo`,
    method: 'POST',
    body: createOrderCombo,
  })
  return res
}