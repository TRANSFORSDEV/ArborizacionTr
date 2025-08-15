import { ClasificacionDto } from './../../../../core/models/clasificacion.model';
import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CensoArboreoDto, CoordenadaDto, RegistroFotograficoCensoDto, } from 'src/app/core/models/censoarboreo-dto.model';
import { DetalleDto } from 'src/app/core/models/detalle-dto.model';
import { MaestraDetalleCombo } from 'src/app/core/models/maestradetalle.mode';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { DetalleService } from 'src/app/core/services/detalle.service';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { CoordenadaComponent } from 'src/app/modules/sharedcomponent/coordenada/coordenada.component';
import { RegistroFotograficoComponent } from 'src/app/modules/sharedcomponent/registrofotografico/registrofotografico.component';
import { Habilitaracciones } from 'src/app/core/services/habilitaracciones.service';
import { EsriMapService } from 'src/app/core/services/EsriMap.service';
import { ClasificacionService } from 'src/app/core/services/clasificacion-service';
import { BasicTableService } from 'src/app/core/services/basictable.service';
import { GenericPredecesorSucesorTableDto } from 'src/app/core/models/generic-predecesor-sucesor-dto.model';
import { customRangeValidator } from 'src/app/core/validator/custom-range.validator';
@Component({
  selector: 'app-formulario-censoArboreo',
  templateUrl: './formulario-censoArboreo.component.html',
  styleUrls: ['./formulario-censoArboreo.component.scss'],
})
export class FormularioCensoArboreoComponent implements OnInit {
  @ViewChild('coordenadasComponent')
  coordenadas: CoordenadaComponent;

  @ViewChild('registroFotografico')
  registroFotosComponent: RegistroFotograficoComponent;

  statusDetail: RequestStatus = 'init';
  form: FormGroup;
  isNew: boolean = false;
  userNameRequired: boolean = false;
  passwordRequired: boolean = false;
  censoArboreo: CensoArboreoDto;
  formaCopa: DetalleDto[];
  estadosFito: DetalleDto[];
  madurez: DetalleDto[];
  tipoIndividuo: DetalleDto[];
  tipoEmpla: DetalleDto[];
  infraAfec: DetalleDto[];
  origenes: DetalleDto[];
  clasificado:ClasificacionDto[];

  Comunas:GenericPredecesorSucesorTableDto[];
  Barrios:GenericPredecesorSucesorTableDto[];

  recomendacionesParaManejoSilviculturalLista :DetalleDto[];
  mostraUpdate: boolean = false;
  mostraDelete: boolean = false;
  coordenadasList: CoordenadaDto[] = [];

  coordsList: CoordenadaDto[] = [
    { id: "", latitud: 7.147551442, longitud: -73.12981657, altitud: 'not specified', norte: 'not specified', este: 'not specified' },
    { id: "", latitud: 7.1150, longitud: -73.1100, altitud: 'not specified', norte: 'not specified', este: 'not specified' },
    { id: "", latitud: 7.1200, longitud: -73.1140, altitud: 'not specified', norte: 'not specified', este: 'not specified' },
    { id: "", latitud: 7.1250, longitud: -73.1220, altitud: 'not specified', norte: 'not specified', este: 'not specified' },
    { id: "", latitud: 7.1100, longitud: -73.1180, altitud: 'not specified', norte: 'not specified', este: 'not specified' }
  ];

  onlyCoordenadas: CoordenadaDto = new CoordenadaDto();
  onlyRegistroFotografico: RegistroFotograficoCensoDto[] = new Array<RegistroFotograficoCensoDto>();

  @Input()
  set dataForm(data: CensoArboreoDto) {
    console.log(data);
    if (data) {
      this.isNew = false;

      this.form.patchValue(data);
      if (data.fecha) {
        const fechaCorteString = formatDate(data.fecha, 'yyyy-MM-dd HH:mm', 'en-US');
        this.form.patchValue({ fecha: fechaCorteString });
      }

      //repairDAP
      this.form.patchValue({ dap2: data["daP2"] });
      this.form.patchValue({ dap3: data["daP3"] });
      this.form.patchValue({ dap4: data["daP4"] });
      try {
        this.form.patchValue({ estadoFitosanitario: JSON.parse(data["estadoFitosanitario"]) });
        this.form.patchValue({ recomendacionesParaManejoSilvicultural: JSON.parse(data["recomendacionesParaManejoSilvicultural"]) });
        this.form.patchValue({ infraestructuraAfectada: JSON.parse(data["infraestructuraAfectada"]) });
      } catch (error) {

      }


      this.form.markAllAsTouched();

      this.censoArboreo = data;
      this.onlyCoordenadas = this.censoArboreo.coordenada;

      this.onlyRegistroFotografico = this.censoArboreo.fotos;
    } else {
      this.initializedObj(data);
      this.isNew = true;
    }
  }

  private initializedObj(data: CensoArboreoDto) {
    if (!data) {
      data = new CensoArboreoDto();
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
    private detallesService: DetalleService,
    private habilitaracciones: Habilitaracciones,
    private clasificacionService: ClasificacionService,
    private basicTableService: BasicTableService,

  ) {
    this.BuildForm();
    this.getFormaCopa();
    this.getEstadoFito();
    this.getMadurez();
    this.getTipoIndividuo();
    this.getTipoEmpla();
    this.getInfraAfec();
    this.getClasificacion();
    this.getComunas();
  }

  ngOnInit(): void {
    this.origenes = new Array<DetalleDto>();
    let nativa = new DetalleDto();
    nativa.codigo = "Nativa";
    nativa.nombre = "Nativa";
    let introducida = new DetalleDto();
    introducida.codigo = "Introducida";
    introducida.nombre = "Introducida";
    this.origenes.push(nativa);
    this.origenes.push(introducida);
    this.setupDapCalculations();


    this.recomendacionesParaManejoSilviculturalLista = new Array<DetalleDto>();
    this.recomendacionesParaManejoSilviculturalLista.push(new DetalleDto('Poda'));
    this.recomendacionesParaManejoSilviculturalLista.push(new DetalleDto('Fertilizacion'));
    this.recomendacionesParaManejoSilviculturalLista.push(new DetalleDto('Tala'));
    this.recomendacionesParaManejoSilviculturalLista.push(new DetalleDto('Traslado'));

  }


  escucharCambios(data: ClasificacionDto) {
      console.log("seleccionado");
      this.form.patchValue({ orden: data.orden.descripcion });
      this.form.patchValue({ familia: data.familia.descripcion });
      this.form.patchValue({ especie: data.especie.descripcion });
      this.form.patchValue({ genero: data.genero.descripcion });
      this.form.patchValue({ nombreComun: data.nombreComun });
      this.form.patchValue({ nombreCientifico: data.nombreCientifico });
  }

  private BuildForm() {
    this.form = this.formbuilder.group({
      numeroIndividuoId: ['', []],
      alturaTotal: ['0.5', [Validators.required, Validators.min(0.5), Validators.max(50)]],
      alturaComercial: ['0.5', [Validators.required, Validators.min(0.5), Validators.max(50)]],
      cuadrilla: ['', []],
      formaCopa: ['', []],
      diametroCopa: ['0', [Validators.required]],
      alturaCopa: ['0', [Validators.required]],
      observacionCopa: ['', []],
      dap: ['0', [Validators.required, Validators.min(28), Validators.max(800)]],
      dap2: ['0', [customRangeValidator(28, 800)]],
      dap3: ['0', [customRangeValidator(28, 800)]],
      dap4: ['0', [customRangeValidator(28, 800)]],
      ndaptotal: [{value: '', disabled: true}, [Validators.required]],
      daptotal: [{value: '', disabled: true}, [Validators.required]],
      numeroFustes: ['0', []],
      nombreComun: ['', [Validators.required]],
      nombreCientifico: ['', [Validators.required]],
      orden: ['', [Validators.required]],
      familia: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      especie: ['', [Validators.required]],
      altitudASNM: ['0', [Validators.required]],
      estadoFitosanitario: ['', []],
      estadoMadurez: ['', []],
      tipoIndividuoForestal: ['', []],
      departamento: ['Santander', [Validators.required]],
      ciudad: ['Bucaramanga', [Validators.required]],
      tipoAglomeracion: ['', []],
      barrio: ['', []],
      comuna: ['', []],
      tipoEmplazamiento: ['', []],
      observacionTipoEmplazamiento: ['Sin Observaciones', []],
      infraestructuraAfectada: ['', []],
      observacionInfraestructuraAfectada: ['', []],
      apendiceCites: [false, []],
      categoriaUicn: [false, []],
      categoriaMinisterioResolucion01922014: [false, []],
      especieEndemica: [false, []],
      origen: ['', []],
      observacion: ['', []],
      fecha: ['', [Validators.required]],
      recomendacionesParaManejoSilvicultural: ['Sin Observaciones', []],
      isGuadua: [false, [Validators.required]],
      clasificacionId: ['', [Validators.required]],
    });

    const resultados = this.habilitaracciones.MostrarBotones('Censo');

    if (resultados.length > 0) {
      resultados.forEach(resultado => {
        this.mostraDelete = resultado.eliminar;
        this.mostraUpdate = resultado.editar;

      });
    }

  }

  private setupDapCalculations() {
    this.form.valueChanges.subscribe(values => {
      this.calculateDapTotalAndNdap();
    });
  }

  private converNumber( value : string) : number {

    let numberValue = Number(value);
    return numberValue
  }
  private calculateDapTotalAndNdap() {
    const dapValues = [
      this.converNumber(this.form.value.dap),
      this.converNumber(this.form.value.dap2),
      this.converNumber(this.form.value.dap3),
      this.converNumber(this.form.value.dap4)
    ];

    const sumDap = dapValues.reduce((acc, current) => acc + current, 0);

    const ndap = dapValues.filter(value => value > 0).length;

    const daptotal = sumDap / Math.PI;
    const ndaptotal = ndap;

    this.form.patchValue({
      daptotal: daptotal.toFixed(2), // Redondear a 2 decimales
      ndaptotal: ndaptotal
    }, { emitEvent: false }); // Evitar un bucle infinito de eventos
  }

  changeLeagueOwner(event:any){

    this.basicTableService.getByTableByIdPredecesor("Barrio",event.id).subscribe(
      result => {

        this.form.patchValue({ barrio: '' });
        this.Barrios = result.data;
      }
    );
  }

  getFormaCopa() {
    this.statusDetail = 'loading';
    this.detallesService.getByMaestra(MaestraDetalleCombo.FormaCopa).subscribe(
      result => {
        this.formaCopa = result.data
        this.statusDetail = 'init';
      }
    );
  }

  getClasificacion() {
    this.statusDetail = 'loading';
    this.clasificacionService.getAll().subscribe(
      result => {
        this.clasificado = result.data
        this.statusDetail = 'init';
      }
    );
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

  getEstadoFito() {
    this.statusDetail = 'loading';
    this.detallesService.getByMaestra(MaestraDetalleCombo.EstadoFitosanitario).subscribe(
      result => {
        this.estadosFito = result.data
        this.statusDetail = 'init';
      }
    );
  }

  getMadurez() {
    this.statusDetail = 'loading';
    this.detallesService.getByMaestra(MaestraDetalleCombo.EstadoMadurez).subscribe(
      result => {
        this.madurez = result.data
        this.statusDetail = 'init';
      }
    );
  }

  getTipoIndividuo() {
    this.statusDetail = 'loading';
    this.detallesService.getByMaestra(MaestraDetalleCombo.TipoIndividuo).subscribe(
      result => {
        this.tipoIndividuo = result.data
        this.statusDetail = 'init';
      }
    );
  }

  getTipoEmpla() {
    this.statusDetail = 'loading';
    this.detallesService.getByMaestra(MaestraDetalleCombo.TipoEmplazamiento).subscribe(
      result => {
        this.tipoEmpla = result.data
        this.statusDetail = 'init';
      }
    );
  }

  getInfraAfec() {
    this.statusDetail = 'loading';
    this.detallesService.getByMaestra(MaestraDetalleCombo.InfraestructuraAfectada).subscribe(
      result => {
        this.infraAfec = result.data
        this.statusDetail = 'init';
      }
    );
  }


  obtenerCamposRequeridos(): string[] {
    const camposRequeridos: string[] = [];
    Object.keys(this.form.controls).forEach(controlName => {
      const control = this.form.get(controlName);
      if (control.errors ) {
        camposRequeridos.push(controlName);
      }
    });
    return camposRequeridos;
  }
  clonarFormulario() {
    let clon = this.formbuilder.group({
      numeroIndividuoId: ['', []],
      alturaTotal: ['0.5', [Validators.required, Validators.min(0.5), Validators.max(50)]],
      alturaComercial: ['0.5', [Validators.required, Validators.min(0.5), Validators.max(50)]],
      cuadrilla: ['', []],
      formaCopa: ['', []],
      diametroCopa: ['0', [Validators.required]],
      alturaCopa: ['0', [Validators.required]],
      observacionCopa: ['', []],
      dap: ['0', [Validators.required, Validators.min(28), Validators.max(800)]],
      dap2: ['0', [customRangeValidator(28, 800)]],
      dap3: ['0', [customRangeValidator(28, 800)]],
      dap4: ['0', [customRangeValidator(28, 800)]],
      ndaptotal: [{value: '', disabled: true}, [Validators.required]],
      daptotal: [{value: '', disabled: true}, [Validators.required]],
      numeroFustes: ['0', []],
      nombreComun: ['', [Validators.required]],
      nombreCientifico: ['', [Validators.required]],
      orden: ['', [Validators.required]],
      familia: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      especie: ['', [Validators.required]],
      altitudASNM: ['0', [Validators.required]],
      estadoFitosanitario: ['', []],
      estadoMadurez: ['', []],
      tipoIndividuoForestal: ['', []],
      departamento: ['Santander', [Validators.required]],
      ciudad: ['Bucaramanga', [Validators.required]],
      tipoAglomeracion: ['', []],
      barrio: ['', []],
      comuna: ['', []],
      tipoEmplazamiento: ['', []],
      observacionTipoEmplazamiento: ['Sin Observaciones', []],
      infraestructuraAfectada: ['', []],
      observacionInfraestructuraAfectada: ['', []],
      apendiceCites: [false, []],
      categoriaUicn: [false, []],
      categoriaMinisterioResolucion01922014: [false, []],
      especieEndemica: [false, []],
      origen: ['', []],
      observacion: ['', []],
      fecha: ['', [Validators.required]],
      recomendacionesParaManejoSilvicultural: ['Sin Observaciones', []],
      isGuadua: [false, [Validators.required]],
      clasificacionId: ['', [Validators.required]],
    })

    return clon;
  }

  changeForm(formElement:string){
    if(formElement == 'estadoMadurez'){
      this.form.get('dap').clearValidators();
      this.form.get('diametroCopa').clearValidators();
      if(this.form.get(formElement).value != 'Plantula'){
        this.form.get('dap').setValidators([Validators.required, Validators.min(28), Validators.max(800)]);
        this.form.get('diametroCopa').setValidators([Validators.required]);
      }
      this.form.get('dap').updateValueAndValidity();
      this.form.get('diametroCopa').updateValueAndValidity();
    }
  }

  Guardar() {

    if (this.form.invalid) {
      //alert (JSON.stringify(this.obtenerCamposRequeridos()))
      this.form.markAllAsTouched();
      return;
    }

    if(!this.registroFotosComponent.isValid()){
      this.mostrarNecesitaImagenes();
      return
    }
    debugger;
    let clonForm = this.clonarFormulario();
    clonForm.patchValue(this.form.getRawValue());
    

    clonForm.value['coordenada'] = this.coordenadas.getFormValue();
    clonForm.value['fotos'] = new Array<RegistroFotograficoCensoDto>();

    const files = this.registroFotosComponent.getFilesLoaded();
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    clonForm.value["estadoFitosanitario"]=JSON.stringify(this.form.value.estadoFitosanitario);
    clonForm.value["recomendacionesParaManejoSilvicultural"]=JSON.stringify(this.form.value.recomendacionesParaManejoSilvicultural);
    clonForm.value["infraestructuraAfectada"]=JSON.stringify(this.form.value.infraestructuraAfectada);

    let infoFotos = {
      'rotation'  : this.registroFotosComponent.getRotationLoaded().rotation,
    };

    formData.append('fullobject', JSON.stringify(clonForm.value));
    formData.append('infofotos', JSON.stringify(infoFotos));

    this.create.emit(formData);
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

    this.form.value.coordenada = this.coordenadas.getFormValue();
    this.form.value.fotos = this.registroFotosComponent.getCurrentFotos();

    const files = this.registroFotosComponent.getFilesLoaded();
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    this.form.value["estadoFitosanitario"]=JSON.stringify(this.form.value.estadoFitosanitario);
    this.form.value["recomendacionesParaManejoSilvicultural"]=JSON.stringify(this.form.value.recomendacionesParaManejoSilvicultural);
    this.form.value["infraestructuraAfectada"]=JSON.stringify(this.form.value.infraestructuraAfectada);


    let infoFotos = {
      'rotation'  : this.registroFotosComponent.getRotationLoaded().rotation,

    };
    formData.append('fullobject', JSON.stringify(this.form.value));
    formData.append('infofotos', JSON.stringify(infoFotos));

    this.update.emit(formData);
  }

  async mostrarConfirmacion() {
    const TitleUp = 'Cambiara el estado del censoArboreo';
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

  async mostrarNecesitaImagenes() {
    const TitleUp = 'Antes de guardar';
    const TitleDonw = 'Debe seleccionar al menos una imagen';
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
      get: () => {
        try {
          return this.form.get(name);
        } catch (error) {
          console.error('Error al obtener el campo:', error);
          return null; // O manejar el error de otra manera
        }
      },
      isValid: () => {
        try {
          const field = this.form.get(name);
          return field && field.touched && field.valid;
        } catch (error) {
          console.error('Error al verificar si el campo es válido:', error);
          return false; // O manejar el error de otra manera
        }
      }
    };
  }
}
