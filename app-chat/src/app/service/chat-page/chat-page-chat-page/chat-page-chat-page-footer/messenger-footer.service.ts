import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ObjectChatFooter } from './../../../../models/chat-page/chat-page-chat-page/footer/object_chat_footer';

@Injectable({
  providedIn: 'root'
})
export class MessengerFooterService {

  public chenh_lech_height: number;
  public object_chat_footer: ObjectChatFooter;

  // service
  public layData: Subscription;

  constructor(
    private db: AngularFireDatabase,
  ) {
    this.chenh_lech_height = 0;
    this.object_chat_footer = new ObjectChatFooter();
  }

  public getHeight(): string {
    return (633 - this.chenh_lech_height) + "px";
  }

  public getThongTinCoBan(id: string) {
    return this.db.object("/cuoc_tro_chuyen/" + id).snapshotChanges();
  }

  public dienThongTinCoBan(object: Object) {
    if (object != null) {
      this.object_chat_footer.loai = object['loai_cuoc_tro_truyen'];
      this.object_chat_footer.mau = object['mau'];
      this.object_chat_footer.bieu_tuong_cam_xuc = object['bieu_tuong_cam_xuc'];
    }
  }

}
