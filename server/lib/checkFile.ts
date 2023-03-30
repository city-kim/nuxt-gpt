import * as fs from 'node:fs/promises'
import type { ChatType } from '@/types/openai'

export async function checkFile (target:ChatType) {
  console.log('파일체크 시작')
  const path = `data/${target.type}/${target.id}.json` // data 하위 slack과 browser로 구분하여 파일을 생성한다
  if (target.remove) {
    // 삭제명령인경우 덮어쓰기용으로
    const file = await fs.open(path, 'w+')
    console.log('삭제명령')
    await file.writeFile('[]') // string으로 저장해준다
    console.log('배열로 다시씀')
    const read = await fs.readFile(path, { encoding: 'utf8' }) // 파일 읽어옴
    // 이 경우 finally가 동작해버리므로 수동으로 닫아준다

    await file.close()
    return Promise.resolve(read)
  } else {
    // 아닌경우 추가용으로 연다
    const file = await fs.open(path, 'a+')
    console.log('추가용으로 연다')
    let read = await file.readFile({ encoding: 'utf8' }) // 파일 읽어옴
    if (read.length < 1) {
      console.log('데이터가없음')
      // 데이터가 없는경우 배열을 생성
      await file.appendFile('[]')
      // path로 파일을 다시 읽음
      read = await fs.readFile(path, { encoding: 'utf8' })
      // 결과값 반환
      await file.close()
      return Promise.resolve(read)
    } else {
      console.log('데이터가 있다')
      // 데이터가 있다면 그냥 결과값 반환
      const data = JSON.parse(read)
      if (data.length > 0 && data.at(-1).role == 'user') {
        // 배열의 데이터가 마지막 데이터가 유저라면 질문 처리중인 것
        return Promise.reject(new Error('proceeding'))
      }

      await file.close()
      return Promise.resolve(read)
    }
  }
}