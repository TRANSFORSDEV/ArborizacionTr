import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DetalleDto } from 'src/app/core/models/detalle-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { DetalleService } from 'src/app/core/services/detalle.service';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
  idMaestra : string;
  id: string;
  statusDetail: RequestStatus;
  detalle:DetalleDto;

constructor(private activatedRoute: ActivatedRoute,
  private detalleService: DetalleService,
  private router: Router){

}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.idMaestra = params['idMaestra'];  
      this.id = params['id'];
      if(this.id)
      {
        this.detalleService.getById(this.id)
        .subscribe(detalle => {
          this.detalle = detalle.data;
        });
      }
    });

  }

  Guardar(data)
  {
    this.detalleService.create(data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/detalle/by/'+this.idMaestra]);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

  Actualizar(data)
  {
    this.detalleService.update(this.id, data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/detalle/by/'+this.idMaestra]);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

  Borrar(data)
  {
    console.log("borrar")
    this.detalleService.delete(this.id, data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/detalle/by/'+this.idMaestra]);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

}
