import { Injectable } from '@angular/core';
import { FriendInfor } from 'src/app/models/friends-page/friend_Infor';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  AngularFireDatabase,
  AngularFireList,
  snapshotChanges,
} from '@angular/fire/database';
import { AddFriendsInfor } from 'src/app/models/friends-page/add_friends';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private friendSource = new BehaviorSubject<FriendInfor>(null);
  friendInforService = this.friendSource.asObservable();
  // add
  private addSource = new BehaviorSubject<any>(null);
  addInforService = this.addSource.asObservable();
  // de xuat
  private offerSource = new BehaviorSubject<any>(null);
  offerInforService = this.offerSource.asObservable();
  constructor(
    private db: AngularFireDatabase,
    
  ) {
    
  }
  // add
  setAddInforService(id: string, addOrUndo: string) {
    this.addSource.next({
      id: id,
      addOrUndo: addOrUndo
    })
  }
// offer
  setOfferInforService(id: string, addOrUndo: string) {
    this.offerSource.next({
      id: id,
      addOrUndo: addOrUndo
    })
  }
  // thay đổi thông tin
  setFriendInforService(id: any) {
    this.friendSource.next(id);
  }
  // get list id dựa vào id đang đăng nhập
  getListIDFriendsByIDUser(idUser: any): any {
    
    return this.db.database.ref('ban_be').child(idUser);
  }

  // hủy kết bạn
  unFriendByIDUser(idUnfriend: string, idUser: string) {
    return this.db.database.ref('ban_be').child(idUser).child(idUnfriend);
  }
  // lấy ra list object bạn bè dựa vào id của mỗi object
  getListFriendsInforByIDFriends(idUser: any) {
    let friendInfor = new FriendInfor();
    const ref = this.db.database.ref('tai_khoan/' + idUser);
    ref.on('value', (data) => {
      friendInfor.id = idUser;
      friendInfor.img = data.val().link_hinh;
      friendInfor.name = data.val().ten;
      friendInfor.sex = data.val().gioi_tinh;
      friendInfor.date = data.val().ngay_tao;
      friendInfor.lastOnline = data.val().lan_cuoi_dang_nhap;
      
    });
  
    return friendInfor;
  }

  getListFriendsInforByIDFriendsOneShot(idUser: any) {
    let friendInfor = new FriendInfor();
    const ref = this.db.database.ref('tai_khoan/' + idUser);
    ref.once('value', (data) => {
      friendInfor.id = idUser;
      friendInfor.img = data.val().link_hinh;
      friendInfor.name = data.val().ten;
      friendInfor.sex = data.val().gioi_tinh;
      friendInfor.date = data.val().ngay_tao;
      friendInfor.lastOnline = data.val().lan_cuoi_dang_nhap;
      
    });
  
    return friendInfor;
  }
  getFriendByID(idUser:any) {
    return this.db.database.ref('tai_khoan/' + idUser);
  }

  
  addFriend(idUser: string, idSend: string) {
    return this.db.database.ref('ban_be/'+ idUser + '/' +idSend)
  }
}
