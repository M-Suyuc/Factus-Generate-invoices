const {
  url_api,
  email,
  password,
  client_id,
  client_secret,
  access_token,
  // NODE_ENV = "development",
} = process.env

export const EnvConfig = () => ({
  email,
  password,
  client_id,
  client_secret,
  access_token,
  url_api,
  // NODE_ENV,
})
