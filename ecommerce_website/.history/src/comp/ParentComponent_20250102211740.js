import React from 'react';
import Delivery from './comp/Delivery'; // Assurez-vous que le chemin est correct

const ParentComponent = () => {
    const trackOrder = async (trackingNumber) => {
        // Exemple de logique pour obtenir les informations de suivi
        const response = await fetch(`/api/track?number=${trackingNumber}`);
        const data = await response.json();
        return data.info; // Supposons que 'info' contient les informations de suivi
    };

    return <Delivery trackOrder={trackOrder} />;
};

export default ParentComponent;
