import { chat } from '@/server/lib/openai_completion'

export default defineEventHandler(async (event) => {
  console.log('slash 이벤트 수신')
  const body = await readBody(event)
  let channel = ''
  if (body.channel_name == 'directmessage') {
    // DM은 userid
    channel = body.user_id
  } else {
    // 채널은 채널id
    channel = body.channel_id
  }
  chat([{role: 'user', content: body.text}], channel)
  return '정상적으로 수신하였습니다.'
})