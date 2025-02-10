"use server"

import { Invoices } from "@/interfaces/invoices"
import { helperHttp } from "@/services/helper"

export async function getInvoices(access_token?: string) {
  try {
    const response = await helperHttp({
      complement: "/v1/bills",
      method: "GET",
      access_token,
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error ${response.status}: ${errorData.message || "Unknown error"}`
      )
    }
    const data = await response.json()

    return data as Invoices
  } catch (error) {
    console.error("Error fetching data:", error)
    throw new Error("Error fetching data")
  }
}
