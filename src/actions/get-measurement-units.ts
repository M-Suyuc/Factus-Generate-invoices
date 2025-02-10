"use server"

import { UnidadesMedida } from "@/interfaces/medidas"
import { helperHttp } from "@/services/helper"

export async function getMeasurementUnits() {
  try {
    const response = await helperHttp({
      complement: "/v1/measurement-units",
      method: "GET",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error ${response.status}: ${errorData.message || "Unknown error"}`
      )
    }
    const data = await response.json()

    return data as UnidadesMedida
  } catch (error) {
    console.error("Error fetching data:", error)
    throw new Error("Error fetching data")
  }
}
