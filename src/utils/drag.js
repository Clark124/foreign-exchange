export default class Drag {
    constructor(el,limitEl){
        this.el = document.querySelector(el);
        this.limitEl = document.querySelector(limitEl);
        this.disX = 0;
        this.disY = 0;
        this.init();
    }
    init(){
        this.el.onmousedown = (e)=>{
            this.disX = e.clientX - this.el.offsetLeft;
            this.disY = e.clientY - this.el.offsetTop;
            document.onmousemove = this.dragMove;
            document.onmouseup = this.dragEnd;
            return false;
        }
    }
    dragMove=(e)=>{
        this.el.style.left = e.clientX - this.disX + 'px';
        this.el.style.top = e.clientY - this.disY + 'px';
        /*if( this.el.offsetLeft < this.limitEl.offsetLeft){
            this.el.style.left = this.limitEl.offsetLeft + 'px';
        }*/
        if( this.el.offsetLeft < 0){
            this.el.style.left = 0;
        }
        if( this.el.offsetLeft + this.el.offsetWidth > this.limitEl.offsetWidth){
            this.el.style.left = this.limitEl.offsetWidth - this.el.offsetWidth + 'px';
        }
        if( this.el.offsetTop < 0 ){
            this.el.style.top = 0 + 'px';
        }
        if( this.el.offsetTop + this.el.offsetHeight > this.limitEl.offsetHeight){
            this.el.style.top = this.limitEl.offsetHeight - this.el.offsetHeight + 'px';
        }
    }
    dragEnd=()=>{
        document.onmousemove = null;
        document.onmouseup = null;
    }
}