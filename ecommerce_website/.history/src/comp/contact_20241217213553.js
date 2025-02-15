import React from 'react'
import './contact.css' 
const Contact = () => {
  return (
    <>
    <div className='contact'>
        <div className='container'>
            <div className='form'>
                <h2>#Contact us</h2>
                <form method='POST'>
                    <div className='box'>
                        <div className='lable'>
                            <h4>Name</h4>
                        </div>
                        <div className='input'>
                            <input type='text' placeholder='Name' value='' name=''></input>
                        </div>
                    </div>

                    <div className='box'>
                        <div className='lable'>
                            <h4>E-mail</h4>
                        </div>
                        <div className='input'>
                            <input type='email' placeholder='E-mail' value='' name=''></input>
                        </div>
                    </div>

                    <div className='box'>
                        <div className='lable'>
                            <h4>Subject</h4>
                        </div>
                        <div className='input'>
                            <input type='text' placeholder='Subject' value='' name=''></input>
                        </div>
                    </div>

                    <div className='box'>
                        <div className='lable'>
                            <h4>Name</h4>
                        </div>
                        <div className='input'>
                            <textarea placeholder='Message !' name='' value=''></textarea>
                        </div>
                       
                    </div>
                </form>
                <button type='sublit'>send</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default Contact