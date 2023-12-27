import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styles: [],
})
export class DoctorComponent implements OnInit {
  public doctorForm: FormGroup;
  public hospitals: Hospital[];
  public selectedHospital: Hospital;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService
  ) {}

  ngOnInit(): void {
    this.doctorForm = this.fb.group({
      name: ['Sam', Validators.required],
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

  loadHospitals() {
    this.hospitalService.loadHospitals().subscribe({
      next: (hospitals: Hospital[]) => {
        this.hospitals = hospitals;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => console.log('loadHospitals complete'),
    });
  }

  saveDoctor() {
    console.log(this.doctorForm.value);
  }
}
