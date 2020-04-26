import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.model';
import {LoadingController, NavController, ToastController} from '@ionic/angular';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from "@angular/fire/storage";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {
  user = {} as User;
  urlImage: Observable<string>;
  constructor(private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private navCtrl: NavController,
              private firestore: AngularFirestore,
              private storage: AngularFireStorage) { }

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
      this.showToast('Enter name');
      return false;
    }

    if (!this.user.surname) {
      this.showToast('Enter surname');
      return false;
    }
    if (!this.user.type) {
      this.showToast('Enter type');
      return false;
    }
    if (!this.user.category) {
      this.showToast('Enter category');
      return false;
    }
    if (!this.user.other_data) {
      this.showToast('Enter other data');
      return false;
    }
    if (!this.user.imageURL) {
      this.showToast('Select a image');
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

  onUpload(event) {
    //console.log('subir', event.target.files[0]);
    //Generar id único a la imagen
    const id = Math.random().toString(36).substring(2);
    const file = event.target.files[0];
    const filePath = 'profile/image_'+id+'.jpg';
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();
  }
}
