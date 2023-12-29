import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';
import { Doctor } from 'src/app/models/doctor.model';
import { Hospital } from 'src/app/models/hospital.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { HospitalService } from 'src/app/services/hospital.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styles: [],
})
export class DoctorComponent implements OnInit {
  public doctorForm: FormGroup;
  public hospitals: Hospital[];
  public selectedDoctor: Doctor;
  public selectedHospital: Hospital;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private doctorService: DoctorService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.loadDoctor(id);
    });
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      hospital: ['', Validators.required],
    });
    this.loadHospitals();
    this.doctorForm.get('hospital').valueChanges.subscribe({
      next: (hospitalId) => {
        this.selectedHospital = this.hospitals.find(
          (h) => h._id === hospitalId
        );
      },
    });
  }

  loadDoctor(id: string) {
    if (id === 'new') {
      return;
    }
    this.doctorService
      .getDoctorById(id)
      .pipe(delay(100))
      .subscribe((doctor: any) => {
        if (!doctor) {
          return this.router.navigateByUrl(`/dashboard/doctors`);
        }
        const {
          name,
          hospital: { _id },
        } = doctor;
        this.selectedDoctor = doctor;
        this.doctorForm.setValue({ name, hospital: _id });
      });
  }

  loadHospitals() {
    this.hospitalService.loadHospitals().subscribe({
      next: (hospitals: Hospital[]) => {
        this.hospitals = hospitals;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }

  saveDoctor() {
    const { name } = this.doctorForm.value;

    if (this.selectedDoctor) {
      const data = {
        ...this.doctorForm.value,
        _id: this.selectedDoctor._id,
      };
      this.doctorService.updateDoctor(data).subscribe((resp) => {
        Swal.fire('Updated', `${name} successfully updated`, 'success');
      });
    } else {
      this.doctorService.createDoctor(this.doctorForm.value).subscribe({
        next: (resp: any) => {
          Swal.fire('Created', `${name} successfully created`, 'success');
          this.router.navigateByUrl(`/dashboard/doctor/${resp.doctor._id}`);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
    }
  }
}
