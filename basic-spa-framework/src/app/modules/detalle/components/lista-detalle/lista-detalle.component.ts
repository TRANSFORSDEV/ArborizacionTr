import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DetalleDto } from 'src/app/core/models/detalle-dto.model';
import { MaestraDto } from 'src/app/core/models/maestra-dto.model';
import { MaestraDetalleCombo } from 'src/app/core/models/maestradetalle.mode';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { DetalleService } from 'src/app/core/services/detalle.service';
import { MaestraService } from 'src/app/core/services/maestra.service';




@Component({
  selector: 'app-lista-detalle',
  templateUrl: './lista-detalle.component.html',
  styleUrls: ['./lista-detalle.component.scss']
})
export class ListaDetalleComponent implements OnInit {

  maestraId : string = null ;
  dataList: DetalleDto[] = [];
  form: FormGroup;
  pageSize: number = 5;
  page: number = 1;
  collectionSize: number = 1
  statusDetail: RequestStatus = 'init';
  
  maestra : MaestraDto;
  redirectAdd : string = "/app/detalle/create";

  constructor(private formbuilder: FormBuilder,
    private detalleService: DetalleService,
    private maestraService: MaestraService,
    private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.maestraId = params['maestraId'] ?? "0";
      this.redirectAdd=this.redirectAdd+"/"+this.maestraId;
      this.BuildForm();
      this.getCredentials();
      if(this.maestraId != "0"){
        this.maestraService.getById(this.maestraId).subscribe(
          (response) => {
            this.maestra = response.data
          },
        );
      }
      
    });

    



    this.detalleService.getByMaestra(MaestraDetalleCombo.AlturasPotencialesArboles).subscribe(
      response => {

      }

    );

  }

  private getCredentials() {

    this.detalleService.getFilterByMaestra(this.filterField, this.maestraId, this.page, this.pageSize).subscribe(
      response => {
        this.dataList = response.data
        this.collectionSize = response.meta.totalCount;
        this.pageSize = response.meta.pageSize;
        this.statusDetail = 'init';

      }
    );
  }

  private BuildForm() {
    this.form = this.formbuilder.group({
      filter: ['', []]
    })
  }

  Buscar() {
    if (this.filterField == "")
      this.getCredentials();

    this.detalleService.getFilterByMaestra(this.filterField, this.maestraId, this.page, this.pageSize).subscribe(
      response => {
        this.dataList = response.data
        this.collectionSize = response.meta.totalCount;
        this.pageSize = response.meta.pageSize;
        this.statusDetail = 'init';
      }
    );
  }

  refreshGrid(event) {
    this.statusDetail = 'loading';

    this.page = event.first / event.rows + 1
    this.pageSize = event.rows;
    this.detalleService.getFilterByMaestra(this.filterField, this.maestraId, this.page, this.pageSize).subscribe(
      response => {
        this.dataList = response.data
        this.collectionSize = response.meta.totalCount;
        this.pageSize = response.meta.pageSize;
        this.statusDetail = 'init';
      }
    );
  }

  get filterField(): string {
    return this.form.get('filter').value;
  }

}
