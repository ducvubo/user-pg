import React from 'react';

export default function Footer() {
  return (
    <div className="flex flex-col items-center h-auto mt-5">
      {/* Tiêu đề và liên kết */}
      <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">Hướng dẫn đặt bàn</h1>
      <p className="text-gray-500 mb-6 text-sm sm:text-base text-center">
        Xem chi tiết hướng dẫn tại đây
      </p>

      {/* Các bước hướng dẫn */}
      <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-4 lg:space-x-8 mb-8 px-4">
        {/* Bước 1: Truy cập trang chủ */}
        <div className="flex flex-col items-center w-full md:w-auto">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 rounded-full flex items-center justify-center text-white">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
          </div>
          <h3 className="mt-2 font-semibold text-sm sm:text-base">TRUY CẬP TRANG CHỦ</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">
            {/* Truy cập pato.taphoaictu.id.vn */}
            Truy cập trang chủ{' '}
            <a
              className="text-blue-500 hover:underline ml-2"
              href="https://pato.taphoaictu.id.vn"
            >
              tại đây
            </a>
          </p>
        </div>

        {/* Mũi tên */}
        <div className="hidden md:block text-gray-400 text-2xl md:text-3xl">➜</div>

        {/* Bước 2: Nhập thông tin đặt bàn */}
        <div className="flex flex-col items-center w-full md:w-auto">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 rounded-full flex items-center justify-center text-white">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
          </div>
          <h3 className="mt-2 font-semibold text-sm sm:text-base">NHẬP THÔNG TIN</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">
            Điền thông tin đặt bàn online
          </p>
        </div>

        {/* Mũi tên */}
        <div className="hidden md:block text-gray-400 text-2xl md:text-3xl">➜</div>

        {/* Bước 3: Xác nhận đặt bàn */}
        <div className="flex flex-col items-center w-full md:w-auto">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 rounded-full flex items-center justify-center text-white">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h3 className="mt-2 font-semibold text-sm sm:text-base">XÁC NHẬN ĐẶT BÀN</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">
            Kiểm tra và xác nhận thông tin
          </p>
        </div>

        {/* Mũi tên */}
        <div className="hidden md:block text-gray-400 text-2xl md:text-3xl">➜</div>

        {/* Bước 4: Nhà hàng xác nhận đặt bàn */}
        <div className="flex flex-col items-center w-full md:w-auto">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 rounded-full flex items-center justify-center text-white">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              ></path>
            </svg>
          </div>
          <h3 className="mt-2 font-semibold text-sm sm:text-base">NHÀ HÀNG XÁC NHẬN</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">
            Nhà hàng xác nhận đặt bàn
          </p>
        </div>

        {/* Mũi tên */}
        <div className="hidden md:block text-gray-400 text-2xl md:text-3xl">➜</div>

        {/* Bước 5: Thưởng thức */}
        <div className="flex flex-col items-center w-full md:w-auto">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 rounded-full flex items-center justify-center text-white">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
          </div>
          <h3 className="mt-2 font-semibold text-sm sm:text-base">THƯỞNG THỨC</h3>
          <p className="text-gray-600 text-center text-xs sm:text-sm">
            Thưởng thức món ngon tại nhà hàng
          </p>
        </div>
      </div>

      {/* Thông tin footer */}
      <div className="w-full bg-red-500 text-white p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
        {/* Thông tin liên hệ */}
        <div className="w-full md:w-auto">
          <h3 className="font-semibold text-sm sm:text-base mb-2">THÔNG TIN LIÊN HỆ</h3>
          <p className="text-xs sm:text-sm">Hotline: 0373853243</p>
          <p className="text-xs sm:text-sm">
            Chực phí 2.000đ/phút, hoạt động 24/7 (ké cả ngày Lễ, Tết).
          </p>
          <p className="text-xs sm:text-sm">Email: vminhduc8@gmail.com</p>
        </div>

        {/* Về chúng tôi */}
        <div className="w-full md:w-auto">
          <h3 className="font-semibold text-sm sm:text-base mb-2">VỀ CHÚNG TÔI</h3>
          <p className="text-xs sm:text-sm">Trang chủ</p>
          <p className="text-xs sm:text-sm">Giới thiệu</p>
          <p className="text-xs sm:text-sm">Liên hệ</p>
        </div>

        {/* Điều khoản sử dụng */}
        <div className="w-full md:w-auto">
          <h3 className="font-semibold text-sm sm:text-base mb-2">ĐIỀU KHOẢN SỬ DỤNG</h3>
          <p className="text-xs sm:text-sm">Giới thiệu</p>
          <p className="text-xs sm:text-sm">Quy chế hoạt động</p>
        </div>

        {/* Biểu tượng mạng xã hội */}
        <div className="flex space-x-4">
          <a href="#" className="text-white">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.563V12h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z"></path>
            </svg>
          </a>
          <a href="#" className="text-white">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.5 0h-19C1.1 0 0 1.1 0 2.5v19C0 22.9 1.1 24 2.5 24h19c1.4 0 2.5-1.1 2.5-2.5v-19C24 1.1 22.9 0 21.5 0zM8 19H5V9h3v10zm-1.5-11.5c-.9 0-1.5-.7-1.5-1.5S5.6 4.5 6.5 4.5 8 5.2 8 6s-.7 1.5-1.5 1.5zm13 11.5h-3v-5.5c0-1.4-.5-2.3-1.7-2.3-1.2 0-1.9.8-1.9 2.3V19h-3V9h3v1.4c.4-.6 1.1-1.4 2.7-1.4 2 0 3.5 1.3 3.5 4.1v5.9z"></path>
            </svg>
          </a>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="pt-4 pb-6 text-center bg-red-500 w-full text-white text-xs sm:text-sm">
        <p>
          Đây chỉ là một sản phẩm demo nếu quý khách có nhu cầu vui lòng xem{' '}
          <a className="text-blue-500" href="https://pato.com.vn">
            tại đây
          </a>{' '}
          xin cảm ơn!!!
        </p>
      </div>
    </div>
  );
}