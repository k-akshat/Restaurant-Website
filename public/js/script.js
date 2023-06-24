
let menu = document.querySelector('#menu-bar');
let navBar = document.querySelector('.navbar');

function loader(){
    document.querySelector('.loader-container').classList.add('fade-out');
}
function fadeOut(){
    setInterval(loader, 2500);
}
window.onload = fadeOut;

menu.onclick = ()=>{
    menu.classList.toggle('fa-times');
    navBar.classList.toggle('active');
}
window.onscroll = ()=>{
    menu.classList.remove('fa-times');
    navBar.classList.remove('active');
}
document.querySelector('#search-icon').onclick = ()=>{
    document.querySelector('#search-form').classList.toggle('active');
}
document.querySelector('#close').onclick = ()=>{
    document.querySelector('#search-form').classList.remove('active');
}

const addCartButton = document.querySelectorAll('a.cart');
addCartButton.forEach((button)=>{
  button.addEventListener('click', (event)=>{
    event.preventDefault();
    console.log(button.dataset.doc);
    const endPoint = `/order/${button.dataset.doc}`;

    fetch(endPoint, {
      method: 'POST',     
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      window.location.href = '/order';
    })
    .catch(err => console.log(err));
  })
})


const rmCartButton = document.querySelectorAll('a.remove-cart');
rmCartButton.forEach((button)=>{
  button.addEventListener('click', (event)=>{
    event.preventDefault();
    console.log(button.dataset.doc);
    const endPoint = `/order/${button.dataset.doc}`;


    fetch(endPoint, {
      method: 'DELETE',     
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      window.location.href = '/order';
    })
    .catch(err => console.log(err));
  })
})

const qtyButton = document.querySelectorAll('input.qty');
qtyButton.forEach((button)=>{
  button.addEventListener('change', (event)=>{

    console.log(button.dataset.doc);

    const id = button.dataset.doc;
    const value = button.value;
    console.log(id, value);
    const data = {
      id, value
    }
    fetch('/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      window.location.href = '/order';
    })
    .catch(err => console.log(err));
  })
})


var swiper = new Swiper(".home-slider", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    loop:true,
  });

var swiper = new Swiper(".review-slider", {
    spaceBetween: 20,
    centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop:true,
    breakpoints:{
        0:{
            slidesPerView : 1,
        },
        640:{
            slidesPerView : 2,
        },
        768:{
            slidesPerView : 2,
        },
        1024:{
            slidesPerView : 3,
        },
    }
  });

