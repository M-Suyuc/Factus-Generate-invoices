export interface UnidadesMedida {
  status: string
  message: string
  data: Datum[]
}

export interface Datum {
  id: number
  code: string
  name: string
}
