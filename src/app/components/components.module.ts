import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncreaserComponent } from './increaser/increaser.component';
import { DonutComponent } from './donut/donut.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [IncreaserComponent, DonutComponent],
  imports: [CommonModule, FormsModule, NgChartsModule],
  exports: [IncreaserComponent, DonutComponent],
})
export class ComponentsModule {}
