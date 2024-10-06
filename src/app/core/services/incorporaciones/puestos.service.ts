import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { RespuestaObjeto } from 'src/app/shared/models/respuesta';
import { Puesto } from 'src/app/shared/models/incorporaciones/puesto';
import { Requisito } from 'src/app/shared/models/incorporaciones/requisito';

@Injectable({
  providedIn: 'root'
})
export class PuestosService {
  private baseUrl = environment.apiIcBack;
  private path = 'api/puestos';

  constructor(private http: HttpClient) { }

  findPuestoByItem(item: number) {
    return this.http.get<RespuestaObjeto<Puesto>>(`http://127.0.0.1:8000/${this.path}/${item}/by-item`);
  }

  findPuestoByItemActual(item: number) {
    return this.http.get<RespuestaObjeto<Puesto>>(`http://127.0.0.1:8000/${this.path}/${item}/by-item-actual`);
  }

  getPuestoRequisito(puestoId: number) {
    return this.http.get<RespuestaObjeto<Requisito>>(`http://127.0.0.1:8000/${this.path}/${puestoId}/requisito`);
  }
}
