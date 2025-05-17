import type { logintype, LogRes } from "./types"
import { apiService } from "./axios"

export class LoginService {
  login = async (data: logintype) => {
    return await apiService.post("/login", data)
    .then(async (response) => await response.data)
    .then((data: LogRes) => {
      if (data.token) {
        localStorage.setItem("token", data.token)
      }
      return data
    })
  }
}
