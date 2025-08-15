//import { LecturasComponent } from './../../containers/lecturas/lecturas.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { CensoArboreoService } from 'src/app/core/services/censoarboreo.service';
import { EspaciosPotencialesService } from 'src/app/core/services/espaciospotenciales.service';

@Component({
  selector: 'app-cargar-manual-espacios',
  templateUrl: './cargar-manual-espacios.component.html',
  styleUrls: ['./cargar-manual-espacios.component.scss']
})
export class CargarManualEspaciosComponent {

  form:FormGroup;
  selectedFile: File = null;
  statusDetail: RequestStatus = 'init';
  @Output() cargarLecturasEvent= new EventEmitter();

  constructor(private formbuilder:FormBuilder,
    private service: EspaciosPotencialesService){
    this.BuildForm();
  }



  cargarArchivo()
  {
    if(this.form.invalid)
    {
      this.form.markAllAsTouched();
      return;
    }

    this.statusDetail = "loading";
    const fd = new FormData();
    fd.append('File', this.selectedFile, this.selectedFile.name);

    this.service.uploadFile(fd,this.selectedFile.size).subscribe(
      (res) => {
        //console.log(res);
        this.statusDetail = "success";
      },
      (err) => {
        //console.log(err);
        this.statusDetail = "error";
      }
    );
  }

  /*Codigo para Modal*/
  @Input() showModal: boolean = false;

  toggleModal()
  {
    this.showModal = !this.showModal;
  }

  cerrarModal(data)
  {
    this.showModal = data;
  }
  /* Fin Codigo para Modal*/

  get isFormInValid() {
    return this.form.invalid && this.form.touched;
  }

  private BuildForm(){
    this.form = this.formbuilder.group({
    })
  }

  onFileUploaded(file: File) {
    this.selectedFile = file;
  }
}
