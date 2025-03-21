"use client";
import { useState, useEffect, useRef } from "react";
import { db, collection, onSnapshot, query, orderBy, doc, getDoc, writeBatch } from "../../../configs/firebase";
import Chat from "@/app/components/Chat";
import { useParams } from "next/navigation";

const RestaurantDashboard = () => {
  const params = useParams();
  const id = params.slug;
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessageAlert, setNewMessageAlert] = useState(null);
  const [prevUnreadCounts, setPrevUnreadCounts] = useState({});
  const customersRef = useRef([]); // Lưu trữ tạm thời danh sách customers
  const prevUnreadCountsRef = useRef({}); // Lưu trữ tạm thời prevUnreadCounts

  useEffect(() => {
    if (!id) {
      setError("Không tìm thấy ID nhà hàng!");
      setLoading(false);
      return;
    }

    const fetchCustomers = () => {
      const chatsRef = collection(db, "chats");
      const unsubscribeChats = onSnapshot(chatsRef, (chatRoomsSnapshot) => {
        const allChatRooms = chatRoomsSnapshot.docs.map(doc => doc.id);
        console.log("All chat rooms (realtime):", allChatRooms);

        // Tạo object để lưu trữ thông tin khách hàng
        const customerMap = new Map();

        const unsubscribesMessages = allChatRooms
          .filter(chatRoomId => chatRoomId.startsWith(`${id}_`))
          .map(chatRoomId => {
            const customerId = chatRoomId.replace(`${id}_`, '');
            const messagesRef = collection(db, "chats", chatRoomId, "messages");
            const q = query(messagesRef, orderBy("timestamp", "asc"));

            return onSnapshot(q, async (messagesSnapshot) => {
              const messages = messagesSnapshot.docs.map(doc => doc.data());
              const unreadCount = messages.filter(
                msg => msg.userType === "customer" && msg.isRead === false
              ).length;

              // Lấy tin nhắn mới nhất từ khách hàng
              const latestMessage = messages.length > 0
                ? messages.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate())[0]
                : null;

              // Kiểm tra xem tin nhắn mới nhất có phải là tin nhắn chưa xem từ khách hàng không
              const isUnreadFromCustomer = latestMessage
                ? latestMessage.userType === "customer" && !latestMessage.isRead
                : false;

              // Kiểm tra tin nhắn mới
              const prevCount = prevUnreadCountsRef.current[customerId] || 0;
              if (prevCount < unreadCount) {
                // Lấy username để hiển thị trong thông báo
                let username = customerId;
                try {
                  const userRef = doc(db, "users", customerId);
                  const userSnap = await getDoc(userRef);
                  if (userSnap.exists()) {
                    const userData = userSnap.data();
                    username = userData.username || customerId;
                  }
                } catch (error) {
                  console.error(`Lỗi khi lấy username của ${customerId}:`, error);
                }
                setNewMessageAlert(`Có tin nhắn mới từ ${username}!`);
                setTimeout(() => setNewMessageAlert(null), 5000);
              }

              // Cập nhật prevUnreadCounts
              if (prevUnreadCountsRef.current[customerId] !== unreadCount) {
                prevUnreadCountsRef.current[customerId] = unreadCount;
                setPrevUnreadCounts(prev => ({
                  ...prev,
                  [customerId]: unreadCount,
                }));
              }

              // Lấy username từ Firestore
              let username = customerId;
              try {
                const userRef = doc(db, "users", customerId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                  const userData = userSnap.data();
                  username = userData.username || customerId;
                }
              } catch (error) {
                console.error(`Lỗi khi lấy username của ${customerId}:`, error);
              }

              customerMap.set(customerId, {
                customerId,
                userId: latestMessage?.userId || customerId,
                username,
                unreadCount,
                latestMessage, // Lưu tin nhắn mới nhất
                isUnreadFromCustomer, // Lưu trạng thái tin nhắn chưa xem
              });

              // Cập nhật danh sách khách hàng từ customerMap
              const updatedCustomers = Array.from(customerMap.values());

              // So sánh để tránh cập nhật không cần thiết
              if (JSON.stringify(updatedCustomers) !== JSON.stringify(customersRef.current)) {
                customersRef.current = updatedCustomers;
                setCustomers(updatedCustomers);
              }

              if (updatedCustomers.length === 0) {
                setError("Chưa có khách hàng nào nhắn tin.");
              } else {
                setError(null);
              }
              setLoading(false);
            }, (error) => {
              console.error(`Lỗi khi lắng nghe tin nhắn của ${chatRoomId}:`, error);
            });
          });

        // Cleanup các listener của messages khi chat rooms thay đổi
        return () => {
          unsubscribesMessages.forEach(unsubscribe => unsubscribe());
        };
      }, (error) => {
        console.error("Lỗi khi lắng nghe danh sách chat rooms:", error);
        setError("Không thể tải danh sách khách hàng!");
        setLoading(false);
      });

      return () => {
        unsubscribeChats();
      };
    };

    const unsubscribe = fetchCustomers();
    return () => unsubscribe();
  }, [id]);

  return (
    <div>
      <h1>Hộp thư khách hàng - Nhà hàng {id}</h1>

      {newMessageAlert && (
        <div style={{ background: "yellow", padding: "10px", margin: "10px 0" }}>
          {newMessageAlert}
        </div>
      )}

      <h3>Danh sách khách hàng:</h3>
      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && customers.length === 0 && !error && <p>Chưa có khách hàng nào.</p>}
      <ul>
        {customers.map((customer) => (
          <li
            key={customer.userId}
            onClick={() => setSelectedCustomer(customer.customerId)}
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: customer.isUnreadFromCustomer ? "bold" : "normal", // In đậm nếu là tin nhắn chưa xem
            }}
          >
            {customer.username}:{" "}
            {customer.latestMessage ? (
              <span>
                {customer.latestMessage.text} ({customer.latestMessage.timestamp.toDate().toLocaleTimeString()})
              </span>
            ) : (
              <span>Chưa có tin nhắn</span>
            )}
          </li>
        ))}
      </ul>

      {selectedCustomer && (
        <Chat restaurantId={id} customerId={selectedCustomer} userType="restaurant" />
      )}
    </div>
  );
};

export default RestaurantDashboard;