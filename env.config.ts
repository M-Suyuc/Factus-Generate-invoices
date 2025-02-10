const { url_api, email, password, client_id, client_secret } = process.env

export const EnvConfig = () => ({
  email,
  password,
  client_id,
  client_secret,
  url_api,
})
