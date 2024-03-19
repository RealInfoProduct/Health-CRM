import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-sales-profit',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './sales-profit.component.html',
})
export class AppSalesProfitComponent {}
