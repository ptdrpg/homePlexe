import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

export const apiService = axios.create({
  baseURL: "http://localhost:4400/api/v1",
  headers: {
    'Content-Type': 'application/json',
  },
})

export function isTokenValid() {
  const token = localStorage.getItem("token")
  if (token == undefined) {
    return false
  }
  try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp != undefined) {
        if (decoded.exp > currentTime) {
          return true
        }
      }
  } catch (error) {
      return false;
  }
}

export const interceptor = () => {
  apiService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Erreur avant l'envoi de la requête : ", error);
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response: AxiosResponse) => { 
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `Erreur de réponse (${error.response.status}): `,
        error.response.data
      );
      if (error.response.status === 401) {
        console.warn("Token expiré ou invalide. Redirection...");
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("Erreur : Aucune réponse reçue du serveur", error.request);
    } else {
      console.error("Erreur lors de la configuration de la requête", error.message);
    }

    return Promise.reject(error);
  }
);
}
