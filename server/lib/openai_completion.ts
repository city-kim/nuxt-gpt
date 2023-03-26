import { Configuration, OpenAIApi } from 'openai'
import type { ChatList } from '@/types/openai'
import { sendMessage } from '@/server/lib/slack_message'

export async function chat(messages: Array<ChatList>, channel?: string) {
  const configuration = new Configuration({ // configuration 인스턴트 생성
    apiKey: process.env.OPENAI_SECRET_KEY, // env의 key를 넣어준다
  })
  const openai = new OpenAIApi(configuration) // 인스턴스 생성
  console.log('질문시작')
  
  const result = await openai.createChatCompletion({ // 비동기로 결과를 받아온다
    model: 'gpt-3.5-turbo', // 사용할 모델
    messages: messages, // 사용될 메시지
  }).catch((err) => {
    console.log(err)
  })

  if (result && result.data.choices[0].message) {
    console.log('답변종료 : ' + JSON.stringify(result.data.choices[0].message))
    if (channel) {
      // 채널이 전달되었다면 직접 메시지를 보낸다
      sendMessage(channel, result.data.choices[0].message.content)
    } else {
      return Promise.resolve(result.data.choices[0].message)
    }
  }
}