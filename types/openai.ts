interface ChatList {
  role: 'user'|'assistant'|'system',
  content: string
}

export type {
  ChatList,
}