import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RespuestaObjeto } from "src/app/shared/models/respuesta";
import { Observable } from "rxjs";
import { RespuestaLista } from "src/app/shared/models/respuesta";
import { User } from "src/app/shared/models/incorporaciones/user";

@Injectable({
  providedIn: "root",
})
export class AdministracionService {

  private baseUrl = environment.apiIcBack;
  private path = "api/administracion";

  constructor(private http: HttpClient) {}

  uploadExcelPlanilla(archivoPlanilla: File) {
    const formData = new FormData();
    formData.append("archivoPlanilla", archivoPlanilla);
    return this.http.post<RespuestaObjeto<string>>(
      `http://127.0.0.1:8000/${this.path}/upload-excel-planilla`,
      formData
    );
  }

  uploadImgFuncionarios(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return this.http.post<RespuestaObjeto<string>>(
      `http://127.0.0.1:8000/${this.path}/upload-imagenes-funcionarios`,
      formData
    );
  }

  getImgUserAdministrador(userCi: number): string {
    return `http://127.0.0.1:8000/${this.path}/${userCi}/img-user-administrador`;
  }

  getImgUsers(usersCi: number): string {
    return `http://127.0.0.1:8000/${this.path}/${usersCi}/img-users`;
  }


  /*byNombreUsuario(name: string, pagination?: { page?: number; limit?: number }) {
    return this.http.post<RespuestaLista<User>>(
      `http://127.0.0.1:8000/${this.path}/filtrar-nombre-usuario`, 
      { name, ...pagination } 
    );
  }*/

}
