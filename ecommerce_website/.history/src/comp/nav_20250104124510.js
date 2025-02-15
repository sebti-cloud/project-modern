import React, { useState } from 'react';
import { MdLocalShipping } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { FiLogIn } from "react-icons/fi";
import { CiLogout, CiUser } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './nav.css';

const Nav = ({ search, setSearch, searchproduct, setSearchResults }) => {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/search?query=${search}`);
      const data = await response.json();
      setResults(data);
      setSearchResults(data); // Propagation des résultats vers les composants enfants
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  };

  const isAuthenticated = !!Cookies.get('token');

  return (
    <div className='header'>
      <div className='top_header'>
        <div className='icon'>
          <MdLocalShipping />
        </div>
        <div className='info'>
          <p>Livraison gratuite pour des achats jusqu'à 700 MAD</p>
        </div>
      </div>
      <div className='mid_header'>
        <div className='logo'>
          <img src='image/logo.jpg' alt='logo'></img>
        </div>
        <div className='search_box'>
          <input type='text' value={search} placeholder='recherche' onChange={(e) => setSearch(e.target.value)} />
          <button onClick={handleSearch}><AiOutlineSearch /></button>
        </div>
        {isAuthenticated ? (
          <div className='user'>
            <div className='icon'><CiLogout /></div>
            <div className='btn'>
              <button onClick={handleLogout}>Déconnexion</button>
            </div>
          </div>
        ) : (
          <div className='user'>
            <div className='icon'><FiLogIn /></div>
            <div className='btn'>
              <button onClick={() => navigate('/login')}>Connexion</button>
              <button onClick={() => navigate('/register')}>Inscription</button>
            </div>
          </div>
        )}
      </div>
      <div className='last_header'>
        <div className='user_profile'>
          {isAuthenticated ? (
            <>
              <div className='icon'><CiUser /></div>
              <div className='info'>
                <h2>Utilisateur Connecté</h2>
                <p>{Cookies.get('email')}</p>
              </div>
            </>
          ) : (
            <>
              <div className='icon'><CiUser /></div>
              <div className='info'>
                <p>Veuillez vous connecter</p>
              </div>
            </>
          )}
        </div>
        <div className='nav'>
          <ul>
            <li><Link to='/' className='link'>Accueil</Link></li>
            <li><Link to='/shop' className='link'>Boutique</Link></li>
            <li><Link to='/Cart' className='link'>Panier</Link></li>
            <li><Link to='/about' className='link'>À propos</Link></li>
            <li><Link to='/contact' className='link'>Contact</Link></li>
            {isAuthenticated && <li><Link to='/profile' className='link'>Mon Compte</Link></li>} {/* Lien vers le compte utilisateur */}
          </ul>
        </div>
        <div className='offer'>
          <p>10% de réduction sur tous les iPhone</p>
        </div>
      </div>
    </div>
  );
};

export default Nav;
