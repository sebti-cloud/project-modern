import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';

const AdminDashboard = () => {
    return (
        <Router>
            <div className="admin-dashboard">
                <nav>
                    <ul>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/orders">Orders</Link></li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/products">
                        <Products />
                    </Route>
                    <Route path="/orders">
                        <Orders />
                    </Route>
                    <Route path="/">
                        <Products />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};

export default AdminDashboard;
