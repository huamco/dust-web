import {Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PerfectScrollbarDirective, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { MenuService } from '../theme/components/menu/menu.service';
import { LoginService} from './login/login.service';
import {DustService} from './system/dust-register/dust.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [ MenuService, DustService, LoginService ]
})
export class PagesComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav') sidenav:any;
  @ViewChild('backToTop') backToTop:any;
  @ViewChildren(PerfectScrollbarDirective) pss: QueryList<PerfectScrollbarDirective>;
  public settings:Settings;
  public menus = ['vertical', 'horizontal'];
  public menuOption:string;
  public menuTypes = ['default', 'compact', 'mini'];
  public menuTypeOption:string;
  public isStickyMenu:boolean = false;
  public lastScrollTop:number = 0;
  public showBackToTop:boolean = false;
  public toggleSearchBar:boolean = false;
  private defaultMenu:string; //declared for return default menu when window resized

  monthlyPower: any;
  dailyPower: any;
  totalhour: any;

  constructor(public appSettings:AppSettings,
              public router:Router,
              private menuService: MenuService,
              public dustService: DustService,
              public loginService: LoginService){
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    if(window.innerWidth <= 768){
      this.settings.menu = 'vertical';
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
    }
    this.menuOption = this.settings.menu;
    this.menuTypeOption = this.settings.menuType;
    this.defaultMenu = this.settings.menu;;
    this.getMonthlyPowerSum();
    this.getDailyPowerSum();
    //this.getTotalHour();
  }

    getMonthlyPowerSum() {
      this.dustService.getMonthlyPowerSum().subscribe(res => {
        console.log(res);
        if (res) {
            this.monthlyPower = res.data.m_fParam_power;
        }
      });
      setTimeout(() => {
          //this.getMonthlyPowerSum();
      }, 5000);
  }

    getDailyPowerSum() {
        this.dustService.getDailyPowerSum().subscribe(res => {
            if (res) {
                this.dailyPower = res.data.m_fParam_power;
            }

        });
        setTimeout(() => {
            //this.getDailyPowerSum();
        }, 5000);
    }

    getTotalHour() {
        this.dustService.getTotalHour().subscribe(res => {
            if (res) {
                this.totalhour = res.data.m_fParam_power;
            }

        });
        setTimeout(() => {
            //this.getTotalHour();
        }, 5000);
    }

  ngAfterViewInit(){
    setTimeout(() => { this.settings.loadingSpinner = false }, 300);
    this.backToTop.nativeElement.style.display = 'none';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(!this.settings.sidenavIsPinned){
          this.sidenav.close();
        }
        if(window.innerWidth <= 768){
          this.sidenav.close();
        }
      }
    });
    if(this.settings.menu == "vertical")
      this.menuService.expandActiveSubMenu(this.menuService.getVerticalMenuItems());
  }

  public chooseMenu(){
    this.settings.menu = this.menuOption;
    this.defaultMenu = this.menuOption;
    this.router.navigate(['/']);
  }

  public chooseMenuType(){
    this.settings.menuType = this.menuTypeOption;
  }

  public changeTheme(theme){
    this.settings.theme = theme;
  }

  public toggleSidenav(){
    this.sidenav.toggle();
  }

  public onPsScrollY(event){
    (event.target.scrollTop > 300) ? this.backToTop.nativeElement.style.display = 'flex' : this.backToTop.nativeElement.style.display = 'none';
    if(this.settings.menu == 'horizontal'){
      if(this.settings.fixedHeader){
        var currentScrollTop = (event.target.scrollTop > 56) ? event.target.scrollTop : 0;
        (currentScrollTop > this.lastScrollTop) ? this.isStickyMenu = true : this.isStickyMenu = false;
        this.lastScrollTop = currentScrollTop;
      }
      else{
        (event.target.scrollTop > 56) ? this.isStickyMenu = true : this.isStickyMenu = false;
      }
    }
  }

  public scrollToTop() {
    this.pss.forEach(ps => {
      if(ps.elementRef.nativeElement.id == 'main' || ps.elementRef.nativeElement.id == 'main-content'){
        ps.scrollToTop(0,250);
      }
    });
  }


  @HostListener('window:resize')
  public onWindowResize():void {
    if(window.innerWidth <= 768){
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
      this.settings.menu = 'vertical'
    }
    else{
      (this.defaultMenu == 'horizontal') ? this.settings.menu = 'horizontal' : this.settings.menu = 'vertical'
      this.settings.sidenavIsOpened = true;
      this.settings.sidenavIsPinned = true;
    }
  }

  public closeSubMenus(){
    let menu = document.querySelector(".sidenav-menu-outer");
    if(menu){
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
        if(child){
          if(child.children[0].classList.contains('expanded')){
              child.children[0].classList.remove('expanded');
              child.children[1].classList.remove('show');
          }
        }
      }
    }
  }

}

/*
{
    "_id" : ObjectId("5c88b1e54c66b11384b51717"),
    "username" : "test001",
    "password" : "test001",
    "name" : "test",
    "email" : "test",
    "companyId" : "testCompany11",
    "startDate" : ISODate("2019-03-12T15:00:00.000Z"),
    "endDate" : ISODate("2019-04-29T15:00:00.000Z"),
    "isAdmin" : 1,
    "createDate" : ISODate("2019-03-13T07:31:49.457Z"),
    "updateDate" : ISODate("2019-03-13T07:31:49.457Z"),
    "id" : 1,
    "hash" : "$2a$10$hTfSSxbFz9Wu7YDRPoUj.OBvbJOxwcAplYDvjAT/KKaRyHM2nWPQa",
    "__v" : 0,
    "isManager" : 1
}
company
{
    "_id" : ObjectId("5c876251a90d2d29b8145cb7"),
    "id" : 1,
    "name" : "testCompany11",
    "address1" : "testCompany11",
    "address2" : "testCompany",
    "zipcode1" : null,
    "tel" : null,
    "fax" : null,
    "isActive" : 1,
    "monitoringType" : 1,
    "createDate" : ISODate("2019-03-12T07:40:01.031Z"),
    "updateDate" : ISODate("2019-03-12T07:40:01.031Z"),
    "__v" : 0
}
*/
