import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsServiceService {
  private source = new BehaviorSubject('cai_dat');
  public stateDefault = this.source.asObservable();
  stateStatus: string = 'tat'
  constructor(private db: AngularFireDatabase) { }
  selectedStateNotification():void {
    this.source.next('thong_bao');
  }
  selectedStateStatus():void {
    this.source.next('trang_thai_hoat_dong');
  }
  selectedStateSupport():void {
    this.source.next('ho_tro');
  }
  selectedStateSettings():void {
    this.source.next('cai_dat');
  }
  public accessSettings(maTaiKhoan: string) {
    return this.db.database.ref('cai_dat').child(maTaiKhoan);
  }
  public accessAcc() {
    return this.db.database.ref('tai_khoan');
  }
  getStatusMe() {
    let idUser = JSON.parse(localStorage.getItem('ma_tai_khoan_dn'));
    this.accessSettings(idUser).on('value', set => {
      this.stateStatus = set.val().trang_thai_hoat_dong;
    })
  }
}
