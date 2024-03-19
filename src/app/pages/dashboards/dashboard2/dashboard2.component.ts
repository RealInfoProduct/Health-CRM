import { Component } from '@angular/core';

// components
import { AppWelcomeCardComponent } from '../../../components/dashboard2/welcome-card/welcome-card.component';
import { AppPaymentsComponent } from '../../../components/dashboard2/payments/payments.component';
import { AppProductsComponent } from '../../../components/dashboard2/products/products.component';
import { AppRevenueUpdatesTwoComponent } from '../../../components/dashboard2/revenue-updates/revenue-updates.component';
import { AppSalesOverviewComponent } from '../../../components/dashboard2/sales-overview/sales-overview.component';
import { AppTotalEarningsComponent } from '../../../components/dashboard2/total-earnings/total-earnings.component';
import { AppSalesProfitComponent } from '../../../components/dashboard2/sales-profit/sales-profit.component';
import { AppMonthlyEarningsTwoComponent } from '../../../components/dashboard2/monthly-earnings/monthly-earnings.component';
import { AppWeeklyStatsComponent } from '../../../components/dashboard1/weekly-stats/weekly-stats.component';
import { AppYearlySalesComponent } from '../../../components/dashboard2/yearly-sales/yearly-sales.component';
import { AppPaymentGatewaysComponent } from '../../../components/dashboard2/payment-gateways/payment-gateways.component';
import { AppRecentTransactionsComponent } from '../../../components/dashboard2/recent-transactions/recent-transactions.component';
import { AppProductPerformanceComponent } from '../../../components/dashboard2/product-performance/product-performance.component';

@Component({
  selector: 'app-dashboard2',
  standalone: true,
  imports: [
    AppWelcomeCardComponent,
    AppPaymentsComponent,
    AppProductsComponent,
    AppRevenueUpdatesTwoComponent,
    AppSalesOverviewComponent,
    AppTotalEarningsComponent,
    AppSalesProfitComponent,
    AppMonthlyEarningsTwoComponent,
    AppWeeklyStatsComponent,
    AppYearlySalesComponent,
    AppPaymentGatewaysComponent,
    AppRecentTransactionsComponent,
    AppProductPerformanceComponent,
  ],
  templateUrl: './dashboard2.component.html',
})
export class AppDashboard2Component {
  constructor() {}
}
