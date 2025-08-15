import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CensoArboreoDto } from 'src/app/core/models/censoarboreo-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { UserDto } from 'src/app/core/models/user-dto.model';
import { CensoArboreoService } from 'src/app/core/services/censoarboreo.service';
import { RegistroFotograficoComponent } from 'src/app/modules/sharedcomponent/registrofotografico/registrofotografico.component';

@Component({
  selector: 'app-impresioncensoArboreo',
  templateUrl: './impresioncensoArboreo.component.html',
  styleUrls: ['./impresioncensoArboreo.component.scss']
})
export class ImpresionCensoArboreoComponent implements OnInit {

  id: string;
  statusDetail: RequestStatus;
  censoArboreo:CensoArboreoDto;

  

  constructor(private activatedRoute: ActivatedRoute,
    private censoArboreoService: CensoArboreoService,
    private router: Router){

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      if(this.id)
      {
        this.censoArboreoService.getById(this.id)
        .subscribe(censoArboreo => {
          this.censoArboreo = censoArboreo.data;
        });
      }
    });

  }

  Guardar(data)
  {
    
    this.censoArboreoService.createWFiles(data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/censo']);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

  Actualizar(data)
  {
    this.censoArboreoService.updateWFile(this.id, data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/censo']);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

  Borrar(data)
  {
    console.log("borrar")
    this.censoArboreoService.delete(this.id, data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/censo']);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

}
