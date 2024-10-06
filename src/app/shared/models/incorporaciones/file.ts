import { Persona } from "./persona";
import { User } from "./user";

export interface File {
  idFile: number;
  nombreFile: String;
  rutaFile: string;
  tipoFile: number;
  tipoDocumentoFile: number;
  personaId: number;
  parentId: number;
  estadoFile: number;
  createdByFile?: number;
  modifiedByFile?: number;

  parent?: Pick<File, "idFile" | "nombreFile" | "rutaFile" | "tipoDocumentoFile" |"tipoFile">;
  children?: Pick<File, "idFile" | "nombreFile" | "rutaFile" | "tipoDocumentoFile" |"tipoFile">;
  persona?: Pick<Persona, "idPersona" | "primerApellidoPersona" | "segundoApellidoPersona" | "nombrePersona" | "ciPersona" | "generoPersona">;
  createdBy?: Pick<User, "id" | "name" | "username">;
  modifiedBy?: Pick<User, "id" | "name" | "username">;
}
