import React from 'react'
import './footer.css'
import { FaPiggyBank } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className='footer'>
      <div className='container'>
        <div className='left-box'>
          <div className='box'>
            <div className='icon_box'>
              <FaPiggyBank />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
