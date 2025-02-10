"use server"

import { EnvConfig } from "../../env.config"
import { getToken } from "./get-token"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function validateInvoice(formData: any) {
  const access_token = await getToken()
  const { url_api } = EnvConfig()

  const response = await fetch(`${url_api}/v1/bills/validate`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(formData),
  })

  if (response.status === 409) {
    throw new Error(
      "Conflicto: Se encontró una factura pendiente por enviar a la DIAN"
    )
  }

  if (!response.ok) {
    console.log(response)
  }

  const data = await response.json()

  return data
}
