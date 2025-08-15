import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImpresionCensoArboreoComponent } from './containers/impresioncensoarboreo/impresioncensoarboreo.component';
import { ListaCensoArboreoComponent } from './components/lista-censoarboreo/lista-censoarboreo.component';
import { CensoArboreoComponent } from './containers/censoarboreo/censoarboreo.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    component: ListaCensoArboreoComponent
  },
  {
    path: 'create',
    canActivate: [ AuthGuard ],
    component: CensoArboreoComponent
  },
  {
    path: 'edit/:id',
    canActivate: [ AuthGuard ],
    component: CensoArboreoComponent
  },
  {
    path: 'print/:id',
    canActivate: [ AuthGuard ],
    component: ImpresionCensoArboreoComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,
  ]
})
export class CensoArboreoRoutingModule { }
