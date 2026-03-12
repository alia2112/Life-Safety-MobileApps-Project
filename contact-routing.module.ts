import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController} from '@ionic/angular';
import { Contacts } from '../models/contacts.mode';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  contact = {} as Contacts;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private firestore: AngularFirestore,
  ) { }

  ngOnInit() {
  }

  async createContact(contact: Contacts){
    if (this.formValidation()){
      let loader = this.loadingCtrl.create({
        message: "Please wait.."
      });
      (await loader).present();

      try{
        await this.firestore.collection("Contact").add(contact);
      }catch(e){
        this.showToast(e);
      }
      (await loader).dismiss();
      this.navCtrl.navigateRoot("main");
    }
  }

  formValidation(){
    if(!this.contact.name){
      this.showToast("Enter Name");
      return false;
    }
    if(!this.contact.number){
      this.showToast("Enter Number");
      return false;
    }
    return true;
  }

  showToast(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 3000
    })
    .then(toastData => toastData.present());
  }

}
