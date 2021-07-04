import { Subscription } from 'rxjs';
import { ChatPageProcessServiceService } from './../chat-page-process-service.service';
import { ChatPageBanBe } from './../../../models/chat-page/chat-page-friends-page/chat_page_ban_be';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatPageFriendsServiceService {

  // Danh sách bạn bè 
  public ban_bes: ChatPageBanBe[];
  // Danh sách các mã cuộc trò chuyện đơn
  public maCuocTroChuyenDons: string[];

  // Trạng thái online
  public isOnline;

  // service
  public layListBanbe: Subscription;
  public layTroChuyenDon: Subscription;
  public layThanhVienCuocTroChuyen: Subscription;
  public layThongTinThanhVien: Subscription;
  public layLanCuoiDangNhap: Subscription;

  constructor(
    private db: AngularFireDatabase,
    private main_page_process_service: ChatPageProcessServiceService
  ) {
    // Hàm update lại ban_bes 5s 1 lần
    this.update();
  }

  public dienBanBeOnline(object: Object) {
    let banBes: ChatPageBanBe[] = [];
    if (object != null) {
      Object.entries(object).forEach(([key, value]) => {
        if (value['ton_tai'] == "0") {
          let cpbb: ChatPageBanBe = new ChatPageBanBe();
          cpbb.ma_tai_khoan = key;
          banBes.push(cpbb);
        }
      });
    }
    this.ban_bes = banBes;
    setTimeout(() => {
      this.main_page_process_service.setLoading(false);
    }, 0);
  }

  public dienTroChuyenDonOnline(object: Object) {
    let cuocTroChuyenDons: string[] = [];
    if (object != null) {
      Object.entries(object).forEach(([key, value]) => {
        if (value['loai_cuoc_tro_truyen'] == 'don') {
          cuocTroChuyenDons.push(key);
        };
      });
    }
    this.maCuocTroChuyenDons = cuocTroChuyenDons;
    setTimeout(() => {
      this.main_page_process_service.setLoading(false);
    }, 0);
  }

  public dienThanhVienCuocTroChuyenOnline(object: Object) {
    if (object != null) {
      Object.entries(object).forEach(([key, value]) => {
        // Duyện đúng mã trò truyện đơn thì check thử nó có chứa 2 tài khoản không
        if (this.checkContain(key)) {
          this.handleThanhVienCuocTroChuyenDon(value, key);
        }
      });
    }
  }

  public getLanCuoiDangNhap() {
    return this.db.object("/lan_cuoi_dang_nhap").snapshotChanges();
  }

  public dienLanCuoiDangNhap(object: Object) {
    let count = 0;
    if (this.ban_bes != null) {
      Object.entries(object).forEach(([key, value]) => {
        for (let i = 0; i < this.ban_bes.length; i++) {
          if (this.ban_bes[i].ma_tai_khoan == key) {
            this.ban_bes[i].lan_cuoi_dang_nhap = value['lan_cuoi_dang_nhap'];
            count++;
            break;
          }
        }
      });
      // Thằng nào chưa có thì cho nó là 0
      if (count != this.ban_bes.length) {
        for (let i = 0; i < this.ban_bes.length; i++) {
          if (this.ban_bes[i].lan_cuoi_dang_nhap == null) {
            this.ban_bes[i].lan_cuoi_dang_nhap = 0;
          }
        }
      }
    }
  }

  public update(): void {
    setTimeout(() => {
      let currentTime = Number(new Date());
      if (this.ban_bes != null) {
        let count = 0;
        for (let i = 0; i < this.ban_bes.length; i++) {
          let lan_cuoi_dang_nhap = this.ban_bes[i].lan_cuoi_dang_nhap;
          let overTime = currentTime - lan_cuoi_dang_nhap;
          if (overTime > 10000) {
            this.ban_bes[i].trang_thai_online = false;
            count++;
          } else {
            this.ban_bes[i].trang_thai_online = true;
            this.isOnline = true;
          }
        }
        if (count == this.ban_bes.length) {
          this.isOnline = false;
        }
      }
      this.update();
    }, 5000);
  }

  public getListFriend() {
    let ma_tai_khoan = JSON.parse(localStorage.getItem("ma_tai_khoan_dn"));
    return this.db.object("/ban_be/" + ma_tai_khoan).snapshotChanges();
  }

  public getCuocTroChuyenDon() {
    return this.db.object("/cuoc_tro_chuyen").snapshotChanges();
  }

  public getTaiKhoan() {
    return this.db.object("/tai_khoan").snapshotChanges();
  }

  public getThanhVienCuocTroChuyenDon() {
    return this.db.object("/thanh_vien_cuoc_tro_chuyen").snapshotChanges();
  }

  // Check 1 string có ở trong 1 string[]
  public checkContain(value: string): boolean {
    for (let i = 0; i < this.maCuocTroChuyenDons.length; i++) {
      if (this.maCuocTroChuyenDons[i] == value) {
        return true;
      }
    }
    return false;
  }

  // Nhận vô 1 Json object, check thử có có chứa 2 tài khoản hay không
  public handleThanhVienCuocTroChuyenDon(jsonObject: object, ma_cuoc_tro_chuyen: string) {
    let ma_tai_khoan = JSON.parse(localStorage.getItem("ma_tai_khoan_dn"));
    let isOKeA = false;
    let isOKeB = false;
    let index = -1;
    Object.entries(jsonObject).forEach(([key, value]) => {
      if (key == ma_tai_khoan) {
        isOKeA = true;
      } else {
        index = this.checkMaTaiKhoanInChatPageBanBe(key)
        if (index != -1) {
          isOKeB = true;
        }
      }
    });
    if (isOKeA && isOKeB) {
      this.ban_bes[index].ma_cuoc_tro_chuyen = ma_cuoc_tro_chuyen;
    }
  }

  public createNhungBanBeChuaCoCuocTroChuyen(): void {
    let ma_tai_khoan = JSON.parse(localStorage.getItem("ma_tai_khoan_dn"));
    let currentTime = Number(new Date());
    for (let i = 0; i < this.ban_bes.length; i++) {
      if (this.ban_bes[i].ma_cuoc_tro_chuyen == null) {
        let object = this.db.list("/cuoc_tro_chuyen").push({ loai_cuoc_tro_truyen: "don", bieu_tuong_cam_xuc: "khong", mau: "#3275f7" });
        this.db.object("/thanh_vien_cuoc_tro_chuyen/" + object.key + "/" + ma_tai_khoan).update({ ngay_tham_gia: currentTime, trang_thai: "khong_cho" });
        this.db.object("/thanh_vien_cuoc_tro_chuyen/" + object.key + "/" + this.ban_bes[i].ma_tai_khoan).update({ ngay_tham_gia: currentTime, trang_thai: "khong_cho" });
        this.ban_bes[i].ma_cuoc_tro_chuyen = object.key;
      }
    }
  }

  // Check thử 1 string có phải là mã tài khoản trong list chatpageBanBe
  public checkMaTaiKhoanInChatPageBanBe(key: string) {
    for (let i = 0; i < this.ban_bes.length; i++) {
      if (this.ban_bes[i].ma_cuoc_tro_chuyen == null && this.ban_bes[i].ma_tai_khoan == key) {
        return i;
      }
    }
    return -1;
  }

  public getHinhDaiDienVaLanCuoiDangNhapChoChatPageBanBe(key: string, value: object) {
    if (this.ban_bes != null) {
      for (let i = 0; i < this.ban_bes.length; i++) {
        if (this.ban_bes[i].ma_tai_khoan == key) {
          this.ban_bes[i].link_hinh_dai_dien = value['link_hinh'];
          this.ban_bes[i].ten = value['ten'];
          // Tạo luôn tên giới hạn
          this.ban_bes[i].getTenGioiHan();
          break;
        }
      }
    }
  }

}
