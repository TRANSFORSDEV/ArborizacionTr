import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaestraDto } from 'src/app/core/models/maestra-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { UserDto } from 'src/app/core/models/user-dto.model';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import {Habilitaracciones } from 'src/app/core/services/habilitaracciones.service';
@Component({
  selector: 'app-formulario-maestra',
  templateUrl: './formulario-maestra.component.html',
  styleUrls: ['./formulario-maestra.component.scss']
})
export class FormularioMaestraComponent implements OnInit {

  statusDetail: RequestStatus = 'init';
  form:FormGroup;
  isNew:boolean = false;
  userNameRequired:boolean = false;
  passwordRequired:boolean = false;
  maestra:MaestraDto;
  mostraUpdate: boolean = false;
  mostraDelete: boolean = false;
  @Input()
  set dataForm(data:MaestraDto)
  {
    if(data)
    {
      this.isNew = false;
      this.form.patchValue(data);
      this.form.markAllAsTouched();
      this.maestra = data;
    } else {
      this.isNew = true;
    }
  };
  @Input()
  set status(data:RequestStatus)
  {
    if(data)
    {
      this.statusDetail = data;
    }
  };


  @Output() create= new EventEmitter();
  @Output() update= new EventEmitter();
  @Output() delete= new EventEmitter();

  constructor( private formbuilder:FormBuilder,
    private sweetAlertService: SweetAlertService,
    private habilitaracciones: Habilitaracciones
  ){
      this.BuildForm();
  }

  ngOnInit(): void {
    const resultados = this.habilitaracciones.MostrarBotones('Maestra');

    if (resultados.length > 0) {
        resultados.forEach(resultado => {
             this.mostraDelete=resultado.eliminar;
             this.mostraUpdate=resultado.editar;
            
        });
    }

  }

  private BuildForm(){


    this.form = this.formbuilder.group({
      nombreTabla:['', [Validators.required]]
    })
  }

  Guardar()
  {
    if(this.form.invalid)
    {

      this.form.markAllAsTouched();
      return;
    }


    this.create.emit(this.form.value);
  }

  Actualizar()
  {
    if(this.form.invalid)
    {
      this.form.markAllAsTouched();
      return;
    }
    this.update.emit(this.form.value);
  }

  async mostrarConfirmacion() {
    const TitleUp = 'Cambiara el estado del maestra';
    const TitleDonw = '¿Esta seguro de cambiar el estado?';
    this.sweetAlertService.showConfirmationCallback(TitleUp,TitleDonw, () => {
      //ejecuto el llamado a la funcion Borrar
      this.Borrar();
    }, () => {
         //en caso de usar cancelacion
    });
  }

  Borrar()
  {
    if(this.form.invalid)
    {
      this.form.markAllAsTouched();
      return;
    }
    this.delete.emit()
  }

  get isFormInValid() {
    return this.form.invalid && this.form.touched;
  }

  field(name: string) {
      return {
          get: () => this.form.get(name),
          isValid: () => this.form.get(name).touched && this.form.get(name).valid
      };
  }

}
