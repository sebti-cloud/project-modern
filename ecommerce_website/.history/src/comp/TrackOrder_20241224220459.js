import React from 'react';
const one = document.querySelector(".one");
const two = document.querySelector(".two");
const three = document.querySelector(".three");
const four = document.querySelector(".four");
const five = document.querySelector(".five");



const TrackOrder = () => {

    one.onclick = function() {
        one.classList.add("active");
        two.classList.remove("active");
        three.classList.remove("active");
        four.classList.remove("active");
        five.classList.remove("active");
    }
    
    two.onclick = function() {
        one.classList.add("active");
        two.classList.add("active");
        three.classList.remove("active");
        four.classList.remove("active");
        five.classList.remove("active");
    }
    three.onclick = function() {
        one.classList.add("active");
        two.classList.add("active");
        three.classList.add("active");
        four.classList.remove("active");
        five.classList.remove("active");
    }
    four.onclick = function() {
        one.classList.add("active");
        two.classList.add("active");
        three.classList.add("active");
        four.classList.add("active");
        five.classList.remove("active");
    }
    five.onclick = function() {
        one.classList.add("active");
        two.classList.add("active");
        three.classList.add("active");
        four.classList.add("active");
        five.classList.add("active");
    }
    
  return (

        <div class="main">
    
            <div class="head">
                <p class="head_1">Animated Step <span>Progress Bar</span></p>
                <p class="head_2">Using Html, Css & JavaScript</p>
            </div>
    
            <ul>
                <li>
                    <i class="icon uil uil-capture"></i>
                    <div class="progress one">
                        <p>1</p>
                        <i class="uil uil-check"></i>
                    </div>
                    <p class="text">Add To Cart</p>
                </li>
                <li>
                    <i class="icon uil uil-clipboard-notes"></i>
                    <div class="progress two">
                        <p>2</p>
                        <i class="uil uil-check"></i>
                    </div>
                    <p class="text">Fill Details</p>
                </li>
                <li>
                    <i class="icon uil uil-credit-card"></i>
                    <div class="progress three">
                        <p>3</p>
                        <i class="uil uil-check"></i>
                    </div>
                    <p class="text">Make Payment</p>
                </li>
                <li>
                    <i class="icon uil uil-exchange"></i>
                    <div class="progress four">
                        <p>4</p>
                        <i class="uil uil-check"></i>
                    </div>
                    <p class="text">Order in Progress</p>
                </li>
                <li>
                    <i class="icon uil uil-map-marker"></i>
                    <div class="progress five">
                        <p>5</p>
                        <i class="uil uil-check"></i>
                    </div>
                    <p class="text">Order Arrived</p>
                </li>
            </ul>
    
        </div>
    
  )
}
  

export default TrackOrder;
