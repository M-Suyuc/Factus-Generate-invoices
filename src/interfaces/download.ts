export interface Download {
  status: string
  message: string
  data: Data
}

export interface Data {
  file_name: string
  pdf_base_64_encoded: string
}
