import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ActividadesSilviculturalesDto, Estado } from 'src/app/core/models/actividadessilviculturales-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';

import { ActividadesSilviculturalesService } from 'src/app/core/services/actividadessilviculturales.service';
import {Habilitaracciones } from 'src/app/core/services/habilitaracciones.service';

@Component({
  selector: 'app-lista-actividadesSilviculturales',
  templateUrl: './lista-actividadesSilviculturales.component.html',
  styleUrls: ['./lista-actividadesSilviculturales.component.scss']
})
export class ListaActividadesSilviculturalesComponent implements OnInit {

  dataList: ActividadesSilviculturalesDto[] = [];
  form: FormGroup;
  pageSize: number = 5;
  page: number = 1;
  collectionSize: number = 1
  statusDetail: RequestStatus = 'init';
  tipoActividad : string;
  editPath : string;
  isSiembra: boolean = false;
  isPoda: boolean = false;
  isTala: boolean = false;
  mostrarCreate: boolean = false;

  routeAdd : string = "/app/actividades/create/";

  constructor(private formbuilder: FormBuilder,
    private actividadessilviculturalesService: ActividadesSilviculturalesService,
    private activatedRoute: ActivatedRoute,
    private habilitaracciones: Habilitaracciones
    ) {



  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params: Params) => {
      ;
      this.tipoActividad = params['tipoActividad'];
      this.routeAdd = "/app/actividades/create/" + this.tipoActividad;
      this.editPath = '/app/actividades/edit/'+ this.tipoActividad + "/";
    const resultados = this.habilitaracciones.MostrarBotones('Actividades');

    if (resultados.length > 0) {
        resultados.forEach(resultado => {
             this.mostrarCreate=resultado.editar;

        });
    }



      this.isSiembra = false;
      this.isPoda = false;
      this.isTala = false;
      if(this.tipoActividad == "Siembra"){
        this.isSiembra = true;
      } else if(this.tipoActividad == "Poda"){
        this.isPoda = true;
      } else if(this.tipoActividad == "Tala"){
        this.isTala = true;
      }

      this.BuildForm();
      this.getCredentials();
    });




  }

  private getCredentials() {

    this.actividadessilviculturalesService.getListaBySiembraPodaTala(this.isSiembra,this.isPoda,this.isTala, this.filterField, this.page, this.pageSize).subscribe(
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

    this.actividadessilviculturalesService.getListaBySiembraPodaTala(this.isSiembra,this.isPoda,this.isTala,this.filterField, this.page, this.pageSize).subscribe(
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
    this.actividadessilviculturalesService.getListaBySiembraPodaTala(this.isSiembra,this.isPoda,this.isTala,this.filterField, this.page, this.pageSize).subscribe(
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
    this.actividadessilviculturalesService.getDescargas().subscribe(
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

     // Obtener la fecha actual
     const currentDate = new Date();

     // Formatear la fecha. Puedes ajustar el formato según tus necesidades.
     // Por ejemplo: '2023-12-04'
     const formattedDate = currentDate.toISOString().split('T')[0];

     // Concatenar la fecha formateada con el nombre del archivo
     const filename = `actividades_${formattedDate}.csv`;

    anchor.download = filename;  // El nombre del archivo que se descargará.
    anchor.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
  }

  public translateStateIntToString(estado: number): string {
    switch (estado) {
      case 0:
        return 'Solicitada';
        break;
      case 1:
        return 'Aprobada';
        break;
      case 2:
        return 'Rechazada';
        break;
      case 3:
        return 'Ejecutada';
        break;
      default:
        return 'EMPTY';
        break;
    }
  }


}
