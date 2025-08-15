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
export class MasreportesService extends GenericService<CensoArboreoDto> {
  protected override endpoint = 'ActividadesSilviculturales';  // Aquí estableces el endpoint específico para UserDto
  protected endpoint2 = 'CensoArboreo';
  finalEndpoint = '';

  constructor(http: HttpClient, tokenService: TokenService) {
    super(http, tokenService);
  }

  getDescargas(parametros: ReporteDto): Observable<Blob> {

    let types: string = 'text/xlsx; charset=utf-8';
    console.log(parametros)
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

    var ruta = ''
    switch (+parametros.selectedReportType) {
      case 1:
        ruta = 'exportSiembra'
        this.finalEndpoint = this.endpoint;
        break;
      case 2:
        ruta = 'exportPoda'
        this.finalEndpoint = this.endpoint;
        break;
      case 3:
        ruta = 'exportTala'
        this.finalEndpoint = this.endpoint;
        break;
      case 4:
        ruta = 'exportShape'
        this.finalEndpoint = this.endpoint2;
        break;
      case 5:
          ruta = 'export'
          this.finalEndpoint = this.endpoint2;
          types = 'text/csv; charset=utf-8';
          break;
      default:
    }
    debugger
    if (+parametros.selectedReportType == 4) {
      return this.getShapefileZipParams(params);
    }
    else {

      const headers = new HttpHeaders({
        Accept: 'text/xlsx; charset=utf-8', // Asegúrate de que este valor sea el correcto según tu API.
      });

      return this.http
        .get(`${this.apiUrl}/api/${this.finalEndpoint}/${ruta}`, {
          headers,
          responseType: 'blob' as 'json',
          params, // Agregar los parámetros aquí
          context: checkToken(),
        })
        .pipe(
          map((res: any) => {
            return new Blob([res], { type: types });
          })
        );
    }
  }


  getShapefileZip(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/api/CensoArboreo/exportShape`, {
      responseType: 'blob', // Ajuste aquí
      context: checkToken(),
    }) as Observable<Blob>; // Asegúrate de que la respuesta se maneje como un Blob
  }

  getShapefileZipParams(params: HttpParams): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/api/CensoArboreo/exportShape`, {
      responseType: 'blob', // Ajuste aquí
      params,
      context: checkToken(),
    }) as Observable<Blob>; // Asegúrate de que la respuesta se maneje como un Blob
  }

}
