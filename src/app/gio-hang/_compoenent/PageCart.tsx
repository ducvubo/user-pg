'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IFoodRestaurant } from '@/app/interface/food-restaurant.interface'
import { IComboFood } from '@/app/nha-hang/_component/ComboList'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, Plus, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface IProps {
  foodCart: IFoodRestaurant[]
  foodComboCart: IComboFood[]
}

interface FoodOption {
  fopt_id: string
  fopt_name: string
  fopt_attribute: string
  fopt_price: number
}

interface ComboItem {
  fcbi_id: string
  fcbi_quantity: number
  fcbi_food: {
    food_id: string
    food_name: string
  }
}

export default function PageCart({ foodCart, foodComboCart }: IProps) {
  console.log("🚀 ~ PageCart ~ foodCart:", foodCart)
  const router = useRouter()
  const [foodQuantities, setFoodQuantities] = useState<{ [key: string]: number }>({})
  const [comboQuantities, setComboQuantities] = useState<{ [key: string]: number }>({})
  const [selectedOptions, setSelectedOptions] = useState<{ [foodId: string]: string[] }>({})
  const [activeTab, setActiveTab] = useState('foods')

  // Initialize quantities and selected options for cart items
  useEffect(() => {
    const initialFoodQuantities = foodCart.reduce((acc, food) => {
      acc[food.food_id] = 0
      return acc
    }, {} as { [key: string]: number })

    const initialComboQuantities = foodComboCart.reduce((acc, combo) => {
      acc[combo.fcb_id] = 0
      return acc
    }, {} as { [key: string]: number })

    const initialSelectedOptions = foodCart.reduce((acc, food) => {
      acc[food.food_id] = []
      return acc
    }, {} as { [foodId: string]: string[] })

    setFoodQuantities(initialFoodQuantities)
    setComboQuantities(initialComboQuantities)
    setSelectedOptions(initialSelectedOptions)
  }, [foodCart, foodComboCart])

  // Handle option selection
  const toggleOption = (foodId: string, optionId: string) => {
    setSelectedOptions((prev) => {
      const currentOptions = prev[foodId] || []
      if (currentOptions.includes(optionId)) {
        return { ...prev, [foodId]: currentOptions.filter((id) => id !== optionId) }
      } else {
        return { ...prev, [foodId]: [...currentOptions, optionId] }
      }
    })
  }

  // Calculate total price for a single food item
  const calculateFoodItemTotal = (food: IFoodRestaurant) => {
    const quantity = foodQuantities[food.food_id] || 0
    if (quantity === 0) return '0'
    const foodPrice = food.food_price * quantity
    const optionsPrice = food.fopt_food?.reduce((optSum, opt) => {
      if (selectedOptions[food.food_id]?.includes(opt.fopt_id)) {
        return optSum + (opt.fopt_price || 0)
      }
      return optSum
    }, 0) || 0
    return (foodPrice + optionsPrice * quantity).toLocaleString('vi-VN')
  }

  // Calculate overall total price
  const calculateTotal = () => {
    const foodTotal = foodCart.reduce((sum, food) => {
      const quantity = foodQuantities[food.food_id] || 0
      if (quantity === 0) return sum
      const foodPrice = food.food_price * quantity
      const optionsPrice = food.fopt_food?.reduce((optSum, opt) => {
        if (selectedOptions[food.food_id]?.includes(opt.fopt_id)) {
          return optSum + (opt.fopt_price || 0)
        }
        return optSum
      }, 0) || 0
      return sum + (foodPrice + optionsPrice * quantity)
    }, 0)

    const comboTotal = foodComboCart.reduce((sum, combo) => {
      const quantity = comboQuantities[combo.fcb_id] || 0
      if (quantity === 0) return sum
      return sum + (combo.fcb_price * quantity)
    }, 0)

    return (foodTotal + comboTotal).toLocaleString('vi-VN')
  }

  // Handle quantity changes
  const updateFoodQuantity = (foodId: string, delta: number) => {
    setFoodQuantities((prev) => {
      const newQuantity = (prev[foodId] || 0) + delta
      return { ...prev, [foodId]: Math.max(0, newQuantity) }
    })
  }

  const updateComboQuantity = (comboId: string, delta: number) => {
    setComboQuantities((prev) => {
      const newQuantity = (prev[comboId] || 0) + delta
      return { ...prev, [comboId]: Math.max(0, newQuantity) }
    })
  }

  // Handle item removal (placeholder, as actual removal would depend on cart management logic)
  const removeFoodItem = (foodId: string) => {
    console.log(`Remove food item: ${foodId}`)
    // Implement actual removal logic here
  }

  const removeComboItem = (comboId: string) => {
    console.log(`Remove combo item: ${comboId}`)
    // Implement actual removal logic here
  }

  // Serialize cart data for query parameter
  const serializeCartForCheckout = () => {
    const simplifiedCart = {
      foods: foodCart
        .filter(food => (foodQuantities[food.food_id] || 0) > 0)
        .map(food => ({
          food_id: food.food_id,
          quantity: foodQuantities[food.food_id] || 0,
          selected_options: selectedOptions[food.food_id] || [],
        })),
      combos: foodComboCart
        .filter(combo => (comboQuantities[combo.fcb_id] || 0) > 0)
        .map(combo => ({
          fcb_id: combo.fcb_id,
          quantity: comboQuantities[combo.fcb_id] || 0,
        })),
    }

    // Convert to JSON string and encode for URL
    return encodeURIComponent(JSON.stringify(simplifiedCart))
  }

  // Handle checkout redirect
  const handleCheckout = () => {
    const cartData = serializeCartForCheckout()
    // Redirect to payment page with cart data in query parameter
    router.push(`/dat-mon-an-gio-hang?cart=${cartData}`)
  }

  // Render food item
  const renderFoodItem = (food: IFoodRestaurant) => {
    const images = JSON.parse(food.food_image)
    const primaryImage = images[0]?.image_cloud

    return (
      <div key={food.food_id} className="flex items-start border-b py-4">
        {primaryImage && (
          <div className="relative w-20 h-20 mr-4">
            <Image src={primaryImage} alt={food.food_name} fill className="object-cover rounded" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <Link href={`/mon-an/${food.food_slug}`} target="_blank">
                <h3 className="text-base font-semibold">{food.food_name}</h3>
              </Link>
              <p className="text-sm text-gray-600 mt-1">Giá: {food.food_price.toLocaleString('vi-VN')} VNĐ</p>
              <p className="text-sm text-gray-600 mt-1">{calculateFoodItemTotal(food)} VNĐ</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeFoodItem(food.food_id)}
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {food.fopt_food && food.fopt_food.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-700">Tùy chọn:</p>
              {food.fopt_food.map((option: FoodOption) => (
                <div key={option.fopt_id} className="flex items-center justify-between text-xs text-gray-600 py-1">
                  <div className="flex items-center">
                    <Checkbox
                      id={`${food.food_id}-${option.fopt_id}`}
                      checked={selectedOptions[food.food_id]?.includes(option.fopt_id)}
                      onCheckedChange={() => toggleOption(food.food_id, option.fopt_id)}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor={`${food.food_id}-${option.fopt_id}`}
                      className="ml-2 text-xs"
                    >
                      {option.fopt_name} ({option.fopt_attribute})
                    </label>
                  </div>
                  <span>{option.fopt_price.toLocaleString('vi-VN')} VNĐ</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFoodQuantity(food.food_id, -1)}
              disabled={(foodQuantities[food.food_id] || 0) <= 0}
              className="h-6 w-6"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="mx-2 text-sm">{foodQuantities[food.food_id] || 0}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFoodQuantity(food.food_id, 1)}
              className="h-6 w-6"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Render combo item
  const renderComboItem = (combo: IComboFood) => {
    const images = JSON.parse(combo.fcb_image)
    const primaryImage = images.image_cloud

    return (
      <div key={combo.fcb_id} className="flex items-start border-b py-4">
        {primaryImage && (
          <div className="relative w-20 h-20 mr-4">
            <Image src={primaryImage} alt={combo.fcb_name} fill className="object-cover rounded" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <Link href={`/combo-mon-an/${combo.fcb_slug}`} target="_blank">
                <h3 className="text-base font-semibold">{combo.fcb_name}</h3>
              </Link>
              <p className="text-sm text-gray-600 mt-1">Giá: {combo.fcb_price.toLocaleString('vi-VN')} VNĐ</p>
              <p className="text-sm text-gray-600 mt-1">
                {((comboQuantities[combo.fcb_id] || 0) === 0 ? 0 : (combo.fcb_price * (comboQuantities[combo.fcb_id] || 0))).toLocaleString('vi-VN')} VNĐ
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeComboItem(combo.fcb_id)}
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {combo.fcbi_combo && combo.fcbi_combo.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-700">Bao gồm:</p>
              {combo.fcbi_combo.map((item: ComboItem) => (
                <div key={item.fcbi_id} className="text-xs text-gray-600 py-1">
                  {item.fcbi_food.food_name} (x{item.fcbi_quantity})
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateComboQuantity(combo.fcb_id, -1)}
              disabled={(comboQuantities[combo.fcb_id] || 0) <= 0}
              className="h-6 w-6"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="mx-2 text-sm">{comboQuantities[combo.fcb_id] || 0}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateComboQuantity(combo.fcb_id, 1)}
              className="h-6 w-6"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-8 lg:px-[100px] mt-5 py-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Giỏ hàng</h1>
      <Tabs defaultValue="foods" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="foods">Món ăn</TabsTrigger>
          <TabsTrigger value="combos">Combo</TabsTrigger>
        </TabsList>
        <TabsContent value="foods">
          <Card>
            <CardHeader>
              <CardTitle>Món ăn trong giỏ hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                {foodCart.length > 0 ? (
                  foodCart.map(renderFoodItem)
                ) : (
                  <p className="text-center py-10">Giỏ hàng món ăn trống.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="combos">
          <Card>
            <CardHeader>
              <CardTitle>Combo trong giỏ hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                {foodComboCart.length > 0 ? (
                  foodComboCart.map(renderComboItem)
                ) : (
                  <p className="text-center py-10">Giỏ hàng combo trống.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-semibold">
          Tổng cộng: {calculateTotal()} VNĐ
        </p>
        <Button
          onClick={handleCheckout}
          disabled={
            foodCart.every(food => (foodQuantities[food.food_id] || 0) === 0) &&
            foodComboCart.every(combo => (comboQuantities[combo.fcb_id] || 0) === 0)
          }
          className="bg-green-600 hover:bg-green-700"
        >
          Thanh toán
        </Button>
      </div>
    </div>
  )
}