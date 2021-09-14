import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subscription } from 'rxjs';
import { ChatPageObjectGroupWS } from 'src/app/models/ws/chat-page/chat-page-friends-page/chat_page_object_group_ws';
import { ChatPageFriendsWebsocketService } from './chat-page-friends-websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatPageCreateGroupWsService {
  // kiểm tra tạo mới
  public checkCreate: boolean;
  public isshow: boolean;
  // Danh sach tất cả user
  public all_user: ChatPageObjectGroupWS[];
  // Danh sách những người đã được thêm thêm vào
  public user_added: ChatPageObjectGroupWS[];
  // Danh sách gợi ý
  public user_search: ChatPageObjectGroupWS[];
  
  // service
  public layAllUser:Subscription;

  constructor(
    private db: AngularFireDatabase,
    private chat_page_friends_websocket: ChatPageFriendsWebsocketService
  ) {
    this.init();
  }

  public createGroup(ten_nhom: string,ten:string){
    let ma_tai_khoan = JSON.parse(localStorage.getItem("ma_tai_khoan_dn_ws"));
    let currentTime = Number(new Date());
    let value = "error";
    this.chat_page_friends_websocket.createGroup(ten_nhom);
    
    this.chat_page_friends_websocket.messages_create_group_chat.subscribe(async data => {
      value = JSON.parse(JSON.stringify(data)).status;
      if (await value == "success") {
        // Cuộc trò chuyện
        let cuoc_tro_chuyen = this.db.list("/cuoc_tro_chuyen_ws").push({ loai_cuoc_tro_truyen: "nhom", bieu_tuong_cam_xuc: "khong", mau: "#3275f7" });
        // Thông tin trò chuyện nhóm
        this.db.object("/thong_tin_tro_chuyen_nhom_ws/" + cuoc_tro_chuyen.key).update(
          {
            chu_so_huu: ma_tai_khoan,
            ngay_tao: currentTime,
            ["ten_nhom"]: ten_nhom,
            ton_tai: 0
          }
        );
        // Thành viên cuộc trò chuyện
        this.db.object("/thanh_vien_cuoc_tro_chuyen_ws/" + cuoc_tro_chuyen.key + "/" + ma_tai_khoan).update(
          {
            ngay_roi_di: 0,
            ngay_tham_gia: currentTime,
            roi_chua: "chua",
            trang_thai: "khong_cho",
            chuc_vu: 'quan_tri_vien',
            tham_gia: "roi"
          }
        );
        let array: Object[] = [];
        array.push({ ma_tai_khoan: ma_tai_khoan, ngay_nhan: 0, ngay_xem: currentTime, xem_chua: "roi",ten:ten });
        for (let i = 0; i < this.user_added.length; i++) {
         
          this.db.object("/thanh_vien_cuoc_tro_chuyen_ws/" + cuoc_tro_chuyen.key + "/" + this.user_added[i].ma_tai_khoan).update(
            {
              ngay_roi_di: 0,
              ngay_tham_gia: currentTime,
              roi_chua: "chua",
              trang_thai: "khong_cho",
              chuc_vu: 'thanh_vien',
              tham_gia: "chua"
            }
          );
          array.push({ ma_tai_khoan: this.user_added[i].ma_tai_khoan, ngay_nhan: 0, ngay_xem: 0, xem_chua: "chua",ten:this.user_added[i].ten });
        }
        // Tin nhắn đầu tiên
        this.db.list("/chi_tiet_cuoc_tro_chuyen_ws/" + cuoc_tro_chuyen.key).push(
          {
            dia_chi_file: "",
            link_file: "",
            loai_tin_nhan: "thong_bao",
            ["ma_tai_khoan"]: ma_tai_khoan,
            ten:ten,
            ma_tin_nhan_phan_hoi: "",
            ngay_gui: currentTime,
            noi_dung: "đã tạo nhóm"
          }
        ).then((ref) => {
          for (let i = 0; i < array.length; i++) {
            this.db.object("/chi_tiet_cuoc_tro_chuyen_ws/" + cuoc_tro_chuyen.key + "/" + ref.key + "/tinh_trang_xem/" + array[i]['ma_tai_khoan']).update(
              {
                ngay_nhan: array[i]['ngay_nhan'],
                ngay_xem: array[i]['ngay_xem'],
                xem_chua: array[i]['xem_chua'],
                ten:array[i]['ten']
              }
            )
          };
          // gửi tin nhắn thông báo tạo nhóm websocket
          this.chat_page_friends_websocket.sendMessagesGroup(ten_nhom, ref.key);
        });
       
        this.checkCreate = true;
      } else
        this.checkCreate = false;
    })
          
   
    
  }

  public fillter(value: string) {
    this.user_search = [];
    let ma_tai_khoan = JSON.parse(localStorage.getItem("ma_tai_khoan_dn_ws"));
    if (value.length > 0) {
      for (let i = 0; i < this.all_user.length; i++) {
        if (this.all_user[i].ma_tai_khoan != ma_tai_khoan) {
          if (this.all_user[i].ten.trim().toLowerCase().includes(value.trim().toLowerCase())) {
            if (this.isNotInAdded(this.all_user[i].ma_tai_khoan)) {
              this.user_search.push(new ChatPageObjectGroupWS(this.all_user[i].ten, this.all_user[i].ma_tai_khoan, this.all_user[i].hinh));
            }
          }
        }
      }
    }
  }

  public clearAdded(ma_tai_khoan: string) {
    let index = -1;
    for (let i = 0; i < this.user_added.length; i++) {
      if (this.user_added[i].ma_tai_khoan == ma_tai_khoan) {
        index = i;
        break;
      }
    }
    if (index != -1) {
      this.user_added.splice(index, 1);
    }
  }

  public updateSearch(ten_hien_tai: string, ma_tai_khoan: string) {
    let ma_tai_khoan_dn_ws = JSON.parse(localStorage.getItem("ma_tai_khoan_dn_ws"));
    if (ten_hien_tai.trim().length > 0) {
      for (let i = 0; i < this.all_user.length; i++) {
        if (this.all_user[i].ma_tai_khoan != ma_tai_khoan_dn_ws) {
          if (this.all_user[i].ma_tai_khoan == ma_tai_khoan) {
            let ten = this.all_user[i].ten;
            if (ten.trim().toLowerCase().includes(ten_hien_tai.trim().toLowerCase())) {
              this.user_search.push(new ChatPageObjectGroupWS(this.all_user[i].ten, this.all_user[i].ma_tai_khoan, this.all_user[i].hinh));
            }
            return;
          }
        }
      }
    }
  }

  public isNotInAdded(ma_tai_khoan: string) {
    for (let i = 0; i < this.user_added.length; i++) {
      if (this.user_added[i].ma_tai_khoan == ma_tai_khoan) {
        return false;
      }
    }
    return true;
  }

  public selectUser(ma_tai_khoan: string) {
    for (let i = 0; i < this.all_user.length; i++) {
      if (this.all_user[i].ma_tai_khoan == ma_tai_khoan) {
        this.user_added.push(new ChatPageObjectGroupWS(this.all_user[i].ten, this.all_user[i].ma_tai_khoan, this.all_user[i].hinh));
        this.user_search = [];
        return;
      }
    }
   
  }

  public getAllUser() {
    return this.db.object("/tai_khoan_ws").snapshotChanges();
  }

  public off(): void {
    this.isshow = false;
    this.init();
  }

  public init(): void {
    this.user_added = [];
    this.user_search = [];
  }

  public isOke(): boolean {
    return this.user_added.length != 0;
  }
}
