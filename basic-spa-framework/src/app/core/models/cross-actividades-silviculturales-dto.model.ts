import { CensoArboreoComponent } from "src/app/modules/censoarboreo/containers/censoarboreo/censoarboreo.component";
import { BaseDto } from "./base-dto";
import { CensoArboreoDto } from "./censoarboreo-dto.model";

export class CrossActividadesSilviculturalesDto {

  censoArboreoId: string;
  censoArboreo:CensoArboreoDto;
  numeroIndividuoId: string;
  numeroArbolCampo: string;

}
