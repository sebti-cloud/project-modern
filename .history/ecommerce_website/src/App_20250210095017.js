import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './comp/nav';
import Rout from './comp/rout';
import Footer from './comp/footer';
import Homeproduct from './comp/home_product';
import AdminDashboard from './comp/AdminDashboard';
import About from './comp/About';
import Account from './comp/Account';
import Payment from './comp/Payment';
import Sales from './comp/Sales';
import Delivery from './comp/Delivery';
import TrackOrder from './comp/TrackOrder';
import TopProducts from './comp/TopProducts';
import OldProduct from './comp/OldProduct';
import AddAdmin from './comp/AddAdmin';
import Products from './comp/Products';
import Orders from './comp/Orders';
import LikedProducts from './comp/LikedProducts';
import Categories from './comp/Categories';
import AdminContacts from './comp/AdminContacts';
import AdminList from './comp/AdminList';
import AdminSettings from './comp/AdminSettings';
import AdminUsers from './comp/AdminUsers';
import Cart from './comp/cart';
import Register from './comp/Register';
import Login from './comp/Login';
import UserProfile from './comp/UserProfile';
import UserOrders from './comp/UserOrders';
import UserLikedProducts from './comp/UserLikedProducts';
import UploadProfilePhoto from './comp/UploadProfilePhoto';
import UserActivity from './comp/UserActivity';
import ProductForm from './comp/ProductForm';
import ProductList from './comp/ProductList';
import Suppliers from './comp/Suppliers';
import SalesReport from './comp/reports/SalesReport';
import StockHistory from './comp/StockHistory';  // Ajout de l'importation de StockHistory
import Promotions from './comp/Promotions';
import AdminLogin from './comp/AdminLogin';
import SliderManager from './comp/SliderManager'; // Nouvelle importation
import Cookies from 'js-cookie';

const App = () => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [cartCount, setCartCount] = useState(() => parseInt(localStorage.getItem('cartCount')) || 0);
  const [shop, setShop] = useState(Homeproduct);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [salesProducts, setSalesProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [oldProducts, setOldProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('token'));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!Cookies.get('adminToken'));

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cartCount.toString());
  }, [cart, cartCount]);

  const fetchProducts = async (category = '') => {
    try {
      let url = 'http://localhost:3001/api/products';
      if (category) {
        url += `?category=${category}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setShop(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSalesProducts = async (category = 'all') => {
    try {
      let url = 'http://localhost:3001/api/salesProducts';
      if (category !== 'all') {
        url += `?category=${category}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSalesProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching sales products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSalesProducts();
  }, []);

  const Filter = (x) => {
    fetchProducts(x);
  };

  const allcatfilter = () => {
    fetchProducts();
  };

  const searchproduct = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/search?query=${search}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const addtocart = (product) => {
    const exist = cart.find((x) => x.id === product.id);
    if (exist) {
      alert("This product already exists in your cart");
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
      setCartCount(cartCount + 1); // Incrémenter le compteur de panier
      alert("Added to cart");
    }
  };

  const clearCart = () => {
    setCart([]);
    setCartCount(0);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartCount');
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('adminToken');
    setIsAuthenticated(false);
    setIsAdminAuthenticated(false);
  };
  const saveProduct = async (formData) => {
    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const editProduct = async (product) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${product.id}/type`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ types: product.types }) // Envoie uniquement les types dans le corps de la requête
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchProducts(); // Rafraîchir la liste des produits
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Router>
      <Nav
        search={search}
        setSearch={setSearch}
        searchproduct={searchproduct}
        setSearchResults={setSearchResults}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
      />
      <div id="main-content">
        <Routes>
          <Route path="/admin" element={isAdminAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/add-admin" element={isAdminAuthenticated ? <AddAdmin /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/products" element={isAdminAuthenticated ? <Products /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/orders" element={isAdminAuthenticated ? <Orders /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/likedProducts" element={isAdminAuthenticated ? <LikedProducts /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/categories" element={isAdminAuthenticated ? <Categories /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/contacts" element={isAdminAuthenticated ? <AdminContacts /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/admins" element={isAdminAuthenticated ? <AdminList /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/admin-settings" element={isAdminAuthenticated ? <AdminSettings /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/admin-users" element={isAdminAuthenticated ? <AdminUsers /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/promotions" element={isAdminAuthenticated ? <Promotions /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/suppliers" element={isAdminAuthenticated ? <Suppliers /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/sales-report" element={isAdminAuthenticated ? <SalesReport /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/ProductForm" element={<ProductForm saveProduct={saveProduct} />} />
          <Route path="/admin/ProductForm/:productId" element={<ProductForm saveProduct={saveProduct} editProduct={editProduct} />} />
          <Route path="/admin/stock-history" element={isAdminAuthenticated ? <StockHistory /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/slider-manager" element={isAdminAuthenticated ? <SliderManager /> : <Navigate to="/admin/login" />} /> {/* Nouvelle route */}

          <Route path="/about" element={<About />} />
          <Route path="/account" element={<Account />} />
          <Route path="/payment/:orderId" element={<Payment clearCart={clearCart} />} />
          <Route path="/sales" element={<Sales salesProducts={salesProducts} fetchSalesProducts={fetchSalesProducts} addtocart={addtocart} />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/track-order/:trackingNumber" element={<TrackOrder />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/top-products" element={<TopProducts topProducts={topProducts} fetchTopProducts={fetchProducts} addtocart={addtocart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} cartCount={cartCount} setCartCount={setCartCount} clearCart={clearCart} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/profile" element={isAuthenticated ? <UserProfile cartCount={cartCount} /> : <Navigate to="/login" />} />
          <Route path="/user-orders" element={isAuthenticated ? <UserOrders /> : <Navigate to="/login" />} />
          <Route path="/user-liked-products" element={isAuthenticated ? <UserLikedProducts /> : <Navigate to="/login" />} />
          <Route path="/user-activities/:userId" element={<UserActivity />} />
          <Route path="/ProductList" element={<ProductList products={shop} editProduct={editProduct} deleteProduct={deleteProduct} />} />
          <Route path="/admin/login" element={<AdminLogin setIsAdminAuthenticated={setIsAdminAuthenticated} />} />

          <Route
            path="/*"
            element={
              <Rout
                setCart={setCart}
                cart={cart}
                shop={shop}
                Filter={Filter}
                allcatfilter={allcatfilter}
                addtocart={addtocart}
                fetchProducts={fetchProducts}
                searchproduct={searchproduct}
                searchResults={searchResults}
                cartCount={cartCount}
                setCartCount={setCartCount}
              />
            }
          />
        </Routes>
      </div>
      <Footer isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
    </Router>
  );
};

export default App;

/*import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './comp/nav';
import Rout from './comp/rout';
import Footer from './comp/footer';
import Homeproduct from './comp/home_product';
import AdminDashboard from './comp/AdminDashboard';
import About from './comp/About';
import Account from './comp/Account';
import Payment from './comp/Payment';
import Sales from './comp/Sales';
import Delivery from './comp/Delivery';
import TrackOrder from './comp/TrackOrder';
import TopProducts from './comp/TopProducts';
import OldProduct from './comp/OldProduct';
import AddAdmin from './comp/AddAdmin';
import Products from './comp/Products';
import Orders from './comp/Orders';
import LikedProducts from './comp/LikedProducts';
import Categories from './comp/Categories';
import AdminContacts from './comp/AdminContacts';
import AdminList from './comp/AdminList';
import AdminSettings from './comp/AdminSettings';
import AdminUsers from './comp/AdminUsers';
import Cart from './comp/cart';
import Register from './comp/Register';
import Login from './comp/Login';
import UserProfile from './comp/UserProfile';
import UserOrders from './comp/UserOrders';
import UserLikedProducts from './comp/UserLikedProducts';
import UploadProfilePhoto from './comp/UploadProfilePhoto';
import UserActivity from './comp/UserActivity';
import ProductForm from './comp/ProductForm';
import ProductList from './comp/ProductList';
import Suppliers from './comp/Suppliers';
import SalesReport from './comp/reports/SalesReport';
import StockHistory from './comp/StockHistory';  // Ajout de l'importation de StockHistory
import Promotions from './comp/Promotions';
import AdminLogin from './comp/AdminLogin';
import Cookies from 'js-cookie';

const App = () => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [cartCount, setCartCount] = useState(() => parseInt(localStorage.getItem('cartCount')) || 0);
  const [shop, setShop] = useState(Homeproduct);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [salesProducts, setSalesProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [oldProducts, setOldProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('token'));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!Cookies.get('adminToken'));

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cartCount.toString());
  }, [cart, cartCount]);

  const fetchProducts = async (category = '') => {
    try {
      let url = 'http://localhost:3001/api/products';
      if (category) {
        url += `?category=${category}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setShop(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSalesProducts = async (category = 'all') => {
    try {
      let url = 'http://localhost:3001/api/salesProducts';
      if (category !== 'all') {
        url += `?category=${category}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSalesProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching sales products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSalesProducts();
  }, []);

  const Filter = (x) => {
    fetchProducts(x);
  };

  const allcatfilter = () => {
    fetchProducts();
  };

  const searchproduct = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/search?query=${search}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const addtocart = (product) => {
    const exist = cart.find((x) => x.id === product.id);
    if (exist) {
      alert("This product already exists in your cart");
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
      setCartCount(cartCount + 1); // Incrémenter le compteur de panier
      alert("Added to cart");
    }
  };

  const clearCart = () => {
    setCart([]);
    setCartCount(0);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartCount');
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('adminToken');
    setIsAuthenticated(false);
    setIsAdminAuthenticated(false);
  };

  const saveProduct = async (formData) => {
    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const editProduct = async (product) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${product.id}/type`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ types: product.types }) // Envoie uniquement les types dans le corps de la requête
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchProducts(); // Rafraîchir la liste des produits
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Router>
      <Nav
        search={search}
        setSearch={setSearch}
        searchproduct={searchproduct}
        setSearchResults={setSearchResults}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
      />
      <div id="main-content">
        <Routes>
          <Route path="/admin" element={isAdminAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/add-admin" element={isAdminAuthenticated ? <AddAdmin /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/products" element={isAdminAuthenticated ? <Products /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/orders" element={isAdminAuthenticated ? <Orders /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/likedProducts" element={isAdminAuthenticated ? <LikedProducts /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/categories" element={isAdminAuthenticated ? <Categories /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/contacts" element={isAdminAuthenticated ? <AdminContacts /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/admins" element={isAdminAuthenticated ? <AdminList /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/admin-settings" element={isAdminAuthenticated ? <AdminSettings /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/admin-users" element={isAdminAuthenticated ? <AdminUsers /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/promotions" element={isAdminAuthenticated ? <Promotions /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/suppliers" element={isAdminAuthenticated ? <Suppliers /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/sales-report" element={isAdminAuthenticated ? <SalesReport /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/stock-history" element={isAdminAuthenticated ? <StockHistory /> : <Navigate to="/admin/login" />} />

          <Route path="/about" element={<About />} />
          <Route path="/account" element={<Account />} />
          <Route path="/payment/:orderId" element={<Payment clearCart={clearCart} />} />
          <Route path="/sales" element={<Sales salesProducts={salesProducts} fetchSalesProducts={fetchSalesProducts} addtocart={addtocart} />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/track-order/:trackingNumber" element={<TrackOrder />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/top-products" element={<TopProducts topProducts={topProducts} fetchTopProducts={fetchProducts} addtocart={addtocart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} cartCount={cartCount} setCartCount={setCartCount} clearCart={clearCart} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/profile" element={isAuthenticated ? <UserProfile cartCount={cartCount} /> : <Navigate to="/login" />} />
          <Route path="/user-orders" element={isAuthenticated ? <UserOrders /> : <Navigate to="/login" />} />
          <Route path="/user-liked-products" element={isAuthenticated ? <UserLikedProducts /> : <Navigate to="/login" />} />
          <Route path="/user-activities/:userId" element={<UserActivity />} />
          <Route path="/ProductForm" element={<ProductForm saveProduct={saveProduct} />} />
          <Route path="/ProductList" element={<ProductList products={shop} editProduct={editProduct} deleteProduct={deleteProduct} />} />
          <Route path="/ProductForm/:productId" element={<ProductForm saveProduct={saveProduct} editProduct={editProduct} />} />
          <Route path="/admin/login" element={<AdminLogin setIsAdminAuthenticated={setIsAdminAuthenticated} />} />

          <Route
            path="/*"
            element={
              <Rout
                setCart={setCart}
                cart={cart}
                shop={shop}
                Filter={Filter}
                allcatfilter={allcatfilter}
                addtocart={addtocart}
                fetchProducts={fetchProducts}
                searchproduct={searchproduct}
                searchResults={searchResults}
                cartCount={cartCount}
                setCartCount={setCartCount}
              />
            }
          />
        </Routes>
      </div>
      <Footer isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
    </Router>
  );
};

export default App;*/