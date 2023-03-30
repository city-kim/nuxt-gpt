import * as fs from 'node:fs/promises'
import type { ChatData } from '@/types/openai'

export default defineEventHandler(async (event) => {
  const id = getCookie(event, 'browser_id') // 쿠키값으로 아이디를 생성
  const result = {
    message: '데이터가 없다',
    data: [] as Array<ChatData>,
  }
  if (id) {
    console.log('쿠키확인')
    // 쿠키가 있는경우만 실행한다
    const path = `data/browser/${id}.json`
    const file = await fs.open(path, 'r')
    .catch(() => {
      result.message = '파일이 없다'
    })

    if (file) { // 파일이 존재하는경우만 실행한다
      console.log('파일이 있군요')
      const read = await file.readFile({ encoding: 'utf8' }) // 파일을 읽어온뒤
      const data = JSON.parse(read) as Array<ChatData> // 결과값 json으로 변환
      
      result.message = '데이터가 있다'
      result.data = data

      file.close()
    }
  }
  console.log('리스트 종료')
  // 아무것도 해당하지 않는다면 빈 배열을 반환한다
  return result

})
