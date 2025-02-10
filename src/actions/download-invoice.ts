"use server"

import { Download } from "@/interfaces/download"
import { EnvConfig } from "../../env.config"
import { getToken } from "./get-token"

export async function DownloadPDF(PdfNumber: string) {
  const access_token = await getToken()
  const { url_api } = EnvConfig()

  const response = await fetch(
    `${url_api}/v1/bills/download-pdf/${PdfNumber}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    console.log(errorData)
  }

  const data = (await response.json()) as Download

  return data
}
