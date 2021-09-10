import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { MemberGroupChat } from 'src/app/models/chat-page/chat-page-file-page/member/member';
import { MyNameService } from 'src/app/service/firebase/my-name/my-name.service';
import { ChatPageChatPageContentService } from '../../chat-page-chat-page/chat-page-chat-page-content/chat-page-chat-page-content.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

    // Mặc định là đóng
  public isOpen:boolean;
  public memberList:MemberGroupChat[] = []
  public isAdmin: boolean = false;
  constructor(private db: AngularFireDatabase, private content_service: ChatPageChatPageContentService,
    private my_name_service: MyNameService) { }

  // lấy ra danh sách thành viên
  loadMemberGroupChat(ma_cuoc_tro_chuyen: string) {
    let parseID = JSON.parse(localStorage.getItem('ma_tai_khoan_dn'))
    this.accessthanh_vien_cuoc_tro_chuyen().child(ma_cuoc_tro_chuyen).on('value', member => {
        this.memberList = []
        let checkID = false;
        member.forEach(elementMember => {
          if(elementMember.val().roi_chua == 'chua') {
            let memberGroup = new MemberGroupChat();
            memberGroup.idUser = elementMember.key;
            memberGroup.role = elementMember.val().chuc_vu;
            memberGroup.dateJoin = elementMember.val().ngay_tham_gia;
            this.accesstai_khoan().child(elementMember.key).on('value', tk => {
              memberGroup.img = tk.val().link_hinh;
              memberGroup.name = tk.val().ten;
              this.memberList.push(memberGroup)
            })
            if(elementMember.key == parseID && elementMember.val().chuc_vu == 'quan_tri_vien' && !checkID)
              checkID = true;
            this.sortRole();
          }
        });
        this.isAdmin = checkID;
    })
  }

  // sắp xếp đưa quản trị viên lên đầu
  sortRole() {
    this.memberList = this.memberList.sort((role1, role2) => {
      var x = role1.role;
      var y = role2.role;
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }


  accessthanh_vien_cuoc_tro_chuyen() {
    return this.db.database.ref('thanh_vien_cuoc_tro_chuyen');
  }

  accesstai_khoan() {
    return this.db.database.ref('tai_khoan')
  }

    // lấy ra thanh viên cuộc trò chuyện
    getMembersConversation() {
      return this.db.database.ref('thanh_vien_cuoc_tro_chuyen/');
    }
  
    // lấy ra nhóm chat
  getGroupChat() {
    return this.db.database.ref('thong_tin_tro_chuyen_nhom/');
  }

  // cập nhật cuộc trò chuyện
  updateMembersConversation(idConver: string, idUser: string) {
    return this.db.database.ref('thanh_vien_cuoc_tro_chuyen/').child(idConver).child(idUser)
  }

   // loại cuộc trò chuyện
   getKindConversation() {
    return this.db.database.ref('cuoc_tro_chuyen/');
  }

  removeMember(ma_cuoc_tro_chuyen: string, member: MemberGroupChat) {
    this.content_service.sumitTinNhanThongBaoTaoNhom(ma_cuoc_tro_chuyen,
      "đã xóa thành viên " + member.name + " ra khỏi nhóm", "thong_bao", this.my_name_service.myName);
    this.accessthanh_vien_cuoc_tro_chuyen().child(ma_cuoc_tro_chuyen).child(member.idUser).update({
      ngay_roi_di: Number(new Date()),
      roi_chua: 'roi'
    })
  }

  decisionMember(ma_cuoc_tro_chuyen: string, id: string) {
    this.accessthanh_vien_cuoc_tro_chuyen().child(ma_cuoc_tro_chuyen).child(id).update({
      chuc_vu:'quan_tri_vien'
    })
  }

  outGroup(ma_cuoc_tro_chuyen: string, member: MemberGroupChat) {
    this.content_service.sumitTinNhanThongBaoTaoNhom(ma_cuoc_tro_chuyen,
      "đã rời khởi nhóm", "thong_bao", this.my_name_service.myName);
    // Rời nhóm
    this.accessthanh_vien_cuoc_tro_chuyen().child(ma_cuoc_tro_chuyen).child(member.idUser).update({
      ngay_roi_di: Number(new Date()),
      roi_chua: 'roi'
    })
    
  }
}
