import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { throwIfEmpty } from 'rxjs/operators';
import { AddFriendsInfor } from 'src/app/models/firebase/friends-page/add_friends';
import { FriendInfor } from 'src/app/models/firebase/friends-page/friend_Infor';
import { AddFriendsService } from 'src/app/service/firebase/friends-page/add-friends/add-friends.service';
import { ContactsService } from 'src/app/service/firebase/friends-page/contacts/contacts.service';
import { FriendsPageService } from 'src/app/service/firebase/friends-page/friends-page.service';
import { RequestAddFriendsService } from 'src/app/service/firebase/friends-page/request-add/request-add-friends.service';
import { SendAddFriendService } from 'src/app/service/firebase/friends-page/send-add/send-add-friend.service';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.component.html',
  styleUrls: ['./add-friends.component.scss'],
})
export class AddFriendsComponent implements OnInit, OnDestroy {
  
  valueSub: Subscription;
  iDUrl: any;
  mutualAddList: any[];
  idMutualAdd: string = '';
 
  constructor(
    public friendsPageService: FriendsPageService,
    private router: Router,
    private route: ActivatedRoute,
    private contactsService: ContactsService,
    public addListService: AddFriendsService,
    private requestListService: RequestAddFriendsService,
    private sendsListService: SendAddFriendService
  ) {}

  ngOnInit(): void {
    this.friendsPageService.selectedAddFriendsService();
    this.getIDURLFriendsList()
    this.getListAdd()
  }
  onClickExitMutual() {
    this.idMutualAdd = '';
  }
  sortMututalAdd() {
    this.mutualAddList = this.mutualAddList.sort((nameIn1, nameIn2) => {
      var x = nameIn1.getNameLast();
      var y = nameIn2.getNameLast();
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }
  onClickGetIDFriendMutual(id: string) {
    let parseIDUser = JSON.parse(localStorage.getItem('ma_tai_khoan_dn'));
    let listFriends = []
    this.idMutualAdd= id;
    let req
    // l???y ra danh s??ch b???n b?? id ??ang ????ng nh???p
    this.contactsService.getListIDFriendsByIDUser(parseIDUser).on('value', (friend) => {
      listFriends = []
        friend.forEach(element => {
            if(element.val().ton_tai == 0)
              listFriends.push(element.key)
        });
        // l???y ra danh s??ch b???n b?? c???a id ad
        this.contactsService.getListIDFriendsByIDUser(id).on('value', (friend_in)=> {
          this.mutualAddList = []
          friend_in.forEach(friend_i=> {
            listFriends.forEach(lfriends => {
              // ki???m tra c?? l?? b???n chung hay kh??ng
                if(friend_i.val().ton_tai == 0 && friend_i.key == lfriends) {
                    this.requestListService.getInforRequest(friend_i.key).on('value', (result) => {
                      req = new AddFriendsInfor()
                      let checkAdd = true;
                      req.id = result.key
                      req.img = result.val().link_hinh
                      req.name = result.val().ten
                      req.sex = result.val().gioi_tinh
                      req.date = friend_i.val().ngay_tao
                      // ki???m tra c?? n??n th??m v??o dnah s??ch hay kh??ng
                      this.mutualAddList.forEach(element => {
                          if(element.id == req.id)
                              checkAdd = false;
                      });
                      if(checkAdd) {
                        this.mutualAddList.push(req)
                      } else {
                        this.mutualAddList.forEach((element,index) => {
                            if(element.id == req.id) {
                              if(element.img != req.img || element.name != req.img || element.sex != req.sex || element.date != req.date) {
                                this.mutualAddList[index] = req
                              }
                            }
                        });
                      }
                      this.sortMututalAdd()
                    })
                    // th??m v??o danh s??ch sau ???? s???p x???p theo ABCD
                }
            });
          });
        })
    })
  }
  moveLink(link: string) {
    this.router.navigate(['/bessenger/ban-be/them-ban/' + link]);
  }
  // l???y ra idUrl
  getIDURLFriendsList() {
    this.valueSub = this.route.paramMap.subscribe((params) => {
      this.iDUrl = params.get('id');
    });
  }

  ngOnDestroy() {
    this.valueSub.unsubscribe();
    
  }

  // send object ????n profile
  sendFriendToProfile(id: any, addOrUndor: any) {
    this.contactsService.setAddInforService(id,addOrUndor);
    // loading
  }

  // click v??o b???t k?? ng?????i n??o
  onClickSelectedFriend(friend: AddFriendsInfor, iDURL: any) {
      if (friend != null && this.iDUrl != friend.id) {
        this.sendFriendToProfile(friend.id, friend.checkAddOrUndo);
        this.moveLink(friend.id);
      }
  }
  // l???y ra danh s??ch t??m ki???m
  getListAdd() {
    if(this.iDUrl != null) {
      let parseIDUser = JSON.parse(localStorage.getItem('ma_tai_khoan_dn'));
    // danh s??ch b???n b?? c???a id ??ang ????ng nh???p
    this.addListService.getListFriendsByIDUser(parseIDUser).on('value', (friends) => {
      setTimeout(() => {
        this.friendsPageService.setLoading(true)
      }, 0);
      let checkScroll = false;
      let listFriendsMe = [];
      if(friends.val() != null) {
        let check = true;
        // l???y ra danh s??ch b???n b??
        friends.forEach(f_item => {
            if(f_item.val().ton_tai == 0)
              listFriendsMe.push(f_item.key)
        });
        // l???y ra danh s??ch ng?????i d??ng ??ang ????ng nh???p nh???n y??u c???u
        this.addListService.getRequestInforByIDUser(parseIDUser).once('value', (request) => {
          let listMeRequest = []
          if(request.val() != null) {
            request.forEach(r_item => {
              if(r_item.val().ton_tai == 0) 
                listMeRequest.push(r_item.key)
            });
          }
          
          // l???y ra danh s??ch ng?????i d??ng ??ang ????ng nh???p ???? g???i yeu c???u
         
          this.addListService.getSendInforByIDUser(parseIDUser).once('value', (sends) => {
            let listMeSends = []
            if(sends.val() != null) {
              sends.forEach(s_item => {
                if(s_item.val().ton_tai == 0) 
                  listMeSends.push(s_item.key)
              });
            }
            // l???y ra danh s??ch t??i kho???n tr??n server
            this.addListService.getAllAccount().on('value', (account) => {
                if(account.val() != null && check) {
                  this.friendsPageService.addList = []
                  account.forEach(a_item => {
                    // n???u id != id ng?????i ??ang ????ng nh???p v?? c?? k?? t??? nh???p v??o, kh??ng n???m trong danh s??ch b???n b??, kh??ng n???m trong danh s??ch g???i y??u c???u, kh??ng n???m trong danh s??ch nh???n y??u c???u
                    // n???u id tr??ng v???i id tr??n url + load l???n ?????u
                    if(a_item.key != parseIDUser 
                        && a_item.key == this.iDUrl 
                        && !listMeSends.includes(a_item.key)
                        && !listMeRequest.includes(a_item.key)
                        && !listFriendsMe.includes(a_item.key)
                        ) {
                          let accountTemp = new AddFriendsInfor();
                          accountTemp.id = a_item.key;
                          accountTemp.name = a_item.val().ten;
                          accountTemp.img = a_item.val().link_hinh;
                          accountTemp.checkAddOrUndo = 'them';
                          if(this.friendsPageService.saveAddList.length != 0) {
                            this.friendsPageService.saveAddList.forEach(element => {
                                if(element.id == accountTemp.id)
                                  accountTemp.checkAddOrUndo = element.checkAddOrUndo;
                            });
                            
                          } else {
                            accountTemp.checkAddOrUndo = 'them';
                          }
                          this.friendsPageService.addList.push(accountTemp)
                         } else {
                          //  n???u kh??ng ph???i load l???n ?????u v?? id kh??ng tr??ng v???i idurl
                            if(this.friendsPageService.saveAddList.length >0) {
                              this.friendsPageService.saveAddList.forEach(element => {
                                  let accountTemp = new AddFriendsInfor();
                                  accountTemp.id = a_item.key;
                                  accountTemp.name = a_item.val().ten;
                                  accountTemp.img = a_item.val().link_hinh;
                                  accountTemp.checkAddOrUndo = 'them';
                                  if(element.id == a_item.key) {
                                    this.friendsPageService.saveAddList.forEach(element => {
                                          if(element.id == accountTemp.id)
                                            accountTemp.checkAddOrUndo = element.checkAddOrUndo;
                                    });
                                    this.friendsPageService.addList.push(accountTemp)
                                  } else if(a_item.key != parseIDUser 
                                      && !listMeSends.includes(a_item.key)
                                      && !listMeRequest.includes(a_item.key)
                                      && !listFriendsMe.includes(a_item.key)
                                      && a_item.val().ten.toLowerCase().trim().includes(this.friendsPageService.searchVal)
                                    ) {
                                      this.friendsPageService.addList.push(accountTemp)
                                  }
                              });
                              // n???u load l???n ?????u th?? th??m ng?????i d??ng c?? id tr??ng id tr??n url + nh???ng ng?????i c?? t??n tr??ng v???i ?? search
                            } else {
                              if(this.friendsPageService.searchVal != '') {
                                if(a_item.key != parseIDUser 
                                  && a_item.val().ten.toLowerCase().trim().includes(this.friendsPageService.searchVal)
                                  && !listMeSends.includes(a_item.key)
                                  && !listMeRequest.includes(a_item.key)
                                  && !listFriendsMe.includes(a_item.key)) {
                                    let accountTemp = new AddFriendsInfor();
                                    accountTemp.id = a_item.key;
                                    accountTemp.name = a_item.val().ten;
                                    accountTemp.img = a_item.val().link_hinh;
                                    accountTemp.checkAddOrUndo = 'them';
                                    this.friendsPageService.addList.push(accountTemp)
                                  }
                              }
                            }
                      }
                   
                  });
                  // duy???t qua danh s??ch t???ng th???ng trong danh s??ch t??m ki???m
                  this.friendsPageService.addList.forEach(AddFriends => {
                  // t??m ra danh s??ch b???n b?? c???a t???ng th???ng ????
                      this.addListService.getListFriendsByIDUser(AddFriends.id).on('value', (Add_item) => {
                        let countMutual = 0;
                        // n???u th???ng ???? c?? b???n b??
                        if(Add_item.val() != null) {
                          // duy???t qua danh s??ch b???n b??
                          Add_item.forEach(f_of_Add => {
                            // duy???t qua danh s??ch b???n b?? c???a th???ng ??ang ????ng nh???p
                              listFriendsMe.forEach(friends_me => {
                                  if(f_of_Add.key == friends_me && f_of_Add.val().ton_tai == 0) {
                                    countMutual++;
                                  }
                              });
                          });
                          if(countMutual != 0) {
                            AddFriends.mutualFriends = countMutual;
                          }
                        }
                      })
                  });
                 
                  if(check) {
                    if(this.friendsPageService.addList.length > 0) {
                      this.friendsPageService.setSizeAdd(this.friendsPageService.addList.length);
                      // n???u v???a load l???i trang m???i m?? c?? id th?? chuy???n id sang profile
                      if(this.friendsPageService.searchVal == '') {
                      this.contactsService.setAddInforService(
                       this.friendsPageService.addList[0].id,
                        this.friendsPageService.addList[0].checkAddOrUndo
                      );
                    }
                      check = false
                    } else {
                      
                      this.router.navigate(['/**']);
                      check = false
                    }
                  }
                }
            })
          })
        })
      }
      setTimeout(() => {
        this.friendsPageService.setLoading(false)
      }, 0);
    })
    } else {
      setTimeout(() => {
        this.friendsPageService.setLoading(true)
      }, 0);
      this.contactsService.setAddInforService(null,null);
      this.friendsPageService.saveAddList = []
      this.friendsPageService.addList = []
      this.friendsPageService.setSizeAdd(0);
      this.friendsPageService.searchVal = '';
      setTimeout(() => {
        this.friendsPageService.setLoading(false)
      }, 0);
    }
  }
  
  // th??m b???n
  onClickAddFriends(item: AddFriendsInfor, index: number) {
    let parseIDUser = JSON.parse(localStorage.getItem('ma_tai_khoan_dn'));
      this.friendsPageService.addList[index].checkAddOrUndo = 'thu_hoi';
      let checkAdd = false;
    // c???p nh???t danh s??ch l??u ???? th??m
      this.friendsPageService.saveAddList.forEach((element) => {
        if (element.id == item.id) {
          element.checkAddOrUndo = this.friendsPageService.addList[index].checkAddOrUndo;
          checkAdd = true;
        }
      });
      if(!checkAdd){
        this.friendsPageService.saveAddList.push({
          id: item.id,
          checkAddOrUndo: this.friendsPageService.addList[index].checkAddOrUndo,
        });
      }
       // c???p nh???t b???ng y??u c???u k???t b???n
    this.requestListService.acceptRequestService(item.id, parseIDUser).update({
      ngay_tao: Number(new Date()),
      ton_tai: 0

    })
    // c???p nh???t b???ng ???? g???i
    this.sendsListService.editSendService(item.id,parseIDUser).update({
      ngay_tao: Number(new Date()),
      ton_tai: 0
    })
    // th??m b???n nh??ng kh??ng chuy???n trang profile
    if(this.iDUrl == item.id) {
      this.contactsService.setAddInforService(
            item.id,
            item.checkAddOrUndo
      );
    }
    
    
  }

  // thu h???i y??u c???u k???t b???n
  onClickUndoAddFriends(item: AddFriendsInfor, index: number) {
    this.friendsPageService.addList[index].checkAddOrUndo = 'them';
    let parseIDUser = JSON.parse(localStorage.getItem('ma_tai_khoan_dn'));
    // c???p nh???t danh s??ch l??u ???? th??m
    let checkAdd = false;
      this.friendsPageService.saveAddList.forEach((element) => {
        if (element.id == item.id) {
          element.checkAddOrUndo = this.friendsPageService.addList[index].checkAddOrUndo;
          checkAdd = true;
        }
      });
      if(!checkAdd){
        this.friendsPageService.saveAddList.push({
          id: item.id,
          checkAddOrUndo: this.friendsPageService.addList[index].checkAddOrUndo,
        });
      }
          // c???p nh???t b???ng y??u c???u k???t b???n
    this.requestListService.acceptRequestService(item.id, parseIDUser).update({
      ton_tai: 1
    })
    // c???p nh???t b???ng ???? g???i
    this.sendsListService.editSendService(item.id,parseIDUser).update({
      ton_tai: 1
    })
    // h???y th??m b???n nh??ng kh??ng chuy???n trang profile
      if(this.iDUrl == item.id) {
        this.contactsService.setAddInforService(
              item.id,
              item.checkAddOrUndo
        );
      }
   
    
     
    
}
}
