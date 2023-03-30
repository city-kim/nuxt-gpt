import * as fs from 'node:fs/promises'
import type { ChatData, ChatType } from '@/types/openai'

export async function writeData (message: ChatData, target:ChatType) {
  const path = `data/${target.type}/${target.id}.json` // data 하위 slack과 browser로 구분하여 파일을 생성한다
  const read = await fs.readFile(path, { encoding: 'utf8' }) // 파일 내용을 읽는다
  const file = await fs.open(path, 'w') // 파일은 덮어쓰한다
  
  const data = JSON.parse(read) // JSON으로 변환
  data.push(message) // 전달받은 내용을 push함
  await fs.writeFile(file, JSON.stringify(data)) // string으로 저장해준다
  console.log('쓰기')
  
  await file.close() // 파일을 닫아준다
  console.log('저장되었다')
  return Promise.resolve('done')
}