import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

const Order = () => {
  const { id } = useParams(); // order ID from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch order details.'
        );
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div>Loading order details...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!order) return null;

  return (
    <div style={{ maxWidth: 700, margin: 'auto' }}>
      <h2>Order {order._id}</h2>

      <section>
        <h3>Shipping</h3>
        <p>
          <strong>Name:</strong> {order.user.name}
        </p>
        <p>
          <strong>Email:</strong>{' '}
          <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
        </p>
        <p>
          <strong>Address:</strong>{' '}
          {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>
        {order.isDelivered ? (
          <p style={{ color: 'green' }}>Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</p>
        ) : (
          <p style={{ color: 'red' }}>Not Delivered</p>
        )}
      </section>

      <section>
        <h3>Payment Method</h3>
        <p>
          <strong>Method:</strong> {order.paymentMethod}
        </p>
        {order.isPaid ? (
          <p style={{ color: 'green' }}>Paid on {new Date(order.paidAt).toLocaleDateString()}</p>
        ) : (
          <p style={{ color: 'red' }}>Not Paid</p>
        )}
      </section>

      <section>
        <h3>Order Items</h3>
        {order.orderItems.length === 0 ? (
          <p>Order is empty</p>
        ) : (
          order.orderItems.map((item) => (
            <div
              key={item.product}
              style={{ display: 'flex', marginBottom: 10, alignItems: 'center' }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{ width: 60, marginRight: 10 }}
              />
              <div style={{ flex: 1 }}>
                <p>{item.name}</p>
              </div>
              <p>
                {item.qty} x ${item.price.toFixed(2)} = $
                {(item.qty * item.price).toFixed(2)}
              </p>
            </div>
          ))
        )}
      </section>

      <section>
        <h3>Order Summary</h3>
        <p>
          <strong>Items Price: </strong>${order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}
        </p>
        <p>
          <strong>Tax Price: </strong>${order.taxPrice.toFixed(2)}
        </p>
        <p>
          <strong>Shipping Price: </strong>${order.shippingPrice.toFixed(2)}
        </p>
        <p>
          <strong>Total Price: </strong>${order.totalPrice.toFixed(2)}
        </p>
      </section>
    </div>
  );
};

export default Order;
