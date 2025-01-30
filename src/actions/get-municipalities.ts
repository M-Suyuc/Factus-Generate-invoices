"use server"

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

    return response.json()
  } catch (error) {
    console.error("Error fetching data:", error)
    throw new Error("Error fetching data")
  }
}
