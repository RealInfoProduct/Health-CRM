import { Component, ViewChild } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexStroke,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

export interface salesoverviewChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  stroke: ApexStroke;
}
@Component({
  selector: 'app-sales-overview',
  standalone: true,
  imports: [MaterialModule, NgApexchartsModule, TablerIconsModule],
  templateUrl: './sales-overview.component.html',
})
export class AppSalesOverviewComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public salesoverviewChart!: Partial<salesoverviewChart> | any;

  constructor() {
    this.salesoverviewChart = {
      series: [55, 55, 55],

      chart: {
        type: 'donut',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",

        toolbar: {
          show: false,
        },
        height: 275,
      },
      labels: ['Profit', 'Revenue', 'Expance'],
      colors: ['#5D87FF', '#ECF2FF', '#49BEFF'],
      plotOptions: {
        pie: {
          donut: {
            size: '89%',
            background: 'transparent',

            labels: {
              show: true,
              name: {
                show: true,
                offsetY: 7,
              },
              value: {
                show: false,
              },
              total: {
                show: true,
                color: '#2A3547',
                fontSize: '20px',
                fontWeight: '600',
                label: '$500,458',
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: false,
      },
      legend: {
        show: false,
      },
      tooltip: {
        theme: 'dark',
        fillSeriesColor: false,
      },
    };
  }
}
