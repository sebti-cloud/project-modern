import React from 'react';
import UserOrders from './UserOrders';
import UserLikedProducts from './UserLikedProducts';

const UserActivity = () => {
  return (
    <div>
      <h2>My Activity</h2>
      <UserOrders />
      <UserLikedProducts />
    </div>
  );
};

export default UserActivity;
