import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainPageService } from './../../../service/main-page/main-page.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  constructor(
    private main_page_service: MainPageService,
    private router: Router
  ) {}
  selectedSlide: number = 1;
  timeOut: any = 0;
  ngOnInit(): void {
    setTimeout(() => {
      this.main_page_service.reset();
      this.main_page_service.selectTrangChu();
    }, 0);
   
    this.reset();
    this.setChangeSlide();
  }
  reset() {
    clearTimeout(this.timeOut);
    this.selectedSlide = 1;
    let slide1 = document.getElementById('slide-1');
    let slide2 = document.getElementById('slide-2');
    let slide3 = document.getElementById('slide-3');
    slide3.classList.remove('slide-selected');
    slide2.classList.remove('slide-selected');
    slide1.classList.add('slide-selected');
  }
  setChangeSlide() {
    let slide1 = document.getElementById('slide-1');
    let slide2 = document.getElementById('slide-2');
    let slide3 = document.getElementById('slide-3');

    this.timeOut = setTimeout(() => {
      if (this.selectedSlide == 0) {
        slide3.classList.remove('slide-selected');
        slide2.classList.remove('slide-selected');
        slide1.classList.add('slide-selected');
        this.selectedSlide = 1;
      } else if (this.selectedSlide == 1) {
        slide1.classList.remove('slide-selected');
        slide2.classList.add('slide-selected');
        slide3.classList.remove('slide-selected');

        let video = <HTMLVideoElement>document.getElementById('slide-2-video');
        video.load();
        this.selectedSlide = 2;
      } else {
        slide1.classList.remove('slide-selected');
        slide2.classList.remove('slide-selected');
        slide3.classList.add('slide-selected');
        this.selectedSlide = 0;
      }
      this.setChangeSlide();
    }, 7000);
  }
  slideClick(slide: number) {
      let slide1 = document.getElementById('slide-1');
      let slide2 = document.getElementById('slide-2');
      let slide3 = document.getElementById('slide-3');
      slide3.classList.remove('slide-selected');
      slide2.classList.remove('slide-selected');
      slide1.classList.remove('slide-selected');
      clearTimeout(this.timeOut);
      if (slide == 0) {
        slide3.classList.remove('slide-selected');
        slide2.classList.remove('slide-selected');
        slide1.classList.add('slide-selected');
        this.selectedSlide = 1;
      } else if (slide == 1) {
        slide1.classList.remove('slide-selected');
        slide3.classList.remove('slide-selected');
        slide2.classList.add('slide-selected');
        let video = <HTMLVideoElement>document.getElementById('slide-2-video');
        video.load();
        this.selectedSlide = 2;
      } else {
        slide2.classList.remove('slide-selected');
        slide1.classList.remove('slide-selected');
        slide3.classList.add('slide-selected');
        this.selectedSlide = 0;
      }
      this.setChangeSlide();
  }
  moveToMessage() {
    this.router.navigate(['/bessenger/tin-nhan/danh-sach']);
  }

  moveToRecomend() {
    this.router.navigate(['/bessenger/ban-be/de-xuat']);
  }
}
