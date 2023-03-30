import { chat } from '@/server/lib/openai_completion'

export default defineEventHandler(async (event) => {
  // GPT에게 물어보기
  const body = await readBody(event)

  let id = getCookie(event, 'browser_id') // 쿠키값으로 아이디를 생성
  if (!id) {
    // 없으면 만들어준다 현재시간 + 16진수
    id = new Date().getTime().toString(16)
    setCookie(event, 'browser_id', id)
  }


  if (body.prompt) {
    console.log('질문내용 : ' + body.prompt)
    // 질문던지기
    const quest = await chat({role: 'user', content: body.prompt}, {type: 'browser', id: id})
    .catch((err) => {
      console.log(err)
      throw createError({ statusCode: 500, statusMessage: err.cause, message: err.message })
    })
    if (quest) {
      // 답변이 정상적으로 왔다면 리턴
      return {
        result: quest,
      }
    }
  } else {
    // 질문이 없는경우
    throw createError({
      statusCode: 400,
      statusMessage: '질문이 입력되지 않았습니다.',
    })
  }
})
