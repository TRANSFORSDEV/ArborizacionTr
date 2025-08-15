import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ListaBasicTableComponent } from './components/lista-basic-table/lista-basic-table.component';
import { BasicTableComponent } from './containers/basic-table/basic-table.component';

const routes: Routes = [
  {
    path: ':tabla',
    canActivate: [ AuthGuard ],
    component: ListaBasicTableComponent
  },
  {
    path: 'create/:tabla',
    canActivate: [ AuthGuard ],
    component: BasicTableComponent
  },
  {
    path: 'edit/:tabla/:id',
    canActivate: [ AuthGuard ],
    component: BasicTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,
  ]
})
export class BasicTableRoutingModule { }
