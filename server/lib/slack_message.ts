import { WebClient } from '@slack/web-api'

const web = new WebClient(process.env.SLACK_BOT_OAUTH)

export function sendMessage (channel: string, content: string) {
  web.chat.postMessage({
    channel: channel, // 이벤트 수신된 채널에 게시
    text: content,
  })
}