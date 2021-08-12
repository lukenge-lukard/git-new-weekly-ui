const indicator = document.querySelector(".indicator");
let index = 0;

function indicateSlide(element){
    index=element.id;
    updateCircleIndicator();
}

function updateCircleIndicator(){
    for(let i=0; i<indicator.children.length; i++){
        indicator.children[i].classList.remove("active1");
    }
    indicator.children[index].classList.add("active1");
}