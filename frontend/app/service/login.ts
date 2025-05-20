import type { logintype, LogRes } from "./types"
import { apiService } from "./axios"

export class LoginService {
  login = async (data: logintype) => {
    try {
      const response = await apiService.post("/login", data);
      const result: LogRes = response.data;
      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      return result
    } catch (error: any) {
      throw error
    }
  }
}
