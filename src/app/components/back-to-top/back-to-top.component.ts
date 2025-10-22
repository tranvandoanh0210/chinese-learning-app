import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { fromEvent, Subscription, throttleTime } from 'rxjs';

@Component({
  selector: 'app-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.css'],

  standalone: true,
  imports: [CommonModule],
})
export class BackToTopComponent implements OnInit {
  isVisible = false;
  private scrollSubscription: Subscription | null = null;
  private isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnInit() {
    // Sử dụng RxJS để throttle scroll events
    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(throttleTime(1))
      .subscribe(() => {
        this.checkScrollPosition();
      });
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  private checkScrollPosition(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    // Hiển thị button khi scroll xuống 300px hoặc 1/3 màn hình
    this.isVisible = scrollPosition > Math.max(300, windowHeight / 3);
  }
  scrollToTop(): void {
    // Scroll tức thì
    window.scrollTo(0, 0);

    // Thêm hiệu ứng visual thay vì scroll animation
    this.addScrollEffect();
  }

  private addScrollEffect(): void {
    // Có thể thêm hiệu ứng fade in/out cho content
    // hoặc các hiệu ứng visual khác
  }
  // scrollToTop(): void {
  //   const scrollToTop = () => {
  //     const currentPosition = window.pageYOffset || document.documentElement.scrollTop;

  //     if (currentPosition > 0) {
  //       window.requestAnimationFrame(scrollToTop);
  //       window.scrollTo(0, currentPosition - currentPosition / 8); // Smooth scroll
  //     }
  //   };

  //   scrollToTop();
  // }

  // Alternative: Smooth scroll với behavior smooth
  scrollToTopSmooth(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
