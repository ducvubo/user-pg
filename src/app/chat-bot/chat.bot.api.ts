'use server'

import { sendRequest } from "@/lib/api"

export const sendMessageChatBot = async (message: string) => {
  const res: IBackendRes<any> = await sendRequest({
    url:`${process.env.URL_SERVER}/chat-bot/send-message`,
    method: 'POST',
    body: { text: message },
  })
  return res
}

export const getConversationHistory = async () => {
  const res: IBackendRes<any> = await sendRequest({
    url:`${process.env.URL_SERVER}/chat-bot/conversation`,
    method: 'GET',
  })
  return res
}