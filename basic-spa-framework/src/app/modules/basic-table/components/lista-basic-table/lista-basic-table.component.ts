import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GenericPredecesorSucesorTableDto } from 'src/app/core/models/generic-predecesor-sucesor-dto.model';

import { RequestStatus } from 'src/app/core/models/request-status.model';
import { BasicTableService } from 'src/app/core/services/basictable.service';
import {Habilitaracciones } from 'src/app/core/services/habilitaracciones.service';

@Component({
  selector: 'app-lista-basic-table',
  templateUrl: './lista-basic-table.component.html',
  styleUrls: ['./lista-basic-table.component.scss']
})
export class ListaBasicTableComponent implements OnInit {

  tabla: string;
  padre: string;
  dataList: GenericPredecesorSucesorTableDto[] = [];
  form: FormGroup;
  pageSize: number = 5;
  page: number = 1;
  collectionSize: number = 1
  statusDetail: RequestStatus = 'init';
  mostrarCreate: boolean = false;

  constructor(private formbuilder: FormBuilder,
    private basicTableService: BasicTableService,
    private activatedRoute: ActivatedRoute,
    private habilitaracciones: Habilitaracciones) {
      
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.tabla = params['tabla'];
      this.padre = this.basicTableService.getAntecesor(this.tabla);
      this.BuildForm();
      this.getCredentials();
    });
    this.ValidarBotones();

  }
  private ValidarBotones() {
    const resultados = this.habilitaracciones.MostrarBotones('BasicTable');
    
        if (resultados.length > 0) {
            resultados.forEach(resultado => {
                 this.mostrarCreate=resultado.editar;
                
            });
        }
     }
  private getCredentials() {
    this.basicTableService.getPagesByTable(this.tabla, this.filterField, this.page, this.pageSize).subscribe(
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

    this.basicTableService.getPagesByTable(this.tabla, this.filterField, this.page, this.pageSize).subscribe(
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
    this.basicTableService.getPagesByTable(this.tabla, this.filterField, this.page, this.pageSize).subscribe(
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
