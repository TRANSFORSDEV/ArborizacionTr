import { UserDto } from '../models/user-dto.model';
import { TokenService } from './token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from './generic-service';
import { MaestraDto } from '../models/maestra-dto.model';

@Injectable({
  providedIn: 'root'
})
export class MaestraService extends GenericService<MaestraDto> {
    protected override endpoint = 'maestra';  // Aquí estableces el endpoint específico para UserDto

  constructor(http: HttpClient, tokenService: TokenService) {
    super(http, tokenService);
  }
}
