import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { NgFor } from '@angular/common';

interface stats {
  id: number;
  color: string;
  title: string;
  subtitle: string;
  img: string;
  percent: string;
}

@Component({
  selector: 'app-payment-gateways',
  standalone: true,
  imports:[MaterialModule, NgFor],
  templateUrl: './payment-gateways.component.html',
})
export class AppPaymentGatewaysComponent {
  stats: stats[] = [
    {
      id: 1,
      color: 'primary',
      title: 'Paypal',
      subtitle: 'Big Brands',
      img: 'assets/images/svgs/icon-paypal.svg',
      percent: '6235',
    },
    {
      id: 2,
      color: 'success',
      title: 'Wallet',
      subtitle: 'Bill payment',
      img: 'assets/images/svgs/icon-office-bag.svg',
      percent: '345',
    },
    {
      id: 3,
      color: 'warning',
      title: 'Credit Card',
      subtitle: 'Money reversed',
      img: 'assets/images/svgs/icon-master-card.svg',
      percent: '2235',
    },
    {
      id: 4,
      color: 'error',
      title: 'Refund',
      subtitle: 'Bill Payment',
      img: 'assets/images/svgs/icon-pie.svg',
      percent: '32',
    },
  ];
}
