import { TokenService } from './token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from './generic-service';
import { EspaciosPotencialesDto } from '../models/espaciospotenciales-dto.model';
import { checkToken } from '../Interceptor/token-interceptor';
import { CustomApiResponse } from '../models/api-response';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspaciosPotencialesService extends GenericService<EspaciosPotencialesDto> {
    protected override endpoint = 'EspaciosPotenciales';  // Aquí estableces el endpoint específico para UserDto

  constructor(http: HttpClient, tokenService: TokenService) {
    super(http, tokenService);
  }

  createWFiles(item: FormData) {
    return this.http.post<CustomApiResponse<EspaciosPotencialesDto>>(`${this.apiUrl}/api/${this.endpoint}/LoadEspacioWithImages`, item, { context: checkToken() });
  }

  updateWFile(id: string, item: any) {
    return this.http.put<CustomApiResponse<EspaciosPotencialesDto>>(`${this.apiUrl}/api/${this.endpoint}/UpdateLoadEspacioWithImages/${id}`, item, { context: checkToken() });
  }
  uploadFile(formData: FormData, size: number) {
    return this.http.post<CustomApiResponse<EspaciosPotencialesDto>>(`${this.apiUrl}/api/${this.endpoint}/cargarArchivo`, formData,  { context: checkToken() });
  }
  getDescargas(): Observable<Blob> {
    const headers = new HttpHeaders({
      Accept: 'text/csv; charset=utf-8', // Asegúrate de que este valor sea el correcto según tu API.
    });

    return this.http
      .get(`${this.apiUrl}/api/${this.endpoint}/export`, {
        headers,
        responseType: 'blob' as 'json',
        context: checkToken(),
      })
      .pipe(
        map((res: any) => {
          return new Blob([res], { type: 'text/csv; charset=utf-8' });
        })
      );
  }
}
