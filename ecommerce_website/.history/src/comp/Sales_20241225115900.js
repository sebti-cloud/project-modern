const Sales = ({ salesProducts = [], addtocart, fetchSalesProducts }) => {
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
      fetchSalesProducts();
  }, []);

  const filterProducts = (category) => {
      setFilter(category);
      fetchSalesProducts(category);
  };

  return (
      <div className="sales">
          <div className="banner">
              <h2>Big Sales</h2>
              <p>Get the best deals on our top products</p>
          </div>
          <div className="filters">
              <button onClick={() => filterProducts('all')}>All</button>
              <button onClick={() => filterProducts('electronics')}>Electronics</button>
              <button onClick={() => filterProducts('fashion')}>Fashion</button>
              <button onClick={() => filterProducts('home')}>Home</button>
          </div>
          <div className="products_grid">
              {salesProducts.map(product => (
                  <div key={product.id} className="product_card">
                      <img src={`http://localhost:3001${product.image}`} alt={product.name} />
                      <h3>{product.name}</h3>
                      <p>{product.price} MAD</p>
                      <button onClick={() => addtocart(product)}>
                          <AiOutlineShoppingCart /> Add to Cart
                      </button>
                  </div>
              ))}
          </div>
      </div>
  );
};

export default Sales;
