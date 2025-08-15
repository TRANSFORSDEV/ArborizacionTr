import { EspecieDto } from "./especie.model";
import { FamiliaDto } from "./familia.model";
import { GeneroDto } from "./genero.model";
import { OrdenDto } from "./orden.model";

export interface ClasificacionDto {
  id: string; // Guid en C# se traduce generalmente como string en TypeScript
  ordenId?: string;
  orden?: OrdenDto;
  familiaId?: string;
  familia?: FamiliaDto;
  generoId?: string;
  genero?: GeneroDto;
  especieId?: string;
  especie?: EspecieDto;
  nombreCientifico: string;
  nombreComun: string;
  etiqueta: string;
}
