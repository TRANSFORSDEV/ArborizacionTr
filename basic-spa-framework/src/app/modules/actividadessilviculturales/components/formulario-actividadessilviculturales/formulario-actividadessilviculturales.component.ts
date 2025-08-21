import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ActividadesSilviculturalesDto, Estado } from 'src/app/core/models/actividadessilviculturales-dto.model';
import { CensoArboreoDto, RegistroFotograficoCensoDto } from 'src/app/core/models/censoarboreo-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { UserDto } from 'src/app/core/models/user-dto.model';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { BuscarArbolNoCampoComponent } from 'src/app/modules/censoarboreo/components/buscar-arbol-nocampo/buscar-arbol-nocampo.component';
import { RegistroFotograficoComponent } from 'src/app/modules/sharedcomponent/registrofotografico/registrofotografico.component';

import {Habilitaracciones } from 'src/app/core/services/habilitaracciones.service';
import { DetalleService } from 'src/app/core/services/detalle.service';
import { MaestraDetalleCombo } from 'src/app/core/models/maestradetalle.mode';
import { DetalleDto } from 'src/app/core/models/detalle-dto.model';
@Component({
  selector: 'app-formulario-actividadesSilviculturales',
  templateUrl: './formulario-actividadesSilviculturales.component.html',
  styleUrls: ['./formulario-actividadesSilviculturales.component.scss'],
})
export class FormularioActividadesSilviculturalesComponent implements OnInit {
  statusDetail: RequestStatus = 'init';
  form: FormGroup;
  isNew: boolean = false;
  userNameRequired: boolean = false;
  passwordRequired: boolean = false;
  actividadessilviculturalesDto: ActividadesSilviculturalesDto;
  individuoSeleccionado: CensoArboreoDto = null;
  mostraUpdate: boolean = false;
  mostraDelete: boolean = false;
  isMultipleMode: boolean = false;
  tipoActividad: string = '';

  isSiembra: boolean = false;
  isPoda: boolean = false;
  isTala: boolean = false;

  isActividadPlantulaBusqueda : boolean = false;

  limpiezaList : DetalleDto[];
  podaSanitariaList : DetalleDto[];
  tipoEmplazamientoList : DetalleDto[];

  onlyRegistroFotograficoAntes: RegistroFotograficoCensoDto[] =
    new Array<RegistroFotograficoCensoDto>();

  onlyRegistroFotograficoDurante: RegistroFotograficoCensoDto[] =
    new Array<RegistroFotograficoCensoDto>();

  onlyRegistroFotograficoDespues: RegistroFotograficoCensoDto[] =
    new Array<RegistroFotograficoCensoDto>();

    ClassFormGroup: string = "";
    //ClassFormGroup: string = "borde-rojo";

  @ViewChild('buscarArbolLista')
  buscarArbolLista: BuscarArbolNoCampoComponent;

  @ViewChild('registroFotograficoAntes')
  registroFotograficoAntes: RegistroFotograficoComponent;

  @ViewChild('registroFotograficoDurante')
  registroFotograficoDurante: RegistroFotograficoComponent;

  @ViewChild('registroFotograficoDespues')
  registroFotograficoDespues: RegistroFotograficoComponent;

  @Input()
  set dataForm(data: ActividadesSilviculturalesDto) {
    console.log(data);
    if (data) {
      this.isNew = false;

      this.form.patchValue(data);

      if (data.nuevaIntervencion) {
        const fechaCorteString = formatDate(
          data.nuevaIntervencion,
          'yyyy-MM-dd',
          'en-US'
        );
        this.form.patchValue({ nuevaIntervencion: fechaCorteString });
      }

      if (data.expedicionPermiso) {
        const fechaCorteString = formatDate(
          data.expedicionPermiso,
          'yyyy-MM-dd',
          'en-US'
        );
        this.form.patchValue({ expedicionPermiso: fechaCorteString });
      }

      let estadoLocal = Number(data.estado);
      let estadoString = this.translateStateIntToString(estadoLocal);
      if(estadoLocal != 0) {
        this.ClassFormGroup = "disabled-div";
      }
      this.form.patchValue({ estado: estadoString });
      this.form.markAllAsTouched();
      this.actividadessilviculturalesDto = data;

      let fotosAntes = new RegistroFotograficoCensoDto();
      fotosAntes.nombre = data.fotoAntes;
      this.onlyRegistroFotograficoAntes.push(fotosAntes);

      
      debugger;
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
      this.form.patchValue({ estado: Estado.Solicitada.toString() });
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
    private habilitaracciones: Habilitaracciones,
    private sweetAlertService: SweetAlertService,
    private activatedRoute: ActivatedRoute,
    private detallesService: DetalleService,
  ) {
    this.loadNgSelectData();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.tipoActividad = params['tipoActividad'];

      if (this.tipoActividad) {
        if (this.tipoActividad == 'Siembra') {
          this.isSiembra = true;
          this.isActividadPlantulaBusqueda = true;
        } else if (this.tipoActividad == 'Poda') {
          this.isPoda = true;
          
        } else if (this.tipoActividad == 'Tala') {
          this.isTala = true;
        }
        this.BuildForm(this.tipoActividad);
      }
    });
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


  ngOnInit(): void {
    const resultados = this.habilitaracciones.MostrarBotones('Actividades');

    if (resultados.length > 0) {
      resultados.forEach((resultado) => {
        this.mostraDelete = resultado.eliminar;
        this.mostraUpdate = resultado.editar;
      });
    }
  }

  /*selected(individuo)
  {
    this.individuoSeleccionado = individuo;
    this.form.patchValue({idCensoArboreo: individuo.id});
  }*/

  private BuildForm(tipoActividad: string) {
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
        observacion: ['', [Validators.required]],
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
        observacion: ['', [Validators.required]],
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

        responsable:['', [Validators.required]],

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
        observacion: ['', [Validators.required]],
        estado: ['', []],
        idCensoArboreo: ['00000000-0000-0000-0000-000000000000', []],
        numeroArbolEnCampo: ['', []],
      });
    }
  }
  async mostrarNecesitaImagenes( text : string ) {
    const TitleUp = 'Antes de guardar';
    const TitleDonw = 'Debe seleccionar al menos una imagen de '+ text;
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

  Guardar() {
    debugger;
    if (
      this.form.invalid ||
      this.buscarArbolLista.getCrossBuscarArbol().length == 0
    ) {
      this.form.markAllAsTouched();
      return;
    }

   /*  if(!this.registroFotograficoAntes.isValid() || !this.registroFotograficoDurante.isValid() || !this.registroFotograficoDespues.isValid()) {
      let text = "";
      if(!this.registroFotograficoAntes.isValid()){
        text = text + " antes, "
      }
      if(!this.registroFotograficoDurante.isValid()){
        text = text + "durante, "
      }
      if(!this.registroFotograficoDespues.isValid()){
        text = text + "despues, "
      }
      text = text.substring(0,text.length - 2);
      this.mostrarNecesitaImagenes(text);
      return;
    } */
    

    ///%%%%%%%%%
    this.form.value['isSiembra'] = this.isSiembra;
    this.form.value['isPoda'] = this.isPoda;
    this.form.value['isTala'] = this.isTala;

    

    const formData = new FormData();

    const filesAntes = this.registroFotograficoAntes.getFilesLoaded();
    for (let i = 0; i < filesAntes.length; i++) {
      formData.append('files', filesAntes[i]);
    }

    const filesDurante = this.registroFotograficoDurante.getFilesLoaded();
    for (let i = 0; i < filesDurante.length; i++) {
      formData.append('files', filesDurante[i]);
    }

    const filesDespues = this.registroFotograficoDespues.getFilesLoaded();
    for (let i = 0; i < filesDespues.length; i++) {
      formData.append('files', filesDespues[i]);
    }


    let whichOne: string[] = new Array<string>();
    let rotationAntes = this.registroFotograficoAntes.getRotationLoaded();
    if(rotationAntes.rotation.length != 0) {
      whichOne.push("FotoAntes");
    }

    let rotationDurante = this.registroFotograficoDurante.getRotationLoaded();
    debugger;
    if(rotationDurante.rotation.length != 0) {
      rotationAntes.rotation.push(rotationDurante.rotation[0]);
      whichOne.push("FotoDuranteUno");
      if(rotationDurante.rotation.length > 1) {
        rotationAntes.rotation.push(rotationDurante.rotation[1]);
        whichOne.push("FotoDuranteDos");
      }
    }


    let rotationDespues = this.registroFotograficoDespues.getRotationLoaded();
    if(rotationDespues.rotation.length != 0){
      whichOne.push("FotoDespues");
      rotationAntes.rotation.push(rotationDespues.rotation[0]);
    }

    let infoFotos = {
      'rotation'  : rotationAntes.rotation,
      'destino' : whichOne
    };
    formData.append('fullobject', JSON.stringify(this.form.value));
    formData.append('infofotos', JSON.stringify(infoFotos));
    formData.append(
      'multi',
      JSON.stringify(this.buscarArbolLista.getCrossBuscarArbol())
    );
    formData.append('skip', JSON.stringify(false));

    this.create.emit(formData);
  }

  Actualizar() {
    

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
/* 
    if(!this.registroFotograficoAntes.isValid() || !this.registroFotograficoDurante.isValid() || !this.registroFotograficoDespues.isValid()){

      let text = "";
      if(!this.registroFotograficoAntes.isValid() && this.registroFotograficoAntes.getCurrentFotos().length == 0){
        text = text + " antes, "
      }
      if(!this.registroFotograficoDurante.isValid() && this.registroFotograficoDurante.getCurrentFotos().length == 0){
        text = text + "durante, "
      }
      if(!this.registroFotograficoDespues.isValid() && this.registroFotograficoDespues.getCurrentFotos().length == 0){
        text = text + "despues, "
      }

      if(text.length != 0){
        this.mostrarNecesitaImagenes(text.substring(0,text.length-2));
        return
      }
    } */

    

    this.form.value['isSiembra'] = this.isSiembra;
    this.form.value['isPoda'] = this.isPoda;
    this.form.value['isTala'] = this.isTala;

    

    const formData = new FormData();

    const filesAntes = this.registroFotograficoAntes.getFilesLoaded();
    for (let i = 0; i < filesAntes.length; i++) {
      formData.append('files', filesAntes[i]);
    }

    const filesDurante = this.registroFotograficoDurante.getFilesLoaded();
    for (let i = 0; i < filesDurante.length; i++) {
      formData.append('files', filesDurante[i]);
    }

    const filesDespues = this.registroFotograficoDespues.getFilesLoaded();
    for (let i = 0; i < filesDespues.length; i++) {
      formData.append('files', filesDespues[i]);
    }


    let whichOne: string[] = new Array<string>();
    let rotationAntes = this.registroFotograficoAntes.getRotationLoaded();

    debugger;
    if(this.registroFotograficoAntes.getCurrentFotos().length == 0) {
      this.form["fotoAntes"] = null;
    } else {
      this.form.value["fotoAntes"] = this.actividadessilviculturalesDto.fotoAntes;
      
    }

    if(rotationAntes.rotation.length != 0) {
      whichOne.push("FotoAntes");
    }

    let rotationDurante = this.registroFotograficoDurante.getRotationLoaded();


    if(this.registroFotograficoDurante.getCurrentFotos().length == 0) {
      this.form["fotoDuranteUno"] = null;
      this.form["fotoDuranteDos"] = null;
    } else {
      if(this.registroFotograficoDurante.getCurrentFotos().length == 1) {
        this.form.value["fotoDuranteUno"] = this.actividadessilviculturalesDto.fotoDuranteUno;
        this.form.value["fotoDuranteDos"] = null;
      } else {
        this.form.value["fotoDuranteUno"] = this.actividadessilviculturalesDto.fotoDuranteUno;
        this.form.value["fotoDuranteDos"] = this.actividadessilviculturalesDto.fotoDuranteDos;
      }
    }

    
    if(rotationDurante.rotation.length != 0) {
      rotationAntes.rotation.push(rotationDurante.rotation[0]);
      whichOne.push("FotoDuranteUno");
      if(rotationDurante.rotation.length > 1) {
        rotationAntes.rotation.push(rotationDurante.rotation[1]);
        whichOne.push("FotoDuranteDos");
      }
    }


    let rotationDespues = this.registroFotograficoDespues.getRotationLoaded();

    if(this.registroFotograficoDespues.getCurrentFotos().length == 0) {
      this.form.value["fotoDespues"] = null;
    } else {
      this.form.value["fotoDespues"] = this.actividadessilviculturalesDto.fotoDespues;
    }

    if(rotationDespues.rotation.length != 0){
      whichOne.push("FotoDespues");
      rotationAntes.rotation.push(rotationDespues.rotation[0]);
    }



    let infoFotos = {
      'rotation'  : rotationAntes.rotation,
      'destino' : whichOne
    };

    formData.append('fullobject', JSON.stringify(this.form.value));
    formData.append('infofotos', JSON.stringify(infoFotos));
    //formData.append('multi', JSON.stringify(this.buscarArbolLista.getCrossBuscarArbol()));   

    this.update.emit(formData);
  }

  async mostrarConfirmacion() {
    const TitleUp = 'Cambiara el estado del actividadessilviculturales';
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
