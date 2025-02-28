export const SystemParameterEnum = {
  BANNER_HEADER: { sys_para_id: '79170c98-15b1-4934-8ced-13f64d32de58', sys_para_description: 'Banner header' },
  LOGOHEADER: { sys_para_id: '5ec5b429-956f-4e79-8097-1099af992f77', sys_para_description: 'Logo Header' },
  CATHOME: { sys_para_id: 'd695db21-f4ed-4927-ad42-7b625a9c682d', sys_para_description: 'Danh mục trang chủ' },
  SLIDETOPHOME: { sys_para_id: 'e92a08d0-fbd1-4c71-8f8d-6a45587d849a', sys_para_description: 'Slide top' },
  SLIDEBOTTOMHOME: { sys_para_id: '3ab01a11-a19c-40c7-af79-45be24a17f2c', sys_para_description: 'Slide bottom' },
  BANNERTOPHOME: { sys_para_id: '2cad65a5-175f-4e2d-99fd-9eaf782982f7', sys_para_description: 'Banner trên trang chủ' },
  BANNERCENTERHOME: { sys_para_id: 'afef916c-7848-4395-a992-f08ebed40dee', sys_para_description: 'Banner giữa trang chủ' },
  BANNERBOTTOMHOME: { sys_para_id: '91ec5379-03df-4ae4-80f8-f4be7fe94729', sys_para_description: 'Banner cuối trang chủ' },
  TOPRESTAURANTADDRESS: { sys_para_id: '19e52648-e2fc-459d-8a40-5885da0d28e5', sys_para_description: 'Nhà hàng nổi bật' },
  YOULOOKINGFOR: { sys_para_id: '91d10a51-713f-485d-b901-1c1212fe1a69', sys_para_description: 'Nhà hàng gợi ý' },
  RESTAURANTDEAL: { sys_para_id: '2c7b331d-9db3-433c-a7fe-1f8b5117b055', sys_para_description: 'Nhà hàng ưu đãi' },
} as const

export const ListSystemParameter = Object.values(SystemParameterEnum)
