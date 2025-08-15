import { TokenService } from './token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from './generic-service';
import { DetalleDto } from '../models/detalle-dto.model';
import { CustomApiResponse } from '../models/api-response';
import { checkToken } from '../Interceptor/token-interceptor';

@Injectable({
  providedIn: 'root'
})
export class DetalleService extends GenericService<DetalleDto> {
    protected override endpoint = 'detalle';  // Aquí estableces el endpoint específico para UserDto

  constructor(http: HttpClient, tokenService: TokenService) {
    super(http, tokenService);
  }

  getByMaestra(id : string) {
    return this.http.get<CustomApiResponse<DetalleDto[]>>(`${this.apiUrl}/api/${this.endpoint}/GetByMaestra/${id}`, { context: checkToken() });
  }

  getFilterByMaestra(filter: string, idMaestra: string, pageNumber: number, pageSize: number) {
    const params = {
      IdMaestra: idMaestra,
      filter: filter,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    };

    return this.http.get<CustomApiResponse<DetalleDto[]>>(`${this.apiUrl}/api/${this.endpoint}`, { params, context: checkToken() });
  }
}
