Trang Web Khách hàng Nhà hàng PATO (user-pg)

Đây là ứng dụng frontend dành cho khách hàng của nhà hàng PATO, được xây dựng bằng Next.js và TypeScript. Trang web này cho phép người dùng khám phá nhà hàng, xem thực đơn, đặt bàn, đặt món và tương tác với nhà hàng một cách thuận tiện.

Chức Năng Chính

Trang chủ & Khám phá:

Giới thiệu tổng quan về nhà hàng PATO.

Hiển thị các món ăn, combo và ưu đãi nổi bật.

Chức năng tìm kiếm nhà hàng (dù hiện tại chỉ có một).

Trang Chi tiết Nhà hàng:

Xem thông tin chi tiết, hình ảnh, video và vị trí trên bản đồ.

Duyệt thực đơn đầy đủ bao gồm món ăn lẻ, combo và phòng riêng.

Đọc các bài viết blog liên quan.

Đặt hàng & Đặt chỗ:

Chức năng đặt bàn trực tuyến với tùy chọn số lượng người, ngày giờ.

Đặt món ăn, combo giao hàng tận nơi hoặc đến lấy.

Đặt phòng riêng cho các sự kiện.

Tài khoản Người dùng:

Quản lý thông tin cá nhân.

Xem lại lịch sử các đơn đã đặt (bàn, món ăn, phòng).

Quản lý giỏ hàng.

Tương tác Thông minh:

Chat trực tiếp: Giao tiếp real-time với nhân viên nhà hàng thông qua Firebase.

Hỏi & Đáp (Ticket System): Gửi câu hỏi hoặc yêu cầu hỗ trợ và theo dõi phản hồi.

Chatbot AI: Tích hợp chatbot sử dụng AI để trả lời các câu hỏi thường gặp một cách tự động.

Công Nghệ Sử Dụng

Framework: Next.js (sử dụng App Router)

Ngôn ngữ: TypeScript

UI & Styling:

Tailwind CSS

shadcn/ui cho các component UI.

Quản lý Trạng thái (State Management): Redux Toolkit

Form: React Hook Form và Zod

Giao tiếp Real-time: Socket.IO Client, Firebase Realtime Database

Bản đồ: Leaflet

Hướng Dẫn Cài Đặt và Chạy Dự Án

Yêu cầu tiên quyết

Node.js (phiên bản >= 18.x)

pnpm (hoặc npm/yarn)

Cài đặt

Clone repository:

git clone <your-repo-url>
cd user-pg


Cài đặt các dependencies:

pnpm install


Cấu hình môi trường:
Tạo một file .env.development và điền các URL của các microservice backend:

# URL to the main backend service
NEXT_PUBLIC_API_BACKEND_URL=http://localhost:8001/api/v1/

# URL to other microservices
NEXT_PUBLIC_API_ORDER_URL=http://localhost:8002/api/v1/
NEXT_PUBLIC_API_INVENTORY_URL=http://localhost:8003/api/v1/
NEXT_PUBLIC_API_EMPLOYEE_URL=http://localhost:8004/api/v1/
NEXT_PUBLIC_API_BLOG_URL=http://localhost:8005/api/v1/
NEXT_PUBLIC_API_ROOM_URL=http://localhost:8006/api/v1/
NEXT_PUBLIC_API_SYSTEM_MANAGEMENT_URL=http://localhost:8007/api/v1/

# Firebase config for real-time chat
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... (các biến khác)


Chạy ứng dụng

Chạy ở chế độ development:

pnpm dev


Ứng dụng sẽ chạy tại http://localhost:3000.

Build và chạy ở chế độ production:

pnpm build
pnpm start


Triển khai (Deployment)

Dự án được cấu hình để triển khai dưới dạng một container. Quá trình build và deploy được tự động hóa thông qua pipeline CI/CD trên GitLab.
