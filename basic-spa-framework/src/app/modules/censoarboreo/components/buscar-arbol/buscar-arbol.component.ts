import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CensoArboreoDto } from 'src/app/core/models/censoarboreo-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { CensoArboreoService } from 'src/app/core/services/censoarboreo.service';

@Component({
  selector: 'app-buscar-arbol',
  templateUrl: './buscar-arbol.component.html',
  styleUrls: ['./buscar-arbol.component.scss']
})
export class BuscarArbolComponent {
  showModal = false;
  dataList: CensoArboreoDto[] = [];
  seleccionado: CensoArboreoDto = null;
  form: FormGroup;
  pageSize: number = 5;
  page: number = 1;
  collectionSize: number = 1
  statusDetail: RequestStatus = 'init';
  isActividadPlantulaBusqueda: boolean = false;
  @Output() selected = new EventEmitter();
  @ViewChild('inputBuscar') inputBuscar!: ElementRef;
  modalStyles: any = {};
  @Input()
  set isActividadPlantula(param: boolean) {

    this.isActividadPlantulaBusqueda = param;
  };

  constructor(
    private formbuilder: FormBuilder,
    private service: CensoArboreoService) {

    this.BuildForm();
    this.getCenso();
  }

  private getCenso() {
    this.statusDetail = 'loading';
    debugger;
    if (this.isActividadPlantulaBusqueda) {
      this.service.getFilterPlantula(this.field("filter").get().value, this.page, this.pageSize).subscribe(
        respuesta => {
          this.dataList = respuesta.data
          this.collectionSize = respuesta.meta.totalCount;
          this.pageSize = this.pageSize;
          this.statusDetail = 'init';
        }
      );
    } else {
      this.service.get(this.field("filter").get().value, this.page, this.pageSize).subscribe(
        respuesta => {
          this.dataList = respuesta.data
          this.collectionSize = respuesta.meta.totalCount;
          this.pageSize = this.pageSize;
          this.statusDetail = 'init';
        }
      );
    }

  }

  private BuildForm() {
    this.form = this.formbuilder.group({
      filter: ['', []],
      nombreComun: ['', []]
    })
  }

  Seleccionar(afiliado: CensoArboreoDto) {
    this.seleccionado = afiliado;
    this.form.patchValue(afiliado);
    this.selected.emit(this.seleccionado);
    this.toggleModal();
  }

  refreshGrid(event) {
    this.statusDetail = 'loading';
    this.page = event.first / event.rows + 1
    this.pageSize = event.rows;

    if (this.isActividadPlantulaBusqueda) {
      this.service.getFilterPlantula(this.field("filter").get().value, this.page, this.pageSize).subscribe(
        response => {
          this.dataList = response.data
          this.collectionSize = response.meta.totalCount;
          this.pageSize = response.meta.pageSize;
          this.statusDetail = 'init';
        }
      );
    } else {
      this.service.get(this.field("filter").get().value, this.page, this.pageSize).subscribe(
        response => {
          this.dataList = response.data
          this.collectionSize = response.meta.totalCount;
          this.pageSize = response.meta.pageSize;
          this.statusDetail = 'init';
        }
      );
    }

  }

  Buscar() {
    if (this.field("filter").get().value == "")
      this.getCenso();

    this.statusDetail = 'loading';
    debugger;
    if (this.isActividadPlantulaBusqueda) {
      this.service.getFilterPlantula(this.field("filter").get().value, this.page, this.pageSize).subscribe(
        afiliados => {
          this.dataList = afiliados.data
          this.collectionSize = afiliados.meta.totalCount;
          this.pageSize = afiliados.meta.pageSize;
          this.statusDetail = 'init';
        }
      );
    } else {
      this.service.get(this.field("filter").get().value, this.page, this.pageSize).subscribe(
        afiliados => {
          this.dataList = afiliados.data
          this.collectionSize = afiliados.meta.totalCount;
          this.pageSize = afiliados.meta.pageSize;
          this.statusDetail = 'init';
        }
      );
    }

  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  field(name: string) {
    return {
      get: () => this.form.get(name),
      isValid: () => this.form.get(name).touched && this.form.get(name).valid
    };
  }

}
