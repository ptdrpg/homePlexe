import { jwtDecode } from "jwt-decode";

export type Paylod = {
  user_id: number;
  username: string;
  role: string;
}

export const decodePaylod = () => {
  const token = localStorage.getItem("token")
  if (token) {
    try {
      const decoded = jwtDecode<Paylod>(token);
      console.log(decoded);
      
      return decoded;
    } catch (error) {
      return null;
    }
  }
}