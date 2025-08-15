import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EspaciosPotencialesDto } from 'src/app/core/models/espaciospotenciales-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { UserDto } from 'src/app/core/models/user-dto.model';
import { EspaciosPotencialesService } from 'src/app/core/services/espaciospotenciales.service';

@Component({
  selector: 'app-espaciosPotenciales',
  templateUrl: './espaciosPotenciales.component.html',
  styleUrls: ['./espaciosPotenciales.component.scss']
})
export class EspaciosPotencialesComponent implements OnInit {

  id: string;
  statusDetail: RequestStatus;
  espaciosPotenciales: EspaciosPotencialesDto

constructor(private activatedRoute: ActivatedRoute,
  private espaciosPotencialesService: EspaciosPotencialesService,
  private router: Router){

}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      if(this.id)
      {
        this.espaciosPotencialesService.getById(this.id)
        .subscribe(espaciosPotenciales => {
          this.espaciosPotenciales = espaciosPotenciales.data;
        });
      }
    });

  }

  Guardar(data)
  {

    

    this.espaciosPotencialesService.createWFiles(data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/espacios']);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

  Actualizar(data)
  {
    this.espaciosPotencialesService.updateWFile(this.id, data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/espacios']);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

  Borrar(data)
  {
    console.log("borrar")
    this.espaciosPotencialesService.delete( this.id, data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/espacios']);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

}
