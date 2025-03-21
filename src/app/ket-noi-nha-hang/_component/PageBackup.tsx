// "use client";

// import { useState, useEffect, useRef, useMemo } from "react";
// import {
//   db,
//   collection,
//   onSnapshot,
//   query,
//   orderBy,
//   doc,
//   getDoc,
//   setDoc,
//   writeBatch,
//   getDocs,
// } from "../../configs/firebase";
// import Chat from "./Chat";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { CheckIcon } from "@radix-ui/react-icons";
// import { cn } from "@/lib/utils";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { useRouter } from "next/navigation";
// import { debounce } from "lodash";
// import { searchRestaurantByName } from "./../connect.api";
// import { GetRestaurantByIds } from "../../home/home.api";

// interface Restaurant {
//   _id: string;
//   restaurant_name: string;
// }

// interface RestaurantDetail {
//   _id: string;
//   restaurant_name: string;
//   restaurant_category: Array<{
//     _id: string;
//     category_name: string;
//     category_icon: string;
//   }>;
//   restaurant_slug: string;
//   restaurant_banner: {
//     image_cloud: string;
//     image_custom: string;
//   };
//   restaurant_address: {
//     address_province: { id: string; name: string };
//     address_district: { id: string; name: string };
//     address_ward: { id: string; name: string };
//     address_specific: string;
//   };
//   restaurant_price: {
//     restaurant_price_option: string;
//     restaurant_price_amount: number;
//   };
//   restaurant_type: Array<{
//     _id: string;
//     restaurant_type_name: string;
//   }>;
// }

// interface Conversation {
//   restaurantId: string;
//   latestMessage: any | null;
//   isUnreadFromRestaurant: boolean;
// }

// interface Props {
//   idUser: string;
// }

// const PageConnect = ({ idUser }: Props) => {
//   const router = useRouter();
//   const [name, setName] = useState<string>("");
//   const [hasUsername, setHasUsername] = useState<boolean | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
//   const [isChangeNameDialogOpen, setIsChangeNameDialogOpen] = useState<boolean>(false);
//   const [isAddConversationDialogOpen, setIsAddConversationDialogOpen] = useState<boolean>(false); // State cho dialog thêm cuộc trò chuyện
//   const [newName, setNewName] = useState<string>("");
//   const [restaurantId, setRestaurantId] = useState<string>("");
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
//   const [newMessageAlert, setNewMessageAlert] = useState<string | null>(null);
//   const [prevUnreadCounts, setPrevUnreadCounts] = useState<Record<string, number>>({});
//   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
//   const [restaurantDetails, setRestaurantDetails] = useState<Record<string, RestaurantDetail>>({});
//   const [isLoadingRestaurants, setIsLoadingRestaurants] = useState<boolean>(false);
//   const unsubscribesRef = useRef<(() => void)[]>([]);
//   const conversationsRef = useRef<Conversation[]>([]);

//   useEffect(() => {
//     const checkUserId = async (id: string) => {
//       if (!id.trim()) {
//         setHasUsername(false);
//         setIsDialogOpen(true);
//         return;
//       }

//       try {
//         const userRef = doc(db, "users", id);
//         const userSnap = await getDoc(userRef);

//         if (userSnap.exists()) {
//           const userData = userSnap.data() as { username?: string };
//           setName(userData.username || "");
//           setHasUsername(!!userData.username);
//           setIsDialogOpen(!userData.username);
//         } else {
//           setName("");
//           setHasUsername(false);
//           setIsDialogOpen(true);
//         }
//       } catch (error) {
//         console.error("Lỗi khi kiểm tra userId:", error);
//         alert("Không thể kiểm tra userId. Vui lòng thử lại!");
//         setHasUsername(false);
//         setIsDialogOpen(true);
//       }
//     };

//     checkUserId(idUser);
//   }, [idUser]);

//   const handleSaveName = async () => {
//     if (!name.trim()) {
//       alert("Vui lòng nhập tên!");
//       return;
//     }

//     try {
//       const userRef = doc(db, "users", idUser);
//       await setDoc(userRef, {
//         id: idUser,
//         username: name,
//       }, { merge: true });

//       setHasUsername(true);
//       setIsDialogOpen(false);
//       alert("Tên đã được lưu thành công!");
//     } catch (error) {
//       console.error("Lỗi khi lưu tên:", error);
//       alert("Không thể lưu tên. Vui lòng thử lại!");
//     }
//   };

//   const handleGoBack = () => {
//     router.push("/");
//   };

//   const handleChangeName = async () => {
//     if (!newName.trim()) {
//       alert("Vui lòng nhập tên mới!");
//       return;
//     }

//     try {
//       const userRef = doc(db, "users", idUser);
//       await setDoc(userRef, {
//         id: idUser,
//         username: newName,
//       }, { merge: true });

//       setName(newName);
//       setNewName("");
//       setIsChangeNameDialogOpen(false);
//       alert("Tên đã được đổi thành công!");
//     } catch (error) {
//       console.error("Lỗi khi đổi tên:", error);
//       alert("Không thể đổi tên. Vui lòng thử lại!");
//     }
//   };

//   const fetchRestaurants = async (searchTerm: string) => {
//     if (!searchTerm.trim()) {
//       setRestaurants([]);
//       setIsLoadingRestaurants(false);
//       return;
//     }

//     setIsLoadingRestaurants(true);
//     try {
//       const data = await searchRestaurantByName({ name: searchTerm });
//       console.log("🚀 ~ fetchRestaurants ~ data:", data);
//       if (data.statusCode === 200) {
//         const restaurantData = Array.isArray(data.data) ? data.data : [];
//         setRestaurants(restaurantData);
//       } else {
//         setRestaurants([]);
//         console.error("Lỗi từ API tìm kiếm:", data.message);
//       }
//     } catch (error) {
//       console.error("Lỗi khi gọi API tìm kiếm:", error);
//       setRestaurants([]);
//     } finally {
//       setIsLoadingRestaurants(false);
//     }
//   };

//   useEffect(() => {
//     fetchRestaurants(searchTerm);
//   }, [searchTerm]);

//   const fetchRestaurantDetails = async (restaurantIds: string[]) => {
//     if (restaurantIds.length === 0) {
//       return;
//     }

//     try {
//       const data = await GetRestaurantByIds(restaurantIds);
//       if (data.statusCode === 201 && data.data) {
//         const newDetails = data.data.reduce((acc: Record<string, RestaurantDetail>, restaurant: RestaurantDetail) => {
//           acc[restaurant._id] = restaurant;
//           return acc;
//         }, {});
//         setRestaurantDetails((prev) => ({
//           ...prev,
//           ...newDetails,
//         }));
//       } else {
//         console.error("Lỗi từ API get-restaurant-by-ids:", data.message);
//       }
//     } catch (error) {
//       console.error("Lỗi khi gọi API get-restaurant-by-ids:", error);
//     }
//   };

//   useEffect(() => {
//     if (conversations.length === 0) return;

//     const restaurantIds = conversations.map((conv) => conv.restaurantId);
//     const missingIds = restaurantIds.filter((id) => !restaurantDetails[id]);
//     if (missingIds.length > 0) {
//       fetchRestaurantDetails(missingIds);
//     }
//   }, [conversations]);

//   const handleAddConversation = async () => {
//     if (!restaurantId.trim()) {
//       alert("Vui lòng chọn một nhà hàng!");
//       return;
//     }

//     try {
//       const chatRoomId = `${restaurantId}_${idUser}`;
//       const chatRef = doc(db, "chats", chatRoomId);
//       await setDoc(chatRef, {
//         createdAt: new Date(),
//         restaurantId,
//         customerId: idUser,
//       }, { merge: true });

//       const newConversation: Conversation = {
//         restaurantId,
//         latestMessage: null,
//         isUnreadFromRestaurant: false,
//       };
//       setConversations((prev) => {
//         const updated = [...prev, newConversation];
//         const uniqueConversations = Array.from(
//           new Map(updated.map((item) => [item.restaurantId, item])).values()
//         );
//         conversationsRef.current = uniqueConversations;
//         return uniqueConversations;
//       });

//       console.log('conversationRef:', conversations);

//       setRestaurantId("");
//       setSearchTerm("");
//       setIsAddConversationDialogOpen(false); // Đóng dialog sau khi thêm
//     } catch (error) {
//       console.error("Lỗi khi thêm cuộc trò chuyện:", error);
//       alert("Không thể thêm cuộc trò chuyện. Vui lòng thử lại!");
//     }
//   };

//   const handleSelectConversation = async (restaurantId: string) => {
//     setSelectedConversation(restaurantId);

//     try {
//       const chatRoomId = `${restaurantId}_${idUser}`;
//       const messagesRef = collection(db, "chats", chatRoomId, "messages");
//       const q = query(messagesRef, orderBy("timestamp", "asc"));
//       const snapshot = await getDocs(q);
//       const batch = writeBatch(db);

//       snapshot.docs.forEach((doc) => {
//         const msg = doc.data() as any;
//         if (msg.userType === "restaurant" && !msg.isRead) {
//           const msgRef = doc.ref;
//           batch.update(msgRef, { isRead: true });
//         }
//       });

//       await batch.commit();
//     } catch (error) {
//       console.error("Lỗi khi đánh dấu tin nhắn là đã xem:", error);
//     }
//   };

//   useEffect(() => {
//     if (hasUsername !== true || !idUser) return;

//     const chatsRef = collection(db, "chats");
//     const unsubscribeChats = onSnapshot(chatsRef, (snapshot) => {
//       const allChatRooms = snapshot.docs.map((doc) => doc.id);
//       const relatedChatRooms = allChatRooms.filter((chatRoomId) =>
//         chatRoomId.endsWith(`_${idUser}`)
//       );
//       console.log("Related chat rooms:", relatedChatRooms);

//       const newConversations = relatedChatRooms.map((chatRoomId) => {
//         const restaurantId = chatRoomId.replace(`_${idUser}`, "");
//         const existingConv = conversationsRef.current.find(
//           (conv) => conv.restaurantId === restaurantId
//         );
//         return {
//           restaurantId,
//           latestMessage: existingConv?.latestMessage || null,
//           isUnreadFromRestaurant: existingConv?.isUnreadFromRestaurant || false,
//         };
//       });

//       const hasChanged = newConversations.some((newConv) => {
//         const oldConv = conversationsRef.current.find(
//           (conv) => conv.restaurantId === newConv.restaurantId
//         );
//         if (!oldConv) return true;
//         return (
//           newConv.restaurantId !== oldConv.restaurantId ||
//           newConv.latestMessage?.text !== oldConv.latestMessage?.text ||
//           newConv.isUnreadFromRestaurant !== oldConv.isUnreadFromRestaurant
//         );
//       });

//       if (hasChanged) {
//         console.log("Updating conversations:", newConversations);
//         conversationsRef.current = newConversations;
//         setConversations(newConversations);
//       }
//     }, (error) => {
//       console.error("Lỗi khi lắng nghe danh sách chat rooms:", error);
//     });

//     return () => unsubscribeChats();
//   }, [hasUsername, idUser]);

//   useEffect(() => {
//     if (hasUsername !== true || !idUser || conversations.length === 0) return;

//     console.log("Setting up listeners for conversations:", conversations);

//     unsubscribesRef.current.forEach((unsubscribe) => unsubscribe());
//     unsubscribesRef.current = [];

//     const newUnsubscribes = conversations.map((conv) => {
//       const chatRoomId = `${conv.restaurantId}_${idUser}`;
//       console.log(`Listening to messages for chatRoomId: ${chatRoomId}`);
//       const messagesRef = collection(db, "chats", chatRoomId, "messages");
//       const q = query(messagesRef, orderBy("timestamp", "asc"));

//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         const messages = snapshot.docs.map((doc) => doc.data());
//         console.log(`Messages for ${chatRoomId}:`, messages);

//         const unreadCount = messages.filter(
//           (msg) => msg.userType === "restaurant" && msg.isRead === false
//         ).length;

//         const latestMessage =
//           messages.length > 0
//             ? messages.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate())[0]
//             : null;

//         const isUnreadFromRestaurant = latestMessage
//           ? latestMessage.userType === "restaurant" && !latestMessage.isRead
//           : false;

//         setConversations((prevConversations) => {
//           const updatedConversations = prevConversations.map((c) =>
//             c.restaurantId === conv.restaurantId
//               ? { ...c, latestMessage, isUnreadFromRestaurant }
//               : c
//           );

//           const hasChanged = updatedConversations.some((newConv) => {
//             const oldConv = conversationsRef.current.find(
//               (conv) => conv.restaurantId === newConv.restaurantId
//             );
//             if (!oldConv) return true;
//             return (
//               newConv.restaurantId !== oldConv.restaurantId ||
//               newConv.latestMessage?.text !== oldConv.latestMessage?.text ||
//               (newConv.latestMessage?.timestamp?.toDate?.().getTime() !==
//                 oldConv.latestMessage?.timestamp?.toDate?.().getTime()) ||
//               newConv.isUnreadFromRestaurant !== oldConv.isUnreadFromRestaurant
//             );
//           });

//           if (hasChanged) {
//             console.log("Updating conversations with new message:", updatedConversations);
//             conversationsRef.current = updatedConversations;
//             return updatedConversations;
//           }
//           return prevConversations;
//         });

//         const prevCount = prevUnreadCounts[conv.restaurantId] || 0;
//         if (unreadCount > prevCount) {
//           console.log(`New message detected for ${conv.restaurantId}. Unread count: ${unreadCount}`);
//           setNewMessageAlert(
//             `Có tin nhắn mới từ ${restaurantDetails[conv.restaurantId]?.restaurant_name || conv.restaurantId}!`
//           );
//           setTimeout(() => setNewMessageAlert(null), 5000);
//         }

//         setPrevUnreadCounts((prev) => ({
//           ...prev,
//           [conv.restaurantId]: unreadCount,
//         }));
//       }, (error) => {
//         console.error(`Lỗi khi lắng nghe tin nhắn của ${chatRoomId}:`, error);
//       });

//       return unsubscribe;
//     });

//     unsubscribesRef.current = newUnsubscribes;

//     return () => {
//       console.log("Cleaning up listeners for conversations:", conversations);
//       newUnsubscribes.forEach((unsubscribe) => unsubscribe());
//     };
//   }, [hasUsername, idUser, conversations.length]);

//   const restaurantItems = useMemo(() => {
//     console.log("🚀 ~ Rendering restaurantItems, restaurants:", restaurants);
//     return restaurants.map((restaurant) => (
//       <CommandItem
//         key={restaurant._id}
//         value={restaurant.restaurant_name}
//         onSelect={() => {
//           const isExistingConversation = conversations.some(
//             (conv) => conv.restaurantId === restaurant._id
//           );

//           if (isExistingConversation) {
//             setSelectedConversation(restaurant._id);
//             setIsAddConversationDialogOpen(false);
//             setSearchTerm("");
//           } else {
//             setRestaurantId(restaurant._id);
//           }
//         }}
//         className="hover:bg-gray-700"
//       >
//         {restaurant.restaurant_name}
//         <CheckIcon
//           className={cn(
//             "ml-auto h-4 w-4",
//             restaurantId === restaurant._id ? "opacity-100" : "opacity-0"
//           )}
//         />
//       </CommandItem>
//     ));
//   }, [restaurants, restaurantId, conversations]);

//   return (
//     <div className="container mx-auto p-4 min-h-screen">
//       {/* Dialog để nhập tên lần đầu */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Nhập tên của bạn</DialogTitle>
//             <DialogDescription>
//               Vui lòng nhập tên để tiếp tục sử dụng tính năng chat. Nếu không muốn nhập, bạn có thể quay về trang chủ.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             <Input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Nhập tên của bạn"
//               className="border-gray-700"
//             />
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={handleGoBack}>
//               Quay về trang chủ
//             </Button>
//             <Button onClick={handleSaveName}>Lưu tên</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Dialog để đổi tên */}
//       <Dialog open={isChangeNameDialogOpen} onOpenChange={setIsChangeNameDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Đổi tên hiển thị</DialogTitle>
//             <DialogDescription>
//               Nhập tên mới của bạn. Tên hiện tại: <strong>{name}</strong>
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             <Input
//               type="text"
//               value={newName}
//               onChange={(e) => setNewName(e.target.value)}
//               placeholder="Nhập tên mới"
//               className="border-gray-700"
//             />
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsChangeNameDialogOpen(false)}>
//               Hủy
//             </Button>
//             <Button onClick={handleChangeName}>Lưu tên mới</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Dialog để thêm cuộc trò chuyện */}
//       <Dialog open={isAddConversationDialogOpen} onOpenChange={setIsAddConversationDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Thêm cuộc trò chuyện mới</DialogTitle>
//             <DialogDescription>
//               Tìm và chọn một nhà hàng để bắt đầu trò chuyện.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             <Command>
//               <CommandInput
//                 placeholder="Tìm nhà hàng..."
//                 className="h-9"
//                 value={searchTerm}
//                 onValueChange={(value) => setSearchTerm(value)}
//               />
//               <CommandList>
//                 {isLoadingRestaurants ? (
//                   <CommandEmpty>Đang tìm kiếm...</CommandEmpty>
//                 ) : restaurants.length === 0 ? (
//                   <CommandEmpty>Không tìm thấy nhà hàng.</CommandEmpty>
//                 ) : (
//                   <CommandGroup>{restaurantItems}</CommandGroup>
//                 )}
//               </CommandList>
//             </Command>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsAddConversationDialogOpen(false)}>
//               Hủy
//             </Button>
//             <Button onClick={handleAddConversation} disabled={!restaurantId}>
//               Thêm cuộc trò chuyện
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {hasUsername === true && (
//         <div className="grid grid-cols-4 gap-4">
//           <div className="col-span-1">
//             <div className="mb-4 flex items-center justify-between">
//               <h3 className="text-lg font-semibold">
//                 Xin chào, {name}!
//               </h3>
//               <Button
//                 variant="outline"
//                 onClick={() => setIsChangeNameDialogOpen(true)}
//                 className="text-sm"
//               >
//                 Đổi tên
//               </Button>
//             </div>

//             <div className="mb-6">
//               <Button
//                 onClick={() => setIsAddConversationDialogOpen(true)}
//                 className="w-full bg-blue-600 hover:bg-blue-700"
//               >
//                 Thêm cuộc trò chuyện
//               </Button>
//             </div>

//             {conversations.length > 0 && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">Danh sách cuộc trò chuyện:</h3>
//                 <ScrollArea className="h-[calc(100vh-300px)]">
//                   <div className="space-y-2">
//                     {conversations.sort((a, b) => {
//                       const timeA = a?.latestMessage?.timestamp?.toDate?.() || 0;
//                       const timeB = b?.latestMessage?.timestamp?.toDate?.() || 0;
//                       return timeB - timeA;
//                     }).map((conv) => (
//                       <div
//                         key={conv.restaurantId}
//                         onClick={() => handleSelectConversation(conv.restaurantId)}
//                         className={`p-3 rounded-md cursor-pointer flex flex-col ${selectedConversation === conv.restaurantId
//                           ? "bg-gray-200 dark:bg-gray-700"
//                           : "hover:bg-gray-300 dark:hover:bg-gray-800"
//                           } ${conv.isUnreadFromRestaurant ? "font-bold" : ""}`}
//                       >
//                         <span className="font-semibold">
//                           {restaurantDetails[conv.restaurantId]?.restaurant_name || `Nhà hàng ${conv.restaurantId}`}
//                         </span>
//                         {conv.latestMessage ? (
//                           <span>
//                             {conv.latestMessage.text} (
//                             {conv.latestMessage.timestamp.toDate().toLocaleTimeString()})
//                           </span>
//                         ) : (
//                           <span>Chưa có tin nhắn</span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </div>
//             )}
//           </div>

//           <div className="col-span-3">
//             {selectedConversation ? (
//               <div>
//                 <h3 className="text-lg font-semibold mb-4">
//                   {restaurantDetails[selectedConversation]?.restaurant_name || selectedConversation}
//                 </h3>
//                 <Chat
//                   restaurantId={selectedConversation}
//                   customerId={idUser}
//                   userType="customer"
//                 />
//               </div>
//             ) : (
//               <div className="flex items-center justify-center h-full">
//                 <p className="text-gray-400">Chọn một nhà hàng để bắt đầu trò chuyện.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PageConnect;