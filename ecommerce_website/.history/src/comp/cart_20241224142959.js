import React, { useState } from 'react';
import './cart.css';
import { Link } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';

const Cart = ({ cart, setCart }) => {
    const [checkout, setCheckout] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: '', surname: '', phone: '' });

    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:3001/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart, userInfo })
        });
        if (response.ok) {
            alert('Checkout successful!');
            setCart([]);
            setCheckout(false);
        } else {
            alert('Checkout failed');
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

    return (
        <>
            <div className='cart'>
                <h3>#cart</h3>
                {cart.length === 0 &&
                    <div className='empty_cart'>
                        <h2>Your shopping cart is empty</h2>
                        <Link to='/shop'><button>Shop Now</button></Link>
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
                                        <p>Price: ${curElm.price}</p>
                                        <p>Total: ${curElm.price * curElm.qty}</p>
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
                            <h4>Sub Total: Mad{total}</h4>
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
        </>
    );
};

export default Cart;
