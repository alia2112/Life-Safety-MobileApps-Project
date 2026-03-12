import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  contacts: any;
  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore) { }

    ngOnInit() {
    }
  
    ionViewWillEnter() {
      this.getPosts();
    }
  
    async getPosts(){
      //show loader
      let loader = await this.loadingCtrl.create({
        message: "Please wait..."
      });
      loader.present();
  
      try {
      this.firestore
      .collection("Contact")
      .snapshotChanges()
      .subscribe(data => { 
        this.contacts = data.map(e => {
          return {
            id: e.payload.doc.id,
            name: e.payload.doc.data()["name"],
            number: e.payload.doc.data()["number"],
          };
        });
  
        loader.dismiss();
      });
      
      } catch(e){
      this.showToast(e);
  
      }
    }
  
    async deleteContact(id: string){
    //show loader
    let loader = this.loadingCtrl.create({
    message: "Please wait..."
    });
    (await loader).present();
  
    await this.firestore.doc("Contact/" + id).delete();
  
    //dismiss loader
    (await loader).dismiss();
    }
  
    showToast (message:string){
      this.toastCtrl.create({
        message: message,
        duration: 3000
      }).then(toastData => toastData.present());
    }


}
