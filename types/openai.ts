interface ChatData {
  role: 'user'|'assistant'|'system',
  content: string
}

interface ChatType {
  type: 'slack'|'browser'
  id: string
}

export type {
  ChatData,
  ChatType
}