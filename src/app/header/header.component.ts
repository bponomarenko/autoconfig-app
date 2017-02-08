import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  ViewChild
} from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';

import { User } from '../types/user';
import { UserService } from '../services/user.service';
import { CredentialsFormComponent } from '../credentials-form/credentials-form.component';
import { ProvisionDialogComponent } from '../provision-dialog/provision-dialog.component';

@Component({
  selector: 'ac-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterContentInit {
  private user: User;
  private formData: { user: User };

  @Input() loading: boolean;
  @Output() refresh = new EventEmitter();
  @ViewChild('userForm') form: CredentialsFormComponent;
  @ViewChild('credentialsModal') dialog: ModalDirective;
  @ViewChild('provisionDialog') provisionDialog: ProvisionDialogComponent;

  constructor(private userService: UserService) {
    this.user = this.userService.getUser();
    this.formData = {
      user: new User()
    };

    this.userService.userChange.subscribe((user: User) => {
      this.user = new User(user);
    });
  }

  ngAfterContentInit() {
    this.dialog.onShow.subscribe(() => {
      this.formData.user = new User(this.user);
    });

    this.dialog.onHidden.subscribe(() => {
      this.form.reset();
    });
  }

  get isUserModified(): boolean {
    return !this.user.isEqualTo(this.formData.user);
  }

  refreshList() {
    this.refresh.emit();
  }

  addEnvironment() {
    this.provisionDialog.show();
  }

  saveCredentials() {
    this.userService.setUser(this.formData.user);
    this.dialog.hide();
  }
}
