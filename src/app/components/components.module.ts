import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncreaserComponent } from './increaser/increaser.component';
import { DonutComponent } from './donut/donut.component';
import { NgChartsModule } from 'ng2-charts';
import { ModalImageComponent } from './modal-image/modal-image.component';

@NgModule({
  declarations: [IncreaserComponent, DonutComponent, ModalImageComponent],
  imports: [CommonModule, FormsModule, NgChartsModule],
  exports: [IncreaserComponent, DonutComponent, ModalImageComponent],
})
export class ComponentsModule {}
