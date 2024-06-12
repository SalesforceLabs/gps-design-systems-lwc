import { LightningElement, api } from "lwc";

export default class SfGpsDsAuVic2Swiper extends LightningElement {
  @api containerClassName;
  @api wrapperClassName;
  @api className;

  @api needsNavigation = false;
  @api needsScrollbar = false;
  @api needsPagination = false;

  @api slides = [];
  @api slidesGrid = [];
  @api snapGrid = [];
  @api slidesSizesGrid = [];

  @api direction;
  @api activeIndex = 0;
  @api realIndex = 0;

  _isBeginning = true;

  @api get isBeginning() {
    return this._isBeginning;
  }

  set isBeginning(value) {
    this._isBeginning = value;
  }

  @api isEnd = false;

  @api translate = 0;
  @api previousTranslate = 0;
  @api progresss = 0;
  @api velocity = 0;
  @api animating = false;

  @api allowSlideNext;
  @api allowSlidePrev;
  @api allowClick;
  @api allowTouchMove;

  @api slidesPerView;
  @api spaceBetween;

  get isHorizontal() {
    return this.direction === "horizontal";
  }
  get isVertical() {
    return this.direction === "vertical";
  }

  get nextEl() {
    return this.refs.nextElRef;
  }
  get prevEl() {
    return this.refs.prevElRef;
  }
  get paginationEl() {
    return this.refs.paginationElRef;
  }
  get scrollbarEl() {
    return this.refs.scrollbarElRef;
  }
  get swipper() {
    return this.refs.swiperElRef;
  }

  /* methods */

  getDirectionLabel(property) {
    if (this.isHorizontal()) {
      return property;
    }
    // prettier-ignore
    return {
      "width": "height",
      "margin-top": "margin-left",
      "margin-bottom ": "margin-right",
      "margin-left": "margin-top",
      "margin-right": "margin-bottom",
      "padding-left": "padding-top",
      "padding-right": "padding-bottom",
      "marginRight": "marginBottom",
    }[property];
  }

  dispatchSwiper() {
    this.dispatchEvent(new CustomEvent("swiper"));
  }

  dispatchSlideChange() {
    this.dispatchEvent(new CustomEvent("slidechange"));
  }

  getSlideClassName(slideEl) {
    if (this.destroyed) return "";

    return slideEl.className
      .split(" ")
      .filter((className) => {
        return (
          className.indexOf("swiper-slide") === 0 ||
          className.indexOf(this.slideClassName) === 0
        );
      })
      .join(" ");
  }

  slidesPerViewDynamic(view = "current", exact = false) {
    const swiper = this;
    const {
      // eslint-disable-next-line
      params,
      slides,
      slidesGrid,
      slidesSizesGrid,
      size: swiperSize,
      activeIndex
    } = swiper;
    let spv = 1;

    if (typeof this.slidesPerView === "number") {
      return this.slidesPerView;
    }

    if (this.centeredSlides) {
      let slideSize = slides[activeIndex]
        ? slides[activeIndex].swiperSlideSize
        : 0;
      let breakLoop;
      for (let i = activeIndex + 1; i < slides.length; i += 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }

      for (let i = activeIndex - 1; i >= 0; i -= 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
    } else {
      // eslint-disable-next-line
      if (view === "current") {
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          const slideInView = exact
            ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] <
              swiperSize
            : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        // previous
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          const slideInView =
            slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      }
    }
    return spv;
  }

  update() {
    if (this.destroyed) {
      return;
    }

    const snapGrid = this.snapGrid;
    const params = this.params;

    this.updateSize();
    this.updateSlides();
    this.updateProgress();
    this.updateSlideClasses();

    let translated;

    if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
      this.setTranslate();
      if (params.autoHeight) {
        this.updateAutoHeight();
      }
    } else {
      if (
        (this.slidesPerView === "auto" || this.slidesPerView > 1) &&
        this.isEnd &&
        !this.centeredSlides
      ) {
        const slides =
          this.virtual && params.virtual.enabled
            ? this.virtual.slides
            : this.slides;
        translated = this.slideTo(slides.length - 1, 0, false, true);
      } else {
        translated = this.slideTo(this.activeIndex, 0, false, true);
      }
      if (!translated) {
        this.setTranslate();
      }
    }

    if (params.watchOverflow && snapGrid !== this.snapGrid) {
      this.checkOverflow();
    }

    this.dispatchEvent(new CustomEvent("update"));
  }

  setTranslate() {
    const translateValue = this.rtlTranslate
      ? this.translate * -1
      : this.translate;
    const newTranslate = Math.min(
      Math.max(translateValue, this.maxTranslate()),
      this.minTranslate()
    );
    this.setTranslate(newTranslate);
    this.updateActiveIndex();
    this.updateSlidesClasses();
  }

  changeDirection(newDirection, needUpdate = true) {
    const currentDirection = this.direction;
    if (!newDirection) {
      // eslint-disable-next-line
      newDirection =
        currentDirection === "horizontal" ? "vertical" : "horizontal";
    }
    if (
      newDirection === currentDirection ||
      (newDirection !== "horizontal" && newDirection !== "vertical")
    ) {
      return this;
    }

    this.el.classList.remove(
      `${this.containerModifierClass}${currentDirection}`
    );
    this.el.classList.add(`${this.containerModifierClass}${newDirection}`);
    this.emitContainerClasses();

    /* eslint-disable @lwc/lwc/no-api-reassignments */
    this.direction = newDirection;

    this.slides.forEach((slideEl) => {
      if (newDirection === "vertical") {
        slideEl.style.width = "";
      } else {
        slideEl.style.height = "";
      }
    });

    this.dispatchEvent(new CustomEvent("changeDirection"));
    if (needUpdate) this.update();

    return this;
  }

  changeLanguageDirection(direction) {
    if ((this.rtl && direction === "rtl") || (!this.rtl && direction === "ltr"))
      return;
    this.rtl = direction === "rtl";
    this.rtlTranslate = this.direction === "horizontal" && this.rtl;
    if (this.rtl) {
      this.classList.add(`${this.containerModifierClassName}rtl`);
      this.el.dir = "rtl";
    } else {
      this.el.classList.remove(
        `${swiper.params.containerModifierClassName}rtl`
      );
      this.el.dir = "ltr";
    }
    this.update();
  }

  mounted;

  connectedCallback() {
    if (this.mounted === false) {
      this.mounted = true;

      if (typeof this.el === "string") {
        this.el = this.template.querySelector("el");
      }
      if (!this.el) {
        return false;
      }
    }
  }

  @api enable() {
    if (this.enabled) return;

    this.enabled = true;

    if (this.grabCursor) {
      this.setGrabCursor();
    }

    this.dispatchEvent(new CustomEvent("enable"));
  }

  @api disable() {
    if (!this.enabled) return;

    this.enabled = false;

    if (this.grabCursor) {
      this.unsetGrabCursor();
    }

    this.dispatchEvent(new CustomEvent("disable"));
  }

  @api setProgress(progress, speed) {
    progress = Math.min(Math.max(progress, 0), 1);
    const min = this.minTranslate();
    const max = this.maxTranslate();
    const current = (max - min) * progress + min;
    this.translateTo(current, typeof speed === "undefined" ? 0 : speed);
    this.updateActiveIndex();
    this.updateSlidesClasses();
  }
}
