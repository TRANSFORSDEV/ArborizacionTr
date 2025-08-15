import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { CrossActividadesSilviculturalesDto } from 'src/app/core/models/cross-actividades-silviculturales-dto.model';
import { EsriMapService } from 'src/app/core/services/EsriMap.service';

import { CensoArboreoService } from 'src/app/core/services/censoarboreo.service';

@Component({
  selector: 'app-buscar-arbol-nocampo',
  templateUrl: './buscar-arbol-nocampo.component.html',
  styleUrls: ['./buscar-arbol-nocampo.component.scss'],
})
export class BuscarArbolNoCampoComponent implements OnInit {
  crossSilviculturales: CrossActividadesSilviculturalesDto[] =
    new Array<CrossActividadesSilviculturalesDto>();

    isActividadPlantulaBusqueda : boolean = false;

  @Input()
  set isActividadPlantula (param : boolean) {

    this.isActividadPlantulaBusqueda = param;
  };

  constructor (
    private formbuilder: FormBuilder,
    private service: CensoArboreoService,
    private esriMapService: EsriMapService
  ) {

  }

  ngOnInit(): void {
   this.ngAfterViewInit();
  }

  async ngAfterViewInit() {
    await this.esriMapService.initializeMap('containerId'); // Asegúrate de pasar el ID correcto del contenedor
    this.esriMapService.resetMapView();
     //this.addAllPoints();
  }

  Seleccionar(event) {

    let item = new CrossActividadesSilviculturalesDto();
    item.censoArboreoId = event.id;
    item.censoArboreo = event;
    item.numeroIndividuoId = event.numeroIndividuoId;
    item.numeroArbolCampo = (this.crossSilviculturales.length +1)+ "";
    this.crossSilviculturales.push(item);

    this.esriMapService.addPoint( item.censoArboreo.coordenada.longitud, item.censoArboreo.coordenada.latitud)
  }

  getCrossBuscarArbol(){
    return this.crossSilviculturales;
  }

  public isValid() : boolean {
    return this.crossSilviculturales.length == 0;
  }
}
