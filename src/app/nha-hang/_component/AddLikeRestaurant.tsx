'use client'
import React from 'react';
import { Heart } from 'lucide-react';
import { addRestaurantLike, getCookie, removeRestaurantLike } from '../api';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

interface IProps {
  restaurantId: string;
}

export default function AddLikeRestaurant({ restaurantId }: IProps) {
  const [isLiked, setIsLiked] = React.useState(false);



  const handleLike = async () => {
    if (isLiked) {
      await removeRestaurantLike(restaurantId);
    } else {
      await addRestaurantLike(restaurantId);
    }
    await getListLikedRestaurant();
  };



  const getListLikedRestaurant = async () => {
    const listLikedRestaurant: RequestCookie | undefined = await getCookie('listLikedRestaurant');
    if (listLikedRestaurant && listLikedRestaurant.value) {
      const listLikedRestaurantArr = JSON.parse(listLikedRestaurant.value);
      if (listLikedRestaurantArr.includes(restaurantId)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }

    }
  }

  React.useEffect(() => {
    getListLikedRestaurant();
  }, []);

  return (
    <button
      onClick={handleLike}
      className={`p-2 rounded-full transition-colors ${isLiked ? 'text-red-500 hover:bg-red-100' : 'text-gray-500 hover:bg-gray-100'
        }`}
      aria-label="Add to favorites"
    >
      <Heart
        className={isLiked ? 'fill-current' : ''}
        size={24}
      />
    </button>
  );
}