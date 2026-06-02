import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { NgFor } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

interface topcards {
  id: number;
  img: string;
  color: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-top-cards',
  standalone: true,
  imports: [MaterialModule, NgFor],
  templateUrl: './top-cards.component.html',
})
export class AppTopCardsComponent implements OnInit {
  topcards: topcards[] = [
    {
      id: 1,
      color: 'primary',
      img: '/assets/images/svgs/online-appointment.png',
      title: 'Appointments',
      subtitle: '0',
    },
    {
      id: 2,
      color: 'warning',
      img: '/assets/images/svgs/syringe.png',
      title: 'Medical',
      subtitle: '0',
    },
    {
      id: 3,
      color: 'accent',
      img: '/assets/images/svgs/lab-technician.png',
      title: 'Laboratory',
      subtitle: '0',
    },
    {
      id: 4,
      color: 'error',
      img: '/assets/images/svgs/medical-team.png',
      title: 'Doctors',
      subtitle: '0',
    },
    {
      id: 5,
      color: 'success',
      img: '/assets/images/svgs/bill.png',
      title: 'Bill',
      subtitle: '₹0',
    },
    {
      id: 6,
      color: 'accent',
      img: '/assets/images/svgs/icon-connect.svg',
      title: 'Reports',
      subtitle: '59',
    },
  ];
  appointmentslist: any[] = [];
  medicallist: any[] = [];
  laboratorylist: any[] = [];
  doctorslist: any[] = [];
  billlist: any[] = [];

  dataSource!: MatTableDataSource<any>;
  constructor(private firebaseCollectionService: FirebaseCollectionService) { }


  ngOnInit() {
    this.getappointmentdata();
    this.getMedicalData();
    this.getlaboratoryData();
    this.getdoctorsdata();
    this.getbilldata();
  }

  


  getappointmentdata() {
    this.firebaseCollectionService
      .getDocuments('Doctor', 'appointmentslist')
      .then((appointment) => {
        this.appointmentslist = appointment || [];
        this.dataSource = new MatTableDataSource(this.appointmentslist);

        const appointmentCard = this.topcards.find((card) => card.id === 1);
        if (appointmentCard) {
          appointmentCard.subtitle = this.appointmentslist.length.toString();
        }
      }).catch((error) => {
        console.error('Error fetching appointments:', error);
      });
  }

  getMedicalData() {
    this.firebaseCollectionService
      .getDocuments('Doctor', 'medicallist')
      .then((medical) => {
        this.medicallist = medical || [];
        this.dataSource = new MatTableDataSource(this.medicallist);

        const medicalCard = this.topcards.find((card) => card.id === 2);
        if (medicalCard) {
          medicalCard.subtitle = this.medicallist.length.toString();
        }
      }).catch((error) => {
        console.error('Error fetching medical data:', error);
      });
  }

  getlaboratoryData() {
    this.firebaseCollectionService
      .getDocuments('Doctor', 'laboratorylist')
      .then((laboratory) => {
        this.laboratorylist = laboratory || [];
        this.dataSource = new MatTableDataSource(this.laboratorylist);

        const laboratoryCard = this.topcards.find((card) => card.id === 3);
        if (laboratoryCard) {
          laboratoryCard.subtitle = this.laboratorylist.length.toString();
        }
      }).catch((error) => {
        console.error('Error fetching laboratory:', error);
      });
  }

  getdoctorsdata() {
    this.firebaseCollectionService.getDocuments('Doctor', 'doctorslist').then((doctors) => {
      this.doctorslist = doctors || [];
      this.dataSource = new MatTableDataSource(this.doctorslist)

      const doctorsCard = this.topcards.find((card) => card.id === 4);
      if (doctorsCard) {
        doctorsCard.subtitle = this.doctorslist.length.toString();
      }
    }).catch((error) => {
      console.error('Error fetching laboratory:', error);
    });
  }

  getbilldata() {
    this.firebaseCollectionService
      .getDocuments('Doctor', 'billlist')
      .then((bill) => {
        this.billlist = bill;

        if (bill && bill.length > 0) {
          this.dataSource = new MatTableDataSource(this.billlist);

          const totalFinal = this.billlist.reduce((sum, item) => sum + (item.finalTotal || 0), 0);

          const billCard = this.topcards.find((card) => card.title === 'Bill');
          if (billCard) {
            billCard.subtitle = `₹${totalFinal.toLocaleString('en-IN')}`;
          }
        } else {
          this.billlist = [];
          this.dataSource = new MatTableDataSource(this.billlist);

          const billCard = this.topcards.find((card) => card.title === 'Bill');
          if (billCard) {
            billCard.subtitle = '₹0';
          }
        }
      }).catch((error) => {
        console.error('Error fetching bills:', error);
      });
  }

}
