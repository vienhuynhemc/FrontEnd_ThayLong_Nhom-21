import { ChatDataWs } from 'src/app/models/ws/chat-page/chat-page-friends-page/chat_data_ws';
import { NotificationWsService } from './../../../service/ws/notification-settings/notification-ws.service';
import { SettingServiceWsService } from './../../../service/ws/settings/setting-service-ws.service';
import { FriendsPageWsService } from './../../../service/ws/friends-page/friends-page-ws.service';
import { LoginWsWsService } from './../../../service/ws/login/login-ws-ws.service';
import { MyNameWsService } from './../../../service/ws/my-name/my-name-ws.service';
import { LoginWsService } from './../../../service/ws/login/login-ws.service';
import { MainPageWsService } from './../../../service/ws/main-page/main-page-ws.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VersionService } from 'src/app/service/version/version.service';
import { SettingNotification } from 'src/app/models/firebase/settings/settingNotification';
import { ChatPageFriendsLeftServiceWsService } from 'src/app/service/ws/chat-page/chat-page-friends-page/chat-page-friends-left-service-ws.service';
import { ChatPageFriendsServiceWsService } from 'src/app/service/ws/chat-page/chat-page-friends-page/chat-page-friends-service-ws.service';
import { SingleOrGroupChat } from 'src/app/models/firebase/settings/SingleOrGroupChat';

@Component({
  selector: 'app-main-page-ws',
  templateUrl: './main-page-ws.component.html',
  styleUrls: ['./main-page-ws.component.scss']
})
export class MainPageWsComponent implements OnInit {

  constructor(
    public version_service: VersionService,
    private route: ActivatedRoute,
    private router: Router,
    public main_page_service_ws: MainPageWsService,
    public login_service_ws: LoginWsService,
    public my_name_service_ws: MyNameWsService,
    public login_ws_ws: LoginWsWsService,
    public chat_page_friends_object_left_service_ws: ChatPageFriendsLeftServiceWsService,
    private chat_page_firends_service_ws: ChatPageFriendsServiceWsService,
    public friendsPageService_ws: FriendsPageWsService,
    public settings_service_ws: SettingServiceWsService,
    public notificationMessageService_ws: NotificationWsService
  ) {

  }

  ngOnInit(): void {
    if (this.version_service.version == 1) {
      this.router.navigate(['/change-version']);
    }
    if (!this.login_service_ws.isLogin()) {
      this.router.navigate(['/dang-nhap-ws']);
    } else {
      // V?? l???n sau t??? ?????ng l??u ????ng nh???p ko ph???i ????ng nh???p v??o n??n ch??? n??y ph???i login 1 l???n n???a v??o websocket
      // ???? login r???i login ti???p ko sao ch??? ko login l?? c?? chuy???n
      this.login_ws_ws.getPassword().subscribe(data => {
        let email = JSON.parse(localStorage.getItem("email_dn_ws"));
        this.login_ws_ws.login(email, data[0]['mat_khau']);
        this.login_ws_ws.messages_login.subscribe(data => {
          let value = JSON.parse(JSON.stringify(data));
          if (value.event == "LOGIN") {
            console.log("????ng nh???p t??? OnInit: " + value.status + " " + value.mes);
          } else if (value.event == "GET_USER_LIST") {
            this.chat_page_friends_object_left_service_ws.subscribe_ws_user_list(value);
          } else if (value.event == "GET_ROOM_CHAT_MES") {
            this.chat_page_friends_object_left_service_ws.subscribe_ws_nhom(value);
          }else if(value.event == "GET_PEOPLE_CHAT_MES"){
            this.chat_page_friends_object_left_service_ws.subscribe_ws_don(value);
          }else if(value.event == "SEND_CHAT"){
            let object = new ChatDataWs();
            object.id = value.data.id;
            object.name = value.data.name;
            object.type = value.data.type;
            object.to = value.data.to;
            object.mes = value.data.mes;
            object.createAt = value.data.createAt;
            this.chat_page_friends_object_left_service_ws.actionWsNew(object);
            console.log("send chat");
          }
        })
      })
      this.notificationMessage()
      if (this.main_page_service_ws.layHinh == null) {
        this.getData();
      } else {
        this.main_page_service_ws.layHinh.unsubscribe();
        this.getData();
      }
      if (this.my_name_service_ws.layTen == null) {
        this.my_name_service_ws.getName().subscribe(data => {
          this.my_name_service_ws.myName = data.payload.toJSON()['ten'];
        })
      } else {
        this.my_name_service_ws.layTen.unsubscribe();
        this.my_name_service_ws.getName().subscribe(data => {
          this.my_name_service_ws.myName = data.payload.toJSON()['ten'];
        });
      }
    }
    // t??? ?????ng join group
    this.main_page_service_ws.autoJoinGroup();


  }

  public getData() {
    this.main_page_service_ws.layHinh = this.main_page_service_ws.getImg().subscribe(data => {
      this.main_page_service_ws.setImg(data.payload.toJSON());
    });
  }

  // ????ng xu???t
  logOut(): void {
    // logout storage
    this.login_service_ws.logOut();
    // logout websocket
    this.login_ws_ws.logout();
    this.main_page_service_ws.reset();
    this.chat_page_friends_object_left_service_ws.allBoxData = null;
    this.chat_page_firends_service_ws.ban_bes = null;
    this.router.navigate(['/dang-nhap-ws']);
  }

  ///////////////////////////////////////
  // C??c h??m di chuy???n trang
  moveToHomePage(): void {
    this.router.navigate(['trang-chu'], { relativeTo: this.route });
  }
  moveToPersonalPage(): void {
    this.router.navigate(['thong-tin-ca-nhan'], { relativeTo: this.route });
  }
  moveToFriendsPage(): void {
    this.router.navigate(['ban-be'], { relativeTo: this.route });
    // tr???ng th??i m???c ?????nh c???a friends page khi ch???n n??
    this.friendsPageService_ws.selectedFriendsPageDefaultSerivce();
  }
  moveToChatPage(): void {
    this.router.navigate(['tin-nhan/danh-sach'], { relativeTo: this.route });
    // sau khi login ch???y h??m t??? join group, khi nh???n v??o tin nh???n th?? ch???y 1 l???n n???a cho ch???c
    this.main_page_service_ws.autoJoinGroup();
  }
  moveToChatRequestPage(): void {
    this.router.navigate(['tin-nhan-an'], { relativeTo: this.route });
  }
  moveToSettingPage(): void {
    this.router.navigate(['cai-dat'], { relativeTo: this.route });
    this.settings_service_ws.selectedStateStatus();
  }
  //////////////////////////////////////////

  // th??ng b??o
  notificationMessage() {
    let idUser = JSON.parse(localStorage.getItem('ma_tai_khoan_dn_ws'));
    // tr??nh l???p nhi???u l???n
    let checkLoop = ''
    this.notificationMessageService_ws.accessSettings(idUser).once('value', set => {
      if (set.val().khong_lam_phien == 'tat') {
        // truy c???p l???y ra t???t c??? m?? cu???c tr?? chuy???n
        this.notificationMessageService_ws.access_cuoc_tro_chuyen().on('value', conver => {
          // danh s??ch chat
          let listIDConver = []
          conver.forEach(elementConver => {
            listIDConver.push(elementConver.key)
          });
          // v??o thanh vi??n cu???c tr?? chuy???n ????? l???y ra danh s??ch c??c cu???c tr?? chuy???n b???n th??n c?? tham gia
          this.notificationMessageService_ws.access_thanh_vien_cuoc_tro_chuyen().on('value', member => {
            let listIDConverUserJoin = []
            listIDConver.forEach(keySingle => {
              member.child(keySingle).forEach(elementMember => {
                //  n???u l?? chat ????n
                if (elementMember.val().roi_chua == undefined) {
                  if (elementMember.key == idUser && elementMember.val().trang_thai == 'khong_cho') {
                    let singleBox = new SingleOrGroupChat();
                    singleBox.idConver = keySingle;
                    singleBox.typeConver = 'don';
                    listIDConverUserJoin.push(singleBox)
                  }
                  // n???u l?? nh??m chat
                } else {
                  if (elementMember.key == idUser && elementMember.val().trang_thai == 'khong_cho' && elementMember.val().roi_chua == 'chua') {
                    let groupBox = new SingleOrGroupChat();
                    groupBox.idConver = keySingle;
                    groupBox.typeConver = 'nhom';
                    // l???y ra t??n nh??m
                    this.notificationMessageService_ws.access_thong_tin_tro_chuyen_nhom().child(keySingle).once('value', group => {
                      groupBox.nameGroup = group.val().ten_nhom
                    })
                    listIDConverUserJoin.push(groupBox)
                  }
                }
              });
            });

            //  v??o chi ti???t cu???c tr?? chuy???n l???y ra tin nh???n ch??a xem
            this.notificationMessageService_ws.access_chi_tiet_cuoc_tro_chuyen().on('value', converMess => {
              listIDConverUserJoin.forEach(elementJoin => {
                let idCon = elementJoin.idConver
                converMess.child(elementJoin.idConver).forEach(elementDetail => {
                  // ch??? x??t tin nh???n kh??ng ph???i thu h???i v?? kh??ng ph???i b???n th??n g???i
                  if (elementDetail.val().loai_tin_nhan != 'thu_hoi' && elementDetail.val().ma_tai_khoan != idUser) {
                    // l???y ra tin nh???n b???n th??n ch??a xem
                    elementDetail.child('tinh_trang_xem').forEach(watch => {
                      if (watch.key == idUser && watch.val().xem_chua == 'chua' && checkLoop != elementDetail.key) {
                        checkLoop = elementDetail.key
                        if (Notification.permission === 'granted') {
                          // truy c???p v??o t??i kho???n ????? l???y ra ???nh ?????i di???n
                          this.notificationMessageService_ws.access_tai_khoan().child(elementDetail.val().ma_tai_khoan).once('value', acc => {
                            let mess = new SettingNotification();
                            mess.urlAvatar = acc.val().link_hinh;
                            mess.idConversation = idCon;
                            mess.content = elementDetail.val().noi_dung;
                            mess.typeMess = elementDetail.val().loai_tin_nhan;
                            mess.soundNoti = set.val().am_thanh_thong_bao;
                            mess.contentNoti = set.val().hien_thi_ban_xem_truoc;
                            if (elementJoin.typeConver == 'nhom')
                              mess.name = elementJoin.nameGroup;
                            else
                              mess.name = elementDetail.val().ten;
                            this.notificationMessageService_ws.access_chi_tiet_cuoc_tro_chuyen().child(idCon).child(elementDetail.key).child('tinh_trang_xem').child(idUser).update({
                              ngay_nhan: Number(new Date()),
                              xem_chua: 'dang'
                            })
                            if (mess.typeMess == 'gui_tin_nhan_btcx')
                              mess.alt = elementDetail.val().alt;
                            this.showMessage(mess)
                          })
                        }
                      }
                    });
                  }
                });
              });
            })
          })
        })
      }
    })

  }

  // format th??ng b??o tin nh???n m???i v?? hi???n th???
  showMessage(mess: SettingNotification) {
    let result = '';
    switch (mess.typeMess) {
      case "gui_text":
        result = mess.content;
        break;
      case "gui_text_icon":
        result = "???? g???i icon";
        break;
      case "thong_bao":
        result = mess.content.charAt(0).toUpperCase() + mess.content.slice(1);
        break;
      case "gui_tin_nhan_like":
        result = "????";
        break;
      case "gui_hinh":
        result = "???? g???i h??nh ???nh";
        break;
      case "gui_video":
        result = "G???i m???t video";
        break;
      case "gui_ghi_am":
        result = "G???i m???t tin nh???n tho???i";
        break;
      case "gui_file":
        result = "G???i m???t t???p";
        break;
      case "phan_hoi":
        result = "Ph???n h???i m???t tin nh???n";
        break;
      case "gui_nhan_dan":
        result = "G???i m???t nh??n d??n"
        break;
      case "gui_giphy":
        result = "G???i m???t file GIF t??? GIPHY"
        break;
      case "gui_tin_nhan_btcx":
        result = mess.alt;
        break;

    }
    if (result != '') {
      // thay th??? t???t c??? <br> = ' '
      result = result.replace(/<br>/g, ' ');
      const notification = new Notification(mess.name, {
        body: mess.contentNoti == 'bat' ? result : '',
        icon: mess.urlAvatar,
        silent: mess.soundNoti == 'bat' ? false : true
      })

      notification.onclick = (e) => {
        window.close()
        window.open(location.origin + '/bessenger-ws/tin-nhan/' + mess.idConversation, '_blank');
      }
    }
  }

}
