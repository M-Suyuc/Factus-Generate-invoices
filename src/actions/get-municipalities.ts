"use server"

import { Municipios } from "@/interfaces/municipalities"
import { helperHttp } from "@/services/helper"

export async function getMunicipalities() {
  try {
    const response = await helperHttp({
      complement: "/v1/municipalities",
      method: "GET",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error ${response.status}: ${errorData.message || "Unknown error"}`
      )
    }
    const data = await response.json()

    return data as Municipios
  } catch (error) {
    console.error("Error fetching data:", error)
    throw new Error("Error fetching data")
  }
}
