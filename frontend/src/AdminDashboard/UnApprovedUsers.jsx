import React, { useState, useEffect } from 'react';
import { CheckCircle, User, Mail, Clock, RefreshCw } from 'lucide-react';
import axios from 'axios';

const UnapprovedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch unapproved users
  const fetchUnapprovedUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/v1/users/unapproved');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching unapproved users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Approve user function
  const approveUser = (userId) => {


    axios.get(`/api/v1/users/approve/${userId}`).then(res => {
        fetchUnapprovedUsers()
    }).catch(err => console.log(err)).finally()

  };

  useEffect(() => {
    fetchUnapprovedUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              <span className="ml-3 text-lg text-gray-600">Loading unapproved users...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">Error loading users</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchUnapprovedUsers}
                className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Unapproved Users
          </h1>
          <p className="text-white/80">
            Manage and approve pending user registrations
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-gray-600">Pending Approvals</p>
              </div>
            </div>
            <button
              onClick={fetchUnapprovedUsers}
              className="bg-primary hover:bg-secondary text-white p-2 rounded-lg transition-colors duration-200"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600">No users pending approval at the moment.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Email</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.name || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="w-4 h-4 mr-1" />
                            Unapproved
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => approveUser(user._id)}
                            className="inline-flex items-center px-4 py-2 bg-primary hover:bg-secondary text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-100">
                {users.map((user) => (
                  <div key={user.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.name || 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 text-sm">{user.email}</span>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mb-3">
                          <Clock className="w-4 h-4 mr-1" />
                          Unapproved
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => approveUser(user.id)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-secondary text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve User
                        </>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnapprovedUsers;