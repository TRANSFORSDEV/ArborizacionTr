import { TokenService } from './token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from './generic-service';
import { DetalleDto } from '../models/detalle-dto.model';

@Injectable({
  providedIn: 'root'
})
export class DetalleService extends GenericService<DetalleDto> {
    protected override endpoint = 'detalle';  // Aquí estableces el endpoint específico para UserDto

  constructor(http: HttpClient, tokenService: TokenService) {
    super(http, tokenService);
  }
}
