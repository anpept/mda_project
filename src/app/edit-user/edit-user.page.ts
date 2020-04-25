import { Component, OnInit } from '@angular/core';
import {User} from "../models/user.model";
import {ActivatedRoute} from "@angular/router";
import {LoadingController, NavController, ToastController} from "@ionic/angular";
import {AngularFirestore} from "@angular/fire/firestore";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {
  user = {} as User;
  id: any;

  constructor(private actRoute: ActivatedRoute,
              private loadingCtrl: LoadingController,
              private firestore: AngularFirestore,
              private toastCtrl: ToastController,
              private navCtrl: NavController) {
    this.id = this.actRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.getUserById(this.id);
  }
  async getUserById(id: string){
    const loader = this.loadingCtrl.create({
      message: 'Please wait...'
    });
    (await loader).present();

    this.firestore.doc("users/" + id).valueChanges().subscribe(data =>{
      this.user.email = data["email"];
      this.user.password = data["password"];
      this.user.name = data["name"];
      this.user.surname = data["surname"];
      this.user.type = data["type"];
      this.user.category = data["category"];
      this.user.other_data = data["other_data"];
    });
    (await loader).dismiss();
  }

  async updateUser(user: User){
    if (this.formValidation()) {
      // show loader
      let loader = this.loadingCtrl.create({
        message: 'Please wait...'
      });
      (await loader).present();

      try {
        await this.firestore.doc('users/'+this.id).update(user);
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

    if (!this.user.type) {
      this.showToast('Enter type');
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
