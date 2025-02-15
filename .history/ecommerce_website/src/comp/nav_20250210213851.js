/* nav.css */

/* Réinitialisation de base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* Barre de Navigation */
.navbar {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px; /* Ajout du padding ici */
}

.navbar-logo img {
  height: 40px;
  cursor: pointer;
}

.navbar-search {
  display: flex;
  align-items: center;
  background-color: #f1f1f1;
  padding: 5px; /* Ajout du padding ici */
  border-radius: 5px;
  margin-top: 0px;
}

.navbar-search input {
  border: none;
  background-color: transparent;
  padding: 5px;
  outline: none;
}

.navbar-search button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #0070c9;
}

.navbar-icons {
  display: flex;
  align-items: center;
  margin-top: 40px;
}

.navbar-icon {
  position: relative;
  margin-right: 2px;
  cursor: pointer;
  font-weight: bold;
  font-size: x-large;
  color: cornflowerblue;
}

.navbar-icon img.profile-photo-nav {
  margin: -5px 10px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ddd;
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.8rem;
}

.navbar-menu {
  display: flex;
  list-style: none;
  justify-content: center;
  margin-top: 0px;
  margin-bottom: 20px; /* Ajout du margin-bottom pour le menu de la barre de navigation */
}

.navbar-item {
  margin: 0 10px;
}

.navbar-link {
  text-decoration: none;
  color: #1d1d1f;
  font-size: 1rem;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
  margin-bottom: 10px; /* Ajout du margin-bottom pour les liens de navigation */
}

.navbar-link:hover {
  color: #0070c9;
}

.nav-icon {
  margin-right: 8px;
  font-size: 1.2rem;
}

/* Styles pour le bouton hamburger */
.navbar-menu-icon {
  display: none;
}

/* Styles pour mobiles */
@media (max-width: 600px) {
  .navbar-container {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px; /* Réduction du padding */
  }

  .navbar-logo img {
    height: 30px; /* Réduction de la taille du logo */
  }

  .navbar-search {
    width: 100%;
    margin-top: 10px;
  }

  .navbar-search input {
    font-size: 0.9rem; /* Réduction de la taille du texte */
  }

  .navbar-search button {
    font-size: 1rem; /* Réduction de la taille du bouton de recherche */
  }

  .navbar-icons {
    margin-top: 10px;
    font-size: 0.9rem; /* Réduction de la taille des icônes */
  }

  .navbar-icon {
    font-size: 1rem; /* Réduction de la taille des icônes */
  }

  .navbar-menu-icon {
    display: block;
    font-size: 1.5rem;
    cursor: pointer;
    margin-left: auto;
  }

  .navbar-menu {
    display: none;
    flex-direction: column;
    align-items: flex-start;
  }

  .navbar-menu.open {
    display: flex;
  }

  .navbar-item {
    margin-bottom: 10px;
  }

  .navbar-link {
    font-size: 0.9rem; /* Réduction de la taille du texte des liens */
  }
}


/*import React, { useState, useEffect } from 'react';
import { AiOutlineSearch, AiOutlineUser, AiOutlineLogout, AiOutlineHome, AiOutlineShop, AiOutlineInfoCircle, AiOutlineMail } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './nav.css';

const Nav = ({ search, setSearch, searchproduct, setSearchResults, isAuthenticated, handleLogout }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get('userToken');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:3001/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setUser(result);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/search?query=${search}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const logout = () => {
    Cookies.remove('userToken');
    handleLogout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="http://localhost:3001/uploads/logo_for_RAHTY.png" alt="Logo" />
        </Link>
        <div className="navbar-search">
          <input 
            type="text" 
            value={search} 
            placeholder="Recherche" 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <button onClick={handleSearch}><AiOutlineSearch /></button>
        </div>
        <div className="navbar-icons">
          {isAuthenticated ? (
            <>
              <div className="navbar-icon" onClick={logout}><AiOutlineLogout title="Déconnexion" /></div>
              <Link to="/profile" className="navbar-icon">
                <img src={`http://localhost:3001${user?.photo}`} alt="Profile" className="profile-photo-nav" />
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-icon"><AiOutlineUser title="Connexion" />Connexion</Link>
            </>
          )}
        </div>
      </div>
      <ul className="navbar-menu">
        <li className="navbar-item">
          <Link to="/" className="navbar-link"><AiOutlineHome className="nav-icon" /> Accueil</Link>
        </li>
        <li className="navbar-item">
          <Link to="/shop" className="navbar-link"><AiOutlineShop className="nav-icon" /> Boutique</Link>
        </li>
        <li className="navbar-item">
          <Link to="/about" className="navbar-link"><AiOutlineInfoCircle className="nav-icon" /> À propos</Link>
        </li>
        <li className="navbar-item">
          <Link to="/contact" className="navbar-link"><AiOutlineMail className="nav-icon" /> Contact</Link>
        </li>
        {isAuthenticated && (
          <li className="navbar-item">
            <Link to="/profile" className="navbar-link"><AiOutlineUser className="nav-icon" /> Mon Compte</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
*/
