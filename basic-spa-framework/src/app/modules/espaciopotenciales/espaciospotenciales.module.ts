import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EspaciosPotencialesRoutingModule } from './espaciospotenciales-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';

import { FormularioEspaciosPotencialesComponent } from './components/formulario-espaciospotenciales/formulario-espaciospotenciales.component';
import { ListaEspaciosPotencialesComponent } from './components/lista-espaciospotenciales/lista-espaciospotenciales.component';
import { EspaciosPotencialesComponent } from './containers/espaciospotenciales/espaciospotenciales.component';
import { NumberInputDirective } from 'src/app/core/directives/number-input.directive';
import { CargarManualEspaciosComponent } from '../censoarboreo/components/cargar-manual-espacios/cargar-manual-espacios.component';



@NgModule({
  declarations: [
    ListaEspaciosPotencialesComponent,
    FormularioEspaciosPotencialesComponent,
    EspaciosPotencialesComponent,
    CargarManualEspaciosComponent
    
  ],
  imports: [
    CommonModule,
    EspaciosPotencialesRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class EspaciosPotencialesModule { }
