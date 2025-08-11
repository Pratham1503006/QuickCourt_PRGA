import React, { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../services/database'

// Mock mode is always true since we removed Supabase
const isMockMode = () => true;

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      if (isMockMode()) {
        // Check localStorage for mock session
        const storedUser = localStorage.getItem('quickcourt_user')
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            setUser(userData)
            setUserProfile(userData)
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError)
            localStorage.removeItem('quickcourt_user')
          }
        }
        setLoading(false)
        return
      }

      // Check for existing session in localStorage
      const storedUser = localStorage.getItem('quickcourt_user')
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setUserProfile(userData)
        } catch (parseError) {
          console.error('Error parsing stored user data:', parseError)
          localStorage.removeItem('quickcourt_user')
        }
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Auth initialization error:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const fetchUserProfile = async (userId) => {
    try {
      const profile = await db.getUserById(userId)
      setUserProfile(profile)
    } catch (err) {
      console.error('Error fetching user profile:', err)
      setError(err.message)
    }
  }

  const signUp = async ({ email, password, fullName, phone, role = 'customer' }) => {
    try {
      setLoading(true)
      setError(null)

      if (isMockMode()) {
        // Mock signup
        const existingUser = await db.getUserByEmail(email)
        if (existingUser) {
          throw new Error('User already exists')
        }

        const userData = {
          email,
          passwordHash: '$2b$12$mock.hash.here',
          fullName,
          phone,
          role
        }

        const newUser = await db.createUser(userData)
        setUser(newUser)
        setUserProfile(newUser)
        
        // Store in localStorage for mock mode
        localStorage.setItem('quickcourt_user', JSON.stringify(newUser))
        
        return { user: newUser, error: null }
      }

      // Real backend API registration
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, fullName, phone, role })
      })

      const registerData = await response.json()

      if (!response.ok) {
        throw new Error(registerData.message || 'Registration failed')
      }

      if (registerData.success && registerData.user) {
        setUser(registerData.user)
        setUserProfile(registerData.user)
        
        // Store user session
        localStorage.setItem('quickcourt_user', JSON.stringify(registerData.user))
        
        return { user: registerData.user, error: null }
      } else {
        throw new Error(registerData.message || 'Registration failed')
      }

    } catch (err) {
      console.error('Signup error:', err)
      setError(err.message)
      return { user: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async ({ email, password }) => {
    try {
      setLoading(true)
      setError(null)

      if (isMockMode()) {
        // Mock signin (keeping for backward compatibility)
        const user = await db.getUserByEmail(email)
        if (!user) {
          // Provide helpful error message for demo mode
          const validEmails = [
            'admin@quickcourt.com (Admin)',
            'john.smith@example.com (Venue Owner)', 
            'alice.wilson@example.com (Customer)'
          ]
          throw new Error(`Demo Mode: Please use one of these demo accounts:\n${validEmails.join('\n')}\nPassword: demo123`)
        }

        // In demo mode, accept any password for simplicity
        setUser(user)
        setUserProfile(user)
        
        // Store in localStorage for mock mode
        localStorage.setItem('quickcourt_user', JSON.stringify(user))
        
        return { user, error: null }
      }

      // Real backend API authentication
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const loginData = await response.json()

      if (!response.ok) {
        throw new Error(loginData.message || 'Login failed')
      }

      if (loginData.success && loginData.user) {
        setUser(loginData.user)
        setUserProfile(loginData.user)
        
        // Store user session
        localStorage.setItem('quickcourt_user', JSON.stringify(loginData.user))
        
        return { user: loginData.user, error: null }
      } else {
        throw new Error(loginData.message || 'Login failed')
      }

    } catch (err) {
      console.error('Signin error:', err)
      setError(err.message)
      return { user: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)

      // Clear localStorage for both mock and real modes
      localStorage.removeItem('quickcourt_user')
      setUser(null)
      setUserProfile(null)
      
      return { error: null }
    } catch (err) {
      console.error('Signout error:', err)
      setError(err.message)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    try {
      setError(null)

      if (isMockMode()) {
        // Mock password reset
        console.log('Mock password reset for:', email)
        return { error: null }
      }

      // For real mode, you would implement backend password reset here
      console.log('Password reset not implemented for backend mode')
      return { error: null }
    } catch (err) {
      console.error('Password reset error:', err)
      setError(err.message)
      return { error: err }
    }
  }

  const updateProfile = async (updates) => {
    try {
      setLoading(true)
      setError(null)

      if (isMockMode()) {
        // Mock profile update
        const updatedProfile = { ...userProfile, ...updates }
        setUserProfile(updatedProfile)
        localStorage.setItem('quickcourt_user', JSON.stringify(updatedProfile))
        return { user: updatedProfile, error: null }
      }

      // For real mode, implement backend profile update
      const updatedProfile = { ...userProfile, ...updates }
      setUserProfile(updatedProfile)
      localStorage.setItem('quickcourt_user', JSON.stringify(updatedProfile))
      return { user: updatedProfile, error: null }
    } catch (err) {
      console.error('Profile update error:', err)
      setError(err.message)
      return { user: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: userProfile?.role === 'admin',
    isVenueOwner: userProfile?.role === 'venue_owner',
    isCustomer: userProfile?.role === 'customer'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
