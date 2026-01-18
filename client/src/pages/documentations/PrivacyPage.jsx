import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const PrivacyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: 'Information We Collect',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      content: [
        {
          subtitle: 'Customer Information',
          text: 'When you create a customer account, we collect your full name, email address, phone number, and password. During vehicle pickup, we verify and record your government-issued ID details (Aadhaar, PAN, Voter ID, Passport, or Driving License) including ID type and number for security and legal compliance.'
        },
        {
          subtitle: 'Vendor Information',
          text: 'Vendors registering on YatraMate provide their full name (or organization name for businesses), contact number, email address, business/personal address, and identification documents. Organizations may provide Business Registration Certificates or Tax IDs, while individuals provide PAN, Aadhaar, License, or Passport details. We also collect uploaded identity documents for verification purposes.'
        },
        {
          subtitle: 'Vehicle Information',
          text: 'For vehicles listed by vendors, we collect vehicle name, brand, model, type (bike/car), registration number, engine number, chassis number, engine CC, location, RC documents, insurance documents, and vehicle images (exterior and interior photos).'
        },
        {
          subtitle: 'Booking & Transaction Data',
          text: 'We collect booking details including pickup/return dates and times, locations, odometer readings, estimated and final costs, advance payments (40%), and final payments (60%). All payment transactions through Razorpay include order IDs, payment IDs, and signature verification data.'
        },
        {
          subtitle: 'Usage Data',
          text: 'We automatically collect information about how you interact with our platform, including IP addresses, browser types, device information, pages visited, time spent on pages, and referring URLs. This helps us improve our services and detect potential security issues.'
        },
        {
          subtitle: 'Location Information',
          text: 'We collect location data related to vehicle pickup and drop-off points. With your permission, we may collect real-time location data to provide enhanced services such as nearest vehicle availability.'
        }
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      content: [
        {
          subtitle: 'Service Delivery',
          text: 'We use your information to process vehicle bookings, verify customer and vendor identities, facilitate vehicle pickups and returns, calculate rental costs based on distance and time, process advance and final payments through Razorpay, generate bill IDs, and provide customer support.'
        },
        {
          subtitle: 'Vendor Operations',
          text: 'For vendors, we use information to review and approve vehicle listings, match vehicles with appropriate pricing packages based on engine CC and type, track earnings and booking statistics, and process vendor payouts.'
        },
        {
          subtitle: 'Office Staff Operations',
          text: 'Office staff use collected information to verify customer identity at pickup, record vehicle condition and odometer readings, process returns and damage assessments, handle refunds for cancellations, and maintain booking records.'
        },
        {
          subtitle: 'Communication',
          text: 'We use your contact information to send booking confirmations with Bill IDs, OTPs for email verification and password changes, payment receipts and refund notifications, important service updates, and promotional offers (with your consent).'
        },
        {
          subtitle: 'Security and Fraud Prevention',
          text: 'We analyze usage patterns to detect fraudulent activities, prevent unauthorized account access, verify identity documents to ensure legitimate users, and protect both customers and vendors from potential fraud.'
        },
        {
          subtitle: 'Service Improvement',
          text: 'We use aggregated and anonymized data to analyze booking trends, improve vehicle availability algorithms, enhance user interface and experience, develop new features based on user behavior, and optimize pricing structures.'
        }
      ]
    },
    {
      title: 'Information Sharing and Disclosure',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      content: [
        {
          subtitle: 'With Vendors',
          text: 'When you book a vehicle, we share relevant booking details with the vehicle vendor including your name, contact information, and booking dates. This enables vendors to track their vehicle usage and earnings.'
        },
        {
          subtitle: 'With Payment Processors',
          text: 'We share necessary transaction data with Razorpay to process your advance and final payments. Razorpay handles your card details, UPI information, and wallet data according to their own privacy policy and PCI-DSS compliance standards. We do not store complete card details on our servers.'
        },
        {
          subtitle: 'With Image Storage Provider',
          text: 'Vehicle images and uploaded documents are stored using ImageKit\'s cloud storage service. These images are used only for vehicle display and document verification purposes.'
        },
        {
          subtitle: 'With Office Staff',
          text: 'Our authorized office staff access customer booking details, ID verification information, and vehicle condition records to process pickups and returns. Staff are bound by confidentiality agreements.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information when required by law, in response to valid legal processes (court orders, subpoenas), to protect our rights and property, to prevent fraud or illegal activities, or in connection with vehicle accidents or insurance claims.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. We will notify you of any such change in ownership and your options regarding your personal data.'
        }
      ]
    },
    {
      title: 'Data Security',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      content: [
        {
          subtitle: 'Technical Security Measures',
          text: 'We implement industry-standard security measures including SSL/TLS encryption for all data transmission, secure password hashing using bcrypt, JWT (JSON Web Tokens) for secure authentication, HTTP-only cookies to prevent XSS attacks, and regular security audits of our systems.'
        },
        {
          subtitle: 'Payment Security',
          text: 'All payment processing is handled through Razorpay, a PCI-DSS compliant payment gateway. Your sensitive payment details are never stored on our servers. We only store transaction IDs and verification signatures for record-keeping.'
        },
        {
          subtitle: 'Document Storage',
          text: 'Uploaded documents (ID proofs, RC documents, insurance papers) are stored securely on ImageKit\'s cloud infrastructure with encrypted storage and controlled access permissions.'
        },
        {
          subtitle: 'Access Controls',
          text: 'We implement role-based access controls: Customers can only view their own bookings and profile. Vendors can only access their own vehicles and earnings. Office staff have limited access to process bookings. Admins have controlled full system access with audit logging.'
        },
        {
          subtitle: 'Data Retention',
          text: 'We retain your personal information only as long as necessary: Active account data is kept while your account exists. Booking records are retained for 7 years for legal compliance. Inactive accounts may be deleted after 2 years of inactivity with prior notice.'
        }
      ]
    },
    {
      title: 'User-Specific Privacy Rights',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      content: [
        {
          subtitle: 'Customer Rights',
          text: 'As a customer, you can: Access and update your profile information at any time. View your complete booking history. Request deletion of your account and associated data. Opt out of marketing communications. Cancel bookings and track refund status. Download your personal data upon request.'
        },
        {
          subtitle: 'Vendor Rights',
          text: 'As a vendor, you can: Update your profile and business information. Add or remove vehicles from your listing. Access detailed earnings reports. Request correction of any incorrect information. Delete your vendor account (vehicles will be delisted). Export your vehicle and earnings data.'
        },
        {
          subtitle: 'Password Security',
          text: 'All users can change their password through the settings page. Password changes require OTP verification sent to your registered email for enhanced security. We recommend using strong, unique passwords and enabling email verification.'
        },
        {
          subtitle: 'Data Deletion Requests',
          text: 'You can request complete deletion of your account and personal data by contacting privacy@yatramate.com. Note: Certain data may be retained for legal compliance, pending transactions, or dispute resolution. Deletion requests are processed within 30 days.'
        }
      ]
    },
    {
      title: 'Cookies and Tracking Technologies',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      content: [
        {
          subtitle: 'Essential Cookies',
          text: 'We use essential cookies to maintain your login session (HTTP-only cookies with JWT tokens), remember your preferences, ensure secure transactions, and enable core platform functionality. These cannot be disabled as they are necessary for the service to work.'
        },
        {
          subtitle: 'Analytics Cookies',
          text: 'We may use analytics tools to understand how users interact with our platform, identify popular features and areas for improvement, track booking conversion rates, and optimize user experience. These cookies collect anonymized data.'
        },
        {
          subtitle: 'Managing Cookies',
          text: 'You can control cookie settings through your browser preferences. However, disabling essential cookies may affect your ability to use the platform, particularly login functionality and secure transactions.'
        }
      ]
    },
    {
      title: 'Third-Party Services',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      content: [
        {
          subtitle: 'Razorpay Payment Gateway',
          text: 'We use Razorpay to process all online payments including advance bookings (40%) and final payments (60%). Razorpay is PCI-DSS compliant and handles your payment card data, UPI details, and wallet information according to their privacy policy at razorpay.com/privacy.'
        },
        {
          subtitle: 'ImageKit Image Storage',
          text: 'Vehicle images, ID documents, RC documents, and insurance papers are stored using ImageKit\'s cloud storage service. ImageKit provides secure storage with CDN delivery for optimized image loading. Their privacy policy is available at imagekit.io/privacy-policy.'
        },
        {
          subtitle: 'Email Services',
          text: 'We use email services to send booking confirmations, OTPs for verification, password reset links, and important notifications. These services have access to your email address only for delivery purposes.'
        },
        {
          subtitle: 'MongoDB Database',
          text: 'Your data is stored in MongoDB databases with encryption at rest and in transit. We use secure connection strings and implement database-level access controls.'
        }
      ]
    },
    {
      title: 'Children\'s Privacy',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      content: [
        {
          subtitle: 'Age Restrictions',
          text: 'YatraMate services are intended for users who are at least 18 years of age. Vehicle rentals require a valid driving license, which is only issued to adults. We do not knowingly collect personal information from individuals under 18. If we discover that we have collected information from a minor, we will promptly delete it.'
        }
      ]
    },
    {
      title: 'Changes to This Privacy Policy',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      content: [
        {
          subtitle: 'Policy Updates',
          text: 'We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or business operations. When we make significant changes, we will: Update the "Last Updated" date at the top of this page. Send email notification to registered users for material changes. Post a prominent notice on our platform. Your continued use of YatraMate after changes constitutes acceptance of the updated policy.'
        }
      ]
    },
    {
      title: 'Contact Information',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      content: [
        {
          subtitle: 'Privacy Inquiries',
          text: 'For any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at: Email: privacy@yatramate.com | Support: support@yatramate.com | Phone: +91-000-000-0000 | Address: 123 Business Park, Tech City, India. We aim to respond to all privacy-related inquiries within 72 hours.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden bg-linear-to-r from-secondary-600 via-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 
            data-testid="privacy-page-title"
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
          >
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-primary-100">
            Your privacy is important to us. Learn how we collect, use, and protect your information across all user roles.
          </p>
          <p className="text-sm text-primary-200 mt-4">
            Last Updated: January 2026
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border-l-4 border-secondary-600 p-6 rounded-r-xl mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">Our Commitment to Your Privacy <span className='text-red-600'>:</span></h2>
            <p className="text-neutral-700 leading-relaxed mb-3">
              At YatraMate, we respect your privacy and are committed to protecting the personal information of all our users - whether you're a customer renting vehicles, a vendor listing your fleet, or an office staff member managing operations.
            </p>
            <p className="text-neutral-700 leading-relaxed mb-3">
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our vehicle rental platform. It covers all user types and their specific data handling practices.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              By using YatraMate's services, you consent to the data practices described in this policy. If you do not agree with this policy, please do not use our services.
            </p>
          </div>

          {/* User Type Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md border border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Customers</h3>
              <p className="text-sm text-neutral-600">We collect account info, booking details, payment data, and ID verification at pickup.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Vendors</h3>
              <p className="text-sm text-neutral-600">We collect business details, ID documents, vehicle information, and earnings data.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Office Staff</h3>
              <p className="text-sm text-neutral-600">Staff access booking data for pickups, returns, and refund processing under strict guidelines.</p>
            </div>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-8">
            {sections.map((section, sectionIndex) => (
              <div 
                key={sectionIndex}
                data-testid={`privacy-section-${sectionIndex}`}
                className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-neutral-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-linear-to-r from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center text-white mr-4 shrink-0">
                    {section.icon}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mt-2">{section.title}</h2>
                </div>
                <div className="space-y-4 ml-0 md:ml-16">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className="text-lg font-semibold text-neutral-800 mb-2"><span className='text-red-500'>●</span> {item.subtitle}</h3>
                      <p className="text-neutral-700 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-linear-to-r from-secondary-600 to-primary-600 text-white p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-primary-100 leading-relaxed mb-6">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please don't hesitate to contact us. We're committed to protecting your privacy and ensuring transparency in all our data handling practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
            <Link
                to="/help"
                data-testid="privacy-help-center-btn"
                className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-neutral-50 transition-colors duration-200 text-center"
              >
                Visit Help Center
              </Link>
              <a
                href="mailto:privacy@yatramate.com"
                data-testid="privacy-email-btn"
                className="inline-block bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-colors duration-200 border-2 border-white text-center"
              >
                Email: privacy@yatramate.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
