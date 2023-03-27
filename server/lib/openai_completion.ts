import { Configuration, OpenAIApi } from 'openai'
import { sendMessage } from '@/server/lib/slack_message'
import { checkFile } from '@/server/lib/checkFile'
import { writeFile } from '@/server/lib/writeFile'
import type { ChatData, ChatType } from '@/types/openai'

export async function chat(message: ChatData, target: ChatType) {
  const configuration = new Configuration({ // configuration 인스턴트 생성
    apiKey: process.env.OPENAI_SECRET_KEY, // env의 key를 넣어준다
  })
  const openai = new OpenAIApi(configuration) // 인스턴스 생성
  console.log('질문시작')
  
  const messages = await checkFile(target).catch((err) => {
    if (err.message == 'proceeding') {
      console.log('실행중 에러!')
      // 이미 실행중이라 에러난경우
      if (target.type == 'slack') {
        // 슬랙은 에러메시지를 전송한다
        sendMessage(target.id, `이미 질문이 진행중입니다! \n 잠시후 다시 질문해주세요! \n 실패한 질문: ${message.content}`)
      }
    }
    return Promise.reject(new Error(message.content, {cause: err}))
  }) // 파일체크를 한다

  let sendData = JSON.parse(messages) // JSON으로 변환해준다
  sendData.slice(-6) // 질문 답변은 최대 6개까지만 유지하도록 만든다
  sendData.push(message) // 전달된 메시지를 push해준다

  // 문의를 우선 저장한다
  await writeFile(message, target)
  const result = await openai.createChatCompletion({ // 비동기로 결과를 받아온다
    model: 'gpt-3.5-turbo', // 사용할 모델
    messages: sendData, // 사용될 메시지
  }).catch((err) => {
    console.log(err)
  })

  if (result && result.data.choices[0].message) {
    console.log('답변종료 : ' + JSON.stringify(result.data.choices[0].message))
    // 답변을 저장한다
    await writeFile(result.data.choices[0].message, target)
    if (target.type == 'slack') {
      // 슬랙인경우 메시지를 발송한다
      sendMessage(target.id, result.data.choices[0].message.content)
    } else {
      return Promise.resolve(result.data.choices[0].message)
    }
  }
}