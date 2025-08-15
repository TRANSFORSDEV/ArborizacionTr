import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenericPredecesorSucesorTableDto } from 'src/app/core/models/generic-predecesor-sucesor-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { BasicTableService } from 'src/app/core/services/basictable.service';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import {Habilitaracciones } from 'src/app/core/services/habilitaracciones.service';
@Component({
  selector: 'app-formulario-basic-table',
  templateUrl: './formulario-basic-table.component.html',
  styleUrls: ['./formulario-basic-table.component.scss'],
})
export class FormularioBasicTableComponent implements OnInit {
  tabla: string;
  padre: string;

  statusDetail: RequestStatus = 'init';
  form: FormGroup;
  isNew: boolean = false;
  userNameRequired: boolean = false;
  passwordRequired: boolean = false;
  basicTable: GenericPredecesorSucesorTableDto;
  padres: GenericPredecesorSucesorTableDto[];
  mostraUpdate: boolean = false;
  mostraDelete: boolean = false;
  @Input()
  set dataForm(data: GenericPredecesorSucesorTableDto) {
    if (data) {
      this.isNew = false;
      this.form.patchValue(data);
      this.form.markAllAsTouched();
      this.basicTable = data;
    } else {
      this.isNew = true;
    }
  }
  @Input()
  set status(data: RequestStatus) {
    if (data) {
      this.statusDetail = data;
    }
  }

  @Input()
  set basicTableName(data: string) {
    if (data) {
      this.tabla = data;
    }
  }

  @Output() create = new EventEmitter();
  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor(
    private formbuilder: FormBuilder,
    private sweetAlertService: SweetAlertService,
    private basicTableService :BasicTableService,
    private habilitaracciones: Habilitaracciones
  ) {
    
  }

  ngOnInit(): void {

      
    let antecesor = this.basicTableService.getAntecesor(this.tabla);
    this.padre  = antecesor;
    if(this.padre != null){
      this.basicTableService.getByTable(antecesor).subscribe(
        (response) => {
          
          this.padres = response.data;
          
        },
        (errorMsg) => {
          
        }
      );
    }
    this.BuildForm(this.padre ==null ? 0 : 1 );
    this.ValidarBotones();
  }
  private ValidarBotones() {

    const resultados = this.habilitaracciones.MostrarBotones('BasicTable');
    
        if (resultados.length > 0) {
            resultados.forEach(resultado => {
                 this.mostraDelete=resultado.eliminar;
                 this.mostraUpdate=resultado.editar;
                
            });
        }
     }
  private BuildForm(modo : number) {
    if(modo == 0){
      
      this.form = this.formbuilder.group({
        descripcion: ['', [Validators.required]]        
      });

    } else if (modo == 1){
      
      this.form = this.formbuilder.group({
        descripcion: ['', [Validators.required]],
        predecesorId : ['', [Validators.required]]
      });
      
    }
    
  }

  Guardar() {
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.create.emit(this.form.value);
  }

  Actualizar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.update.emit(this.form.value);
  }

  async mostrarConfirmacion() {
    const TitleUp = 'Cambiara el estado del basicTable';
    const TitleDonw = '¿Esta seguro de cambiar el estado?';
    this.sweetAlertService.showConfirmationCallback(
      TitleUp,
      TitleDonw,
      () => {
        //ejecuto el llamado a la funcion Borrar
        this.Borrar();
      },
      () => {
        //en caso de usar cancelacion
      }
    );
  }

  Borrar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.delete.emit();
  }

  get isFormInValid() {
    return this.form.invalid && this.form.touched;
  }

  field(name: string) {
    return {
      get: () => this.form.get(name),
      isValid: () => this.form.get(name).touched && this.form.get(name).valid,
    };
  }


  
}
