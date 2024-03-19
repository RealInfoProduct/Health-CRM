import { Component, ViewChild } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../material.module';

export interface productChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  fill: ApexFill;
  markers: ApexMarkers;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule],
  templateUrl: './products.component.html',
})
export class AppProductsComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public productChart!: Partial<productChart> | any;

  constructor() {
    this.productChart = {
      series: [
        {
          name: '',
          color: '#13DEB9',
          data: [30, 25, 35, 20, 30, 40],
        },
      ],

      chart: {
        type: 'area',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 85,
        sparkline: {
          enabled: true,
        },
        group: 'sparklines',
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        colors: ['#E6FFFA'],
        type: 'solid',
        opacity: 0.05,
      },
      markers: {
        size: 0,
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },
    };
  }
}
