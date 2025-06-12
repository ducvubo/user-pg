'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react'; // Lucide icons
import { Button } from '@/components/ui/button'; // shadcn/ui Button
import { Input } from '@/components/ui/input'; // shadcn/ui Input
import { ScrollArea } from '@/components/ui/scroll-area'; // shadcn/ui ScrollArea
import { sendMessageChatBot, getConversationHistory } from './chat.bot.api';

interface Message {
  text: string;
  isUser: boolean;
  userMessage?: string;
}

const ChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Function to fetch conversation history
  const fetchConversationHistory = async () => {
    try {
      const response = await getConversationHistory();
      if (response.statusCode === 200) {
        if (!response.data || response.data.length === 0) {
          setMessages([]);
        } else {
          const conversationMessages = response.data.map((msg: any) => [
            {
              text: msg.user_message,
              isUser: true,
            },
            {
              text: msg.bot_response,
              isUser: false,
              userMessage: msg.user_message,
            },
          ]).flat();

          setMessages(conversationMessages);
        }
      } else {
        setMessages([
          { text: 'Không thể tải lịch sử trò chuyện. Vui lòng thử lại sau.', isUser: false },
        ]);
      }
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      setMessages([
        { text: 'Không thể tải lịch sử trò chuyện. Vui lòng thử lại sau.', isUser: false },
      ]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchConversationHistory();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    const userMessage = message;
    setMessage('');
    setIsTyping(true);

    try {
      const response = await sendMessageChatBot(message);

      if (response.statusCode === 201 && response.data) {
        const botResponse = response.data.bot_response;

        setMessages((prev) => [
          ...prev,
          { text: botResponse, isUser: false, userMessage },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: 'Có lỗi xảy ra, vui lòng thử lại sau.', isUser: false, userMessage },
        ]);
      }
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      setMessages((prev) => [
        ...prev,
        { text: 'Có lỗi xảy ra, vui lòng thử lại sau.', isUser: false, userMessage },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  function renderTextWithLink(text: string) {
    const cleanedText = text.replace(/\[[^\]]*\]/g, "");

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = cleanedText.split(urlRegex);

    return (
      <>
        {parts.map((part, i) => {
          if (urlRegex.test(part)) {
            return (
              <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline break-words whitespace-normal"
              >
                {/* {part} */}
                Nhấp vào đây
              </a>
            );
          } else {
            // Nếu không phải link, xử lý \n và **text**
            const withLineBreaks = part.split("\n").map((line, j) => {
              const boldedLine = line.split(/(\*\*[^\*]+\*\*)/g).map((segment, k) => {
                if (/^\*\*[^\*]+\*\*$/.test(segment)) {
                  return (
                    <strong key={k}>
                      {segment.replace(/\*\*/g, "")}
                    </strong>
                  );
                }
                return <span key={k}>{segment}</span>;
              });

              return (
                <React.Fragment key={j}>
                  {boldedLine}
                  <br />
                </React.Fragment>
              );
            });

            return <React.Fragment key={i}>{withLineBreaks}</React.Fragment>;
          }
        })}
      </>
    );
  }


  return (
    <div className="fixed bottom-0 right-0 z-50">
      {isOpen && (
        <div className="bg-white shadow-xl rounded-lg w-80 h-96 flex flex-col border border-gray-200 mr-4 mb-5">
          <div
            className="bg-[#e6624f] text-white p-3 rounded-t-lg flex justify-between items-center"
          >
            <h3 className="font-semibold text-sm">TƯ VẤN NHANH</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="text-white hover:bg-[#d55a47]"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 flex ${msg.isUser ? 'justify-end' : 'justify-start'
                  }`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-lg text-sm ${msg.isUser
                    ? 'bg-[#e6624f] text-white'
                    : 'bg-gray-100 text-gray-900'
                    }`}
                >
                  {renderTextWithLink(msg.text)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-100 text-gray-500 p-2 rounded-lg text-sm">
                  Đang trả lời...
                </div>
              </div>
            )}
          </ScrollArea>
          <form
            onSubmit={handleSendMessage}
            className="border-t p-3 flex items-center gap-2 rounded-b-lg bg-white"
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 text-base rounded-full border-gray-300"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-[#e6624f] hover:bg-[#d55a47]"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      {!isOpen && (
        <Button
          onClick={toggleChat}
          className={`bg-[#e6624f] hover:bg-[#d55a47] text-white rounded-full shadow-lg transition-all flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mr-4 mb-4 sm:mr-5 sm:mb-5 md:mr-6 md:mb-6 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          aria-label="Open chat"
        >
          <div className="relative">
            <svg
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
        </Button>
      )}
    </div>
  );
};

export default ChatBubble;