import { BaseDto } from "./base-dto";


export class GenericPredecesorSucesorTableDto extends BaseDto {
  public descripcion: string;
  public predecesorId: string;
  public predecesor: GenericPredecesorSucesorTableDto | null;
  public sucesores: GenericPredecesorSucesorTableDto[];

  constructor() {
    super();
    this.sucesores = [];
  }
}