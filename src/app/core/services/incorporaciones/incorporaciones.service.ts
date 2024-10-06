import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RespuestaLista, RespuestaObjeto} from "src/app/shared/models/respuesta";
import { Incorporacion } from "src/app/shared/models/incorporaciones/incorporacion";
import { Observable } from "rxjs";
import { AuthenticationService } from "../auth.service";

@Injectable({
  providedIn: "root",
})
export class IncorporacionesService {
  private baseUrl = environment.apiIcBack;
  private path = "api/incorporaciones";

  constructor(private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  getCurrentUserId(): number | null {
    const currentUser = this.authenticationService.getCurrentUser();
    return currentUser ? currentUser.id : null;
  }

  createUpdateIncorporacion(incorporacionData: Partial<Incorporacion>) {
    const userId = this.getCurrentUserId();
    if (userId) {
      if (incorporacionData.idIncorporacion) {
        incorporacionData.modifiedByIncorporacion = userId;
      } else {
        incorporacionData.createdByIncorporacion = userId;
      }
  
      return this.http.put<RespuestaObjeto<Incorporacion>>(
        `http://127.0.0.1:8000/${this.path}/crear-actualizar-incorporacion`,
        incorporacionData
      ); 
    } else {
      throw new Error("No se pudo obtener el ID del usuario actual");
    }
  }
  

  listarIncorporaciones(query: any = {}, pagination?: { page?: number; limit?: number }) {
    return this.http.post<RespuestaLista<Incorporacion>>(
      `http://127.0.0.1:8000/${this.path}/listar-incorporaciones`,
      { query, ...pagination }
    );
  }

  darBajaIncorporacion(incorporacionId: number): Observable<any> {
    return this.http.put<any>(
      `http://127.0.0.1:8000/${this.path}/${incorporacionId}/darBajaIncorporacion`,
      {}
    );
  }

  generarReportEvaluacion(name: string, fechaInicio: string, fechaFin: string) {
    return this.http.post<Blob>(
      `http://127.0.0.1:8000/${this.path}/genReportEval`,
      { name, fechaInicio, fechaFin },
      { responseType: "blob" as "json" }
    );
  }

  generarReportTrimestral(name: string, fechaInicio: string, fechaFin: string) {
    return this.http.post<Blob>(
      `http://127.0.0.1:8000/${this.path}/genReportTrimestral`,
      { name, fechaInicio, fechaFin },
      { responseType: "blob" as "json" }
    );
  }

  byCiPersonaFormIncorporacion(ciPersona: string): Observable<any> {
    return this.http.get<any>(`http://127.0.0.1:8000/${this.path}/${ciPersona}/by-ciPersona-inc`);
  }

  byCiPersonaFormCambioItem(ciPersona: string): Observable<any> {
    return this.http.get<any>(`http://127.0.0.1:8000/${this.path}/${ciPersona}/by-ciPersona-camb-item`);
  }

  genUrlR0078(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-form-R0078`;
  }

  genUrlR1401(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-form-R1401`;
  }

  genUrlR0980(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-form-R0980`;
  }

  genUrlR1023(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-form-R1023`;
  }

  genUrlR1129(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-form-R1129`;
  }

  genUrlInfMinuta(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-inf-minuta`;
  }

  genUrlInfNota(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-inf-nota`;
  }

  genUrlMemo(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-memo`;
  }

  genUrlRap(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-rap`;
  }

  genUrlActEntrega(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-acta-entrega`;
  }

  genUrlActPosecion(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-acta-posesion`;
  }

  genUrlR1418(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-form-R1418`;
  }

  genUrlR1419(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-form-R1419`;
  }

  genUrlR0716(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-R0716`;
  }

  genUrlR0921(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-R0921`;
  }

  genUrlR0976(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-R0976`;
  }

  genUrlR1469(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-R1469`; 
  }

  genUrlRSGC0033(incorporacionId: number) {
    return `http://127.0.0.1:8000/${this.path}/${incorporacionId}/gen-RSGC-0033`; 
  }

  //servicio para mostrar las imagenes de una persona
  obtenerImagenPersona(personaId: number): string {
    return `http://127.0.0.1:8000/${this.path}/imagen-persona/${personaId}`;
  }
}
