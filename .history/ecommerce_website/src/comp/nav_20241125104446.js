import React from 'react'
import { MdLocalShipping } from "react-icons/md";
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
    </div>    
    </>
  )
}

export default Nav