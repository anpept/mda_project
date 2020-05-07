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
            id: e.payload.doc.id,
            email: e.payload.doc.data()['email'],
            name: e.payload.doc.data()['name'],
            type: e.payload.doc.data()['type'],
            surname: e.payload.doc.data()['surname'],
            category: e.payload.doc.data()['category'],
            other_data: e.payload.doc.data()['other_data']
          };
        });
      });

      // dismiss loader
      (await loader).dismiss();
    } catch (e) {
      this.showToast(e);
    }
  }
  
  async deleteUser(id: string) {
    //muestra el loader
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();

    await this.firestore.doc("users/"+id).delete();

    (await loader).dismiss();
    console.log(id);
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message,
      duration: 3000
    }).then(toastData => toastData.present());
  }
}
