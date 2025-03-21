"use client";

import { useState, useEffect, useRef } from "react";
import {
  db,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  addDoc,
  writeBatch,
  QuerySnapshot,
} from "../../configs/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DocumentData } from "firebase/firestore";

// Định nghĩa type cho tin nhắn
interface Message {
  id: string;
  text: string;
  timestamp: any; // Firestore Timestamp
  userType: "restaurant" | "customer";
  userId: string;
  isRead: boolean;
}

interface ChatProps {
  restaurantId: string;
  customerId: string;
  userType: "restaurant" | "customer";
  banner: string;
}

const Chat = ({ restaurantId, customerId, userType, banner }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [username, setUsername] = useState<string>(customerId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const chatRoomId = `${restaurantId}_${customerId}`;
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userRef = doc(db, "users", customerId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data() as { username?: string };
          setUsername(userData.username || customerId);
        }
      } catch (error) {
        console.error(`Lỗi khi lấy username của ${customerId}:`, error);
      }
    };

    fetchUsername();
  }, [customerId]);

  useEffect(() => {
    setIsLoading(true);
    const messagesRef = collection(db, "chats", chatRoomId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(fetchedMessages);
        setIsLoading(false);

        const batch = writeBatch(db);
        fetchedMessages.forEach((msg) => {
          if (userType === "restaurant" && msg.userType === "customer" && !msg.isRead) {
            const msgRef = doc(db, "chats", chatRoomId, "messages", msg.id);
            batch.update(msgRef, { isRead: true });
          }
        });
        batch.commit().catch((error) => {
          console.error("Lỗi khi cập nhật trạng thái đã xem:", error);
        });
      },
      (error) => {
        console.error(`Lỗi khi lắng nghe tin nhắn của ${chatRoomId}:`, error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [chatRoomId, userType]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messagesRef = collection(db, "chats", chatRoomId, "messages");
      await addDoc(messagesRef, {
        text: newMessage,
        timestamp: new Date(),
        userType,
        userId: userType === "restaurant" ? restaurantId : customerId,
        isRead: false,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      const viewport = scrollArea.querySelector("[data-radix-scroll-area-viewport]") as HTMLDivElement;
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg h-[calc(100vh-15rem)] md:h-[calc(100vh-12rem)] lg:h-[calc(100vh-10rem)]">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-500">Đang tải tin nhắn...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Chưa có tin nhắn nào.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex mb-4 ${msg.userType === userType ? "justify-end" : "justify-start"}`}
            >
              <div className="flex items-start space-x-2 max-w-[80%]">
                {msg.userType !== userType && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage
                      src={
                        msg.userType === "customer"
                          ? "https://github.com/shadcn.png"
                          : banner
                      }
                      alt={msg.userType === "customer" ? username : "Nhà hàng"}
                    />
                    <AvatarFallback>
                      {msg.userType === "customer" ? username[0] : "R"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`p-3 rounded-lg break-words ${msg.userType === userType ? "bg-green-500 text-white" : "bg-gray-100 text-black"}`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {msg.timestamp.toDate().toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {msg.userType === userType && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage
                      src={
                        msg.userType === "customer"
                          ? "https://github.com/shadcn.png"
                          : "https://via.placeholder.com/150?text=Restaurant"
                      }
                      alt={msg.userType === "customer" ? username : "Nhà hàng"}
                    />
                    <AvatarFallback>
                      {msg.userType === "customer" ? username[0] : "R"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))
        )}
      </ScrollArea>

      <div className="flex gap-2 p-4 border-t border-gray-200">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="border-gray-300 flex-1"
        />
        <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default Chat;