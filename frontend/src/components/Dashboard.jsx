function Dashboard({ user, onLogout }) {
  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h2>Welcome, {user.full_name}!</h2>
        <button onClick={onLogout}>Logout</button>
      </nav>
      <div className="user-info">
        <h3>Your Profile</h3>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone_number}</p>
        <p>Account Status: {user.is_verified ? 'Verified' : 'Pending Verification'}</p>
      </div>
    </div>
  );
}

export default Dashboard;
