import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent   {
  fileForm: FormGroup;
  selectedFile: File = null;
  @Output() fileUploaded= new EventEmitter();

  constructor(private formbuilder:FormBuilder) {
    this.fileForm = this.formbuilder.group({
      file: [null]
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
     this.selectedFile = event.target.files[0];
    }
  }

  uploadFile() {
    this.fileUploaded.emit(this.selectedFile);
  }
}
