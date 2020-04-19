import { Component } from '@angular/core';
import {LoadingController, ToastController} from '@ionic/angular';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from '../models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  users: any;
  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController, private firestore: AngularFirestore) {}

  ionViewWillEnter() {
    this.getUsers();
  }

  async getUsers() {
    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Please wait...'
    });
    (await loader).present();

    try {
      this.firestore.collection('users').snapshotChanges().subscribe(data => {
        this.users = data.map(e => {
          return {
            email: e.payload.doc.data()['email'],
            name: e.payload.doc.data()['name'],
            type: e.payload.doc.data()['type']
          };
        });
      });

      // dismiss loader
      (await loader).dismiss();
    } catch (e) {
      this.showToast(e);
    }
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message,
      duration: 3000
    }).then(toastData => toastData.present());
  }
}
