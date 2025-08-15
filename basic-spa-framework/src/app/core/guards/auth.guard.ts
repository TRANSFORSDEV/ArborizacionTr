import { PermisosDto } from './../models/permisos-dto';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { Injectable } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Observable, map, catchError, of } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private tokenService: TokenService,
    private router: Router) { }

  permisos: PermisosDto[]
  home: string = "home";

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const isValidToken = this.tokenService.isValidToken();
    const rutaEnMinuscula = state.url.toLowerCase();

    if (isValidToken) {
      // Agrega la validación de permisos aquí

      if(rutaEnMinuscula.includes(this.home))
        return of(true);

      const modifiedUrl = state.url.replace('/app/', '');
      console.log("url"+modifiedUrl)
      const tienePermiso = this.validarPermisos(modifiedUrl);
    
     
      if (!tienePermiso) {
        console.log("No tienes permisos para acceder a esta ruta.");
        alert("No tienes permisos para ver esta página");
        this.router.navigate(['/app/home']);
        // Aquí puedes decidir si quieres redirigir a otra página, por ejemplo, una página de "Acceso denegado"
        return of(false);
      }

      return of(true);
    } else {
      if (this.tokenService.isValidRefreshToken()) {
        // Intenta renovar el token si es posible
        return this.tokenService.refreshToken().pipe(
          map(response => {
            // Si la renovación es exitosa, entonces el guard permite la navegación
            return true;
          }),
          catchError(err => {
            // Si hay un error (por ejemplo, el token de actualización también es inválido), redirige al usuario al login
            console.log("Error al intentar renovar token.")
            this.router.navigate(['/login/']);
            return of(false);
          })
        );
      } else {
        // Si el token de actualización es inválido, redirige al usuario al login
        this.router.navigate(['/login/']);
        return of(false);
      }
    }
  }

  validarPermisos(ruta: string): boolean {
    const permisos = this.tokenService.getPermisos();
    console.log("permisos"+ permisos)
    // Convertir la ruta a minúsculas para evitar problemas de mayúsculas/minúsculas.
    const rutaEnMinuscula = ruta.toLowerCase();
   /* permisos.forEach(permiso => {
    
    
    });*/
    // Buscar la ruta en el arreglo de permisos. Si la encuentra, devuelve true; de lo contrario, devuelve false.
    return permisos.some(permiso => rutaEnMinuscula.includes(permiso.module.toLowerCase()) && permiso.listed);
    //return true;
  }

}



