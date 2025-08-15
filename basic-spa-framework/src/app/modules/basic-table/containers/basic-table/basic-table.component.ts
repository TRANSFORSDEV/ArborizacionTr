import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GenericPredecesorSucesorTableDto } from 'src/app/core/models/generic-predecesor-sucesor-dto.model';

import { RequestStatus } from 'src/app/core/models/request-status.model';
import { BasicTableService } from 'src/app/core/services/basictable.service';


@Component({
  selector: 'app-basicTable',
  templateUrl: './basic-table.component.html',
  styleUrls: ['./basic-table.component.scss']
})
export class BasicTableComponent implements OnInit {

  id: string;
  tabla: string;
  statusDetail: RequestStatus;
  basicTable:GenericPredecesorSucesorTableDto;

constructor(private activatedRoute: ActivatedRoute,
  private basicTableService: BasicTableService,
  private router: Router){

}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.tabla = params['tabla']
      if(this.id)
      {
        this.basicTableService.getByTableById(this.tabla,this.id)
        .subscribe(basicTable => {
          this.basicTable = basicTable.data;
        });
      }
    });

  }

  Guardar(data)
  {
    
    this.basicTableService.createByTabla(this.tabla, data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/basictable/'+this.tabla]);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

  Actualizar(data)
  {
    this.basicTableService.updateByTabla(this.tabla, this.id, data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/basictable/'+this.tabla]);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

  Borrar(data)
  {
    console.log("borrar")
    this.basicTableService.deleteByTabla(this.tabla, this.id , data).subscribe(
      (data) => {
        this.statusDetail = 'success';
        this.router.navigate(['/app/basictable/'+this.tabla]);
      },
      (errorMsg) => {
        this.statusDetail = 'error';
      }
    );
  }

}
