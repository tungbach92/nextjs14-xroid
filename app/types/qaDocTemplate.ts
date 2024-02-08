
export interface DocItem {
  url: string
  index: number
  id: string
  name: string
  type: string
}
export interface QaDocTemplate {
  id?: string
  model?: string
  title?: string
  gs_docs?: DocItem[]
  urls?: DocItem[]
  ytlinks?: DocItem[]
  spreadsheet_ids?: DocItem[]
  presentation_ids?: DocItem[]
  gdoc_ids?: DocItem[]
  modelId?: string
  userId?: string
  index?: number
}
