
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EspaciosPotencialesDto } from 'src/app/core/models/espaciospotenciales-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { EspaciosPotencialesService } from 'src/app/core/services/espaciospotenciales.service';
import {Habilitaracciones } from 'src/app/core/services/habilitaracciones.service';
@Component({
  selector: 'app-lista-espaciosPotenciales',
  templateUrl: './lista-espaciosPotenciales.component.html',
  styleUrls: ['./lista-espaciosPotenciales.component.scss']
})
export class ListaEspaciosPotencialesComponent implements OnInit {

  dataList: EspaciosPotencialesDto[] = [];
  form: FormGroup;
  pageSize: number = 5;
  page: number = 1;
  collectionSize: number = 1
  statusDetail: RequestStatus = 'init';
  mostrarCreate: boolean = false;

  constructor(private formbuilder: FormBuilder,
    private espaciosPotencialesService: EspaciosPotencialesService,
    private habilitaracciones: Habilitaracciones) {

  }

  ngOnInit(): void {

    this.BuildForm();
    this.getCredentials();
    const resultados = this.habilitaracciones.MostrarBotones('Espacios');

    if (resultados.length > 0) {
        resultados.forEach(resultado => {
             this.mostrarCreate=resultado.editar;
            
        });
    }
  }

  private getCredentials() {
    this.espaciosPotencialesService.get(this.filterField, this.page, this.pageSize).subscribe(
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

    this.espaciosPotencialesService.get(this.filterField, this.page, this.pageSize).subscribe(
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
    this.espaciosPotencialesService.get(this.filterField, this.page, this.pageSize).subscribe(
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

  Descargar() {
    this.statusDetail = 'loading';
    console.log("descargar")
    this.espaciosPotencialesService.getDescargas().subscribe(
      response => {
        this.statusDetail = 'init';
        this.downloadFile(response);
      },
      error => {
        console.error('Download error:', error);
        this.statusDetail = 'error';
      }
    );
  }

  private downloadFile(data: Blob) {
    const blob = new Blob([data], { type: 'text/csv; charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'espacios.csv';  // El nombre del archivo que se descargará.
    anchor.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
  }

}
