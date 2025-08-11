import client from "./database.js";
import bcrypt from "bcryptjs";

// Function to handle user login
export const loginUser = async (email, password) => {
  try {
    // Query to find user by email
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };
    
    const result = await client.query(query);
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    const user = result.rows[0];
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }
    
    // Don't send password hash to client
    delete user.password_hash;
    return user;
    
  } catch (error) {
    throw error;
  }
};

// Function to handle user signup
export const signupUser = async (userData) => {
  const { email, password, full_name, phone_number } = userData;
  
  try {
    // Check if user already exists
    const existingUser = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new user
    const query = {
      text: `INSERT INTO users (
        email, 
        password_hash, 
        full_name, 
        phone_number, 
        role, 
        is_verified, 
        created_at, 
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
      values: [
        email,
        hashedPassword,
        full_name,
        phone_number,
        'user', // Default role
        false // Default verification status
      ]
    };
    
    const result = await client.query(query);
    const newUser = result.rows[0];
    
    // Don't send password hash to client
    delete newUser.password_hash;
    return newUser;
    
  } catch (error) {
    throw error;
  }
};
