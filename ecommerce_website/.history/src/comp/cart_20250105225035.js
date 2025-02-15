import React, { useState } from 'react';
import './cart.css';
import { Link } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import Modal from 'react-modal';
import { FaCopy } from 'react-icons/fa';

const Cart = ({ cart, setCart }) => {
    const [checkout, setCheckout] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: '', surname: '', phone: '' });
    const [trackingNumber, setTrackingNumber] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleCheckout = async () => {
        const token = Cookies.get('token'); // Récupérez le token JWT depuis les cookies (ou d'où vous le stockez)
        const response = await fetch('http://localhost:3001/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Ajoutez le token JWT dans l'en-tête Authorization
          },
          body: JSON.stringify({
            cart: cartItems,
            userInfo: userInformation,
          }),
        });
      
        if (response.ok) {
          // Traitez la réponse positive
        } else {
          console.error('Checkout failed');
          // Traitez l'erreur
        }
      };
      

    const incqty = async (product) => {
        const exist = cart.find((x) => x.id === product.id);
        if (exist) {
            const updatedQty = exist.qty + 1;
            await fetch(`http://localhost:3001/api/cart/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qty: updatedQty })
            });
            setCart(cart.map((curElm) =>
                curElm.id === product.id ? { ...exist, qty: updatedQty } : curElm
            ));
        }
    };

    const decqty = async (product) => {
        const exist = cart.find((x) => x.id === product.id);
        if (exist && exist.qty > 1) {
            const updatedQty = exist.qty - 1;
            await fetch(`http://localhost:3001/api/cart/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qty: updatedQty })
            });
            setCart(cart.map((curElm) =>
                curElm.id === product.id ? { ...exist, qty: updatedQty } : curElm
            ));
        } else {
            removeproduct(product);
        }
    };

    const removeproduct = async (product) => {
        await fetch(`http://localhost:3001/api/cart/${product.id}`, {
            method: 'DELETE'
        });
        setCart(cart.filter((curElm) => curElm.id !== product.id));
    };

    const total = cart.reduce((price, item) => price + item.qty * item.price, 0);

    const placeholderImage = "/uploads/placeholder.jpg"; // Remplace par le chemin réel de ton image de remplacement

    const renderProductImage = (imagePath) => {
        return imagePath && imagePath.trim() !== "" ? `http://localhost:3001${imagePath}` : placeholderImage;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(trackingNumber);
        alert('Numéro de suivi copié dans le presse-papiers');
    };

    return (
        <>
            <div className='cart'>
                <h3>#cart</h3>
                {cart.length === 0 &&
                    <div className='empty_cart'>
                        <h2>Votre panier est vide</h2>
                        <Link to='/shop'><button>Achetez maintenant</button></Link>
                    </div>
                }
                <div className='container'>
                    {cart.map((curElm) => (
                        <React.Fragment key={curElm.id}>
                            <div className='box'>
                                <div className='image'>
                                    <img src={renderProductImage(curElm.image)} alt='' />
                                </div>
                                <div className='detail'>
                                    <div className='info'>
                                        <h4>{curElm.cat}</h4>
                                        <h3>{curElm.name}</h3>
                                        <p>Price: {curElm.price} Mad</p>
                                        <p>Total: {curElm.price * curElm.qty} Mad</p>
                                    </div>
                                    <div className='quantity'>
                                        <button onClick={() => incqty(curElm)}>+</button>
                                        <input type='number' value={curElm.qty} readOnly />
                                        <button onClick={() => decqty(curElm)}>-</button>
                                    </div>
                                    <div className='icon'>
                                        <li onClick={() => removeproduct(curElm)}><AiOutlineClose /></li>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                {cart.length > 0 &&
                    <div className='bottom'>
                        <div className='Total'>
                            <h4>Sub Total: {total} Mad</h4>
                        </div>
                        <button onClick={() => setCheckout(true)}>Checkout</button>
                    </div>
                }
            </div>

            {checkout && (
                <div className='checkout'>
                    <h3>Checkout</h3>
                    <form onSubmit={handleCheckout}>
                        <div className='container'>
                            <input type='text' name='name' placeholder='Name' value={userInfo.name} onChange={handleChange} required />
                            <input type='text' name='surname' placeholder='Surname' value={userInfo.surname} onChange={handleChange} required />
                            <input type='text' name='phone' placeholder='Phone' value={userInfo.phone} onChange={handleChange} required />
                            <button type='submit'>Submit</button>
                        </div>
                    </form>
                </div>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Tracking Number Modal"
                className="modal"
                overlayClassName="overlay"
            >
                <h2>Merci pour votre commande, {userInfo.name} !</h2>
                <p>Voici votre numéro de suivi :</p>
                <div className="tracking-container">
                    <h3>{trackingNumber}</h3>
                    <button onClick={copyToClipboard} className="copy-button">
                        <FaCopy /> Copier
                    </button>
                </div>
                <p>Veuillez noter ce numéro pour suivre l'état de votre commande.</p>
                <Link to="/track-order">
                    <button onClick={() => setModalIsOpen(false)}>Suivre ma commande</button>
                </Link>
            </Modal>
        </>
    );
};

export default Cart;
