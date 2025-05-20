import { apiService } from "./axios";
import type { visitorType } from "./types";

export class VisitorService {
  getAllVisitor = async ()=> {
    return await apiService.get("/users")
    .then(async (response) => await response.data.data.visitor)
    .then((data: visitorType[]) => {
      return data
    })
  }

  reactiveVisitor = async (id: number) => {
    return await apiService.put(`/users/reabilite/${id}`)
    .then(async(response) => await response.data)
    .then((data: {message: string})=> {
      return data
    })
  }
}
