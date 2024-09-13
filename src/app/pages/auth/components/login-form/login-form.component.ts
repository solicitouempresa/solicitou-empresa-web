import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { EstablishmentModel } from 'src/app/models/establishment';
import { EstablishmentsService } from 'src/app/pages/establishments/services/establishments.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @Output() sendLoginForm = new EventEmitter();
  public form: FormGroup;
  public loginInput;
  public passwordInput;
  public establishments:EstablishmentModel[];
  public loading:boolean;
  constructor(private establishmentService:EstablishmentsService){

  }

  public ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  public login(): void {
    if (this.form.valid) {
       this.loading = true;
       this.loginInput = this.form.get('login').value;
       this.passwordInput = this.form.get('password').value;
       this.loadEstablishmentData(this.loginInput, this.passwordInput);
    }
  }

  loadEstablishmentData(login:string, password:string){
    this.establishmentService.getLoginEstablishment(this.loginInput).subscribe((response:EstablishmentModel[]) =>{
      
      if(response.length > 0){
      this.establishments = response;
      let establishment = this.establishments[0];
      
      if(establishment.login == login && establishment.password == password) {
        localStorage.setItem('idEstablishment', establishment.id);
        localStorage.setItem('nameEstablishment', establishment.name);
        setTimeout(() => {
          this.auth();
        }, 1000);
        
      } else {
        this.loading = false;
        alert('Login ou Senha incorretos.')
      }
    } else {
      this.loading = false;
      alert('Login ou Senha incorretos.')
    }

    });
  }

  auth(){
    this.loading = false;
    this.sendLoginForm.emit();
  }
}
