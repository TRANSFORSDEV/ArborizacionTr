import { Component,  Input, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoordenadaDto } from 'src/app/core/models/censoarboreo-dto.model';
import proj4 from 'proj4';

import { RequestStatus } from 'src/app/core/models/request-status.model';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';

@Component({
  selector: 'app-coordenada-xy',
  templateUrl: './coordenada.component.html',
  styleUrls: ['./coordenada.component.scss'],
})
export class CoordenadaComponent implements OnInit {
  statusDetail: RequestStatus = 'init';
  form: FormGroup;
  isNew: boolean = false;
  userNameRequired: boolean = false;
  passwordRequired: boolean = false;
  detalle: CoordenadaDto;
  @Input()
  set dataForm(data: CoordenadaDto) {
    if (data) {
      this.isNew = false;
      this.form.patchValue(data);
      this.form.markAllAsTouched();
      this.detalle = data;
    } else {
      this.isNew = true;
    }
  }
  @Input()
  set status(data: RequestStatus) {
    if (data) {
      this.statusDetail = data;
    }
  }

  constructor(
    private formbuilder: FormBuilder,
    private sweetAlertService: SweetAlertService
  ) {
    this.BuildForm();
  }

  ngOnInit(): void {}

  private BuildForm() {
    this.form = this.formbuilder.group({
      latitud: ['', [Validators.required]],
      longitud: ['', [Validators.required]],
      altitud: ['0', []],
      norte: ['0', []],
      este: ['0', []],
      oeste:['0', []],
    });
  }

  public getFormValue() {

    let values = { ...this.form.value };
    values['id'] = this.detalle.id;
    return values;
  }

  selected(event)
  {
    const utmCoordinates = this.convertToUTM(event.lat, event.lng);

    this.form.patchValue({latitud: event.lat});
    this.form.patchValue({longitud: event.lng});
    this.form.patchValue({altitud: event.elevation});
    this.form.patchValue({norte: utmCoordinates.north.toFixed(2)});
    this.form.patchValue({este: utmCoordinates.east.toFixed(2)});
  }

  get isFormInValid() {
    return this.form.invalid && this.form.touched;
  }

  field(name: string) {
    return {
      get: () => this.form.get(name),
      isValid: () => this.form.get(name).touched && this.form.get(name).valid,
    };
  }

  // Función para convertir latitud y longitud a coordenadas UTM
 convertToUTM(lat, lon) {
  // Definir las proyecciones
  const WGS84 = "WGS84";
  const UTM = `+proj=utm +zone=${this.calculateUTMZone(lon)} +datum=WGS84`; // Calcula la zona UTM basada en la longitud

  // Convertir coordenadas
  const [east, north] = proj4(WGS84, UTM, [lon, lat]);

  return { east, north };
}

// Función para calcular la zona UTM basada en la longitud
 calculateUTMZone(longitude) {
  return Math.floor((longitude + 180) / 6) + 1;
}

}
