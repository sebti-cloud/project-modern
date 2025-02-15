import React from 'react'
import { MdLocalShipping } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import './nav.css'

const Nav = () => {
  return (
    <>
    <div className='header'>
        <div className='top_header'>
          <div className='icon'>
            <MdLocalShipping />
          </div>
          <div className='info'>
            <p>Free Shipping when Shopping upto 2000 Mad</p>
          </div>
        </div>
        <div className='mid_header'>
          <div className='logo'>
            <img src='image/logo.jpg' alt='logo'></img>
          </div>
          <div className='search_box'>
            <input type='text' value='' placeholder='search'></input>
            <button><AiOutlineSearch /></button>
          </div>
        </div>
    </div>
    </>
  )
}

export default Nav