import React, { useState, useEffect } from 'react';
import './admin.css';

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/contacts');
            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            }
            const data = await response.json();
            setContacts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/contacts/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setContacts(contacts.filter(contact => contact.id !== id));
                alert('Message supprimé avec succès');
            } else {
                alert('Échec de la suppression du message');
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    const handleValidate = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/contacts/${id}/validate`, {
                method: 'PUT',
            });
            if (response.ok) {
                const updatedContacts = contacts.map(contact => 
                    contact.id === id ? { ...contact, status: 'validated' } : contact
                );
                setContacts(updatedContacts);
                alert('Message validé avec succès');
            } else {
                alert('Échec de la validation du message');
            }
        } catch (error) {
            console.error('Error validating contact:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="contacts">
            <h2 className="contacts-header">Messages de Contact</h2>
            <table className="contacts-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Téléphone</th>
                        <th>Actions</th> {/* Ajouter une colonne pour les actions */}
                    </tr>
                </thead>
                <tbody>
                    {contacts.map(contact => (
                        <tr key={contact.id}>
                            <td>{contact.id}</td>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>{contact.message}</td>
                            <td>{formatDate(contact.date)}</td>
                            <td>{contact.phone}</td>
                            <td>
                                <button onClick={() => handleValidate(contact.id)}>Valider</button>
                                <button onClick={() => handleDelete(contact.id)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminContacts;
