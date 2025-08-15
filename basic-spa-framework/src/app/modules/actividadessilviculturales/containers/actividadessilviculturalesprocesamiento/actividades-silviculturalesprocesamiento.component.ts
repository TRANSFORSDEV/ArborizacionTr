import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ActividadesSilviculturalesDto, ActividadesSilviculturalesEstadoDto, Estado } from 'src/app/core/models/actividadessilviculturales-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { UserDto } from 'src/app/core/models/user-dto.model';
import { ActividadesSilviculturalesService } from 'src/app/core/services/actividadessilviculturales.service';

@Component({
  selector: 'app-actividadesSilviculturales-procesamiento',
  templateUrl: './actividades-Silviculturalesprocesamiento.component.html',
  styleUrls: ['./actividades-Silviculturalesprocesamiento.component.scss']
})
export class ActividadesSilviculturalesProcesamientoComponent implements OnInit {

  id: string;
  statusDetail: RequestStatus;
  actividadessilviculturales:ActividadesSilviculturalesDto

constructor(private activatedRoute: ActivatedRoute,
  private actividadessilviculturalesService: ActividadesSilviculturalesService,
  private router: Router){

}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      if(this.id)
      {
        this.actividadessilviculturalesService.getById(this.id)
        .subscribe(actividadessilviculturales => {
          this.actividadessilviculturales = actividadessilviculturales.data;
        });
      }
    });

  }

  Guardar(data)
  {
    this.actividadessilviculturalesService.create(data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/actividades/pendientes']);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

  Actualizar(data)
  {
    let dataCast : ActividadesSilviculturalesDto = data;

    debugger;
    let actSilviculturalesEstado : ActividadesSilviculturalesEstadoDto = new ActividadesSilviculturalesEstadoDto();
    
    actSilviculturalesEstado.estado = dataCast.estado;
    actSilviculturalesEstado.id = this.id;
    actSilviculturalesEstado.observacion = dataCast.observacion;
    debugger;
    actSilviculturalesEstado.observacion2 = dataCast.observacion2;
    
    this.actividadessilviculturalesService.updateProcesamientoEstado(this.id, actSilviculturalesEstado).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/actividades/intervenciones/'+this.toReturn(dataCast.estado)]);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }
  
  toReturn(current : Estado) : Estado{
    if(current == Estado.Aprobada || current == Estado.Rechazada){
      return Estado.Solicitada;
    }

    if(current == Estado.Ejecutada){
      return Estado.Aprobada;
    }

    return Estado.Solicitada;

  }
  Borrar(data)
  {
    console.log("borrar")
    this.actividadessilviculturalesService.delete( this.id, data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/actividades/pendientes']);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

}
