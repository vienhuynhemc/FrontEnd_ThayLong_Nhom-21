import { VersionService } from './../../../service/version/version.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatPageFriendsLeftServiceService } from 'src/app/service/firebase/chat-page/chat-page-friends-page/chat-page-friends-left-service.service';
import { FriendsPageService } from 'src/app/service/firebase/friends-page/friends-page.service';
import { SettingsServiceService } from 'src/app/service/firebase/settings/settings-service.service';
import { NotificationService } from 'src/app/service/firebase/notification-settings/notification.service';
import { SettingNotification } from 'src/app/models/firebase/settings/settingNotification';
import { SingleOrGroupChat } from 'src/app/models/firebase/settings/SingleOrGroupChat';
import { ChatPageFriendsServiceService } from 'src/app/service/firebase/chat-page/chat-page-friends-page/chat-page-friends-service.service';
import { MainPageService } from 'src/app/service/firebase/main-page/main-page.service';
import { LoginService } from 'src/app/service/firebase/login/login.service';
import { MyNameService } from 'src/app/service/firebase/my-name/my-name.service';



@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private login_service: LoginService,
    public main_page_service: MainPageService,
    public friendsPageService: FriendsPageService,
    private chat_page_friends_object_left_service: ChatPageFriendsLeftServiceService,
    private chat_page_firends_service: ChatPageFriendsServiceService,
    public my_name_service: MyNameService,
    private settings_service: SettingsServiceService,
    private notificationMessageService: NotificationService,
    public version_service: VersionService
  ) {
  }

  ngOnInit(): void {
    if (this.version_service.version == 2) {
      this.router.navigate(['/change-version']);
    }
    if (!this.login_service.isLogin()) {
      this.router.navigate(['/dang-nhap']);
    } else {
      this.notificationMessage()
      if (this.main_page_service.layHinh == null) {
        this.getData();
      } else {
        this.main_page_service.layHinh.unsubscribe();
        this.getData();
      }
      if (this.my_name_service.layTen == null) {
        this.my_name_service.getName().subscribe(data => {
          this.my_name_service.myName = data.payload.toJSON()['ten'];
        })
      } else {
        this.my_name_service.layTen.unsubscribe();
        this.my_name_service.getName().subscribe(data => {
          this.my_name_service.myName = data.payload.toJSON()['ten'];
        });
      }
    }
  }

  public getData() {
    this.main_page_service.layHinh = this.main_page_service.getImg().subscribe(data => {
      this.main_page_service.setImg(data.payload.toJSON());
    });
  }

  // ????ng xu???t
  logOut(): void {
    this.login_service.logOut();
    this.main_page_service.reset();
    this.chat_page_friends_object_left_service.allBoxData = null;
    this.chat_page_firends_service.ban_bes = null;
    this.router.navigate(['/dang-nhap']);
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
    this.friendsPageService.selectedFriendsPageDefaultSerivce();
  }
  moveToChatPage(): void {
    this.router.navigate(['tin-nhan/danh-sach'], { relativeTo: this.route });
  }
  moveToChatRequestPage(): void {
    this.router.navigate(['tin-nhan-an'], { relativeTo: this.route });
  }
  moveToSettingPage(): void {
    this.router.navigate(['cai-dat'], { relativeTo: this.route });
    this.settings_service.selectedStateStatus();
  }
  //////////////////////////////////////////

  // th??ng b??o
  notificationMessage() {
    let idUser = JSON.parse(localStorage.getItem('ma_tai_khoan_dn'));
    // tr??nh l???p nhi???u l???n
    let checkLoop = ''
    this.notificationMessageService.accessSettings(idUser).once('value', set => {
      if (set.val().khong_lam_phien == 'tat') {
        // truy c???p l???y ra t???t c??? m?? cu???c tr?? chuy???n
        this.notificationMessageService.access_cuoc_tro_chuyen().on('value', conver => {
          // danh s??ch chat
          let listIDConver = []
          conver.forEach(elementConver => {
            listIDConver.push(elementConver.key)
          });
          // v??o thanh vi??n cu???c tr?? chuy???n ????? l???y ra danh s??ch c??c cu???c tr?? chuy???n b???n th??n c?? tham gia
          this.notificationMessageService.access_thanh_vien_cuoc_tro_chuyen().on('value', member => {
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
                    this.notificationMessageService.access_thong_tin_tro_chuyen_nhom().child(keySingle).once('value', group => {
                      groupBox.nameGroup = group.val().ten_nhom
                    })
                    listIDConverUserJoin.push(groupBox)
                  }
                }
              });
            });

            //  v??o chi ti???t cu???c tr?? chuy???n l???y ra tin nh???n ch??a xem
            this.notificationMessageService.access_chi_tiet_cuoc_tro_chuyen().on('value', converMess => {
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
                          this.notificationMessageService.access_tai_khoan().child(elementDetail.val().ma_tai_khoan).once('value', acc => {
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
                            this.notificationMessageService.access_chi_tiet_cuoc_tro_chuyen().child(idCon).child(elementDetail.key).child('tinh_trang_xem').child(idUser).update({
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
      // if(window.location.pathname != '/bessenger/tin-nhan/' + mess.idConversation) {
      notification.onclick = (e) => {
        window.close()
        window.open(location.origin + '/bessenger/tin-nhan/' + mess.idConversation, '_blank');
        // }
      }
    }
  }
}
