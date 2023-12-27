import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchesService } from 'src/app/services/searches.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styles: [],
})
export class DoctorsComponent implements OnInit, OnDestroy {
  public loading: boolean = true;
  public doctors: Doctor[] = [];
  public imgSubs: Subscription;

  constructor(
    private doctorService: DoctorService,
    private modalImageService: ModalImageService,
    private searchesService: SearchesService
  ) {}

  ngOnDestroy(): void {
    if (this.imgSubs) {
      this.imgSubs.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.imgSubs = this.modalImageService.newImage
      .pipe(delay(500))
      .subscribe(() => this.loadDoctors());
  }

  loadDoctors() {
    this.loading = true;
    this.doctorService.loadDoctors().subscribe({
      next: (doctors) => {
        this.loading = false;
        this.doctors = doctors;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => console.log('loadDoctors complete'),
    });
  }

  deleteDoctor(doctor: Doctor) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are going to delete ${doctor.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.doctorService.deleteDoctor(doctor._id).subscribe({
          next: (resp) => {
            Swal.fire(
              'User deleted',
              `${doctor.name} was successfully deleted`,
              'success'
            ),
              this.loadDoctors();
          },
          error: (error) => console.log(error),
          complete: () => console.log('deleteDoctor completed'),
        });
      }
    });
  }

  openModalImage(doctor: Doctor) {
    this.modalImageService.openModal('doctors', doctor._id, doctor.img);
  }

  search(term: string) {
    if (term.length === 0) {
      return this.loadDoctors();
    }
    this.searchesService.search('doctors', term).subscribe({
      next: (results) => {
        this.doctors = results;
      },
      error: (error) => console.log(error),
      complete: () => console.log('search complete'),
    });
  }
}
