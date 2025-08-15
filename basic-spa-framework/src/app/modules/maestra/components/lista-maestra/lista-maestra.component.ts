import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaestraDto } from 'src/app/core/models/maestra-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';

import { MaestraService } from 'src/app/core/services/maestra.service';
import {Habilitaracciones } from 'src/app/core/services/habilitaracciones.service';

@Component({
  selector: 'app-lista-maestra',
  templateUrl: './lista-maestra.component.html',
  styleUrls: ['./lista-maestra.component.scss']
})
export class ListaMaestraComponent implements OnInit {

  dataList: MaestraDto[] = [];
  form: FormGroup;
  pageSize: number = 5;
  page: number = 1;
  collectionSize: number = 1
  statusDetail: RequestStatus = 'init';  
  mostrarCreate: boolean = false;

  constructor(private formbuilder: FormBuilder,
    private maestraService: MaestraService,
    private habilitaracciones: Habilitaracciones) {

  }

  ngOnInit(): void {

    this.BuildForm();
    this.getCredentials();
    const resultados = this.habilitaracciones.MostrarBotones('Maestra');

    if (resultados.length > 0) {
        resultados.forEach(resultado => {
             this.mostrarCreate=resultado.editar;
            
        });
    }
  }

  private getCredentials() {
    this.maestraService.get(this.filterField, this.page, this.pageSize).subscribe(
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

    this.maestraService.get(this.filterField, this.page, this.pageSize).subscribe(
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
    this.maestraService.get(this.filterField, this.page, this.pageSize).subscribe(
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
