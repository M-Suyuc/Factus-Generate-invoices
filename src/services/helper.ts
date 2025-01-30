import { getToken } from "@/actions/get-token"
import { EnvConfig } from "../../env.config"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

interface IOptions {
  method: HttpMethod
  complement: string
}

export const helperHttp = async ({ complement, method }: IOptions) => {
  const { url_api, client_id, client_secret, email, password } = EnvConfig()
  const access_token = await getToken()
  console.log(
    access_token.access_token,
    "------------",
    new Date().toISOString()
  )

  const data = {
    email,
    password,
    client_id,
    client_secret,
  }

  const options: RequestInit & { body?: string } = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token.access_token}`,
    },
  }
  if (method !== "GET") {
    options.body = JSON.stringify(data)
  }

  return fetch(`${url_api}${complement}`, options)
}
