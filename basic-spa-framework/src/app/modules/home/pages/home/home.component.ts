import { Component } from '@angular/core';
import { CoordenadaDto } from 'src/app/core/models/censoarboreo-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { EsriMapService } from 'src/app/core/services/EsriMap.service';
import { CensoArboreoService } from 'src/app/core/services/censoarboreo.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericPredecesorSucesorTableDto } from 'src/app/core/models/generic-predecesor-sucesor-dto.model';
import { BasicTableService } from 'src/app/core/services/basictable.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  listaCoordenadas:CoordenadaDto[]=[];
  statusDetail: RequestStatus = 'init';
  faSpinner = faSpinner;
  form: FormGroup;

  Comunas:GenericPredecesorSucesorTableDto[];
  Barrios:GenericPredecesorSucesorTableDto[];


  constructor(private esriMapService: EsriMapService,
    private censoService: CensoArboreoService,
    private formbuilder: FormBuilder,
    private basicTableService: BasicTableService)
  {
    this.BuildForm();
    this.getComunas();
  }

  private BuildForm() {
    this.form = this.formbuilder.group({
      guadua: ['false', []],
      barrio: ['', []],
      comuna: ['', []],
    })
  }

  getComunas() {
    this.basicTableService.getByTable('Comuna').subscribe(
      result => {
        this.Comunas = result.data
      }
    );
  }

  getArbolesCiudad() {
    this.statusDetail = 'loading';
    this.esriMapService.resetMapView();
    this.censoService.getAllCoordenadas(this.field("comuna").get().value, this.field("barrio").get().value, this.field("guadua").get().value).subscribe(
      result => {
        this.listaCoordenadas = result.data
        this.listaCoordenadas.forEach(coord => {
          this.esriMapService.addPoint(coord.longitud, coord.latitud);
        });
        this.statusDetail = 'init';
      }
    );
  }

  changeLeagueOwner(event:any){
    if(!event)
    return;
    this.basicTableService.getByTableByIdPredecesor('Barrio',event.id).subscribe(
      result => {
        this.form.patchValue({ barrio: '' });
        this.Barrios = result.data;
      }
    );
  }


  async ngAfterViewInit() {
    await this.esriMapService.initializeMap('containerId'); // Asegúrate de pasar el ID correcto del contenedor
    this.esriMapService.resetMapView();
     //this.addAllPoints();
  }

  Imprimir(){
   this.esriMapService.captureMapAsPDF();
  }

  field(name: string) {
    return {
      get: () => {
        try {
          return this.form.get(name);
        } catch (error) {
          console.error('Error al obtener el campo:', error);
          return null; // O manejar el error de otra manera
        }
      },
      isValid: () => {
        try {
          const field = this.form.get(name);
          return field && field.touched && field.valid;
        } catch (error) {
          console.error('Error al verificar si el campo es válido:', error);
          return false; // O manejar el error de otra manera
        }
      }
    };
  }

  changeBasemap(event: Event) {
   this.esriMapService.changeBasemap(event);
  }

}




