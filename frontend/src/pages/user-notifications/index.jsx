import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notificationService';
import Header from '../../components/ui/Header';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';

const UserNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from the backend
      // For now, we'll use mock data
      const mockNotifications = [
        {
          id: '1',
          title: 'Booking Confirmed',
          message: 'Your booking for Elite Sports Complex on Aug 15, 2025 at 2:00 PM has been confirmed.',
          type: 'success',
          category: 'booking',
          isRead: false,
          createdAt: '2025-08-10T14:30:00Z'
        },
        {
          id: '2',
          title: 'New Review',
          message: 'John Smith left a 5-star review for your booking at Downtown Tennis Center.',
          type: 'info',
          category: 'review',
          isRead: true,
          createdAt: '2025-08-09T10:15:00Z'
        },
        {
          id: '3',
          title: 'Special Offer',
          message: 'Get 20% off your next booking at any premium venue this week!',
          type: 'info',
          category: 'promotion',
          isRead: false,
          createdAt: '2025-08-08T09:00:00Z'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (err) {
      setError(err.message);
      notificationService.error('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    notificationService.success('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    notificationService.success('Notification deleted');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        );
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` 
                  : 'All caught up!'}
              </p>
            </div>
            
            {notifications.length > 0 && (
              <div className="mt-4 sm:mt-0">
                <button 
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {notifications.length > 0 ? (
            <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
              <ul className="divide-y divide-border">
                {notifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`p-6 hover:bg-muted/50 ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-start">
                      {getNotificationIcon(notification.type)}
                      
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-foreground font-semibold' : 'text-foreground'}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                            <button 
                              onClick={() => deleteNotification(notification.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <p className="mt-1 text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        
                        <div className="mt-3 flex items-center text-xs">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            {notification.category}
                          </span>
                          
                          {!notification.isRead && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="ml-3 text-primary hover:text-primary/80 text-xs font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <EmptyState
              title="No notifications"
              description="You don't have any notifications right now. We'll let you know when something important happens."
            />
          )}
        </div>
      </main>
      
    </div>
  );
};

export default UserNotifications;
