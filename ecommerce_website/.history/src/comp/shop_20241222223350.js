import React, { useState, useEffect } from 'react';
import './shop.css';
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";

const Shop = ({ addtocart }) => {
    const [showDetail, setShowDetail] = useState(false);
    const [detail, setDetail] = useState([]);
    const [shop, setShop] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (category = '') => {
        console.log('Fetching products for category:', category); // Debug log
        try {
            const response = await fetch(`http://localhost:3001/api/products?category=${category}`);
            const data = await response.json();
            console.log('Fetched products:', data); // Debug log
            setShop(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const detailpage = (product) => {
        setDetail(product);
        setShowDetail(true);
    };

    const closeDetail = () => {
        setShowDetail(false);
    };

    const filtercate = (category) => {
        console.log('Filtering by category:', category); // Debug log
        fetchProducts(category);
    };

    const allcatfilter = () => {
        console.log('Fetching all products'); // Debug log
        fetchProducts();
    };

    return (
        <>
            {showDetail ? (
                <div className='product_detail'>
                    <button className='close_btn' onClick={closeDetail}><AiOutlineClose /></button>
                    <div className='container'>
                        <div className='img_box'>
                            <img src={`http://localhost:3001${detail.image}`} alt=''></img>
                        </div>
                        <div className='info'>
                            <h4># {detail.type}</h4>
                            <h2>{detail.name}</h2>
                            <p>Ce produit exceptionnel offre un mélange parfait de qualité et de performance. Conçu avec des matériaux de première classe, il garantit une durabilité et une satisfaction optimale. Que ce soit pour un usage quotidien ou pour des occasions spéciales, ce produit répondra à toutes vos attentes. Ne manquez pas l'occasion d'améliorer votre expérience avec ce choix incontournable !</p>
                            <h3>${detail.price}</h3>
                            <button onClick={() => addtocart(detail)}>Add To Cart</button>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className='shop'>
                <h2># shop</h2>
                <p>Home . shop</p>
                <div className='container'>
                    <div className='left_box'>
                        <div className='category'>
                            <div className='header'>
                                <h3>All categories</h3>
                            </div>
                            <div className='box'>
                                <ul>
                                    <li onClick={() => allcatfilter()}># All</li>
                                    <li onClick={() => filtercate("tv")}># tv</li>
                                    <li onClick={() => filtercate("laptop")}># laptop</li>
                                    <li onClick={() => filtercate("watch")}># watch</li>
                                    <li onClick={() => filtercate("electromenager")}># electromenager</li>
                                    <li onClick={() => filtercate("electronics")}># electronics</li>
                                    <li onClick={() => filtercate("headphone")}># headphone</li>
                                    <li onClick={() => filtercate("phone")}># phone</li>
                                </ul>
                            </div>
                        </div>
                        <div className='banner'>
                            <div className='img_box'>
                                <img src='image/shop_left.jpg' alt=''></img>
                            </div>
                        </div>
                    </div>
                    <div className='right_box'>
                        <div className='banner'>
                            <div className='img_box'>
                                <img src='image/shop_top.jpg' alt=''></img>
                            </div>
                        </div>
                        <div className='product_box'>
                            <h2>Shop Product</h2>
                            <div className='product_container'>
                                {shop.map((curElm) => (
                                    <div key={curElm.id} className='box'>
                                        <div className='img_box'>
                                            <img src={`http://localhost:3001${curElm.image}`} alt='' ></img>
                                            <div className='icon'>
                                                <li><AiFillHeart /></li>
                                                <li onClick={() => detailpage(curElm)}><AiFillEye /></li>
                                            </div>
                                        </div>
                                        <div className='detail'>
                                            <h3>{curElm.name}</h3>
                                            <p>${curElm.price}</p>
                                            <button onClick={() => addtocart(curElm)}>Add To Cart</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Shop;
