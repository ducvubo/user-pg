export interface IRestaurant {
  _id: string
  restaurant_email: string
  isDeleted: boolean
  restaurant_phone: string
  restaurant_category: RestaurantCategory[]
  restaurant_name: string
  restaurant_slug: string
  restaurant_bank: RestaurantBank
  restaurant_banner: RestaurantBanner
  restaurant_image: RestaurantImage[]
  restaurant_address: RestaurantAddress
  restaurant_price: RestaurantPrice
  restaurant_type: {
    _id: string
    restaurant_type_name: string
  }[]
  restaurant_amenity: {
    _id: string
    amenity_name: string
  }[]
  restaurant_hours: RestaurantHour[]
  restaurant_overview: string
  restaurant_description: string
  restaurant_verify: boolean
  restaurant_status: 'active' | 'inactive' | 'banned'
  restaurant_state: boolean
}

export interface RestaurantCategory {
  _id: string
  createdBy: CreatedBy
  isDeleted: boolean
  category_name: string
  category_icon: string
  category_slug: string
  category_description: string
  category_status: string
  createdAt: string
  updatedAt: string
  __v: number
  updatedBy?: UpdatedBy
}

export interface CreatedBy {
  email: string
  _id: string
}

export interface UpdatedBy {
  email: string
  _id: string
}

export interface RestaurantBank {
  bank: string
  account_number: string
  account_name: string
}

export interface RestaurantBanner {
  image_cloud: string
  image_custom: string
}

export interface RestaurantAddress {
  address_province: AddressProvince
  address_district: AddressDistrict
  address_ward: AddressWard
  address_specific: string
}

export interface AddressProvince {
  id: string
  name: string
}

export interface AddressDistrict {
  id: string
  name: string
}

export interface AddressWard {
  id: string
  name: string
}

export interface RestaurantPrice {
  restaurant_price_option: 'up' | 'down' | 'range'
  restaurant_price_min: number
  restaurant_price_max: number
  restaurant_price_amount: number
}

export interface RestaurantImage {
  image_cloud: string
  image_custom: string
}

export interface RestaurantHour {
  day_of_week: string
  open: string
  close: string
}


