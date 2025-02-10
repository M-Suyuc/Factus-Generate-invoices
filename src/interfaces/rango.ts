export interface RangoNumeracion {
  data: Datum[]
}

export interface Datum {
  id: number
  document: string
  prefix: string
  from: number
  to: number
  current: number
  resolution_number: string
  start_date: Date
  end_date: Date
  technical_key: null | string
  is_expired: boolean
  is_active: number
  created_at: Date
  updated_at: Date
}
