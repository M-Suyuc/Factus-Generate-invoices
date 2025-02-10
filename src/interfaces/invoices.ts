export interface Invoices {
  status: string
  message: string
  data: Data
}

export interface Data {
  data: Datum[]
  pagination: Pagination
}

export interface Datum {
  id: number
  document: Document
  number: string
  api_client_name: string
  reference_code: string
  identification: string
  graphic_representation_name: string
  company: string
  trade_name: string
  names: string
  email: string
  total: string
  status: number
  errors: string[]
  send_email: number
  has_claim: number
  is_negotiable_instrument: number
  payment_form: Document
  created_at: null | string
  credit_notes: unknown[]
  debit_notes: unknown[]
}

export interface Document {
  code: string
  name: Name
}

export enum Name {
  FacturaElectrónicaDeVenta = "Factura electrónica de Venta",
  PagoACrédito = "Pago a crédito",
  PagoDeContado = "Pago de contado",
}

export interface Pagination {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number
  to: number
  links: Link[]
}

export interface Link {
  url: null | string
  label: number | string
  active: boolean
  page?: number
}
