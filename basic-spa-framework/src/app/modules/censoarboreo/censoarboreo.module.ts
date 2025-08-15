import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CensoArboreoRoutingModule } from './censoarboreo-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';

import { FormularioCensoArboreoComponent } from './components/formulario-censoarboreo/formulario-censoarboreo.component';
import { ListaCensoArboreoComponent } from './components/lista-censoarboreo/lista-censoarboreo.component';
import { CensoArboreoComponent } from './containers/censoarboreo/censoarboreo.component';
import { ImpresionCensoArboreoComponent } from './containers/impresioncensoarboreo/impresioncensoarboreo.component';
import { NumberInputDirective } from 'src/app/core/directives/number-input.directive';
import { BuscarArbolComponent } from './components/buscar-arbol/buscar-arbol.component';
import { CargarManualComponent } from './components/cargar-manual/cargar-manual.component';
import { ImpresionfCensoArboreoComponent } from './components/impresion-censoarboreo/impresion-censoarboreo.component';


@NgModule({
  declarations: [
    ListaCensoArboreoComponent,
    FormularioCensoArboreoComponent,
    CensoArboreoComponent,
    BuscarArbolComponent,
    CargarManualComponent,
    ImpresionfCensoArboreoComponent,
    ImpresionCensoArboreoComponent
  ],
  imports: [
    CommonModule,
    CensoArboreoRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports:[BuscarArbolComponent]
})
export class CensoArboreoModule { }
