/*import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './admin.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', category: '', types: [], price: '', details: '' });
    const [editProduct, setEditProduct] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products');
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editProduct) {
            if (name === 'types') {
                const types = Array.from(e.target.selectedOptions, option => option.value);
                setEditProduct({ ...editProduct, types });
            } else {
                setEditProduct({ ...editProduct, [name]: value });
            }
        } else {
            if (name === 'types') {
                const types = Array.from(e.target.selectedOptions, option => option.value);
                setNewProduct({ ...newProduct, types });
            } else {
                setNewProduct({ ...newProduct, [name]: value });
            }
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('category', newProduct.category);
        formData.append('types', JSON.stringify(newProduct.types)); // Convertir types en chaîne JSON
        formData.append('price', newProduct.price);
        formData.append('details', newProduct.details);
        formData.append('image', selectedFile);
        try {
            const response = await fetch('http://localhost:3001/api/products', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                fetchProducts();
                setNewProduct({ name: '', category: '', types: [], price: '', details: '' });
                setSelectedFile(null);
                alert('Product added successfully!', 'alert-success');
            } else {
                alert('Failed to add product.', 'alert-danger');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleEditProduct = (product) => {
        setEditProduct(product);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editProduct.name);
        formData.append('category', editProduct.category);
        formData.append('types', JSON.stringify(editProduct.types || [])); // Assurer types est un tableau
        formData.append('price', editProduct.price);
        formData.append('details', editProduct.details);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }
        try {
            const response = await fetch(`http://localhost:3001/api/products/${editProduct.id}`, {
                method: 'PUT',
                body: formData,
            });
            if (response.ok) {
                fetchProducts();
                setEditProduct(null);
                setSelectedFile(null);
                alert('Product updated successfully!', 'alert-success');
            } else {
                const errorText = await response.text();
                alert(`Failed to update product: ${errorText}`, 'alert-danger');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/products/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchProducts();
                alert('Product deleted successfully!', 'alert-success');
            } else {
                alert('Failed to delete product.', 'alert-danger');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="admin-dashboard">
            <nav>
                <ul>
                    <li><Link to="/products">Produits</Link></li>
                    <li><Link to="/orders">Commandes</Link></li>
                    <li><Link to="/likedProducts">Produits aimés</Link></li>
                    <li><Link to="/categories">Catégories</Link></li>
                    <li><Link to="/contacts">Messages</Link></li>
                    <li><Link to="/admins">Administrateurs</Link></li>
                    <li><Link to="/admin-settings">Settings</Link></li>
                    <li><Link to="/admin-users">Utilisateurs</Link></li> 
                </ul>
            </nav>
            <div className="products">
                <h2 className="products-header">Products</h2>
                <form onSubmit={editProduct ? handleUpdateProduct : handleAddProduct}>
                    <input type="text" name="name" placeholder="Name" value={editProduct ? editProduct.name : newProduct.name} onChange={handleChange} required />
                    <input type="text" name="category" placeholder="Category" value={editProduct ? editProduct.category : newProduct.category} onChange={handleChange} required />
                    <select name="types" value={editProduct ? editProduct.types : newProduct.types} onChange={handleChange}  required>
                        <option value="featured">Featured</option>
                        <option value="new">New</option>
                        <option value="top">Top</option>
                        <option value="sale">Sale</option>
                    </select>
                    <input type="number" name="price" placeholder="Price" value={editProduct ? editProduct.price : newProduct.price} onChange={handleChange} required />
                    <textarea name="details" className="details" placeholder="Details" value={editProduct ? editProduct.details : newProduct.details} onChange={handleChange} required />
                    <input type="file" name="image" onChange={handleFileChange} required={!editProduct} />
                    <button type="submit">{editProduct ? 'Update Product' : 'Add Product'}</button>
                </form>
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Types</th>
                            <th>Price</th>
                            <th>Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td><img src={`http://localhost:3001${product.image}`} alt={product.name} className="product-image" /></td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.types ? product.types.join(', ') : 'No types'}</td>
                                <td>{product.price} MAD</td>
                                <td>{product.details}</td>
                                <td>
                                    <button onClick={() => handleEditProduct(product)} className="edit-button">Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="delete-button">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;
*/import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './admin.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', category: '', types: [], price: '', details: '', quantity: 0 });
    const [editProduct, setEditProduct] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products');
            const data = await response.json();

            // Normaliser les données pour s'assurer que `images` est un tableau
            const normalizedData = data.map(product => ({
                ...product,
                images: product.images
                    ? product.images.replace(/[{}"]/g, '').split(',') // Convertir la chaîne JSON en tableau
                    : [],
            }));

            setProducts(normalizedData);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editProduct) {
            if (name === 'types') {
                const types = Array.from(e.target.selectedOptions, option => option.value);
                setEditProduct({ ...editProduct, types });
            } else {
                setEditProduct({ ...editProduct, [name]: value });
            }
        } else {
            if (name === 'types') {
                const types = Array.from(e.target.selectedOptions, option => option.value);
                setNewProduct({ ...newProduct, types });
            } else {
                setNewProduct({ ...newProduct, [name]: value });
            }
        }
    };

    const handleFileChange = (e) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const files = Array.from(e.target.files).filter(file => allowedTypes.includes(file.type));
        if (files.length !== e.target.files.length) {
            alert('Some files were not uploaded because they are not valid image types.');
        }
        setSelectedFiles(files);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('category', newProduct.category);
        formData.append('types', JSON.stringify(newProduct.types));
        formData.append('price', newProduct.price);
        formData.append('details', newProduct.details);
        formData.append('quantity', newProduct.quantity);

        selectedFiles.forEach((file) => {
            formData.append('images', file);
        });

        try {
            const response = await fetch('http://localhost:3001/api/products', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                fetchProducts();
                setNewProduct({ name: '', category: '', types: [], price: '', details: '', quantity: 0 });
                setSelectedFiles([]);
                alert('Product added successfully!', 'alert-success');
            } else {
                const errorText = await response.text();
                alert(`Failed to add product: ${errorText}`, 'alert-danger');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleEditProduct = (product) => {
        setEditProduct(product);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editProduct.name);
        formData.append('category', editProduct.category);
        formData.append('types', JSON.stringify(editProduct.types || []));
        formData.append('price', editProduct.price);
        formData.append('details', editProduct.details);
        formData.append('quantity', editProduct.quantity);

        if (selectedFiles.length > 0) {
            selectedFiles.forEach((file) => {
                formData.append('images', file);
            });
        }

        try {
            const response = await fetch(`http://localhost:3001/api/products/${editProduct.id}`, {
                method: 'PUT',
                body: formData,
            });
            if (response.ok) {
                fetchProducts();
                setEditProduct(null);
                setSelectedFiles([]);
                alert('Product updated successfully!', 'alert-success');
            } else {
                const errorText = await response.text();
                alert(`Failed to update product: ${errorText}`, 'alert-danger');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`http://localhost:3001/api/products/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchProducts();
                alert('Product deleted successfully!', 'alert-success');
            } else {
                alert('Failed to delete product.', 'alert-danger');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="admin-dashboard">
            <nav>
                <ul>
                    <li><Link to="/products">Produits</Link></li>
                    <li><Link to="/orders">Commandes</Link></li>
                    <li><Link to="/likedProducts">Produits aimés</Link></li>
                    <li><Link to="/categories">Catégories</Link></li>
                    <li><Link to="/contacts">Messages</Link></li>
                    <li><Link to="/admins">Administrateurs</Link></li>
                    <li><Link to="/admin-settings">Settings</Link></li>
                </ul>
            </nav>
            <form onSubmit={editProduct ? handleUpdateProduct : handleAddProduct}>
                <input type="text" name="name" placeholder="Name" value={editProduct ? editProduct.name : newProduct.name} onChange={handleChange} required />
                <input type="text" name="category" placeholder="Category" value={editProduct ? editProduct.category : newProduct.category} onChange={handleChange} required />
                <select name="types" multiple value={editProduct ? editProduct.types : newProduct.types} onChange={handleChange} required>
                    <option value="featured">Featured</option>
                    <option value="new">New</option>
                    <option value="top">Top</option>
                    <option value="sale">Sale</option>
                </select>
                <input type="number" name="price" placeholder="Price" value={editProduct ? editProduct.price : newProduct.price} onChange={handleChange} required />
                <textarea name="details" className="details" placeholder="Details" value={editProduct ? editProduct.details : newProduct.details} onChange={handleChange} required />
                <input type="number" name="quantity" placeholder="Quantity" value={editProduct ? editProduct.quantity : newProduct.quantity} onChange={handleChange} required /> {/* Champ quantité */}
                <input
                    type="file"
                    name="images"
                    multiple
                    onChange={handleFileChange}
                    required={!editProduct}
                />
                <button type="submit">{editProduct ? 'Update Product' : 'Add Product'}</button>
            </form>

            <table className="products-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Types</th>
                        <th>Price</th>
                        <th>Details</th>
                        <th>Quantity</th> {/* En-tête pour la quantité */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>
                                {product.images && product.images.length > 0 ? (
                                    product.images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={`http://localhost:3001${img.trim()}`}
                                            alt={`${product.name} - Image ${index + 1}`}
                                            className="product-image"
                                        />
                                    ))
                                ) : (
                                    <span>No image available</span>
                                )}
                            </td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.types && product.types.length > 0 ? product.types.join(', ') : 'No types'}</td>
                            <td>{product.price} MAD</td>
                            <td>{product.details}</td>
                            <td>{product.quantity}</td> {/* Afficher la quantité */}
                            <td>
                                <button onClick={() => handleEditProduct(product)} className="edit-button">Edit</button>
                                <button onClick={() => handleDeleteProduct(product.id)} className="delete-button">Delete</button>
                            </td>
                        </tr>
                                   ))}
                                   </tbody>
                               </table>
                           </div>
                       );
                   };
                   
                   export default Products;
                   
