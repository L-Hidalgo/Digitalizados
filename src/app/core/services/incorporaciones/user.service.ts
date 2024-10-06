import { Injectable } from "@angular/core";
import { RespuestaLista } from "src/app/shared/models/respuesta";
import { RespuestaObjeto } from "src/app/shared/models/respuesta";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { User } from "src/app/shared/models/incorporaciones/user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private baseUrl = environment.apiIcBack;
  private path = "api/users";

  constructor(private http: HttpClient) {}

  listarUsers(query: any = {}, pagination?: { page?: number; limit?: number }) {
    return this.http.post<RespuestaLista<User>>(
      `http://127.0.0.1:8000/${this.path}/listar-users`,
      { query, ...pagination }
    );
  }

  getAllUserGRH() {
    return this.http.get<RespuestaLista<User>>(`http://127.0.0.1:8000/${this.path}/listar-users-dde`);
  }
  
  asignarRol(userId: number, roles: number[]) {
    return this.http.put<RespuestaObjeto<User>>(
      `http://127.0.0.1:8000/${this.path}/updateRolUser/${userId}`,
     {roles}
    );
  }

  

}
