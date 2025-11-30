// src/pages/Customer/CompletedOrders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, reviewAPI } from '../../lib/api';
import { Package, Star, MessageCircle, CheckCircle } from 'lucide-react';

const CompletedOrders = () => {
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const fetchCompletedOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getCompletedOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching completed orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateSeller = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    setSelectedOrder(order);
    setRating(5);
    setComment('');
    setShowReviewModal(true);
  };

  const handleChat = (orderId) => {
    navigate(`/customer/chat/${orderId}`);
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  const submitReview = async () => {
    if (!selectedOrder) return;
    try {
      setSubmittingReview(true);
      await reviewAPI.submitReview(selectedOrder._id, { rating, comment });
      setShowReviewModal(false);
      setSelectedOrder(null);
      setComment('');
      // refresh orders to reflect review status if needed
      await fetchCompletedOrders();
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Completed Orders</h1>
              <p className="text-gray-600">
                Review your past orders and rate your experience
              </p>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">{orders.length} completed orders</span>
            </div>
            {/* Review Modal */}
            {showReviewModal && selectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowReviewModal(false)} />
                <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6 z-10">
                  <h3 className="text-lg font-semibold mb-2">Rate your experience</h3>
                  <p className="text-sm text-gray-600 mb-4">Seller: <strong>{selectedOrder.seller.businessName}</strong></p>

                  <div className="flex items-center space-x-2 mb-4">
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} onClick={() => handleStarClick(s)} className={`p-2 rounded-md ${s <= rating ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        <Star className="w-5 h-5" />
                      </button>
                    ))}
                    <span className="ml-3 text-sm text-gray-700">{rating} / 5</span>
                  </div>

                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a short review (optional)" className="w-full border rounded-md p-2 text-sm mb-4" rows={4} />

                  <div className="flex justify-end space-x-2">
                    <button onClick={() => { setShowReviewModal(false); setSelectedOrder(null); }} className="px-4 py-2 rounded-md border">Cancel</button>
                    <button onClick={submitReview} disabled={submittingReview} className="px-4 py-2 rounded-md btn-primary">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Completed
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Seller: <span className="font-medium">{order.seller.businessName}</span> • 
                      Completed on: <span className="font-medium">
                        {new Date(order.updatedAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                    <span className="text-2xl font-bold text-primary-600">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="border-t pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Product Info */}
                    <div className="flex space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {order.productSnapshot?.images?.[0] ? (
                          <img 
                            src={order.productSnapshot.images[0]} 
                            alt={order.productSnapshot.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{order.productSnapshot.title}</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          {order.quantity} × ₹{order.pricePerUnit} per unit
                        </p>
                        <p className="text-primary-600 font-semibold">
                          Total: ₹{order.totalAmount}
                        </p>
                      </div>
                    </div>

                    {/* Meeting Details */}
                    <div className="space-y-2">
                      {order.meetingDetails?.scheduledTime && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Meeting date</span>
                          <span className="font-medium">
                            {new Date(order.meetingDetails.scheduledTime).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Payment method</span>
                        <span className="font-medium capitalize">
                          {order.paymentMethod || 'Cash on Delivery'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleRateSeller(order._id)}
                        className="w-full btn-primary flex items-center justify-center space-x-2 text-sm"
                      >
                        <Star className="w-4 h-4" />
                        <span>Rate Seller</span>
                      </button>
                      
                      <button
                        onClick={() => handleChat(order._id)}
                        className="w-full btn-secondary flex items-center justify-center space-x-2 text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>View Chat</span>
                      </button>

                      {/* Report Issue */}
                      <a href="mailto:team.loceal@gmail.com" className="w-full border border-red-300 text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center">
                        Report Issue
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No completed orders</h2>
            <p className="text-gray-600 mb-6">
              You haven't completed any orders yet. Complete your first order to see it here!
            </p>
            <button
              onClick={() => navigate('/customer/products')}
              className="btn-primary"
            >
              Browse Products
            </button>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedOrders;