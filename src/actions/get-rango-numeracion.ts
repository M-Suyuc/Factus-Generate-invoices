"use server"

import { RangoNumeracion } from "@/interfaces/rango"
import { helperHttp } from "@/services/helper"

export async function getRangoNumeracion() {
  try {
    const response = await helperHttp({
      complement:
        "/v1/numbering-ranges?filter[id]&filter[document]&filter[resolution_number]&filter[technical_key]&filter[is_active]",
      method: "GET",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error ${response.status}: ${errorData.message || "Unknown error"}`
      )
    }

    const data = await response.json()

    return data as RangoNumeracion
  } catch (error) {
    console.error("Error fetching data:", error)
    throw new Error("Error fetching data")
  }
}
