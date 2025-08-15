import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  CoordenadaDto, RegistroFotograficoEspacioDto  } from 'src/app/core/models/censoarboreo-dto.model';
import { DetalleDto } from 'src/app/core/models/detalle-dto.model';
import { EspaciosPotencialesDto } from 'src/app/core/models/espaciospotenciales-dto.model';
import { MaestraDetalleCombo } from 'src/app/core/models/maestradetalle.mode';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { DetalleService } from 'src/app/core/services/detalle.service';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { CoordenadaComponent } from 'src/app/modules/sharedcomponent/coordenada/coordenada.component';
import { RegistroFotograficoComponent } from 'src/app/modules/sharedcomponent/registrofotografico/registrofotografico.component';
import {Habilitaracciones } from 'src/app/core/services/habilitaracciones.service';
import { GenericPredecesorSucesorTableDto } from 'src/app/core/models/generic-predecesor-sucesor-dto.model';
import { BasicTableService } from 'src/app/core/services/basictable.service';
@Component({
  selector: 'app-formulario-espaciospotenciales',
  templateUrl: './formulario-espaciospotenciales.component.html',
  styleUrls: ['./formulario-espaciospotenciales.component.scss'],
})
export class FormularioEspaciosPotencialesComponent implements OnInit {
  @ViewChild('componente1')
  coordenadaPosicion: CoordenadaComponent;

  @ViewChild('registroFotografico')
  registroFotosComponent: RegistroFotograficoComponent;

  statusDetail: RequestStatus = 'init';
  form: FormGroup;
  isNew: boolean = false;
  userNameRequired: boolean = false;
  passwordRequired: boolean = false;
  espacios: EspaciosPotencialesDto = new EspaciosPotencialesDto();
  onlyCoordenadas: CoordenadaDto = new CoordenadaDto();
  onlyRegistroFotografico: RegistroFotograficoEspacioDto[] =
    new Array<RegistroFotograficoEspacioDto>();
  tipoEmpla:DetalleDto[];
  distSiembra:DetalleDto[];
  infraAfec:DetalleDto[];
  pendiente:DetalleDto[];
  Comunas:GenericPredecesorSucesorTableDto[];
  Barrios:GenericPredecesorSucesorTableDto[];
  mostraUpdate: boolean = false;
  mostraDelete: boolean = false;
  especiePotencial:string[] = ["Forestal","Palma", "Arbustivo","Frutal","Ornamental"]
  alturaPotencial = [
    { "id": 1, "desc": "1 a 3.9 mts" },
    { "id": 2, "desc": "4 a 7.9 mts" },
    { "id": 3, "desc": "8 a 11.9 mts" },
    { "id": 4, "desc": "12 a 15.9 mts" },
    { "id": 5, "desc": "Mayores a 16" }
];
caracteristicasEdaficas = [
  { "id": 1, "desc": "Con profundidad >0.10" },
  { "id": 2, "desc": "Sin profundidad >0.10" }
];

  @Input()
  set dataForm(data: EspaciosPotencialesDto) {
    console.log(data);
    if (data) {
      this.isNew = false;
      this.initializedObj(data);
      this.form.patchValue(data);
      this.form.markAllAsTouched();
      this.espacios = data;
      this.onlyCoordenadas = this.espacios.coordenada;
      this.onlyRegistroFotografico = this.espacios.fotos;
      this.form.patchValue({ EspeciesPotencialesParaSiembraAlMenosTresOpciones: JSON.parse(data.especiesPotencialesParaSiembraAlMenosTresOpciones) });
    } else {
      this.initializedObj(data);
      this.espacios = data;
      this.isNew = true;
    }
  }

  private initializedObj(data: EspaciosPotencialesDto) {
    if (!data) {
      data = new EspaciosPotencialesDto();
    }
    if (!data.coordenada) {
      data.coordenada = new CoordenadaDto();
    }
  }
  @Input()
  set status(data: RequestStatus) {
    if (data) {
      this.statusDetail = data;
    }
  }

  @Output() create = new EventEmitter();
  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor(
    private formbuilder: FormBuilder,
    private sweetAlertService: SweetAlertService,
    private detallesService:DetalleService,
    private habilitaracciones: Habilitaracciones,
    private basicTableService: BasicTableService,
  ) {
    this.BuildForm();
    this.getTipoEmpla();
    this.getDistSiembra();
    this.getComunas();
    this.getPendiente();
  }

  ngOnInit(): void {
    const resultados = this.habilitaracciones.MostrarBotones('Espacios');

    if (resultados.length > 0) {
        resultados.forEach(resultado => {
             this.mostraDelete=resultado.eliminar;
             this.mostraUpdate=resultado.editar;

        });
    }
  }

  getComunas() {
    this.statusDetail = 'loading';
    this.basicTableService.getByTable('Comuna').subscribe(
      result => {
        this.Comunas = result.data
        this.statusDetail = 'init';
      }
    );
  }

  changeLeagueOwner(event:any){
    debugger;
    this.basicTableService.getByTableByIdPredecesor("Barrio",event.id).subscribe(
      result => {
        debugger;
        this.form.patchValue({ barrio: '' });
        this.Barrios = result.data;
      }
    );
  }

  private BuildForm() {
    this.form = this.formbuilder.group({
      areasDisponibles: ['', [Validators.required]],
      tipoEmplazamiento: ['', [Validators.required]],
      EspeciesPotencialesParaSiembraAlMenosTresOpciones: [
        '',
        [Validators.required],
      ],
      alturasPotencialesArboles: ['', [Validators.required]],
      caracteristicasEdaficasODelSuelo: ['', [Validators.required]],
      tresBolillo: [false, []],
      cuadrado: [false, []],
      rectangular: [false, []],
      individualOUno: [false, []],
      distanciamientoSiembra: ['', [Validators.required]],
      infraestructuraAfectada: ['', []],
      pendienteDelTerreno: ['', [Validators.required]],
      barrio: ['', [Validators.required]],
      comuna: ['', [Validators.required]],
      altitudASNM: ['', [Validators.required]],
    });
  }

  getTipoEmpla(){
    this.statusDetail = 'loading';
    this.detallesService.getByMaestra(MaestraDetalleCombo.TipoEmplazamiento).subscribe(
      result => {
        this.tipoEmpla = result.data
        this.statusDetail = 'init';
      }
    );
  }

  getInfraAfec(){
    this.statusDetail = 'loading';
    this.detallesService.getByMaestra(MaestraDetalleCombo.InfraestructuraAfectada).subscribe(
      result => {
        this.infraAfec = result.data
        this.statusDetail = 'init';
      }
    );
  }

  getDistSiembra(){
    this.statusDetail = 'loading';
    this.detallesService.getByMaestra(MaestraDetalleCombo.DistanciamientoSiembra).subscribe(
      result => {
        this.distSiembra = result.data
        this.statusDetail = 'init';
      }
    );
  }

  getPendiente(){
    this.statusDetail = 'loading';
    this.detallesService.getByMaestra(MaestraDetalleCombo.PendienteDelTerreno).subscribe(
      result => {
        this.pendiente = result.data
        this.statusDetail = 'init';
      }
    );
  }

  Guardar() {
    if (this.form.invalid) {
      console.log(this.form)
      this.form.markAllAsTouched();
      return;
    }


    if(!this.registroFotosComponent.isValid()){
      this.mostrarNecesitaImagenes();
      return
    }

    this.form.value["EspeciesPotencialesParaSiembraAlMenosTresOpciones"]=JSON.stringify(this.form.value.EspeciesPotencialesParaSiembraAlMenosTresOpciones);
    this.form.value.coordenada = this.coordenadaPosicion.getFormValue();
    this.form.value.fotos = new Array<RegistroFotograficoEspacioDto>();

    const files = this.registroFotosComponent.getFilesLoaded();
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }


    let infoFotos = {
      'rotation'  : this.registroFotosComponent.getRotationLoaded().rotation,
    };

    formData.append('infofotos', JSON.stringify(infoFotos));
    let fullStringObj = JSON.stringify(this.form.value);
    debugger;
    formData.append('fullobject', fullStringObj);


    this.create.emit(formData);
  }

  async mostrarNecesitaImagenes() {
    const TitleUp = 'Antes de guardar';
    const TitleDonw = 'Debe seleccionar al menos una image';
    this.sweetAlertService.showConfirmationCallback(
      TitleUp,
      TitleDonw,
      () => {
        //ejecuto el llamado a la funcion Borrar
      },
      () => {
        //en caso de usar cancelacion
      }
    );
  }

  Actualizar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if(!this.registroFotosComponent.isValid()){
      if(this.registroFotosComponent.getCurrentFotos().length == 0){
        this.mostrarNecesitaImagenes();
        return
      }
    }



    this.form.value["EspeciesPotencialesParaSiembraAlMenosTresOpciones"]=JSON.stringify(this.form.value.EspeciesPotencialesParaSiembraAlMenosTresOpciones);
    this.form.value.coordenada = this.coordenadaPosicion.getFormValue();
    this.form.value.fotos = this.registroFotosComponent.getCurrentFotos();

    const files = this.registroFotosComponent.getFilesLoaded();
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    let infoFotos = {
      'rotation'  : this.registroFotosComponent.getRotationLoaded().rotation,
    };
    formData.append('infofotos', JSON.stringify(infoFotos));
    formData.append('fullobject', JSON.stringify(this.form.value));

    this.update.emit(formData);
  }

  async mostrarConfirmacion() {
    const TitleUp = 'Cambiara el estado del espaciosPotenciales';
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
      isValid: () => this.form.get(name).touched && this.form.get(name).invalid,
    };
  }
}
