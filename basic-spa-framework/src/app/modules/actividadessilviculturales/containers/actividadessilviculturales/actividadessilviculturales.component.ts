import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ActividadesSilviculturalesDto } from 'src/app/core/models/actividadessilviculturales-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { UserDto } from 'src/app/core/models/user-dto.model';
import { ActividadesSilviculturalesService } from 'src/app/core/services/actividadessilviculturales.service';

@Component({
  selector: 'app-actividadesSilviculturales',
  templateUrl: './actividadesSilviculturales.component.html',
  styleUrls: ['./actividadesSilviculturales.component.scss']
})
export class ActividadesSilviculturalesComponent implements OnInit {

  tipoActividad : string = "";
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
      this.tipoActividad = params['tipoActividad'];
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
    this.actividadessilviculturalesService.createWFiles(data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/actividades/lista/'+this.tipoActividad]);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

  Actualizar(data)
  {
    this.actividadessilviculturalesService.updateWFile(this.id, data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/actividades/lista/'+this.tipoActividad]);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

  Borrar(data)
  {
    console.log("borrar")
    this.actividadessilviculturalesService.delete( this.id, data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/actividades/lista/'+this.tipoActividad]);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

}
