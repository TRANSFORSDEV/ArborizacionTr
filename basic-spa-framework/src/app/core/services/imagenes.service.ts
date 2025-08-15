import { TokenService } from './token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from './generic-service';
import { DetalleDto } from '../models/detalle-dto.model';
import { CustomApiResponse } from '../models/api-response';
import { checkToken } from '../Interceptor/token-interceptor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Imagenes extends GenericService<DetalleDto> {
    protected override endpoint = 'images';  // Aquí estableces el endpoint específico para UserDto

  constructor(http: HttpClient, tokenService: TokenService) {
    super(http, tokenService);
  }

  getByMaestra(id : string) {
    return this.http.get<CustomApiResponse<DetalleDto[]>>(`${this.apiUrl}/api/${this.endpoint}/GetByMaestra/${id}`, { context: checkToken() });
  }

  downloadHistoryValueFile(nombre: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/api/${this.endpoint}/${nombre}`, {
      responseType: 'blob' as 'json', 
      context: checkToken(), 

    }) as Observable<Blob>;
  } 

  // getShapefileZip(): Observable<Blob> {
  //   return this.http.get(`${this.apiUrl}/api/CensoArboreo/exportShape`, {
  //     responseType: 'blob', // Ajuste aquí
  //     context: checkToken(),
  //   }) as Observable<Blob>; // Asegúrate de que la respuesta se maneje como un Blob
  // }
}
