import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ListaActividadesSilviculturalesComponent } from './components/lista-actividadessilviculturales/lista-actividadessilviculturales.component';
import { ActividadesSilviculturalesComponent } from './containers/actividadessilviculturales/actividadessilviculturales.component';
import { ListaActividadesSilviculturalesPendientesComponent } from './components/lista-actividadessilviculturalespendientes/lista-actividadessilviculturalespendientes.component';
import { ActividadesSilviculturalesProcesamientoComponent } from './containers/actividadessilviculturalesprocesamiento/actividades-silviculturalesprocesamiento.component';





const routes: Routes = [
  {
    path: 'lista/:tipoActividad',
    canActivate: [ AuthGuard ],
    component: ListaActividadesSilviculturalesComponent
  },
  {
    path: 'intervenciones/:type',
    canActivate: [ AuthGuard ],
    component: ListaActividadesSilviculturalesPendientesComponent
  },
  {
    path: 'procesar/:tipoActividad/:id',
    canActivate: [ AuthGuard ],
    component: ActividadesSilviculturalesProcesamientoComponent
  },


  {
    path: 'create/:tipoActividad',
    canActivate: [ AuthGuard ],
    component: ActividadesSilviculturalesComponent
  },
  {
    path: 'edit/:tipoActividad/:id',
    canActivate: [ AuthGuard ],
    component: ActividadesSilviculturalesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,
  ]
})
export class ActividadesSilviculturalesRoutingModule { }
