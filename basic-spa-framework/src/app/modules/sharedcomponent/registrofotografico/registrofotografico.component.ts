import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faXmarkSquare,faArrowLeftRotate,faArrowRightRotate } from '@fortawesome/free-solid-svg-icons';
import { RegistroFotograficoBaseDto } from 'src/app/core/models/censoarboreo-dto.model';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registrofotografico',
  templateUrl: './registrofotografico.component.html',
  styleUrls: ['./registrofotografico.component.scss']
})
export class RegistroFotograficoComponent implements OnInit {

  imagesUrl = environment.API_URL+"/api/images/";
  multipleMode  :boolean = true;
  images: { src: string | ArrayBuffer | null, file: File, rotation: number }[] = [];
  statusDetail: RequestStatus = 'init';
  form:FormGroup;
  cantidadFotos : number = 99999;
  isNew:boolean = false;
  userNameRequired:boolean = false;
  passwordRequired:boolean = false;
  fotos : RegistroFotograficoBaseDto[];
  faXmarkSquare = faXmarkSquare;
  faArrowLeftRotate=faArrowLeftRotate;
  faArrowRightRotate=faArrowRightRotate;

  @Input()
  set multiple (mul : boolean) {

    this.multipleMode = mul;
  };

  @Input()
  set maxFotos (cant : number) {
    
    if(cant==0){
      cant = 9999;
    }
    this.cantidadFotos = cant;
  };

  @Input()
  set dataForm(data : RegistroFotograficoBaseDto[])
  {

    console.log(data)
    if(data)
    {
      this.isNew = false;
      this.form.patchValue(data);
      this.form.markAllAsTouched();
      this.fotos = data;
    } else {
      this.isNew = true;
    }
  };
  @Input()
  set status(data:RequestStatus)
  {
    if(data)
    {
      this.statusDetail = data;
    }
  };



  constructor( private formbuilder:FormBuilder,
    private sweetAlertService: SweetAlertService

  ){
      this.BuildForm();
  }

  ngOnInit(): void {

  }



  onFilesSelected(event: any): void {
    const selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {

          this.images.push({ src: e.target.result, file, rotation: 0 });
          if(this.images.length > (this.cantidadFotos) ) {
            this.images.splice(0,1);
          }
        };
        reader.readAsDataURL(file);
      }

      if(!this.multipleMode) {
        this.fotos.splice(0,1);

        if(this.images.length >= 1 ) {
          this.images.splice(0,1);
        }
        break;

      } else {

        this.fotos.splice(0,1);

        if(this.images.length >= (this.cantidadFotos) ) {
          this.images.splice(0,1);
        }

        /*if(this.cantidadFotos <= (i+1 ) ){
          return;
        }*/
      }
    }
  }
  rotateImage(index: number, angle: number): void {
    const image = this.images[index];
    if (image.file) {
      if (!image.hasOwnProperty('rotation')) {
        image['rotation'] = 0;
      }
      image['rotation'] += angle;
    }
  }
  removeImage(index: number): void {

    this.images.splice(index, 1);

  }

  public removeImageSaved(index: number): void {
    this.fotos.splice(index, 1);
  }

  getCurrentFotos() {
    return this.fotos;
  }

  isValid(){
    const files: File[] = this.images.map(image => image.file)
    return files.length > 0
  }
  getFilesLoaded  (): File[] {
    const files: File[] = this.images.map(image => image.file)
    return files;
  }

  getRotationLoaded  (): any  {
    const rotation: number[] = this.images.map(image => image.rotation);
    return { 'rotation' : rotation};
  }



  private BuildForm() {

    this.form = this.formbuilder.group({
      x:['', [Validators.required]],
      y:['', [Validators.required]]
    })
  }


  public getFormValue(){
    return this.form.value;
  }

  get isFormInValid() {
    return this.form.invalid && this.form.touched;
  }

  field(name: string) {
      return {
          get: () => this.form.get(name),
          isValid: () => this.form.get(name).touched && this.form.get(name).valid
      };
  }

}
