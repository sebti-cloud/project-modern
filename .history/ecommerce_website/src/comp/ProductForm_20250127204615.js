import React from 'react';
import { useParams } from 'react-router-dom';

const ProductForm = () => {
  const { productId } = useParams();

  return (
    <div>
      <h2>Formulaire de Produit</h2>
      {productId ? <p>ID du produit : {productId}</p> : <p>Nouvel Produit</p>}
      <form>
        <div>
          <label>Nom du produit:</label>
          <input type="text" />
        </div>
        <div>
          <label>Prix:</label>
          <input type="number" />
        </div>
        <div>
          <label>Quantité en stock:</label>
          <input type="number" />
        </div>
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
};

export default ProductForm;
