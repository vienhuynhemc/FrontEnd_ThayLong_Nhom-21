import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddFriendsWsService } from 'src/app/service/ws/friends-page/add-friends/add-friends-ws.service';
import { ContactsWsService } from 'src/app/service/ws/friends-page/contacts/contacts-ws.service';
import { FriendsPageWsService } from 'src/app/service/ws/friends-page/friends-page-ws.service';
import { SendAddFriendWsService } from 'src/app/service/ws/friends-page/send-add/send-add-friend-ws.service';
import { RequestAddFriendsWsService } from 'src/app/service/ws/friends-page/request-add/request-add-friends-ws.service';
import { MainPageWsService } from 'src/app/service/ws/main-page/main-page-ws.service';
import { Subscription } from 'rxjs';
import { AddFriendsInforWS } from 'src/app/models/ws/friends-page/add_friends_ws';

@Component({
  selector: 'app-friends-page-ws',
  templateUrl: './friends-page-ws.component.html',
  styleUrls: ['./friends-page-ws.component.scss']
})
export class FriendsPageWsComponent implements  OnInit, OnDestroy, AfterViewChecked {

  friendsPageDefautl: number;
  private valueFromChildSubscription: Subscription;
  idFriendFrist: any;
 
  constructor(
    private main_page_service_ws: MainPageWsService,
    private route: ActivatedRoute,
    private router: Router,
    public friendsPageServiceWS: FriendsPageWsService,
    private cdr: ChangeDetectorRef,
    public contactsServiceWS: ContactsWsService,
    public requestListServiceWS: RequestAddFriendsWsService,
    public sendsListServiceWS: SendAddFriendWsService,
    public addListServiceWS: AddFriendsWsService
  ) {}
  ngAfterViewChecked(): void { 
    this.cdr.detectChanges()
  }

  
  
  ngOnDestroy(): void {
    this.valueFromChildSubscription.unsubscribe();
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.main_page_service_ws.reset();
      this.main_page_service_ws.selectFriendsPage();
    }, 0);
    this.getSelectedFriendsPage();
    this.friendsPageServiceWS.saveAddList = []
    this.friendsPageServiceWS.saveOfferList = []
   
   
   
  }
  
  // get v??? tr???ng th??i page
  getSelectedFriendsPage() {
    this.valueFromChildSubscription = this.friendsPageServiceWS.friendsDefault.subscribe(friendsDefault => 
      {
        
        this.friendsPageDefautl = friendsDefault,
        this.onClickMenu(this.friendsPageDefautl);
      });
    
  }
 

  // click menu ban be, loi moi, da gui
  onClickMenu(index: number) {
    const friends = document.getElementById('btn-friends');
   
    const request = document.getElementById('btn-request');
    const send = document.getElementById('btn-send');
    const add = document.getElementById('btn-add-friends');
    const offer = document.getElementById('btn-offers');
    const iconFriends = document.getElementById('icon_f');
    const iconRequest = document.getElementById('icon_r');
    const iconSend = document.getElementById('icon_s');
    const iconAdd= document.getElementById('icon_add');
    const iconOffer = document.getElementById('icon_offers')
    if (index === 0) {
      friends.style.cssText = 'background-color: #3275f7;color: white;';
      iconFriends.style.color = 'white';

      request.style.cssText = 'background-color: white;color: black;';
      iconRequest.style.color = 'rgb(136, 133, 133)';

      send.style.cssText = 'background-color: white;color: black;';
      iconSend.style.color = 'rgb(136, 133, 133)';

      add.style.backgroundColor = 'white';
      iconAdd.style.color = '#888585';

      offer.style.backgroundColor = 'white';
      iconOffer.style.color = '#888585';
    } else if (index === 1) {
      friends.style.cssText = 'background-color: white;color: black;';
      iconFriends.style.color = 'rgb(136, 133, 133)';

      request.style.cssText = 'background-color: #3275f7;color: white;';
      iconRequest.style.color = 'white';

      send.style.cssText = 'background-color: white; color: black;';
      iconSend.style.color = 'rgb(136, 133, 133)';

      add.style.backgroundColor = 'white';
      iconAdd.style.color = '#888585';

      offer.style.backgroundColor = 'white';
      iconOffer.style.color = '#888585';
    } else if(index == 2) {
      friends.style.cssText = 'background-color: white; color: black;';
      iconFriends.style.color = 'rgb(136, 133, 133)';

      request.style.cssText = 'background-color: white; color: black;';
      iconRequest.style.color = 'rgb(136, 133, 133)';

      send.style.cssText = 'background-color: #3275f7; color: white;';
      iconSend.style.color = 'white';

      add.style.backgroundColor = 'white';
      iconAdd.style.color = '#888585';

      offer.style.backgroundColor = 'white';
      iconOffer.style.color = '#888585';
    } else if(index == 3) {
      friends.style.cssText = 'background-color: white; color: black;';
      iconFriends.style.color = 'rgb(136, 133, 133)';

      request.style.cssText = 'background-color: white; color: black;';
      iconRequest.style.color = 'rgb(136, 133, 133)';

      send.style.cssText = 'background-color: white; color: black;';
      iconSend.style.color = 'rgb(136, 133, 133)';

      add.style.backgroundColor = '#3275f7';
      iconAdd.style.color = 'white';

      offer.style.backgroundColor = 'white';
      iconOffer.style.color = '#888585';

    } else {
      friends.style.cssText = 'background-color: white; color: black;';
      iconFriends.style.color = 'rgb(136, 133, 133)';

      request.style.cssText = 'background-color: white; color: black;';
      iconRequest.style.color = 'rgb(136, 133, 133)';

      send.style.cssText = 'background-color: white; color: black;';
      iconSend.style.color = 'rgb(136, 133, 133)';

      add.style.backgroundColor = 'white';
      iconAdd.style.color = '#888585';

      offer.style.backgroundColor = '#3275f7';
      iconOffer.style.color = 'white';
    }
  }
  
 

 // chuy???n trang
  moveToFriends(): void {
      if(this.friendsPageDefautl != 0) {
        this.router.navigate(['lien-lac/'], { relativeTo: this.route});
        this.friendsPageServiceWS.selectedFriendsPageDefaultSerivce();
        this.contactsServiceWS.setFriendInforService(null);
      }
  }
  moveToRequest(): void {
    if(this.friendsPageDefautl != 1) {
      this.router.navigate(['loi-moi/'], { relativeTo: this.route});
      this.friendsPageServiceWS.selectedRequestService()
      this.contactsServiceWS.setFriendInforService(null);
    }
  
  }
  moveToSend(): void {
    if(this.friendsPageDefautl != 2) {
      this.router.navigate(['da-gui/'], { relativeTo: this.route});
      this.friendsPageServiceWS.selectedSendService()
      this.contactsServiceWS.setFriendInforService(null);
    }
  }
  moveToAddFriends() {
    if(this.friendsPageDefautl != 3) {
      this.router.navigate(['them-ban/'], { relativeTo: this.route});
      this.friendsPageServiceWS.selectedAddFriendsService()
      this.contactsServiceWS.setAddInforService(null,null);
      // g???i h??m ????? tr??nh t??nh tr???ng hi???n th??? l???i gi?? tr??? c?? do firebase t??? update ban_be
      this.searchAddFriends('')
    }
  }

  moveToOfferFriends() {
    if(this.friendsPageDefautl != 4) {
      this.router.navigate(['de-xuat/'], { relativeTo: this.route});
      this.friendsPageServiceWS.selectedOffersFriendsService();
      this.contactsServiceWS.setOfferInforService(null,null);
    }
  }
  // xoa ban be

   // kh??ng x??a 
   onClickNonAcceptUnFriend() {
    this.friendsPageServiceWS.setIDUnFriend('');
    this.friendsPageServiceWS.setNameUnFriend('');
  }

  sendFriendToProfile(id: any) {
    this.contactsServiceWS.setFriendInforService(id);
  }
  // ch???p nh???n x??a k???t b???n
  onClickAcceptUnFriend() {
    let parseIDUser = JSON.parse(localStorage.getItem('ma_tai_khoan_dn_ws'));
    this.contactsServiceWS.unFriendByIDUser(this.friendsPageServiceWS.getIDUnFriend(), parseIDUser).update({
      ton_tai: 1
    })
    this.contactsServiceWS.unFriendByIDUser(parseIDUser, this.friendsPageServiceWS.getIDUnFriend()).update({
      ton_tai: 1
    })
    this.router.navigate(['/bessenger-ws/ban-be/lien-lac/']);
    this.sendFriendToProfile(null);
    this.friendsPageServiceWS.setIDUnFriend('');
    this.friendsPageServiceWS.setNameUnFriend('');
}

  // t??m ki???m b???n b??
  searchFriends(searchValue: string) {
    let parseIDUser = JSON.parse(localStorage.getItem('ma_tai_khoan_dn_ws'));
    this.friendsPageServiceWS.friendsList = [];
    this.contactsServiceWS
      .getListIDFriendsByIDUser(parseIDUser)
      .on('value', (data) => {
        // loading
       
        this.friendsPageServiceWS.friendsList = [];
        
        if (data.val() != null) {
          data.forEach((element) => {
           
            // l???y ra danh s??ch b???n b??
            if (element.val().ton_tai == 0) {
              let temp = this.contactsServiceWS.getListFriendsInforByIDFriends(
                element.key
              );

              if (temp != null && temp.name.toLowerCase().trim().includes(searchValue.toLowerCase().trim())) {
                this.friendsPageServiceWS.friendsList.push(temp);
              }
            }
          });

          // l???y s??? l?????ng b???n b??
          this.friendsPageServiceWS.setSizeFriends(
            this.friendsPageServiceWS.friendsList.length
          );
          // l???y ra b???n chung c???a m???i ng?????i
          //  duy???t qua t???ng m?? t??i kho???n b???n b??

          data.forEach((element) => {
            let count = 0;
            // l???y ra danh s??ch b???n b?? c???a m???i m?? t??i kho???n b???n b??
            this.contactsServiceWS
              .getListIDFriendsByIDUser(element.key)
              .on('value', (data_friends) => {
                // sort theo t??n
                setTimeout(() => {
                  this.friendsPageServiceWS.setLoading(true)
                }, 0);
                this.friendsPageServiceWS.sortFriendsListNameABC();
                if (data_friends.val() != null) {
                  // ki???m tra c?? bao nhi??u b???n chung
                  data_friends.forEach((element_f) => {
                    this.friendsPageServiceWS.friendsList.forEach((element) => {
                      if (
                        element_f.val().ton_tai == 0 &&
                        element_f.key != parseIDUser &&
                        element_f.key == element.id
                      ) {
                        count++;
                      }
                    });
                  });
                  // th??m b???n chung v??o b???n b??
                  this.friendsPageServiceWS.friendsList.forEach((element) => {
                    if (element.id == data_friends.key)
                      element.mutualFriends = count;
                  });
                  count = 0;
                }
                setTimeout(() => {
                  this.friendsPageServiceWS.setLoading(false)
                }, 0);
              });
          });
        }
        // n???u danh s??ch r???ng th?? th??m size = 0
        if (this.friendsPageServiceWS.friendsList.length == 0) {
          this.friendsPageServiceWS.setSizeFriends(0);
        }
       
      });
  }

  // t??m ki???m danh s??ch l???i m???i k???t b???n
  searchRequest(searchValue: string) {
    let count = 0
    let friendsTempOfUser = []
    let parseIDUser = JSON.parse(localStorage.getItem('ma_tai_khoan_dn_ws'));
    this.requestListServiceWS.getRequestInforByIDUser(parseIDUser).on('value', (data) => {
       // l???y ra danh s??ch id b???n b?? c???a id ??ang ????ng nh???p
       this.contactsServiceWS.getListIDFriendsByIDUser(parseIDUser).on('value', (friend_l) => {
        friendsTempOfUser = []
        friend_l.forEach(element => {
          if(element.val().ton_tai == 0)
            friendsTempOfUser.push(element.key)
        });
    })
      // loading
     
      this.friendsPageServiceWS.requestList = []
      data.forEach((element) => {
         // l???y ra danh s??ch request
        if(element.val().ton_tai == 0) {
          let temp = this.requestListServiceWS.getListRequestInforByIDRequest(element.key)
          temp.dateRequest = element.val().ngay_tao
          if(temp != null && temp.name.toLowerCase().trim().includes(searchValue.toLowerCase().trim())) {
            // t??m ra danh s??ch b???n c???a id request
            this.contactsServiceWS.getListIDFriendsByIDUser(element.key).on('value',(data) => {
                // t??m ra b???n chung v???i id ??ang ????ng nh???p
                data.forEach(element => {
                  friendsTempOfUser.forEach(val => {
                      if(element.val().ton_tai == 0 && element.key == val) 
                        count++;
                  });
                });
                temp.mutualFriends = count;
                count = 0
                this.friendsPageServiceWS.sortRequestListDate();
            })
            this.friendsPageServiceWS.requestList.push(temp);
             this.friendsPageServiceWS.sortRequestListDate();
          }
        }
      })
      // l???y s??? l?????ng request
      this.friendsPageServiceWS.setSizeRequest(this.friendsPageServiceWS.requestList.length)
      // l???y ra b???n chung
      
    })
  }

  // t??m ki???m danh s??ch l???i m???i k???t b???n
  searchSends(searchValue: string) {
    let count = 0
    let friendsTempOfUser = []
    let parseIDUser = JSON.parse(localStorage.getItem('ma_tai_khoan_dn_ws'));
    this.sendsListServiceWS.getSendInforByIDUser(parseIDUser).on('value', (data) => {
       // l???y ra danh s??ch id b???n b?? c???a id ??ang ????ng nh???p
       this.contactsServiceWS.getListIDFriendsByIDUser(parseIDUser).on('value', (friend_l) => {
        friendsTempOfUser = []
        friend_l.forEach(element => {
          if(element.val().ton_tai == 0)
            friendsTempOfUser.push(element.key)
        });
    })
      // loading
      this.friendsPageServiceWS.sendstList = []
      data.forEach((element) => {
         // l???y ra danh s??ch request
        if(element.val().ton_tai == 0) {
          let temp = this.sendsListServiceWS.getListSendInforByIDSend(element.key)
          temp.dateSend = element.val().ngay_tao
          if(temp != null && temp.name.toLowerCase().trim().includes(searchValue.toLowerCase().trim())) {
            // t??m ra danh s??ch b???n c???a id request
            this.contactsServiceWS.getListIDFriendsByIDUser(element.key).on('value',(data) => {
                // t??m ra b???n chung v???i id ??ang ????ng nh???p
                data.forEach(element => {
                  friendsTempOfUser.forEach(val => {
                      if(element.val().ton_tai == 0 && element.key == val) 
                        count++;
                  });
                });
                temp.mutualFriends = count;
                count = 0
                this.friendsPageServiceWS.sortSendListDate();
            })
            this.friendsPageServiceWS.sendstList.push(temp);
             this.friendsPageServiceWS.sortSendListDate();
          }
        }
      })
      // l???y s??? l?????ng request
      this.friendsPageServiceWS.setSizeSends(this.friendsPageServiceWS.sendstList.length)
      // l???y ra b???n chung
      
    })
  }

  // danh s??ch b???n v???a t??m
  searchAddFriends(searchValue: string) {
    this.friendsPageServiceWS.searchVal = searchValue
    let parseIDUser = JSON.parse(localStorage.getItem('ma_tai_khoan_dn_ws'));
    // danh s??ch b???n b?? c???a id ??ang ????ng nh???p
    this.addListServiceWS.getListFriendsByIDUser(parseIDUser).on('value', (friends) => {
      setTimeout(() => {
        this.friendsPageServiceWS.setLoading(true)
      }, 0);
      let listFriendsMe = [];
        // l???y ra danh s??ch b???n b??
        friends.forEach(f_item => {
            if(f_item.val().ton_tai == 0)
              listFriendsMe.push(f_item.key)
        });
        // l???y ra danh s??ch ng?????i d??ng ??ang ????ng nh???p nh???n y??u c???u
        this.addListServiceWS.getRequestInforByIDUser(parseIDUser).once('value', (request) => {
          let listMeRequest = []
          if(request.val() != null) {
            request.forEach(r_item => {
              if(r_item.val().ton_tai == 0) 
                listMeRequest.push(r_item.key)
            });
          }
          
          // l???y ra danh s??ch ng?????i d??ng ??ang ????ng nh???p ???? g???i yeu c???u
          this.addListServiceWS.getSendInforByIDUser(parseIDUser).once('value', (sends) => {
            let listMeSends = []
            if(sends.val() != null) {
              sends.forEach(s_item => {
                if(s_item.val().ton_tai == 0) 
                  listMeSends.push(s_item.key)
              });
            }
         
            // l???y ra danh s??ch t??i kho???n tr??n server
            this.addListServiceWS.getAllAccount().on('value', (account) => {
                if(account.val() != null) {
                  this.friendsPageServiceWS.addList = []
                  account.forEach(a_item => {
                    // n???u id != id ng?????i ??ang ????ng nh???p v?? c?? k?? t??? nh???p v??o, kh??ng n???m trong danh s??ch b???n b??, kh??ng n???m trong danh s??ch g???i y??u c???u, kh??ng n???m trong danh s??ch nh???n y??u c???u
                      if(a_item.key != parseIDUser 
                        && a_item.val().ten.toLowerCase().trim().includes(this.friendsPageServiceWS.searchVal.toLowerCase().trim()) 
                        && !listFriendsMe.includes(a_item.key)
                        && !listMeRequest.includes(a_item.key)
                        && !listMeSends.includes(a_item.key) && this.friendsPageServiceWS.searchVal.trim() != '') {
                          let accountTemp = new AddFriendsInforWS();
                          accountTemp.id = a_item.key;
                          accountTemp.name = a_item.val().ten;
                          accountTemp.img = a_item.val().link_hinh;
                          accountTemp.lastOnline = a_item.val().lan_cuoi_dang_nhap;
                          accountTemp.checkAddOrUndo = 'them';
                          
                          if(this.friendsPageServiceWS.saveAddList.length != 0) {
                            this.friendsPageServiceWS.saveAddList.forEach(element => {
                                if(element.id == accountTemp.id)
                                  accountTemp.checkAddOrUndo = element.checkAddOrUndo;
                            });
                            
                          } else {
                            accountTemp.checkAddOrUndo = 'them';
                          }
                          this.friendsPageServiceWS.addList.push(accountTemp)
                         
                      }
                  });
                  // duy???t qua danh s??ch t???ng th???ng trong danh s??ch t??m ki???m
                  this.friendsPageServiceWS.addList.forEach(AddFriends => {
                  // t??m ra danh s??ch b???n b?? c???a t???ng th???ng ????
                      this.addListServiceWS.getListFriendsByIDUser(AddFriends.id).on('value', (Add_item) => {
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
                  this.friendsPageServiceWS.sortMutualFriendsAdd();
                  this.friendsPageServiceWS.setSizeAdd(this.friendsPageServiceWS.addList.length);
                  
                }
            })
          })
        })
      setTimeout(() => {
        this.friendsPageServiceWS.setLoading(false)
      }, 0);
    })
  
  }

}
