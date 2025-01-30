"use server"

import { cache } from "react"
import { EnvConfig } from "../../env.config"

const getCachedToken = cache(async () => {
  // export async function getToken() {
  // console.log("Fetching data at:", new Date().toISOString())
  console.log("Token obtenido en:", new Date().toISOString())

  try {
    const { url_api, client_id, client_secret, email, password } = EnvConfig()

    const formData = new FormData()
    formData.append("grant_type", "password")
    formData.append("client_id", client_id!)
    formData.append("client_secret", client_secret!)
    formData.append("username", email!)
    formData.append("password", password!)

    const response = await fetch(`${url_api}/oauth/token`, {
      next: {
        revalidate: 3000, // Cada 59 minutos
      },
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error ${response.status}: ${errorData.message || "Unknown error"}`
      )
    }
    const data = await response.json()

    // console.log("Data fetched at:", new Date().toISOString())
    console.log(
      "Token expira en:",
      new Date(Date.now() + 3600 * 1000).toISOString()
    )

    return data
  } catch (error) {
    console.error("Error fetching data:", error)
    throw new Error("Error fetching data")
  }
})

export async function getToken() {
  return getCachedToken()
}
