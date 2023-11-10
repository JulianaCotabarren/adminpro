import { Component } from '@angular/core';

@Component({
  selector: 'app-graphic1',
  templateUrl: './graphic1.component.html',
  styles: [],
})
export class Graphic1Component {
  labels1: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  labels2: string[] = ['xxx', 'yyy', 'zzz'];
  data1 = {
    labels: this.labels1,
    datasets: [
      {
        data: [450, 350, 100],
        backgroundColor: ['#6857E6', '#009FEE', '#F02059'],
      },
    ],
  };
  data2 = {
    labels: this.labels2,
    datasets: [
      {
        data: [250, 550, 100],
        backgroundColor: ['#6857E6', '#009FEE', '#F02059'],
      },
    ],
  };
}
