import React from "react";
import './home.css';
import { Link } from "react-router-dom";
const Home = () => {
    return(
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
    </div>
    </>
    )
}

export default Home