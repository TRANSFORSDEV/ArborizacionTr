import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ActividadesSilviculturalesDto, Estado } from 'src/app/core/models/actividadessilviculturales-dto.model';
import { CensoArboreoDto, RegistroFotograficoCensoDto } from 'src/app/core/models/censoarboreo-dto.model';
import { DetalleDto } from 'src/app/core/models/detalle-dto.model';
import { MaestraDetalleCombo } from 'src/app/core/models/maestradetalle.mode';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { UserDto } from 'src/app/core/models/user-dto.model';
import { EsriMapService } from 'src/app/core/services/EsriMap.service';
import { DetalleService } from 'src/app/core/services/detalle.service';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { BuscarArbolNoCampoComponent } from 'src/app/modules/censoarboreo/components/buscar-arbol-nocampo/buscar-arbol-nocampo.component';
import { RegistroFotograficoComponent } from 'src/app/modules/sharedcomponent/registrofotografico/registrofotografico.component';

@Component({
  selector: 'app-procesamiento-actividadesSilviculturales',
  templateUrl: './procesamiento-actividadesSilviculturales.component.html',
  styleUrls: ['./procesamiento-actividadesSilviculturales.component.scss']
})
export class ProcesamientoActividadesSilviculturalesComponent implements OnInit {

  statusDetail: RequestStatus = 'init';
  form:FormGroup;
  isNew:boolean = false;
  userNameRequired:boolean = false;
  passwordRequired:boolean = false;
  actividadessilviculturalesDto : ActividadesSilviculturalesDto;
  individuoSeleccionado: CensoArboreoDto = null;
  isMultipleMode : boolean = false;
  tipoActividad : string = "";

  isSiembra: boolean = false;
  isPoda: boolean = false;
  isTala: boolean = false;

  limpiezaList : DetalleDto[];
  podaSanitariaList : DetalleDto[];
  tipoEmplazamientoList : DetalleDto[];

  onlyRegistroFotograficoAntes: RegistroFotograficoCensoDto[] = new Array<RegistroFotograficoCensoDto>();
  onlyRegistroFotograficoDespues: RegistroFotograficoCensoDto[] = new Array<RegistroFotograficoCensoDto>();
  onlyRegistroFotograficoDurante: RegistroFotograficoCensoDto[] = new Array<RegistroFotograficoCensoDto>();

  @ViewChild('buscarArbolLista')
  buscarArbolLista: BuscarArbolNoCampoComponent;

  @ViewChild('registroFotograficoAntes')
  registroFotograficoAntes: RegistroFotograficoComponent;

  @ViewChild('registroFotograficoDespues')
  registroFotograficoDespues: RegistroFotograficoComponent;
  @Input()
  set dataForm(data:ActividadesSilviculturalesDto)
  {

    console.log(data)

    if(data)
    {
      this.isNew = false;

      this.form.patchValue(data);

      if (data.nuevaIntervencion) {
        const fechaCorteString = formatDate(data.nuevaIntervencion, 'yyyy-MM-dd', 'en-US');
        this.form.patchValue({ nuevaIntervencion: fechaCorteString });
      }

      if (data.expedicionPermiso) {
        const fechaCorteString = formatDate(data.expedicionPermiso, 'yyyy-MM-dd', 'en-US');
        this.form.patchValue({ expedicionPermiso: fechaCorteString });
      }

      let estadoLocal  = Number(data.estado);
      this.form.patchValue({estado : estadoLocal == 0 ? "Solicitada" : estadoLocal == 1 ? "Aprobada" : "Rechazada" })
      this.form.markAllAsTouched();
      this.actividadessilviculturalesDto = data;
      this.actividadessilviculturalesDto.estado = this.numeroAEstado(Number(this.actividadessilviculturalesDto.estado));
      let fotosAntes = new RegistroFotograficoCensoDto();
      fotosAntes.nombre = data.fotoAntes;
      this.onlyRegistroFotograficoAntes.push(fotosAntes);

      ;
      if(data.fotoDuranteUno) {
        let fotosDuranteUno = new RegistroFotograficoCensoDto();
        fotosDuranteUno.nombre = data.fotoDuranteUno;
        this.onlyRegistroFotograficoDurante.push(fotosDuranteUno);
      }
      if(data.fotoDuranteDos) {
        let fotosDuranteDos = new RegistroFotograficoCensoDto();
        fotosDuranteDos.nombre = data.fotoDuranteDos;
        this.onlyRegistroFotograficoDurante.push(fotosDuranteDos);
      }

      let fotosDespues = new RegistroFotograficoCensoDto();
      fotosDespues.nombre = data.fotoDespues;
      this.onlyRegistroFotograficoDespues.push(fotosDespues);
    } else {
      this.isNew = true;
      this.actividadessilviculturalesDto = new ActividadesSilviculturalesDto();
      this.form.patchValue({estado: Estado.Solicitada.toString()});
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

  numeroAEstado(numero: number): Estado  {
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

  @Output() create= new EventEmitter();
  @Output() update= new EventEmitter();
  @Output() delete= new EventEmitter();

  constructor( private formbuilder:FormBuilder,
    private sweetAlertService: SweetAlertService,
    private activatedRoute: ActivatedRoute,
    private detallesService: DetalleService,
    private esriMapService: EsriMapService
  ){
    this.loadNgSelectData();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.tipoActividad = params['tipoActividad'];

      if(this.tipoActividad)
      {
        if(this.tipoActividad == "Siembra"){
        this.isSiembra = true;
      } else if(this.tipoActividad == "Poda"){
        this.isPoda = true;
      } else if(this.tipoActividad == "Tala"){
        this.isTala = true;
      }
        this.BuildForm(this.tipoActividad);
      }
    });
  }

  ngOnInit(): void {
    this.ngAfterViewInit();
  }



  async ngAfterViewInit() {
    await this.esriMapService.initializeMap('containerId2'); // Asegúrate de pasar el ID correcto del contenedor
    this.esriMapService.resetMapView();
    if(this.actividadessilviculturalesDto)
      {
        this.esriMapService.addPoint(this.actividadessilviculturalesDto.censoArboreo.coordenada.longitud, this.actividadessilviculturalesDto.censoArboreo.coordenada.latitud);
      }
  }

  private BuildForm(tipoActividad : string) {



    if (tipoActividad == 'Siembra') {
      this.form = this.formbuilder.group({
        responsable: ['', [Validators.required]],
        actor: ['', [Validators.required]],
        operador: ['', [Validators.required]],

        podaRealceR: [false, []],
        podaEstabilidadE: [false, []],
        podaMantenimientoM: [false, []],
        cortesNuevos: [false, []],
        cortesViejos: [false, []],
        cortesEnfermos: [false, []],
        podaRaices: [false, []],
        estructurasCercanasTipoEmplazamiento: ['', []],
        limpieza: ['', []],
        podaSanitaria: ['', []],
        inmediataI: [false, []],
        cortoPlazoC: [false, []],
        largoPlazoL: [false, []],
        trasplante: [false, []],
        observacion: ['Ninguno', []],
        observacion2: ['Ninguno', []],
        estado: ['', []],
        idCensoArboreo: ['00000000-0000-0000-0000-000000000000', []],
        numeroArbolEnCampo: ['', []],
      });
    } else if (tipoActividad == 'Poda') {
      this.form = this.formbuilder.group({
        actor: ['', [Validators.required]],
        operador: ['', [Validators.required]],

        nuevaIntervencion: ['', [Validators.required]],
        podaCorreccion: [false, []],
        podaFormacion: [false, []],

        //responsable:['', [Validators.required]],

        podaRealceR: [false, []],
        podaEstabilidadE: [false, []],
        podaMantenimientoM: [false, []],
        cortesNuevos: [false, []],
        cortesViejos: [false, []],
        cortesEnfermos: [false, []],
        podaRaices: [false, []],
        //estructurasCercanasTipoEmplazamiento: ['', [Validators.required]],
        limpieza: ['', [Validators.required]],
        podaSanitaria: ['', [Validators.required]],
        inmediataI: [false, []],
        cortoPlazoC: [false, []],
        largoPlazoL: [false, []],
        trasplante: [false, []],
        observacion: ['Ninguno', []],
        observacion2: ['Ninguno', []],
        estado: ['', []],
        idCensoArboreo: ['00000000-0000-0000-0000-000000000000', []],
        numeroArbolEnCampo: ['', []],
      });
    } else if (tipoActividad == 'Tala') {
      this.form = this.formbuilder.group({

        actor: ['', [Validators.required]],
        operador: ['', [Validators.required]],

        numAutorizationCdmb: ['', [Validators.required]],
        usoDeMadera: ['', [Validators.required]],
        expedicionPermiso: ['', [Validators.required]],

        //responsable:['', [Validators.required]],

        podaRealceR: [false, []],
        podaEstabilidadE: [false, []],
        podaMantenimientoM: [false, []],
        cortesNuevos: [false, []],
        cortesViejos: [false, []],
        cortesEnfermos: [false, []],
        podaRaices: [false, []],
        estructurasCercanasTipoEmplazamiento: ['', []],
        limpieza: ['', []],
        podaSanitaria: ['', []],
        inmediataI: [false, []],
        cortoPlazoC: [false, []],
        largoPlazoL: [false, []],
        trasplante: [false, []],
        observacion: ['Ninguno', []],
        observacion2: ['Ninguno', []],
        estado: ['', []],
        idCensoArboreo: ['00000000-0000-0000-0000-000000000000', []],
        numeroArbolEnCampo: ['', []],
      });
    }
}



  loadNgSelectData() {
    this.statusDetail = 'loading';
    this.detallesService.getByMaestra(MaestraDetalleCombo.Limpieza).subscribe(
      result => {
        this.limpiezaList = result.data
        this.statusDetail = 'init';
      }
    );
    this.detallesService.getByMaestra(MaestraDetalleCombo.PodaSanitaria).subscribe(
      result => {
        this.podaSanitariaList = result.data
        this.statusDetail = 'init';
      }
    );
    this.detallesService.getByMaestra(MaestraDetalleCombo.TipoEmplazamiento).subscribe(
      result => {
        this.tipoEmplazamientoList = result.data
        this.statusDetail = 'init';
      }
    );
  }
  public CambiarEstado(estado:number){

    let estadoEnum = this.numeroAEstado(estado);
    this.Actualizar(estadoEnum);
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

  Actualizar(nuevoEstado : Estado)
  {
    if(this.form.invalid)
    {
      this.form.markAllAsTouched();
      return;
    }
    this.form.value.estado = nuevoEstado;
    this.update.emit(this.form.value);
  }

  async mostrarConfirmacion() {
    const TitleUp = 'Cambiara el estado del actividadessilviculturales';
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
