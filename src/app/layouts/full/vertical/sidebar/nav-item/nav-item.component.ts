import {
  Component,
  HostBinding,
  Input,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { NavItem } from './nav-item';
import { Router } from '@angular/router';
import { NavService } from '../../../../../services/nav.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [TranslateModule, TablerIconsModule, MaterialModule, CommonModule],
  templateUrl: './nav-item.component.html',
  styleUrls: [],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ]),
  ],
})
export class AppNavItemComponent implements OnChanges {
  @Output() toggleMobileLink: any = new EventEmitter<void>();
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  expanded: any = false;
  disabled: any = false;
  twoLines: any = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem | any;
  @Input() depth: any;
  
userType:any = localStorage.getItem('usertype')

  constructor(public navService: NavService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnChanges() {
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        // console.log(`Checking '/${this.item.route}' against '${url}'`);
        this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        this.ariaExpanded = this.expanded;
        // console.log(`${this.item.route} is expanded: ${this.expanded}`);
      }
    });
  }

  // isVisible(item: NavItem): boolean {
  //   if (item.allowedUserTypes) {
  //     return item.allowedUserTypes.includes(this.userType);
  //   }
  //   return true;
  // }
  

  isVisible(item: any): boolean {
    // if (this.userType === 'Admin' && (
    //   item.route === '/dashboards/dashboard1' ||
    //   item.route === '/dashboards/dashboard2' ||
    //   item.route === '/apps/appointments' ||
    //   item.route === '/apps/medical' ||
    //   item.route === '/apps/laboratory' ||
    //   item.route === '/apps/lab' ||
    //   item.route === '/apps/staff' ||
    //   item.route === '/apps/patient' ||
    //   item.route === '/apps/medicine' ||
    //   item.route === '/apps/doctors' ||
    //   item.route === '/apps/bill' 
    // )) 
    //   {
    //   return true; 
    // }
     if (this.userType === 'Medical' && (
      item.route === '/dashboards/dashboard1' ||
      item.route === '/dashboards/dashboard2' ||
      item.route === '/apps/medicine'
    )) {
      return true; 
    } 
    // if (this.userType === 'Patient' && (
    //   item.route === '/dashboards/dashboard1' ||
    //   item.route === '/dashboards/dashboard2' ||
    //   item.route === '/apps/appointments' ||
    //   // item.route === '/apps/doctors' ||
    //   item.route === '/apps/bill' 
    // )) 
    //   {
    //   return true; 
    // } 
    if (this.userType === 'Doctor' && (
      item.route === '/dashboards/dashboard1' ||
      item.route === '/dashboards/dashboard2' ||
      item.route === '/apps/appointments' ||
      item.route === '/apps/medical' ||
      item.route === '/apps/laboratory' ||
      item.route === '/apps/lab' ||
      item.route === '/apps/staff' ||
      item.route === '/apps/patient' ||
      // item.route === '/apps/medicine' ||
      item.route === '/apps/doctors' ||
      item.route === '/apps/bill' 
     )) 
      {
      return true; 
    } 
    return false; 
  }
  
  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
      
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
    //scroll
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    if (!this.expanded){
    if (window.innerWidth < 1024) {
      this.notify.emit();
    }
  }
  }

  onSubItemSelected(item: NavItem) {
    if (!item.children || !item.children.length){
      if (this.expanded && window.innerWidth < 1024) {
        this.notify.emit();
      }
    }
  }
}
