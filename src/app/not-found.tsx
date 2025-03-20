'use client';

import type { NextPage } from 'next';
import Link from 'next/link';

const Page404: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-200 p-4">
      <div className="text-center p-6 bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        <h1 className="text-7xl sm:text-8xl font-extrabold text-red-400 drop-shadow-md">
          404
        </h1>
        <h2 className="text-xl sm:text-2xl text-gray-800 mt-4 font-semibold">
          Oops! Trang không tìm thấy
        </h2>
        <p className="text-gray-600 mt-4 mb-8 leading-relaxed text-sm sm:text-base">
          Có vẻ như bạn đã đi lạc. Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link href="/" passHref>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium text-sm sm:text-base
              hover:bg-blue-400 hover:-translate-y-0.5 hover:shadow-md 
              transition-all duration-300 ease-in-out"
          >
            Về trang chủ
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Page404;