import { ClasificacionDto } from '../../../../core/models/clasificacion.model';
import { formatDate,DatePipe } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
import { Imagenes } from 'src/app/core/services/imagenes.service';
import { ActividadesSilviculturalesService } from 'src/app/core/services/actividadessilviculturales.service';
import { ActividadesSilviculturalesDto, Estado } from 'src/app/core/models/actividadessilviculturales-dto.model';
import { environment } from 'src/environments/environment';

declare var Object: any; 
@Component({
  selector: 'app-impresion-censoArboreo',
  templateUrl: './impresion-censoArboreo.component.html',
  styleUrls: ['./impresion-censoArboreo.component.scss'],
  providers: [DatePipe]
})
export class ImpresionfCensoArboreoComponent implements OnInit {

  @ViewChild('coordenadasComponent')
  coordenadas: CoordenadaComponent;

  @ViewChild('registroFotografico')
  
  registroFotosComponent: RegistroFotograficoComponent;
  fechaActual: string;
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
  recomendacionesParaManejoSilviculturalLista :DetalleDto[];
  mostraUpdate: boolean = false;
  mostraDelete: boolean = false;
  coordenadasList: CoordenadaDto[] = [];
  id: string;
  dato:string;
  blobUrlAntes:Array<string> = [];
  blobUrlDespues:Array<string> = [];
  blobUrlPrincipal : string = "";
  dataList: ActividadesSilviculturalesDto[];
  imagesUrl = environment.API_URL+"/api/images/";
  coordsList: CoordenadaDto[] = [
    { id: "", latitud: 7.147551442, longitud: -73.12981657, altitud: 'not specified', norte: 'not specified', este: 'not specified' },
    { id: "", latitud: 7.1150, longitud: -73.1100, altitud: 'not specified', norte: 'not specified', este: 'not specified' },
    { id: "", latitud: 7.1200, longitud: -73.1140, altitud: 'not specified', norte: 'not specified', este: 'not specified' },
    { id: "", latitud: 7.1250, longitud: -73.1220, altitud: 'not specified', norte: 'not specified', este: 'not specified' },
    { id: "", latitud: 7.1100, longitud: -73.1180, altitud: 'not specified', norte: 'not specified', este: 'not specified' }
  ];

  onlyCoordenadas: CoordenadaDto = new CoordenadaDto();
  onlyRegistroFotografico: RegistroFotograficoCensoDto[] = new Array<RegistroFotograficoCensoDto>();
  window: any;
  Estados=Estado;

  @Input()
  set dataForm(data: CensoArboreoDto) {
    
    if (data) {
      this.isNew = false;

      this.form.patchValue(data);
      if (data.fecha) {
        const fechaCorteString = formatDate(data.fecha, 'yyyy-MM-dd', 'en-US');
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
      if(this.censoArboreo.fotos[this.censoArboreo.fotos.length-1].nombre){
        this.downloadImagePrincipal(this.censoArboreo.fotos[this.censoArboreo.fotos.length-1].nombre);
      }
      this.onlyCoordenadas = this.censoArboreo.coordenada;
      console.log(JSON.stringify(this.onlyCoordenadas))
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
  @Output() getactividad = new EventEmitter();


  constructor(
    private formbuilder: FormBuilder,
    private sweetAlertService: SweetAlertService,
    private detallesService: DetalleService,
    private habilitaracciones: Habilitaracciones,
    private clasificacionService: ClasificacionService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private actividadessilviculturalesService: ActividadesSilviculturalesService,
    private imagenes: Imagenes
    

  ) {
    this.BuildForm();
    this.getFormaCopa();
    this.getEstadoFito();
    this.getMadurez();
    this.getTipoIndividuo();
    this.getTipoEmpla();
    this.getInfraAfec();
    this.getClasificacion();
    this.obtenerFechaActual();
    
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      console.log("id "+ this.id)
      this.traeractividades(this.id)
    });
    
    const checkbox = document.querySelector('#apendiceCites');
    const checkboxUicn = document.querySelector('#categoriaUicn');
    const checkboxMinisterioR = document.querySelector('#categoriaMinisterioResolucion01922014');
    const checkboxespecieEndemica = document.querySelector('#especieEndemica');
    const checkboxisGuadua = document.querySelector('#isGuadua');

    checkboxisGuadua.addEventListener('click', () => {
      // Deny the event
      event.preventDefault();
    });
    checkbox.addEventListener('click', () => {
      // Deny the event
      event.preventDefault();
    });
    checkboxUicn.addEventListener('click', () => {
      // Deny the event
      event.preventDefault();
    });
    checkboxMinisterioR.addEventListener('click', () => {
      // Deny the event
      event.preventDefault();
    });
    checkboxespecieEndemica.addEventListener('click', () => {
      // Deny the event
      event.preventDefault();
    });
    
   
    this.origenes = new Array<DetalleDto>();
    let nativa = new DetalleDto();
    nativa.codigo = "Nativa";
    nativa.nombre = "Nativa";
    let introducida = new DetalleDto();
    nativa.codigo = "Introducida";
    nativa.nombre = "Introducida";
    this.origenes.push(nativa);
    this.origenes.push(introducida);


    this.recomendacionesParaManejoSilviculturalLista = new Array<DetalleDto>();
    this.recomendacionesParaManejoSilviculturalLista.push(new DetalleDto('Poda'));
    this.recomendacionesParaManejoSilviculturalLista.push(new DetalleDto('Fertilizacion'));
    this.recomendacionesParaManejoSilviculturalLista.push(new DetalleDto('Tala'));
    this.recomendacionesParaManejoSilviculturalLista.push(new DetalleDto('Traslado'));
   
  }

  private BuildForm() {
    this.form = this.formbuilder.group({
      numeroIndividuoId: ['', [Validators.required]],
      alturaTotal: ['', [Validators.required]],
      alturaComercial: ['', [Validators.required]],
      cuadrilla: ['', [Validators.required]],
      formaCopa: ['', [Validators.required]],
      diametroCopa: ['', [Validators.required]],
      alturaCopa: ['', [Validators.required]],
      observacionCopa: ['', [Validators.required]],
      dap: ['0', [Validators.required]],
      dap2: ['0', [Validators.required]],
      dap3: ['0', [Validators.required]],
      dap4: ['0', [Validators.required]],
      ndaptotal: ['', [Validators.required]],
      daptotal: ['', [Validators.required]],
      numeroFustes: ['0', []],
      nombreComun: ['', [Validators.required]],
      nombreCientifico: ['', [Validators.required]],
      orden: ['', [Validators.required]],
      familia: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      especie: ['', [Validators.required]],
      altitudASNM: ['', [Validators.required]],
      estadoFitosanitario: ['', [Validators.required]],
      estadoMadurez: ['', [Validators.required]],
      tipoIndividuoForestal: ['', [Validators.required]],
      departamento: ['Santander', [Validators.required]],
      ciudad: ['Bucaramanga', [Validators.required]],
      tipoAglomeracion: ['', [Validators.required]],
      barrio: ['', [Validators.required]],
      comuna: ['', [Validators.required]],
      tipoEmplazamiento: ['', [Validators.required]],
      observacionTipoEmplazamiento: ['', [Validators.required]],
      infraestructuraAfectada: ['', [Validators.required]],
      observacionInfraestructuraAfectada: ['', [Validators.required]],
      apendiceCites: [false, [Validators.required]],
      categoriaUicn: [false, [Validators.required]],
      categoriaMinisterioResolucion01922014: [false, [Validators.required]],
      especieEndemica: [false, [Validators.required]],
      origen: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      recomendacionesParaManejoSilvicultural: ['', [Validators.required]],
      isGuadua: [false, [Validators.required]],
      clasificadoId: ['', [Validators.required]],
    });

    this.form.get('dap').valueChanges.subscribe(() => this.actualizarDapTotal());
    this.form.get('dap2').valueChanges.subscribe(() => this.actualizarDapTotal());
    this.form.get('dap3').valueChanges.subscribe(() => this.actualizarDapTotal());
    this.form.get('dap4').valueChanges.subscribe(() => this.actualizarDapTotal());


    const resultados = this.habilitaracciones.MostrarBotones('Censo');

    if (resultados.length > 0) {
      resultados.forEach(resultado => {
        this.mostraDelete = resultado.eliminar;
        this.mostraUpdate = resultado.editar;

      });
    }

  }

  private actualizarDapTotal() {

    const dap = this.form.get('dap').value;
    const dap2 = this.form.get('dap2').value;
    const dap3 = this.form.get('dap3').value;
    const dap4 = this.form.get('dap4').value;

    let dapTotalSuma = Number(dap)+  Number(dap2) + Number(dap3) +Number(dap4);

    // Actualizar el valor de dapTotal en el formulario
    this.form.patchValue({ daptotal : dapTotalSuma });
  }
  // Por ejemplo, en un método del componente o en ngOnInit

      traeractividades(dato){
      
        this.actividadessilviculturalesService.GetAll(dato).subscribe(
          response => {
            if (Array.isArray(response.data)) {
              this.dataList = response.data;
              this.dataList.forEach((elemento,indice)=>{
                
                this.downloadImage(indice);
              });
              // this.downloadImage()
             
            } else {
              // Si response.data no es un array, puedes manejar el error de alguna manera
              console.error('Error: response.data no es un array');
            }
            // Puedes asignar los datos a una propiedad del componente para usarlos en la vista
          },
          (error) => {
            // Maneja los errores aquí
            console.error(error);
          }
        );
      }
  obtenerFechaActual() {
    const fecha = new Date();
    this.fechaActual = this.datePipe.transform(fecha, 'yyyy-MM-dd');
  }
  Imprimir(){

    var ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write('<html><head><title>Imprimir</title>' +
      '<style>' +
      'body { font-size: 20pt; }' + 
      '.label-container {display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;  }'+
      '.item {padding: 20px; border: 1px solid #ccc; text-align: center; }' +
      '.itemright {padding: 20px; border: 1px solid #ccc; text-align: right; }' +
      '.itemleft {padding: 20px; border: 1px solid #ccc; text-align: right; }' +
      '.table-con-borde { border-collapse: collapse; width: 100%; }'+
      '.table-con-borde td, .table-con-borde th { border: 1px solid black; padding: 8px;}'+
      '</style></head><body>'
      );
    
    var contenidoDiv = document.getElementById('divimprimir').innerHTML;
    ventanaImpresion.document.write(contenidoDiv);
    
    ventanaImpresion.document.write('</body></html>');
    ventanaImpresion.document.close();
    ventanaImpresion.print();
    ventanaImpresion.close();
    
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

downloadImagePrincipal(link:string){
  this.imagenes.downloadHistoryValueFile(link).subscribe((blobRes) => {
    // this.blobUrlAntes[indice] = window.URL.createObjectURL(blobRes);
      // Convertir el Blob a una URL de datos
      const reader = new FileReader();
      reader.onloadend = () => {
        this.blobUrlPrincipal = reader.result as string;
      };
      reader.readAsDataURL(blobRes);
});

} 
// This is for downloadImage from b64 string 
downloadImage(indice) {

  this.imagenes.downloadHistoryValueFile(this.dataList[indice].fotoAntes).subscribe((blobRes) => {
      // this.blobUrlAntes[indice] = window.URL.createObjectURL(blobRes);
        // Convertir el Blob a una URL de datos
        const reader = new FileReader();
        reader.onloadend = () => {
          this.blobUrlAntes[indice] = reader.result as string;
        };
        reader.readAsDataURL(blobRes);
  });

  this.imagenes.downloadHistoryValueFile(this.dataList[indice].fotoDespues).subscribe((blobRes) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.blobUrlDespues[indice] = reader.result as string;
    };
    reader.readAsDataURL(blobRes);
  });
}

  Guardar() {

    if (this.form.invalid) {
      alert (JSON.stringify(this.obtenerCamposRequeridos()))
      this.form.markAllAsTouched();
      return;
    }

    let clonForm = this.formbuilder.group(this.form.getRawValue());
    ;
    clonForm.value['coordenada'] = this.coordenadas.getFormValue();
    clonForm.value['fotos'] = new Array<RegistroFotograficoCensoDto>();

    const files = this.registroFotosComponent.getFilesLoaded();
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    /*
    for (const prop in this.form.value) {
      if (this.form.value.hasOwnProperty(prop)) {
        formData.append(`censo.${prop}`, this.form.value[prop].toString());
      }
    }*/
    ;


    clonForm.value["estadoFitosanitario"]=JSON.stringify(this.form.value.estadoFitosanitario);
    clonForm.value["recomendacionesParaManejoSilvicultural"]=JSON.stringify(this.form.value.recomendacionesParaManejoSilvicultural);
    clonForm.value["infraestructuraAfectada"]=JSON.stringify(this.form.value.infraestructuraAfectada);

    let infoFotos = {
      'rotation'  : this.registroFotosComponent.getRotationLoaded().rotation,
    };

    formData.append('fullobject', JSON.stringify(clonForm.value));
    formData.append('infofotos', JSON.stringify(infoFotos));
    ;
    this.create.emit(formData);
  }

  Actualizar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
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

  getEstadoFromNumber(numero: any): string {
    switch (numero) {
      case 0:
        return Estado.Solicitada;
      case 1:
        return Estado.Aprobada;
      case 2:
        return Estado.Rechazada;
      case 3:
        return Estado.Ejecutada;
      default:
        return Estado.Solicitada;
    }
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
