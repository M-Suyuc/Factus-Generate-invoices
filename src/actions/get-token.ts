"use server"

import { cache } from "react"
import { EnvConfig } from "../../env.config"

const getCachedToken = cache(async () => {
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
        revalidate: 3500,
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

    return data
  } catch (error) {
    console.error("Error fetching data:", error)
    throw new Error("Error fetching data")
  }
})

export async function getToken() {
  const { access_token } = await getCachedToken()
  return access_token
}
