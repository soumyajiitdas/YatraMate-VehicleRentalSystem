import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircleUser, ClipboardList, LockKeyhole, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, updatePassword, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    // Initialize form data with user data
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      const result = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });

      if (result.success) {
        setIsEditing(false);
        alert('Profile updated successfully!');
        await refreshUser();
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      const result = await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (result.success) {
        alert('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        alert(result.message || 'Failed to update password');
      }
    } catch (error) {
      alert('Error updating password: ' + error.message);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  if (!user) {
    return null;
  }

  const tabs = [
    {
      id: 'profile', label: 'Profile', icon: (
        <CircleUser className="w-5 h-5" />
      )
    },
    {
      id: 'bookings', label: 'My Bookings', icon: (
        <ClipboardList className="w-5 h-5" />
      )
    },
    {
      id: 'security', label: 'Security', icon: (
        <LockKeyhole className="w-5 h-5" />
      )
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-2">
            My <span className='text-red-500'>Account</span>
          </h1>
          <p className="text-lg text-neutral-600">
            Manage your profile and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar - Horizontal on mobile, vertical on desktop */}
          <div className="lg:col-span-1">
            {/* Mobile: Horizontal scroll tabs */}
            <div className="lg:hidden bg-white border-2 border-primary-200 rounded-2xl shadow-card p-4 mb-6 overflow-x-auto">
              <div className="flex space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                        ? 'shrink-0 flex items-center space-x-2 px-4 py-2.5 bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                        : 'p-3 text-neutral-700 bg-neutral-100'
                      }`}
                  >
                    {tab.icon}
                    <span className={`${activeTab === tab.id ? '' : 'hidden sm:block'}`}>{tab.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="shrink-0 flex items-center space-x-0 sm:space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm text-secondary-600 bg-secondary-50 transition-all duration-200 whitespace-nowrap"
                >
                  <LogOut className="w-5 h-5" />
                  <span className='hidden sm:block'>Logout</span>
                </button>
              </div>
            </div>

            {/* Desktop: Vertical sidebar */}
            <div className="hidden lg:block bg-white border-2 border-primary-200 rounded-2xl shadow-card p-6 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === tab.id
                      ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                      : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-secondary-600 hover:bg-secondary-50 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white border-2 border-primary-200 rounded-2xl shadow-card p-8 space-y-6">
                {/* Profile Header */}
                <div className="pb-6 border-b border-neutral-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shrink-0">
                        {formData.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 truncate">{formData.name}</h2>
                        <p className="text-sm sm:text-base text-neutral-600 truncate">{formData.email}</p>
                      </div>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-glow transition-all duration-200 text-sm sm:text-base"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200 disabled:bg-neutral-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200 disabled:bg-neutral-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200 disabled:bg-neutral-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200 disabled:bg-neutral-50"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-200"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bg-white border-2 border-primary-200 rounded-2xl shadow-card p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4 sm:mb-6">
                  Booking History <span className='text-red-500'>:</span>
                </h2>

                <p className="text-neutral-600 text-sm sm:text-base mb-4">
                  View all your bookings on the bookings page.
                </p>

                <button
                  onClick={() => navigate('/bookings')}
                  className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-200 text-sm sm:text-base"
                >
                  Go to Bookings
                </button>
              </div>

            )}

            {activeTab === 'security' && (
              <div className="bg-white border-2 border-primary-200 rounded-2xl shadow-card p-8 space-y-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Security Settings <span className='text-red-500'>:</span></h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200"
                    />
                  </div>

                  <button
                    onClick={handlePasswordUpdate}
                    className="px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-200"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Background Decorative Elements */}
      <div className="hidden absolute inset-0 pointer-events-none sm:block">
        {/* Top-left cluster */}
        <div className="absolute -top-10 -left-6 w-32 h-32 bg-red-300 rounded-full opacity-50 blur-md" />
        <div className="absolute top-6 -left-12 w-20 h-20 bg-blue-300 rounded-full opacity-50 blur-md" />
        <div className="absolute top-20 left-4 w-14 h-14 bg-yellow-300 rounded-full opacity-50 blur-md" />

        {/* Center-right floating grouping */}
        <div className="absolute top-16 right-24 w-28 h-28 bg-pink-300 rounded-full opacity-50 blur-md" />
        <div className="absolute top-32 right-10 w-16 h-16 bg-purple-300 rounded-full opacity-50 blur-md" />
        <div className="absolute top-44 right-16 w-12 h-12 bg-green-300 rounded-full opacity-50 blur-md" />

        {/* Bottom-right anchor cluster */}
        <div className="absolute -bottom-10 right-8 w-24 h-24 bg-red-300 rounded-full opacity-50 blur-md" />
        <div className="absolute -bottom-4 right-24 w-16 h-16 bg-blue-300 rounded-full opacity-50 blur-md" />
        <div className="absolute -bottom-15 right-16 w-12 h-12 bg-yellow-300 rounded-full opacity-50 blur-md" />
      </div>
    </div>
  );
};

export default ProfilePage;
