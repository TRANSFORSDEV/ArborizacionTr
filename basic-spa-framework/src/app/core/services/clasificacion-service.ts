import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GenericService } from "./generic-service";
import { TokenService } from "./token.service";
import { ClasificacionDto } from "../models/clasificacion.model";

@Injectable({
  providedIn: 'root'
})
export class ClasificacionService extends GenericService<ClasificacionDto> {
    protected override endpoint = 'clasificacion';  // Aquí estableces el endpoint específico para UserDto

  constructor(http: HttpClient, tokenService: TokenService) {
    super(http, tokenService);
  }
}
