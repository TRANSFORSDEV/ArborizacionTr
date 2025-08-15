import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CensoArboreoDto } from 'src/app/core/models/censoarboreo-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { CensoArboreoService } from 'src/app/core/services/censoarboreo.service';
import { Habilitaracciones } from 'src/app/core/services/habilitaracciones.service';
import { faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import { MasreportesService } from 'src/app/core/services/masreportes-service';
import { GenericPredecesorSucesorTableDto } from 'src/app/core/models/generic-predecesor-sucesor-dto.model';
import { BasicTableService } from 'src/app/core/services/basictable.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-lista-censoArboreo',
  templateUrl: './lista-censoArboreo.component.html',
  styleUrls: ['./lista-censoArboreo.component.scss']
})
export class ListaCensoArboreoComponent implements OnInit {

  dataList: CensoArboreoDto[] = [];
  form: FormGroup;
  pageSize: number = 5;
  page: number = 1;
  sortField: string = "";
  sortOrder: number = -1;
  collectionSize: number = 1
  statusDetail: RequestStatus = 'init';
  mostrarCreate: boolean = false;
  faShareFromSquare = faShareFromSquare;

  Comunas: GenericPredecesorSucesorTableDto[];
  Barrios: GenericPredecesorSucesorTableDto[];

  mostraPrint: boolean = false;
  mostraList: boolean = false;
  constructor(private formbuilder: FormBuilder,
    private censoArboreoService: CensoArboreoService,
    private habilitaracciones: Habilitaracciones,
    private reporteServicio: MasreportesService,
    private basicTableService: BasicTableService,) {


  }

  ngOnInit(): void {

    this.BuildForm();
    this.getComunas();


    const resultados = this.habilitaracciones.MostrarBotones('Censo');

    if (resultados.length > 0) {
      resultados.forEach(resultado => {
        this.mostrarCreate = resultado.crear;
      });
    }
  }

  changeLeagueOwner(event: any) {
    if (!event)
      return;
    this.basicTableService.getByTableByIdPredecesor('Barrio', event.id).subscribe(
      result => {
        this.form.patchValue({ barrio: '' });
        this.Barrios = result.data;
      }
    );
  }

  getComunas() {
    this.basicTableService.getByTable('Comuna').subscribe(
      result => {
        this.Comunas = result.data
      }
    );
  }


  private BuildForm() {
    this.form = this.formbuilder.group({
      filter: ['', []],
      guadua: ['false', []],
      barrio: ['', []],
      comuna: ['', []],
      sinPlantulas: ['true', []],
    })


    this.form.valueChanges.pipe(
      debounceTime(500), // Espera 500ms después de cada cambio antes de continuar
      distinctUntilChanged(), // Continúa solo si el valor actual es diferente al último
      switchMap(values =>
        this.censoArboreoService.getFiltrado(this.field('filter').get().value, this.field('comuna').get().value, this.field('barrio').get().value,
          this.field("guadua").get().value, this.field("sinPlantulas").get().value, this.sortField, this.sortOrder, this.page, this.pageSize)
      ) // Llama a la API con los valores actuales del formulario
    ).subscribe(response => {
      this.dataList = response.data
      this.collectionSize = response.meta.totalCount;
      this.pageSize = response.meta.pageSize;

    });
  }


  refreshGrid(event) {
    debugger
    this.statusDetail = 'loading';
    this.page = event.first / event.rows + 1
    this.pageSize = event.rows;
    this.sortField = event.sortField;
    this.sortOrder = event.sortOrder;
    this.censoArboreoService.getFiltrado(this.field('filter').get().value, this.field('comuna').get().value, this.field('barrio').get().value,
      this.field("guadua").get().value, this.field("sinPlantulas").get().value, this.sortField, this.sortOrder, this.page, this.pageSize).subscribe(
        response => {
          this.dataList = response.data
          this.collectionSize = response.meta.totalCount;
          this.pageSize = response.meta.pageSize;
          this.statusDetail = 'init';
        }
      );
  }

  Descargar() {
    this.statusDetail = 'loading';
    console.log("descargar")
    this.censoArboreoService.getDescargas().subscribe(
      response => {

        this.downloadFile(response);
      },
      error => {
        console.error('Download error:', error);
        this.statusDetail = 'error';
      }
    );
  }




  private downloadFile(data: Blob) {
    const blob = new Blob([data], { type: 'text/csv; charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;

    // Obtener la fecha actual
    const currentDate = new Date();

    // Formatear la fecha. Puedes ajustar el formato según tus necesidades.
    // Por ejemplo: '2023-12-04'
    const formattedDate = currentDate.toISOString().split('T')[0];

    // Concatenar la fecha formateada con el nombre del archivo
    const filename = `censo_arboreo_${formattedDate}.csv`;

    anchor.download = filename;  // El nombre del archivo que se descargará.
    anchor.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
  }

  // En tu componente Angular
  descargarShapefileZip() {
    this.reporteServicio.getShapefileZip().subscribe(
      data => {

        // Obtener la fecha actual
        const currentDate = new Date();

        // Formatear la fecha. Puedes ajustar el formato según tus necesidades.
        // Por ejemplo: '2023-12-04'
        const formattedDate = currentDate.toISOString().split('T')[0];

        // Concatenar la fecha formateada con el nombre del archivo
        const filename = `censo_arboreo_shapefiles_${formattedDate}.zip`;

        this.downloadShapeFile(data, filename);
      },
      error => console.error('Error al descargar el archivo:', error)
    );
  }

  private downloadShapeFile(data: Blob, filename: string) {
    const blob = new Blob([data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    window.URL.revokeObjectURL(url);
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


}
