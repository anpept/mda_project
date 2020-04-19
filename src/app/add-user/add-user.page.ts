import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.model';
import {LoadingController, NavController, ToastController} from '@ionic/angular';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {
  user = {} as User;
  constructor(private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private navCtrl: NavController,
              private firestore: AngularFirestore) { }

  ngOnInit() {}

  async createUser(user: User) {

    if (this.formValidation()) {
      // show loader
      const loader = this.loadingCtrl.create({
        message: 'Please wait...'
      });
      (await loader).present();

      try {
        await this.firestore.collection('users').add(user);
      } catch (e) {
          this.showToast(e);
        }

        // dismiss loader
      (await loader).dismiss();

        // redirect to home page
      this.navCtrl.navigateRoot('home');
    }
  }

  formValidation() {
    if (!this.user.email) {
      this.showToast('Enter email');
      return false;
    }

    if (!this.user.password) {
      this.showToast('Enter password');
      return false;
    }

    if (!this.user.name) {
      this.showToast('Enter password');
      return false;
    }

    if (!this.user.type) {
      this.showToast('Enter password');
      return false;
    }
    return true;
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message,
      duration: 3000
    }).then(toastData => toastData.present());
  }
}
