import * as fs from 'node:fs/promises'

export default defineEventHandler(async (event) => {
  const id = getCookie(event, 'browser_id') // 쿠키값으로 아이디를 생성
  const result = {
    message: '삭제완료'
  }
  if (id) {
    console.log('쿠키확인')
    // 쿠키가 있는경우만 실행한다
    setCookie(event, 'browser_id', id, { // 만료날짜를 설정하여 쿠키삭제
      maxAge: 0,
    })
    // 파일삭제
    const path = `data/browser/${id}.json`
    await fs.rm(path)
  }
  console.log('대화삭제')
  // 아무것도 해당하지 않는다면 빈 배열을 반환한다
  return result

})
