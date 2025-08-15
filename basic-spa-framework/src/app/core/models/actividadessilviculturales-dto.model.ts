import { BaseDto } from "./base-dto";
import { CensoArboreoDto } from "./censoarboreo-dto.model";

export class ActividadesSilviculturalesDto extends BaseDto {
    idCensoArboreo: string;
    censoArboreo: CensoArboreoDto;
    podaRealceR : boolean;
    podaEstabilidadE : boolean;
    podaMantenimientoM : boolean;

    cortesNuevos : boolean;
    cortesViejos : boolean;
    cortesEnfermos : boolean;
    podaRaices : boolean;
    estructurasCercanasTipoEmplazamiento : string;
    limpieza : string;
    podaSanitaria : string;
    inmediataI : boolean;
    cortoPlazoC : boolean;
    largoPlazoL : boolean;
    trasplante : boolean;
    observacion : string;
    observacion2 : string;
    estado : Estado;

    //SIEMBRA
    numeroArbolEnCampo: string;
    responsable : string;
    //PODAS
    actor: string;
    operador: string;
    nuevaIntervencion: Date;
    podaCorreccion: boolean;
    podaFormacion: boolean;

    //TALAS
    numAutorizationCdmb: string;
    usoDeMadera: string;
    expedicionPermiso: Date;

    //Fotos
    fotoAntes: string;
    fotoDuranteUno: string;
    fotoDuranteDos: string;
    fotoDespues: string;

    //typo
    isSiembra: boolean;
    isPoda: boolean;
    isTala: boolean;
  }

  export enum Estado {
    Solicitada = "Solicitada",
    Aprobada = "Aprobada",
    Rechazada = "Rechazada",
    Ejecutada = "Ejecutada"
  }


  export class ActividadesSilviculturalesEstadoDto {
    id: string;
    estado : string;
    observacion : string;
    observacion2 : string;
  }
