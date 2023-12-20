import { Component } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styles: [],
})
export class ModalImageComponent {
  public imageToUpload: File;
  public imgTemp: any = null;

  constructor(
    public modalImageService: ModalImageService,
    public fileUploadService: FileUploadService
  ) {}

  closeModal() {
    this.imgTemp = null;
    this.modalImageService.closeModal();
  }

  changeImage(file: File) {
    this.imageToUpload = file;

    if (!file) {
      return (this.imgTemp = null);
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  uploadImage() {
    const id = this.modalImageService.id;
    const type = this.modalImageService.type;

    this.fileUploadService
      .updateImage(this.imageToUpload, type, id)
      .then((img) => {
        Swal.fire('Saved', 'Image changes were successfully saved', 'success');
        this.modalImageService.newImage.emit(img);
        this.closeModal();
      })
      .catch((err) => {
        console.log(err);
        Swal.fire('Error', 'An error uploading image has occurred', 'error');
      });
  }
}
