import { BaseDto } from "./base-dto";

export class DetalleDto extends BaseDto {  
  maestraId :string;
  nombre :string;
  descripcion:string;
  codigo:string;
  constructor(label? : string) {
    super();
    if (label) {
      this.codigo = label;
      this.nombre = label;
    }
  }
}
