import { Persona } from "./persona";
import { Puesto } from "./puesto";
import { User } from "./user";

export interface Incorporacion {
  userId?: number;
  idIncorporacion?: number;
  puestoNuevoId?: number | null;
  puestoNuevoItem?: number;
  puestoActualId?: number;
  puestoActualItem?: number;
  personaId?: number | null;
  //Datos de evaluacion
  obsEvaluacionIncorporacion?: string |null; //1: cumple: 0 no cumple
  detalleObsEvaluacionIncorporacion?: string |null; 
  expEvaluacionIncorporacion?: number; //1: tiene; 0: no tiene
  fchObsEvaluacionIncorporacion?: Date | null; 
  //requsitos
  cumpleFormacionIncorporacion?: number | null;
  cumpleExpProfesionalIncorporacion?: number | null;
  cumpleExpEspecificaIncorporacion?: number | null;
  cumpleExpMandoIncorporacion?: number | null;
  //otros
  hpIncorporacion?: string | null;
  nTramiteIncorporacion?: string | null;
  citeInformeIncorporacion?: string | null;
  fchInformeIncorporacion?: Date | null;
  fchIncorporacion?: string;
  // inf nota y minuta
  citeNotaMinutaIncorporacion?: string | null;
  codigoNotaMinutaIncorporacion?: string | null;
  fchNotaMinutaIncorporacion?: Date | null;
  fchRecepcionNotaIncorporacion?: Date | null;
   //rap
   citeRapIncorporacion?: string | null;
   codigoRapIncorporacion?: string | null;
   fchRapIncorporacion?: Date | null;
  //memo
  citeMemorandumIncorporacion?: string | null;
  codigoMemorandumIncorporacion?: string | null;
  fchMemorandumIncorporacion?: Date | null;

  createdByIncorporacion?: number | null;
  modifiedByIncorporacion?: number | null;
  estadoIncorporacion?: number | null;  //1:sin registro; 2:en proceso; 3:finalizado

  conRespaldoFormacion?: number | null;//eliminar
  // Relaciones
  persona?: Pick<Persona, 'idPersona' | 'primerApellidoPersona' | 'segundoApellidoPersona' | 'nombrePersona' | 'ciPersona' | 'generoPersona'>;
  puestoActual?: Pick<Puesto, 'idPuesto' | 'itemPuesto' | 'denominacionPuesto' | "departamento">;
  puestoNuevo?: Pick<Puesto, "idPuesto" | "itemPuesto" | "denominacionPuesto" | "departamento">;
  createdBy?: Pick<User, 'id' | 'name' | 'username'>;
  modifiedBy?: Pick<User, 'id' | 'name' | 'username'>;
}

export enum EstadosIncorporacion {
  SIN_REGISTRO = 1,
  CON_REGISTRO = 2,
  FINALIZADO = 3,
  INACTIVO = 4,
}

