import * as fs from 'node:fs/promises'
import type { ChatType } from '@/types/openai'

export async function checkFile (target:ChatType) {
  console.log('파일체크 시작')
  const path = `data/${target.type}/${target.id}.json` // data 하위 slack과 browser로 구분하여 파일을 생성한다
  console.log(path)
  let file
  try {
    console.log('파일이 없다면 생성')
    // 파일을 체크하고 없으면 생성해준다
    file = await fs.open(path, 'a')
  } finally {
    console.log('파일open 종료')
    // 생성후 종료
    file?.close()
  }

  let read = await fs.readFile(path, { encoding: 'utf8' }) // 파일 읽어옴
  if (read.length < 1) {
    console.log('데이터가없음')
    // 데이터가 없는경우 배열을 생성
    await fs.appendFile(path, '[]')
    // 다시읽음
    read = await fs.readFile(path, { encoding: 'utf8' })
    // 결과값 반환
    return Promise.resolve(read)
  } else {
    console.log('데이터가 있다')
    // 데이터가 있다면 그냥 결과값 반환
    const data = JSON.parse(read)
    if (data.length > 0 && data.at(-1).role == 'user') {
      // 배열의 데이터가 마지막 데이터가 유저라면 질문 처리중인 것
      return Promise.reject(new Error('proceeding'))
    }
    return Promise.resolve(read)
  }
}