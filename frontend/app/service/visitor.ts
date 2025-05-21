import { apiService } from "./axios";
import type { visitorType, newVisitorType } from "./types";

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

  deleteVisitor = async (id: number)=> {
    return await apiService.delete(`/users/delete/${id}`)
    .then(async(response) => await response.data)
    .then((data: {message: string})=> {
      return data
    })
  }

  createVisitor = async (data: newVisitorType) => {
    try {
      const response = await apiService.post("/users/newVisitor", data);
      const result: {message: string} = response.data;
      return result
    } catch (error: any) {
      throw error 
    }
  }
}
