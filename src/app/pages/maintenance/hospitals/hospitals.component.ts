import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchesService } from 'src/app/services/searches.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styles: [],
})
export class HospitalsComponent implements OnInit, OnDestroy {
  public hospitals: Hospital[] = [];
  public hospitalsTemp: Hospital[] = [];
  public loading: boolean = true;
  public imgSubs: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImageService: ModalImageService,
    private searchesService: SearchesService
  ) {}

  ngOnDestroy(): void {
    if (this.imgSubs) {
      this.imgSubs.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.loadHospitals();
    this.imgSubs = this.modalImageService.newImage
      .pipe(delay(500))
      .subscribe(() => this.loadHospitals());
  }

  loadHospitals() {
    this.loading = true;
    this.hospitalService.loadHospitals().subscribe({
      next: (hospitals) => {
        this.loading = false;
        this.hospitals = hospitals;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => console.log('loadHospitals complete'),
    });
  }

  saveChanges(hospital: Hospital) {
    this.hospitalService.updateHospital(hospital._id, hospital.name).subscribe({
      next: (resp) => {
        Swal.fire('Hospital updated', hospital.name, 'success');
      },
      error: (error) => console.log(error),
      complete: () => console.log('updateHospital completed'),
    });
  }

  deleteHospital(hospital: Hospital) {
    this.hospitalService.deleteHospital(hospital._id).subscribe({
      next: (resp) => {
        this.loadHospitals();
        Swal.fire('Hospital deleted', hospital.name, 'success');
      },
      error: (error) => console.log(error),
      complete: () => console.log('deleteHospital completed'),
    });
  }

  async openModal() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Create hospital',
      text: 'Insert the name of the new hospital',
      input: 'text',
      inputPlaceholder: "Hospital's name",
      showCancelButton: true,
    });
    if (value.trim().length > 0) {
      this.hospitalService.createHospital(value).subscribe({
        next: (resp: any) => {
          this.hospitals.push(resp.hospital);
        },
        error: (error) => console.log(error),
        complete: () => console.log('createHospital completed'),
      });
    }
  }

  openModalImage(hospital: Hospital) {
    this.modalImageService.openModal('hospitals', hospital._id, hospital.img);
  }

  search(term: string) {
    if (term.length === 0) {
      return this.loadHospitals();
    }
    this.searchesService.search('hospitals', term).subscribe({
      next: (results) => {
        this.hospitals = results;
      },
      error: (error) => console.log(error),
      complete: () => console.log('search complete'),
    });
  }
}
