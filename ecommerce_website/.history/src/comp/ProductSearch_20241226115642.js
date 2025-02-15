import React, { useState } from 'react';

const ProductSearch = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/api/search?query=${query}`);
            const data = await response.json();
            if (onSearch) {
                onSearch(data);
            }
        } catch (error) {
            console.error('Error searching products:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher des produits..."
                />
                <button type="submit">Rechercher</button>
            </form>
        </div>
    );
};

export default ProductSearch;
