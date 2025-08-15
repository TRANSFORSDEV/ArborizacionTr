import { BaseDto } from "./base-dto";

export class CensoArboreoDto extends BaseDto{

  numeroIndividuoId: number;
  alturaTotal: number;
  alturaComercial: number;
  cuadrilla: string;
  formaCopa: string;
  diametroCopa: number;
  alturaCopa: number;
  observacionCopa: string;

  dap: number;
  dap2: number;
  dap3: number;
  dap4: number;
  daP2: number;
  daP3: number;
  daP4: number;
  ndaptotal: number;
  daptotal: number;
  numeroFustes: number;
  nombreComun: string;
  nombreCientifico: string;
  orden: string;
  familia: string;
  genero: string;
  especie: string;
  altitudASNM: number;
  estadoFitosanitario: string;
  estadoMadurez: string;
  tipoIndividuoForestal: string;
  departamento: string;
  ciudad: string;
  tipoAglomeracion: string;
  barrio: string;
  comuna: string;
  tipoEmplazamiento: string;
  observacionTipoEmplazamiento: string;
  infraestructuraAfectada: string;
  observacionInfraestructuraAfectada: string;
  apendiceCites: boolean;
  categoriaUicn: boolean;
  clasificacionId:string;
  categoriaMinisterioResolucion01922014: boolean;
  especieEndemica: boolean;
  origen: string;
  observacion: string;
  fecha: Date;
  recomendacionesParaManejoSilvicultural: string;

  coordenada: CoordenadaDto;
  fotos: RegistroFotograficoCensoDto[];

  isGuadua : boolean;

  constructor(){
    super();
    this.coordenada = new CoordenadaDto();
    this.fotos = new Array<RegistroFotograficoCensoDto>();
  }
}


export class CoordenadaDto extends BaseDto {
  latitud: number;
  longitud: number;
  altitud: string;
  norte: string;
  este: string;
}


export class RegistroFotograficoBaseDto extends BaseDto {

  url: string;
  nombre: string;
  censoArboreoId: string;

}

export class RegistroFotograficoCensoDto extends RegistroFotograficoBaseDto {

}

export class RegistroFotograficoEspacioDto extends RegistroFotograficoBaseDto {

}
