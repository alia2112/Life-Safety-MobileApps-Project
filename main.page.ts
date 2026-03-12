import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { AudioService } from '../services/audio.service';
import { Contacts } from '../models/contacts.mode';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { SMS } from '@awesome-cordova-plugins/sms/ngx';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  playing = false;
  public mcontact: Contacts[];
  @ViewChild('audio') audio: ElementRef;

  constructor(
    private audioService: AudioService,
    private firestore: AngularFirestore,
    private geo: Geolocation,
    private sms: SMS,
    private call: CallNumber
    ) {
      this.mcontact = [
      ]
     }

  ngOnInit() {}

  playAudio() {
    this.playing = true;
    // this.audio.nativeElement.play();
    this.audioService.playMusic(this.audio.nativeElement);
  }

  pauseAudio() {
    this.playing = false;
    // this.audio.nativeElement.pause();
    this.audioService.pauseMusic(this.audio.nativeElement);
  }

  Send(){
    this.firestore.collection("Contact")
    .get().subscribe((ss)=>{
      let nombor= this.mcontact
      ss.docs.forEach((doc)=>{
       nombor.push(doc.data())
      })
      const one = this.mcontact[0].number;
      const two = this.mcontact[1].number;
      const three = this.mcontact[2].number;
  
      this.geo.getCurrentPosition().then((position)=>{
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var maplink = "http://maps.google.com/?q="+latitude+","+longitude;
        var message = "HELP ME!! IT'S AN EMERGENCY\n\nPlease Reach ASAP to this location!!.\n\n"+maplink;
        this.sms.send(one,message);
        this.sms.send(two,message);
        this.sms.send(three,message);
      }).then(()=>{
        alert ('The message is sent');
      }).catch((error)=>{
        console.log('The message is failed', error);
      alert('Error:- '+ error);
      });
    });
  }

  callNum(){
    this.call.callNumber("999",true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }
  
}
