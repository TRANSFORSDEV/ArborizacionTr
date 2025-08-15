import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MaestraDto } from 'src/app/core/models/maestra-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { MaestraService } from 'src/app/core/services/maestra.service';

@Component({
  selector: 'app-maestra',
  templateUrl: './maestra.component.html',
  styleUrls: ['./maestra.component.scss']
})
export class MaestraComponent implements OnInit {

  id: string;
  statusDetail: RequestStatus;
  maestra:MaestraDto;

constructor(private activatedRoute: ActivatedRoute,
  private maestraService: MaestraService,
  private router: Router){

}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      if(this.id)
      {
        this.maestraService.getById(this.id)
        .subscribe(maestra => {
          this.maestra = maestra.data;
        });
      }
    });

  }

  Guardar(data)
  {
    this.maestraService.create(data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/maestra']);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

  Actualizar(data)
  {
    this.maestraService.update(this.id, data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/maestra']);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

  Borrar(data)
  {
    console.log("borrar")
    this.maestraService.delete(this.id , data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/maestra']);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

}
