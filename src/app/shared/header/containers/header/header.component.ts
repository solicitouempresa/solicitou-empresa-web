import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Email, User } from '../../../../pages/auth/models';
import { AuthService, EmailService } from '../../../../pages/auth/services';
import { routes } from '../../../../consts';
import { EstablishmentsService } from 'src/app/pages/establishments/services/establishments.service';
import { EstablishmentModel } from 'src/app/models/establishment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() isMenuOpened: boolean;
  @Output() isShowSidebar = new EventEmitter<boolean>();
  public user$: Observable<User>
  public emails$: Observable<Email[]>
  public routers: typeof routes = routes;
  public establishmentName = localStorage.getItem('nameEstablishment') || 'Admin';
  constructor(
  
    private userService: AuthService,
    private emailService: EmailService,
    private router: Router,
  ) {
    this.user$ = this.userService.getUser();
    this.emails$ = this.emailService.loadEmails();
   
  }

  public openMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;

    this.isShowSidebar.emit(this.isMenuOpened);
  }

  public signOut(): void {
    this.userService.signOut();

    this.router.navigate(['login']);
  }
}
