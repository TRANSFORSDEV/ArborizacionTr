import { TokenService } from './token.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from './generic-service';
import { CensoArboreoDto, CoordenadaDto } from '../models/censoarboreo-dto.model';
import { checkToken } from '../Interceptor/token-interceptor';
import { CustomApiResponse } from '../models/api-response';
import { Observable, map } from 'rxjs';
import { ReporteDto } from '../models/reportes.model';

@Injectable({
  providedIn: 'root',
})
export class CensoArboreoService extends GenericService<CensoArboreoDto> {
  protected override endpoint = 'CensoArboreo';  // Aquí estableces el endpoint específico para UserDto

  constructor(http: HttpClient, tokenService: TokenService) {
    super(http, tokenService);
  }

  createWFiles(item: FormData) {
    return this.http.post<CustomApiResponse<CensoArboreoDto>>(
      `${this.apiUrl}/api/${this.endpoint}/LoadCensoWithImages`,
      item,
      { context: checkToken() }
    );
  }

  updateWFile(id: string, item: any) {
    return this.http.put<CustomApiResponse<CensoArboreoDto>>(
      `${this.apiUrl}/api/${this.endpoint}/UpdateLoadCensoWithImages/${id}`,
      item,
      { context: checkToken() }
    );
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

  getDescargasCSV(parametros: ReporteDto): Observable<Blob> {
    const headers = new HttpHeaders({
      Accept: 'text/csv; charset=utf-8', // Asegúrate de que este valor sea el correcto según tu API.
    });

    let params = new HttpParams();
    if (parametros.desde) {
      const fechaDesde = new Date(parametros.desde);
      params = params.set('desde', fechaDesde.toISOString());
    }
    if (parametros.hasta) {
      const fechaDesde = new Date(parametros.hasta);
      params = params.set('hasta', fechaDesde.toISOString());
    }
    if (parametros.filter) {
      params = params.set('filter', parametros.filter);
    }
    params = params.set('guadua', parametros.guadua.toString());

    return this.http
      .get(`${this.apiUrl}/api/${this.endpoint}/export`, {
        headers,
        params,
        responseType: 'blob' as 'json',
        context: checkToken(),
      })
      .pipe(
        map((res: any) => {
          return new Blob([res], { type: 'text/csv; charset=utf-8' });
        })
      );
  }

  uploadFile(formData: FormData, size: number) {
    return this.http.post<CustomApiResponse<CensoArboreoDto>>(`${this.apiUrl}/api/CensoArboreo/cargarArchivo`, formData,  { context: checkToken() });
  }

  getAllCoordenadas(comuna: string,barrio: string, guadua:boolean) {
    const params = {
      comuna :comuna,
      barrio: barrio,
      guadua:guadua
    };
    return this.http.get<CustomApiResponse<CoordenadaDto[]>>(`${this.apiUrl}/api/CensoArboreo/GetUbicacionArboles`,{params, context: checkToken() });
  }

  getFilterPlantula(filter: string, pageNumber: number, pageSize: number) {
    const params = {
      filter: filter,
      toActividades : 'Plantula',
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    };

    return this.http.get<CustomApiResponse<CensoArboreoDto[]>>(`${this.apiUrl}/api/${this.endpoint}`, { params, context: checkToken() });
  }

  getArbolesCercanos(lat: number,long: number) {
    const params = {
      lat: lat,
      long: long,
      dist: 20
    };

    return this.http.get<CustomApiResponse<CoordenadaDto[]>>(`${this.apiUrl}/api/CensoArboreo/GetUbicacionArbolesCercanos`, { params, context: checkToken() });
  }

  getFiltrado(filter: string,comuna: string,barrio: string, guadua:boolean, sinPlantulas:boolean,ordenarPor:string, orden:number,
     pageNumber: number, pageSize: number) {
    const params = {
      filter: filter,
      comuna:comuna,
      barrio:barrio,
      guadua:guadua,
      ordenarPor:ordenarPor,
      orden:orden,
      sinPlantulas:sinPlantulas,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    };

    return this.http.get<CustomApiResponse<CensoArboreoDto[]>>(`${this.apiUrl}/api/${this.endpoint}`, { params, context: checkToken() });
  }

}
