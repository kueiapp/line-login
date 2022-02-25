import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

const http: AxiosInstance = axios.create({
  timeout: 10 * 1000,
});

export async function postAuthToGetToken(code: string) {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", process.env.VUE_APP_LINE_CLIENT_ID);
  params.append("client_secret", process.env.VUE_APP_LINE_CLIENT_ID_SECRET);
  params.append("redirect_uri", process.env.VUE_APP_LINE_CALLBACK_URL);
  params.append("code", code);
  return await http
    .post(`https://api.line.me/oauth2/v2.1/token`, params, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    })
    .then((response: AxiosResponse) => response.data)
    .catch((error: AxiosError) => Promise.reject(400));
}
