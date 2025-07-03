'use client';

import { useState, useEffect } from 'react';
import UserForm from './UserForm';
import UserList from './UserList';

interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
  createdAt: string;
  updatedAt: string;
}

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new user
  const createUser = async (userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(prev => [data.data, ...prev]);
        setShowForm(false);
      } else {
        setError(data.error || 'Failed to create user');
      }
    } catch (error) {
      setError('Failed to create user');
      console.error('Error creating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update a user
  const updateUser = async (userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingUser) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(prev => prev.map(user => 
          user._id === editingUser._id ? data.data : user
        ));
        setEditingUser(null);
        setShowForm(false);
      } else {
        setError(data.error || 'Failed to update user');
      }
    } catch (error) {
      setError('Failed to update user');
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a user
  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(prev => prev.filter(user => user._id !== id));
      } else {
        setError(data.error || 'Failed to delete user');
      }
    } catch (error) {
      setError('Failed to delete user');
      console.error('Error deleting user:', error);
    }
  };

  // Handle form submission
  const handleFormSubmit = (userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (editingUser) {
      updateUser(userData);
    } else {
      createUser(userData);
    }
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  // Handle cancel form
  const handleCancelForm = () => {
    setEditingUser(null);
    setShowForm(false);
    setError(null);
  };

  // Handle add new user
  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
    setError(null);
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Create, read, update, and delete users</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {showForm ? (editingUser ? 'Edit User' : 'Add New User') : 'User Form'}
              </h2>
              {!showForm && (
                <button
                  onClick={handleAddUser}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add User
                </button>
              )}
            </div>
            
            {showForm && (
              <UserForm
                user={editingUser || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleCancelForm}
                isLoading={isSubmitting}
              />
            )}
            
            {!showForm && (
              <p className="text-gray-500 text-center py-8">
                Click &quot;Add User&quot; to create a new user
              </p>
            )}
          </div>
        </div>

        {/* List Section */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <UserList
              users={users}
              onEdit={handleEditUser}
              onDelete={deleteUser}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}