import { Component, OnInit, ViewChild } from '@angular/core';
import { AddbilldialogComponent } from './addbilldialog/addbilldialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Timestamp } from 'firebase/firestore';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit{
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;

  billColumns: string[] = [
    'id',
    'patientName',
    'status',
    'admissionDate',
    'dischargeDate',
    'paymentMethod',
    'total',
    'discount',
    'tax',
    'finalTotal',
    'action'
  ]

  billlist: any = []
  appointmentslist: any = []

  dataSource = new MatTableDataSource(this.billlist)
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService
  ) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getbilldata()
    this.getappointmentdata()
  }

  getappointmentdata() {
    this.firebaseCollectionService.getDocuments('ClinicList', 'appointmentslist').then((appointment) => {
      this.appointmentslist = appointment
    }).catch((error) => {
      console.error('Error fetching laboratory:', error);
    });
  }

  getbilldata() {
    this.firebaseCollectionService.getDocuments('ClinicList', 'billlist').then((bill) => {
      this.billlist = bill
      if (bill && bill.length > 0) {
        this.dataSource = new MatTableDataSource(this.billlist)
        this.dataSource.paginator = this.paginator
      } else {
        this.billlist = []
        this.dataSource = new MatTableDataSource(this.billlist)
        this.dataSource.paginator = this.paginator
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  convertTimestamp(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  openBillDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AddbilldialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.firebaseCollectionService.addDocument('ClinicList', result.data, 'billlist');
        this.getbilldata()

      } else if (result.event === 'Update') {
        this.billlist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('ClinicList', obj.id, result.data, 'billlist');
            this.getbilldata()
          }
        });
      } else if (result.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('ClinicList', obj.id, 'billlist');
        this.getbilldata()
      }

    })
  }

  getAppointmentlist(appointmentId: string): string {  
    return this.appointmentslist.find((appointmentObj:any) => appointmentObj.id === appointmentId)?.firstName  ;
  }

}
