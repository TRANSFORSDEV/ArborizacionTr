
import { TokenService } from './token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from './generic-service';
import { GenericPredecesorSucesorTableDto } from '../models/generic-predecesor-sucesor-dto.model';
import { checkToken } from '../Interceptor/token-interceptor';
import { CustomApiResponse } from '../models/api-response';


@Injectable({
  providedIn: 'root'
})
export class BasicTableService extends GenericService<GenericPredecesorSucesorTableDto> {
    protected override endpoint = 'BasicTable';  // Aquí estableces el endpoint específico para UserDto

  constructor(http: HttpClient, tokenService: TokenService) {
    super(http, tokenService);
  }

  getPagesByTable(tabla: string,filter: string, pageNumber: number, pageSize: number) {
    const params = {
      filter: filter,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    };

    return this.http.get<CustomApiResponse<GenericPredecesorSucesorTableDto[]>>(`${this.apiUrl}/api/${this.endpoint}/filters/${tabla}`, { params, context: checkToken() });
  }

  getByTableById(tabla: string, id: string) {
    return this.http.get<CustomApiResponse<GenericPredecesorSucesorTableDto>>(`${this.apiUrl}/api/${this.endpoint}/${tabla}/${id}`, { context: checkToken() });
  }

  getByTable(tabla: string) {
    return this.http.get<CustomApiResponse<GenericPredecesorSucesorTableDto[]>>(`${this.apiUrl}/api/${this.endpoint}/${tabla}`, { context: checkToken() });
  }

  createByTabla(tabla: string, item: GenericPredecesorSucesorTableDto) {
    return this.http.post<CustomApiResponse<GenericPredecesorSucesorTableDto>>(`${this.apiUrl}/api/${this.endpoint}/${tabla}`, { ...item, 'ResponsableId': this.tokenService.getTokenId() }, { context: checkToken() });
  }

  updateByTabla(tabla: string,id: string, item: GenericPredecesorSucesorTableDto) {
    return this.http.put<CustomApiResponse<GenericPredecesorSucesorTableDto>>(`${this.apiUrl}/api/${this.endpoint}/${tabla}/${id}`, { ...item, 'ResponsableId': this.tokenService.getTokenId() }, { context: checkToken() });
  }

  deleteByTabla(tabla: string, id: string, item: GenericPredecesorSucesorTableDto) {
    return this.http.delete<CustomApiResponse<GenericPredecesorSucesorTableDto>>(`${this.apiUrl}/api/${this.endpoint}/${tabla}/${id}`, { context: checkToken() });
  }


  getByTableByIdPredecesor(tabla: string, predecesorId: string) {
    return this.http.get<CustomApiResponse<GenericPredecesorSucesorTableDto[]>>(`${this.apiUrl}/api/${this.endpoint}/ByPredecesor/${tabla}/${predecesorId}`, { context: checkToken() });
  }


  public getAntecesor(tabla : string) : string {
    switch(tabla){
      case "Familia" : return "Orden";
      case "Genero" : return "Familia";
      case "Especie" : return "Genero";
      case "Barrio" : return "Comuna";
      default: return null;

    }
  }
}
