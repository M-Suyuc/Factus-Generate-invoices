export interface Tributos {
  status: string
  message: string
  data: Datum[]
}

export interface Datum {
  id: number
  code: string
  name: string
  description: string
}
