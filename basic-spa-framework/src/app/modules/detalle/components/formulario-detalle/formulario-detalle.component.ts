import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { DetalleDto } from 'src/app/core/models/detalle-dto.model';
import { MaestraDto } from 'src/app/core/models/maestra-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { MaestraService } from 'src/app/core/services/maestra.service';

import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';

@Component({
  selector: 'app-formulario-detalle',
  templateUrl: './formulario-detalle.component.html',
  styleUrls: ['./formulario-detalle.component.scss']
})
export class FormularioDetalleComponent implements OnInit {

  idMaestra:string;
  statusDetail: RequestStatus = 'init';
  form:FormGroup;
  isNew:boolean = false;
  userNameRequired:boolean = false;
  passwordRequired:boolean = false;
  detalle:DetalleDto;
  maestras : MaestraDto[];
  @Input()
  set dataForm(data:DetalleDto)
  {
    
    if(data)
    {
      this.isNew = false;
      this.form.patchValue(data);
      this.form.markAllAsTouched();
      this.detalle = data;
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
    private maestraService: MaestraService,
    private activatedRoute: ActivatedRoute,
  ){
      
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      
      this.idMaestra = params['idMaestra'];  
      
      this.BuildForm();
    });
    
    this.maestraService.getAll().subscribe(
      (response) => {
        this.maestras = response.data;
      },
    );
  }

  private BuildForm(){


    this.form = this.formbuilder.group({
      nombre:['', [Validators.required]],
      maestraId:[this.idMaestra, [Validators.required]],
      codigo:['', [Validators.required]],
      descripcion:['', [Validators.required]],
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
    const TitleUp = 'Cambiara el estado del detalle';
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
