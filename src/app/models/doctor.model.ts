import { Hospital } from './hospital.model';

interface _DoctorUser {
  _id: string;
  name: string;
  img: string;
}

export class Doctor {
  constructor(
    public name: string,
    public hospital?: Hospital,
    public _id?: string,
    public user?: _DoctorUser,
    public img?: string
  ) {}
}
