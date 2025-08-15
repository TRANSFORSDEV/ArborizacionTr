import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { ActividadesSilviculturalesRoutingModule } from './actividades-silviculturales-routing.module';
import { FormularioActividadesSilviculturalesComponent } from './components/formulario-actividadessilviculturales/formulario-actividadessilviculturales.component';
import { ListaActividadesSilviculturalesComponent } from './components/lista-actividadessilviculturales/lista-actividadessilviculturales.component';
import { ListaActividadesSilviculturalesPendientesComponent } from './components/lista-actividadessilviculturalespendientes/lista-actividadessilviculturalespendientes.component';
import { ProcesamientoActividadesSilviculturalesComponent } from './components/procesamiento-actividadessilviculturales/procesamiento-actividadessilviculturales.component';
import { ActividadesSilviculturalesComponent } from './containers/actividadessilviculturales/actividadessilviculturales.component';
import { ActividadesSilviculturalesProcesamientoComponent } from './containers/actividadessilviculturalesprocesamiento/actividades-silviculturalesprocesamiento.component';
import { CensoArboreoModule } from '../censoarboreo/censoarboreo.module';
import { BuscarArbolNoCampoComponent } from '../censoarboreo/components/buscar-arbol-nocampo/buscar-arbol-nocampo.component';

import { CargarManualActividadesComponent } from '../censoarboreo/components/cargar-manual-actividades/cargar-manual-actividades.component';
import { CargarManualActividadesPodaComponent } from '../censoarboreo/components/cargar-manual-poda/cargar-manual-poda';
import { CargarManualActividadesTalaComponent } from '../censoarboreo/components/cargar-manual-tala/cargar-manual-tala';
import { CargarManualActividadesSiembraComponent } from '../censoarboreo/components/cargar-manual-siembra/cargar-manual-siembra';


@NgModule({
  declarations: [
    ListaActividadesSilviculturalesComponent,
    ListaActividadesSilviculturalesPendientesComponent,
    FormularioActividadesSilviculturalesComponent,
    ActividadesSilviculturalesComponent,
    ActividadesSilviculturalesProcesamientoComponent,
    ProcesamientoActividadesSilviculturalesComponent,
    BuscarArbolNoCampoComponent,
    CargarManualActividadesComponent,
    CargarManualActividadesPodaComponent,
    CargarManualActividadesTalaComponent,
    CargarManualActividadesSiembraComponent
  ],
  imports: [
    CommonModule,
    ActividadesSilviculturalesRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    CensoArboreoModule
  ],
  exports : [BuscarArbolNoCampoComponent]
})
export class ActividadesSilviculturalesModule { }
