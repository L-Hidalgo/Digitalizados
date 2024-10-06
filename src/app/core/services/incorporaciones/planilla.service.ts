import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { RespuestaLista} from "src/app/shared/models/respuesta";
import { Observable } from 'rxjs';
import { Gerencia } from "src/app/shared/models/incorporaciones/gerencia";

@Injectable({
  providedIn: "root",
})
export class PlanillaService {
  private baseUrl = environment.apiIcBack;
  private path = "api/planilla";

  constructor(private http: HttpClient) {}

  listarPuestos( query: any = {}, pagination?: { page?: number; limit?: number }) {
    return this.http.post<RespuestaLista<any>>(
      `http://127.0.0.1:8000/${this.path}/listar-puestos`,
      { query, ...pagination }
    );
  }

  getGerencias(): Observable<Gerencia[]> {
    return this.http.get<Gerencia[]>(
      `http://127.0.0.1:8000/${this.path}/listar-gerencia`
    );
  }

  getImagenFuncionario(personaId: number): string {
    return `http://127.0.0.1:8000/${this.path}/${personaId}/imagen-funcionario`;
  }

  getInfPersonaPuesto(puestoId: number) {
    return this.http.get<RespuestaLista<any>>(`http://127.0.0.1:8000/${this.path}/${puestoId}/inf-persona-puesto`);
  }
}
