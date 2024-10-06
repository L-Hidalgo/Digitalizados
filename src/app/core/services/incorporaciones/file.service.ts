import { Injectable } from "@angular/core";
import { AuthenticationService } from "../auth.service";
import { environment } from "src/environments/environment";
import {
  RespuestaLista,
  RespuestaObjeto,
} from "src/app/shared/models/respuesta";
import { map } from "rxjs/operators";
//import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { File } from "src/app/shared/models/incorporaciones/file";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FileService {
  //private baseUrl = environment.apiIcBack;
  private path = "api/file";

  constructor(
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) {}

  getCurrentUserId(): number | null {
    const currentUser = this.authenticationService.getCurrentUser();
    return currentUser ? currentUser.id : null;
  }

  crearFile(formData: FormData): Observable<RespuestaObjeto<File>> {
    const userId = this.getCurrentUserId();
    if (userId !== null) {
      formData.append("createdByFile", userId.toString());
      return this.http.post<RespuestaObjeto<File>>(
        `http://127.0.0.1:8000/${this.path}/crear-file`,
        formData
      );
    } else {
      throw new Error("No se pudo obtener el ID del usuario actual");
    }
  }

  listarFile(query: any = {}, pagination?: { page?: number; limit?: number }) {
    return this.http.post<RespuestaLista<File>>(
      `http://127.0.0.1:8000/${this.path}/listar-file`,
      { query, ...pagination }
    );
  }

  listarMemoRap(query: any = {}, pagination?: { page?: number; limit?: number }) {
    return this.http.post<RespuestaLista<File>>(
      `http://127.0.0.1:8000/${this.path}/listar-memo-rap`,
      { query, ...pagination }
    );
  }

  getFileChildren(parentId: number, personaFile?: string): Observable<any[]> {
    let params = new HttpParams();

    if (personaFile) {
      params = params.set("personaFile", personaFile);
    }

    return this.http.get<any[]>(
      `http://127.0.0.1:8000/${this.path}/${parentId}/children-file`,
      { params }
    );
  }

  getDocumento(fileId: number): Observable<{ blob: Blob }> {
    return this.http
      .get(`http://127.0.0.1:8000/${this.path}/${fileId}/ver-documento`, {
        observe: "response",
        responseType: "blob",
      })
      .pipe(
        map((response) => {
          return { blob: response.body as Blob };
        })
      );
  }

  downloadDocumento(fileId: number) {
    return this.http.get(
      `http://127.0.0.1:8000/${this.path}/${fileId}/download-documento`,
      { responseType: "blob" }
    );
  }

  modificarNombreFile(fileId: number): Observable<any> {
    const userId = this.getCurrentUserId();
    if (userId !== null) {
      const data = { modifiedByFile: userId.toString() };

      return this.http.patch(
        `http://127.0.0.1:8000/${this.path}/${fileId}/modificar-file`,
        data
      );
    } else {
      throw new Error("No se pudo obtener el ID del usuario actual");
    }
  }

  darBajaFile(fileId: number): Observable<any> {
    const userId = this.getCurrentUserId();
    if (userId !== null) {
      const data = { modifiedByFile: userId.toString() };

      return this.http.patch(
        `http://127.0.0.1:8000/${this.path}/${fileId}/dar-baja-file`,
        data
      );
    } else {
      throw new Error("No se pudo obtener el ID del usuario actual");
    }
  }

  getNombreFile(fileId: number): Observable<File> {
    return this.http.get<File>(
      `http://127.0.0.1:8000/${this.path}/${fileId}/mostrar-nombre-file`
    );
  }

  updateNombreFile(fileId: number, nombreFile: string): Observable<any> {
    const userId = this.getCurrentUserId();
    if (userId !== null) {
      const data = {
        idFile: fileId,
        nombreFile: nombreFile,
        modifiedByFile: userId.toString(),
      };
      return this.http.put(
        `http://127.0.0.1:8000/${this.path}/${fileId}/modificar-nombre-file`,
        data
      );
    } else {
      throw new Error("No se pudo obtener el ID del usuario actual");
    }
  }

  downloadCarpeta(fileId: number): Observable<ArrayBuffer> {
    return this.http.get(
      `http://127.0.0.1:8000/${this.path}/${fileId}/download-carpeta`,
      { responseType: "arraybuffer" }
    );
  }
}
