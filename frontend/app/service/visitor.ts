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
}
