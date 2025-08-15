import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasreportesService } from 'src/app/core/services/masreportes-service';
import { Habilitaracciones } from 'src/app/core/services/habilitaracciones.service';
import { CensoArboreoService } from 'src/app/core/services/censoarboreo.service';


@Component({
  selector: 'app-masreportes',
  templateUrl: './masreportes.component.html',
  styleUrls: ['./masreportes.component.scss']
})
export class MasReportesComponent implements OnInit {
  form: FormGroup;

  constructor(private formbuilder: FormBuilder,
    private masreportesService: MasreportesService,
    private censoArboreoService: CensoArboreoService,
    private habilitaracciones: Habilitaracciones) {
  }

  ngOnInit(): void {
    this.BuildForm();
  }

  private BuildForm() {

    this.form = this.formbuilder.group({
      guadua: ['false'],
      desde: [''],
      hasta: [''],
      filter: [''],
      selectedReportType: ['1']
    });
  }

  Descargar() {

    if(this.field("selectedReportType").get().value=="5")
    {
      this.DescargarCensoCSV();
    }
    else if (this.field("selectedReportType").get().value=="6")
    {

    }
    else
    {
      this.DescargarReportesXls();
    }
  }

  DescargarCensoCSV() {
    console.log("descargar")
    this.censoArboreoService.getDescargasCSV(this.form.value).subscribe(
      response => {
        this.downloadFileCensoCSV(response);
      },
      error => {
        console.error('Download error:', error);
      }
    );
  }

  private downloadFileCensoCSV(data: Blob) {
    const blob = new Blob([data], { type: 'text/csv; charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'censo_arboreo.csv';  // El nombre del archivo que se descargará.
    anchor.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
  }



  DescargarReportesXls() {
    console.log(this.form.value)
    this.masreportesService.getDescargas(this.form.value).subscribe(
      response => {
        this.downloadFileReportes(response);
      },
      error => {
        console.error('Download error:', error);
      }
    );

  }

  private downloadFileReportes(data: Blob) {
    const blob = new Blob([data], { type: 'text/csv; charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    var ruta = ''
    if (+this.field("selectedReportType").get().value == 1) {
      ruta = 'actividades_silviculturales_siembra.xlsx'
    } else {
      if (+this.field("selectedReportType").get().value == 2) {
        ruta = 'actividades_silviculturales_poda.xlsx'
      } else {
        if (+this.field("selectedReportType").get().value == 3) {
          ruta = 'actividades_silviculturales_tala.xlsx'
        } else {
          if (+this.field("selectedReportType").get().value == 4) {
            ruta = 'censo_shape.zip'
          }
        }
      }

    }
    anchor.download = ruta;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  field(name: string) {
    return {
      get: () => this.form.get(name),
      isValid: () => this.form.get(name).touched && this.form.get(name).valid
    };
  }

}
