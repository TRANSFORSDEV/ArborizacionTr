import { BaseDto } from "./base-dto";
import { CoordenadaDto, RegistroFotograficoEspacioDto} from "./censoarboreo-dto.model";

export class EspaciosPotencialesDto extends BaseDto {
  areasDisponibles: number;
  tipoEmplazamiento: string;
  especiesPotencialesParaSiembraAlMenosTresOpciones: string;
  alturasPotencialesArboles: number;
  caracteristicasEdaficasODelSuelo: number;
  tresBolillo: boolean;
  cuadrado: boolean;
  rectangular: boolean;
  individualOUno: boolean;
  distanciamientoSiembra: number;
  infraestructuraAfectada: string;
  pendienteDelTerreno: string;
  barrio: string;
  comuna: string;
  altitudASNM: number;
  
  coordenada: CoordenadaDto;
  fotos: RegistroFotograficoEspacioDto[];
  

  constructor(){
    super();
    this.fotos = new Array<RegistroFotograficoEspacioDto>();
    this.coordenada = new CoordenadaDto();
  }
}


