import { ReportesComponent } from './pages/reportes/reportes.component';
import { MasReportesComponent } from './pages/masreportes/masreportes.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    component: ReportesComponent
  },
  {
  path: 'masreportes',
  canActivate: [ AuthGuard ],
  component: MasReportesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
