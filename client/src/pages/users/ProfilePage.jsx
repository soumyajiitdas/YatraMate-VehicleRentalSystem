import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { CircleUser, ClipboardList, LockKeyhole, LogOut, Mail, Shield } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, refreshUser, requestPasswordChangeOTP, verifyPasswordChangeOTP, resendPasswordChangeOTP } = useAuth();
  const { toast } = useToast();
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
  
  // Password change OTP states
  const [passwordChangeStep, setPasswordChangeStep] = useState('form'); // 'form', 'otp'
  const [otp, setOtp] = useState('');
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

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

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

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
        toast.success('Profile updated successfully!');
        await refreshUser();
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile: ' + error.message);
    }
  };

  const handleRequestPasswordChangeOTP = async () => {
    if (!passwordData.currentPassword) {
      toast.warning('Please enter your current password');
      return;
    }

    if (!passwordData.newPassword) {
      toast.warning('Please enter your new password');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.warning('Password must be at least 6 characters');
      return;
    }

    setIsRequestingOTP(true);
    try {
      const result = await requestPasswordChangeOTP(passwordData.currentPassword);

      if (result.success) {
        toast.success('Verification OTP sent to your email!');
        setPasswordChangeStep('otp');
        setResendCooldown(60);
      } else {
        toast.error(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Error sending OTP: ' + error.message);
    } finally {
      setIsRequestingOTP(false);
    }
  };

  const handleVerifyOTPAndChangePassword = async () => {
    if (!otp || otp.length !== 6) {
      toast.warning('Please enter the 6-digit OTP');
      return;
    }

    setIsVerifyingOTP(true);
    try {
      const result = await verifyPasswordChangeOTP(otp, passwordData.newPassword);

      if (result.success) {
        toast.success('Password changed successfully!');
        // Reset all states
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setOtp('');
        setPasswordChangeStep('form');
      } else {
        toast.error(result.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Error changing password: ' + error.message);
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsResendingOTP(true);
    try {
      const result = await resendPasswordChangeOTP();

      if (result.success) {
        toast.success('New OTP sent to your email!');
        setResendCooldown(60);
      } else {
        toast.error(result.message || 'Failed to resend OTP');
      }
    } catch (error) {
      toast.error('Error resending OTP: ' + error.message);
    } finally {
      setIsResendingOTP(false);
    }
  };

  const handleCancelOTPStep = () => {
    setPasswordChangeStep('form');
    setOtp('');
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
                    data-testid={`tab-${tab.id}`}
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
                  data-testid="logout-btn-mobile"
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
                  data-testid={`tab-${tab.id}-desktop`}
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
                data-testid="logout-btn-desktop"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-secondary-500 bg-red-50 hover:scale-104 transition-all duration-200"
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
                        data-testid="edit-profile-btn"
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
                      data-testid="profile-name-input"
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
                      disabled
                      data-testid="profile-email-input"
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
                      data-testid="profile-phone-input"
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
                      data-testid="profile-address-input"
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200 disabled:bg-neutral-50"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSave}
                        data-testid="save-profile-btn"
                        className="px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-200"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        data-testid="cancel-edit-btn"
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
                  data-testid="go-to-bookings-btn"
                  className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-200 text-sm sm:text-base"
                >
                  Go to Bookings
                </button>
              </div>

            )}

            {activeTab === 'security' && (
              <div className="bg-white border-2 border-primary-200 rounded-2xl shadow-card p-8 space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-7 h-7 text-primary-600" />
                  <h2 className="text-2xl font-bold text-neutral-900">Security Settings <span className='text-red-500'>:</span></h2>
                </div>
                
                <p className="text-neutral-600 text-sm mb-6">
                  Change your password securely with email verification.
                </p>

                {passwordChangeStep === 'form' ? (
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
                        data-testid="current-password-input"
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
                        placeholder="Enter new password (min. 6 characters)"
                        data-testid="new-password-input"
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
                        data-testid="confirm-password-input"
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200"
                      />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">Email Verification Required</p>
                          <p className="text-xs text-amber-700 mt-1">A verification OTP will be sent to your registered email address to confirm the password change.</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleRequestPasswordChangeOTP}
                      disabled={isRequestingOTP}
                      data-testid="request-otp-btn"
                      className="px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isRequestingOTP ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Sending OTP...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5" />
                          <span>Send Verification OTP</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* OTP Verification Step */}
                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-primary-600" />
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-2">Verify Your Email</h3>
                      <p className="text-sm text-neutral-600 mb-4">
                        We've sent a 6-digit verification code to <span className="font-semibold">{user?.email}</span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Enter OTP Code
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        data-testid="otp-input"
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200 text-center text-2xl tracking-[0.5em] font-mono"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleVerifyOTPAndChangePassword}
                        disabled={isVerifyingOTP || otp.length !== 6}
                        data-testid="verify-otp-btn"
                        className="flex-1 px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isVerifyingOTP ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-5 h-5" />
                            <span>Verify & Change Password</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelOTPStep}
                        data-testid="cancel-otp-btn"
                        className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        onClick={handleResendOTP}
                        disabled={isResendingOTP || resendCooldown > 0}
                        data-testid="resend-otp-btn"
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:text-neutral-400 disabled:cursor-not-allowed"
                      >
                        {isResendingOTP ? (
                          'Sending...'
                        ) : resendCooldown > 0 ? (
                          `Resend OTP in ${resendCooldown}s`
                        ) : (
                          'Resend OTP'
                        )}
                      </button>
                    </div>
                  </div>
                )}
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
