"use server"

import { Tributos } from "@/interfaces/tributos"
import { helperHttp } from "@/services/helper"

export async function getTributesProducts() {
  try {
    const response = await helperHttp({
      complement: "/v1/tributes/products",
      method: "GET",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error ${response.status}: ${errorData.message || "Unknown error"}`
      )
    }

    const data = await response.json()

    return data as Tributos
  } catch (error) {
    console.error("Error fetching data:", error)
    throw new Error("Error fetching data")
  }
}
