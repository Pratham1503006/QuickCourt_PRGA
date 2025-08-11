// Notification service for managing user notifications and alerts
import { toast } from 'react-toastify';

class NotificationService {
  // Success notifications
  success(message, options = {}) {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  }

  // Error notifications
  error(message, options = {}) {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  }

  // Warning notifications
  warning(message, options = {}) {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  }

  // Info notifications
  info(message, options = {}) {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  }

  // Booking-specific notifications
  bookingCreated(venueName) {
    this.success(`Booking request sent for ${venueName}. You'll be notified once confirmed.`);
  }

  bookingConfirmed(venueName, date) {
    this.success(`Your booking at ${venueName} for ${date} has been confirmed!`);
  }

  bookingCancelled(venueName) {
    this.warning(`Your booking at ${venueName} has been cancelled.`);
  }

  bookingReminder(venueName, timeRemaining) {
    this.info(`Reminder: Your booking at ${venueName} starts in ${timeRemaining}.`);
  }

  // Authentication notifications
  loginSuccess(userName) {
    this.success(`Welcome back, ${userName}!`);
  }

  logoutSuccess() {
    this.info('You have been logged out successfully.');
  }

  signupSuccess() {
    this.success('Account created successfully! Please check your email to verify your account.');
  }

  passwordResetSent(email) {
    this.info(`Password reset instructions have been sent to ${email}.`);
  }

  // Venue-specific notifications
  venueAdded() {
    this.success('Venue has been added and is pending approval.');
  }

  venueApproved(venueName) {
    this.success(`Your venue "${venueName}" has been approved and is now live!`);
  }

  venueRejected(venueName) {
    this.error(`Your venue "${venueName}" was not approved. Please check the requirements and resubmit.`);
  }

  // Favorite notifications
  addedToFavorites(venueName) {
    this.success(`${venueName} has been added to your favorites.`);
  }

  removedFromFavorites(venueName) {
    this.info(`${venueName} has been removed from your favorites.`);
  }

  // Review notifications
  reviewSubmitted() {
    this.success('Thank you for your review! It helps other users make better decisions.');
  }

  // Error handling notifications
  networkError() {
    this.error('Network error. Please check your connection and try again.');
  }

  serverError() {
    this.error('Server error. Please try again later or contact support if the problem persists.');
  }

  validationError(message) {
    this.error(message || 'Please check your input and try again.');
  }

  permissionDenied() {
    this.error('You don\'t have permission to perform this action.');
  }

  sessionExpired() {
    this.warning('Your session has expired. Please log in again.');
  }

  // Custom notification with action
  withAction(message, actionText, onAction, type = 'info') {
    const options = {
      onClick: onAction,
      closeButton: false,
      autoClose: false,
      hideProgressBar: true
    };

    const CustomToast = ({ closeToast }) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onAction();
              closeToast();
            }}
            className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90"
          >
            {actionText}
          </button>
          <button
            onClick={closeToast}
            className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    );

    toast(CustomToast, { ...options, type });
  }

  // Loading notifications
  loading(message = 'Loading...') {
    return toast.loading(message, {
      position: "top-center"
    });
  }

  updateLoading(toastId, message, type = 'success') {
    toast.update(toastId, {
      render: message,
      type: type,
      isLoading: false,
      autoClose: 3000,
      closeButton: true
    });
  }

  // Dismiss specific toast
  dismiss(toastId) {
    toast.dismiss(toastId);
  }

  // Dismiss all toasts
  dismissAll() {
    toast.dismiss();
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
