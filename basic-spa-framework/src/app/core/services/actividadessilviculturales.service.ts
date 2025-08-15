import { TokenService } from './token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from './generic-service';
import { ActividadesSilviculturalesDto, ActividadesSilviculturalesEstadoDto } from '../models/actividadessilviculturales-dto.model';
import { CustomApiResponse } from '../models/api-response';
import { checkToken } from '../Interceptor/token-interceptor';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActividadesSilviculturalesService extends GenericService<ActividadesSilviculturalesDto> {
    protected override endpoint = 'ActividadesSilviculturales';  // Aquí estableces el endpoint específico para UserDto

  constructor(http: HttpClient, tokenService: TokenService) {
    super(http, tokenService);
  }

  getPendientes(filter: string, pageNumber: number, pageSize: number) {
    const params = {
      filter: filter,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    };

    return this.http.get<CustomApiResponse<ActividadesSilviculturalesDto[]>>(`${this.apiUrl}/api/${this.endpoint}/GetActividadesSilviculturalesPendientes`, { params, context: checkToken() });
  }

  getByType(filter: string, pageNumber: number, pageSize: number, type : string) {
    const params = {
      filter: filter,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    };

    return this.http.get<CustomApiResponse<ActividadesSilviculturalesDto[]>>(`${this.apiUrl}/api/${this.endpoint}/GetActividadesSilviculturalesByEstado/${type}`, { params, context: checkToken() });
  }



  ///PODA SIEMBRA

  getListaBySiembraPodaTala(isSiembra:boolean,isPoda:boolean,isTala:boolean,  filter: string, pageNumber: number, pageSize: number) {
    const params = {
      isSiembra: isSiembra,
      isPoda:isPoda,
      isTala:isTala,
      filter: filter,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    };

    return this.http.get<CustomApiResponse<ActividadesSilviculturalesDto[]>>(`${this.apiUrl}/api/${this.endpoint}`, { params, context: checkToken() });
  }

  createWFiles(item: FormData) {
    return this.http.post<CustomApiResponse<ActividadesSilviculturalesDto>>(`${this.apiUrl}/api/${this.endpoint}/LoadWithImages`, item, { context: checkToken() });
  }

  updateWFile(id: string, item: any) {
    return this.http.put<CustomApiResponse<ActividadesSilviculturalesDto>>(`${this.apiUrl}/api/${this.endpoint}/UpdateLoadWithImages/${id}`, item, { context: checkToken() });
  }
  //traer actividades
  GetAll(id: string) {
    return this.http.get<CustomApiResponse<ActividadesSilviculturalesDto>>(`${this.apiUrl}/api/${this.endpoint}/GetAll/${id}`,{ context: checkToken() });
  }
  updateProcesamiento(id: string, item: ActividadesSilviculturalesDto) {
    return this.http.put<CustomApiResponse<ActividadesSilviculturalesDto>>(`${this.apiUrl}/api/${this.endpoint}/procesamiento/${id}`, { ...item, 'ResponsableId': this.tokenService.getTokenId() }, { context: checkToken() });
  }
  updateProcesamientoEstado(id: string, item: ActividadesSilviculturalesEstadoDto) {
    return this.http.put<CustomApiResponse<ActividadesSilviculturalesDto>>(`${this.apiUrl}/api/${this.endpoint}/procesamiento/estado/${id}`, { ...item, 'ResponsableId': this.tokenService.getTokenId() }, { context: checkToken() });
  }

  uploadFile(formData: FormData, size: number) {
    return this.http.post<CustomApiResponse<ActividadesSilviculturalesDto>>(`${this.apiUrl}/api/${this.endpoint}/cargarArchivo`, formData,  { context: checkToken() });
  }

  uploadFilePoda(formData: FormData, size: number) {
    return this.http.post<CustomApiResponse<ActividadesSilviculturalesDto>>(`${this.apiUrl}/api/${this.endpoint}/cargarArchivoPoda`, formData,  { context: checkToken() });
  }

  uploadFileSiembra(formData: FormData, size: number) {
    return this.http.post<CustomApiResponse<ActividadesSilviculturalesDto>>(`${this.apiUrl}/api/${this.endpoint}/cargarArchivoSiembra`, formData,  { context: checkToken() });
  }

  uploadFileTala(formData: FormData, size: number) {
    return this.http.post<CustomApiResponse<ActividadesSilviculturalesDto>>(`${this.apiUrl}/api/${this.endpoint}/cargarArchivoTala`, formData,  { context: checkToken() });
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
