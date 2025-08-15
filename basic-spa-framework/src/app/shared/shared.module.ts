import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { CustomIconsComponent } from './components/custom-icons/custom-icons.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalComponent } from './components/modal/modal.component';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CoordenadaComponent } from '../modules/sharedcomponent/coordenada/coordenada.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NumberInputDirective } from '../core/directives/number-input.directive';
import { ImageCropperModule } from 'ngx-image-cropper';
import { EsriMapComponent } from './components/esri-map/esri-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { EsriMapSelectorComponent } from './components/esri-map-selector/esri-map-selector.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LineasComponent } from './components/lineas/lineas.component';
import { RegistroFotograficoComponent } from '../modules/sharedcomponent/registrofotografico/registrofotografico.component';
import { ObligatorioComponent } from './components/obligatorio/obligatorio.component';




@NgModule({
  declarations: [ButtonComponent,
    CustomIconsComponent, ModalComponent, CoordenadaComponent,
    RegistroFotograficoComponent ,NumberInputDirective,  EsriMapComponent,  EsriMapSelectorComponent, FileUploadComponent, LineasComponent, ObligatorioComponent ],
  imports: [CommonModule, FontAwesomeModule, TableModule, PaginatorModule, ReactiveFormsModule, LeafletModule ,ImageCropperModule, NgSelectModule],
  exports:[ButtonComponent,LineasComponent,  ObligatorioComponent, CustomIconsComponent, CoordenadaComponent, RegistroFotograficoComponent, ModalComponent, TableModule,
    PaginatorModule, NumberInputDirective, EsriMapComponent,  EsriMapSelectorComponent, FileUploadComponent, NgSelectModule]
})
export class SharedModule { }
