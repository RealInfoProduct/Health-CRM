import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { DailyRoutineDialogComponent } from './daily-routine-dialog/daily-routine-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-daily-routine',
  templateUrl: './daily-routine.component.html',
  styleUrls: ['./daily-routine.component.scss']
})
export class DailyRoutineComponent implements OnInit {

  appointmentsColumns: string[] = [
    'id',
    'patientName',
    'mobileNumber',
    'department',
    'ward',
    'roomNumber',
    'bedNumber',
    'action'
  ]

  dayilyRoutinelist: any[] = []

  dataSource = new MatTableDataSource(this.dayilyRoutinelist)
   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService
  ) { }

  ngOnInit(): void {
    this.getdayilyRoutinedata();
  }

  getdayilyRoutinedata() {
    const userId = localStorage.getItem('userId')
    const clinicId = localStorage.getItem('clinicId')
    const ReceptionistId = localStorage.getItem('ReceptionistId')
    this.firebaseCollectionService.getdayilyRoutineList(userId, clinicId, ReceptionistId, 'dayilyRoutinelist').then((dayilyRoutine) => {
        this.dayilyRoutinelist = dayilyRoutine
       if (dayilyRoutine && dayilyRoutine.length > 0) {
        this.dataSource = new MatTableDataSource(this.dayilyRoutinelist)
        
        this.dataSource.paginator = this.paginator
      } else {
        this.dayilyRoutinelist = []
        this.dataSource = new MatTableDataSource(this.dayilyRoutinelist)
        this.dataSource.paginator = this.paginator
      }
    })
  }


   applyFilter(event: Event)  {
      const filterValue = (event.target as HTMLInputElement)
    .value
    .toLowerCase()
    .trim();
      this.dataSource.data = this.dayilyRoutinelist.filter((item: any) => {

    const fullName =
      `${item.patientName || ''} `
        .toLowerCase()
        .trim();

    const mobile =
      `${item.mobileNumber || ''}`;

    return (
      fullName.includes(filterValue) ||
      mobile.includes(filterValue)
    );
  });
   }

  openadminDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(DailyRoutineDialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        const userId = localStorage.getItem('userId')
        const clinicId = localStorage.getItem('clinicId')
        const ReceptionistId = localStorage.getItem('ReceptionistId')
        this.firebaseCollectionService.adddayilyRoutinelist(userId, clinicId, ReceptionistId, result.data);
        this.getdayilyRoutinedata()

      } else if (result.event === 'Update') {
        this.dayilyRoutinelist.forEach((element: any) => {
          if (obj.id === element.id) {
            const userId = localStorage.getItem('userId')
            const clinicId = localStorage.getItem('clinicId')
            const ReceptionistId = localStorage.getItem('ReceptionistId')
            this.firebaseCollectionService.updatedayilyRoutineList(userId, clinicId, ReceptionistId, obj.id, result.data);
            this.getdayilyRoutinedata()
          }
        });
      } else if (result.event === 'Delete') {
        const userId = localStorage.getItem('userId')
        const clinicId = localStorage.getItem('clinicId')
        const ReceptionistId = localStorage.getItem('ReceptionistId')
        this.firebaseCollectionService.deletedayilyRoutineList(userId, clinicId, ReceptionistId, obj.id);
        this.getdayilyRoutinedata()
      }

    })
  }


}
