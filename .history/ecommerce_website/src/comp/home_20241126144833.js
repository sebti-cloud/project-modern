import React, { useState } from "react";
import './home.css';
import { Link } from "react-router-dom";
import Homeproduct from "./home_product";
const Home = () => {
    const [trendingProduct, setTrendingProduct] = useState(Homeproduct)
    return (
        <>
            <div className="home">
                <div className="top_banner">
                    <div className="contant">
                        <h3>silver aluminum</h3>
                        <h2>Apple Watch</h2>
                        <p>30%off at your first order</p>
                        <Link to='/shop' className="link">Shop Now</Link>
                    </div>
                </div>
                <div className="trending">
                    <div className="container">
                        <div className='left_box'>
                            <div className="header">
                                <div className="heading">
                                    <h2>trending product</h2>
                                </div>
                                <div className="cate">
                                    <h3>New</h3>
                                    <h3>Featured</h3>
                                    <h3>top selling</h3>
                                </div>
                            </div>
                            <div className="products">
                                <div className="container">
                                    {
                                        trendingProduct.map((curElm) => {
                                            return (
                                                <>
                                                    <div className="box">
                                                        <div className="img_box">
                                                            <img src={curElm.img} alt=''></img>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="right_box">

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home