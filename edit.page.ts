import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Contacts } from 'src/app/models/contacts.mode';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
contact = {} as Contacts;
id: any;
  constructor(
    private actRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {
    this.id = this.actRoute.snapshot.paramMap.get("id");
   }

  ngOnInit() {
    this.getContactById(this.id);
  }

  async getContactById(id: string){
    //show loader
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();

    this.firestore.doc("Contact/" + id)
    .valueChanges().subscribe(data =>{
      this.contact.name = data["name"];
      this.contact.number = data["number"];
    });
    //dismiss loader
    (await loader).dismiss();
  }

  async updateContact(contact:Contacts){
    if(this.formValidation()){
      //show loader
      let loader = this.loadingCtrl.create({
        message: "Please wait.."
      });
      (await loader).present();

      try{
        await this.firestore.doc("Contact/" + this.id).update(contact);
      }catch(e){
        this.showToast(e);
      }
      //dismiss loader
      (await loader).dismiss();

      //redirect to view contact page
      this.navCtrl.navigateRoot("main");
    }
  }

  formValidation(){
    if(!this.contact.name){
      this.showToast("Enter name");
      return false;
    }
    if(!this.contact.number){
      this.showToast("Enter number");
      return false;
    }
    return true;
  }

  showToast(message:string){
    this.toastCtrl.create({
      message: message,
      duration: 3000
    })
    .then(toastData => toastData.present());
  }
}
