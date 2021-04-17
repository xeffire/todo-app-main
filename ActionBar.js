class ActionBar {
    constructor() {
        this.filters = document.getElementsByClassName("filter");
    }

    changeDisp(){
        if (window.innerWidth > 480 && !this.filters[0].classList.contains("show")) {
          this.filters[0].classList.add("show");
          this.filters[1].classList.remove("show");
        } else if (window.innerWidth < 480 && this.filters[0].classList.contains("show")) {
          this.filters[0].classList.remove("show");
          this.filters[1].classList.add("show");
        }
      }
}

export {ActionBar};