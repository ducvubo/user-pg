export interface IFoodRestaurant {
  food_cat_id: string
  food_close_time: string
  food_description: string
  food_image: string
  food_name: string
  food_note: string
  food_open_time: string
  food_price: number
  food_sort: number
  food_slug: string
  createdBy: string
  food_res_id: string
  updatedBy: string | null
  deletedBy: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  isDeleted: number
  food_id: string
  food_state: 'soldOut' | 'inStock' | 'almostOut'
  fopt_food: IFoodOption[]
}

export interface IFoodOption {
  fopt_id: string
  fopt_res_id: string
  fopt_food_id: string
  fopt_name: string
  fopt_attribute: string
  fopt_price: number
  fopt_image: string
  fopt_state: 'soldOut' | 'inStock' | 'almostOut'
  fopt_note: string
}
