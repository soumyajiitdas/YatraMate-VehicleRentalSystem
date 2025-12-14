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
          subtitle: 'Personal Information',
          text: 'We collect personal information that you provide to us, including your name, email address, phone number, date of birth, and address. When you create an account or make a booking, we also collect your driving license details and government-issued ID information for verification purposes.'
        },
        {
          subtitle: 'Payment Information',
          text: 'Payment details such as credit/debit card information, UPI IDs, and billing addresses are collected through secure payment gateways. We do not store complete card details on our servers; they are encrypted and handled by PCI-DSS compliant payment processors.'
        },
        {
          subtitle: 'Usage Data',
          text: 'We automatically collect information about how you interact with our services, including IP addresses, browser types, device information, pages visited, time spent on pages, and referring URLs. This helps us improve our services and user experience.'
        },
        {
          subtitle: 'Location Information',
          text: 'With your permission, we may collect location data to help you find nearby vehicles, provide accurate pickup/drop-off services, and enhance your overall experience.'
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
          text: 'Your information is used to process bookings, verify your identity, facilitate vehicle pickups and returns, process payments, and provide customer support. This is essential for delivering our core services to you.'
        },
        {
          subtitle: 'Communication',
          text: 'We use your contact information to send booking confirmations, reminders, updates about your rentals, respond to your inquiries, and provide important service notifications. We may also send promotional offers if you have opted in to receive marketing communications.'
        },
        {
          subtitle: 'Security and Fraud Prevention',
          text: 'We analyze usage patterns and behavior to detect and prevent fraud, unauthorized access, and other security threats. This helps protect both you and our platform from malicious activities.'
        },
        {
          subtitle: 'Service Improvement',
          text: 'We use aggregated and anonymized data to analyze trends, understand user preferences, improve our website and mobile applications, develop new features, and enhance overall service quality.'
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
          subtitle: 'Service Providers',
          text: 'We share your information with trusted third-party service providers who help us operate our business, including payment processors, vehicle vendors, SMS and email service providers, and cloud hosting services. These providers are contractually obligated to protect your data.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information when required by law, to comply with legal processes, respond to government requests, enforce our terms and policies, or protect our rights, property, and safety or that of others.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. We will notify you of any such change in ownership or control of your personal information.'
        },
        {
          subtitle: 'With Your Consent',
          text: 'We may share your information with other parties when you explicitly consent to such sharing, such as when you choose to share your trip details with friends or family.'
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
          subtitle: 'Security Measures',
          text: 'We implement industry-standard security measures including SSL encryption, secure servers, firewalls, and regular security audits to protect your personal information from unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          subtitle: 'Data Retention',
          text: 'We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Inactive accounts may be deleted after a period of inactivity.'
        },
        {
          subtitle: 'Your Responsibility',
          text: 'You are responsible for maintaining the confidentiality of your account credentials. Never share your password with others, and notify us immediately if you suspect any unauthorized access to your account.'
        }
      ]
    },
    {
      title: 'Your Rights and Choices',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      content: [
        {
          subtitle: 'Access and Update',
          text: 'You have the right to access, review, and update your personal information at any time through your account settings. If you need assistance, contact our support team.'
        },
        {
          subtitle: 'Data Deletion',
          text: 'You can request deletion of your account and personal data by contacting us at privacy@yatramate.com. Please note that we may retain certain information as required by law or for legitimate business purposes.'
        },
        {
          subtitle: 'Marketing Communications',
          text: 'You can opt out of receiving promotional emails by clicking the unsubscribe link in any marketing email or by updating your communication preferences in your account settings. Please note that you will still receive transactional emails related to your bookings.'
        },
        {
          subtitle: 'Cookie Preferences',
          text: 'You can control cookie settings through your browser settings. However, disabling cookies may affect your ability to use certain features of our website.'
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
          subtitle: 'What We Use',
          text: 'We use cookies, web beacons, and similar tracking technologies to enhance your experience, remember your preferences, analyze usage patterns, and deliver personalized content and advertisements.'
        },
        {
          subtitle: 'Types of Cookies',
          text: 'Essential cookies are necessary for the website to function. Performance cookies help us understand how you use our site. Functional cookies remember your preferences. Marketing cookies track your activity to deliver relevant advertisements.'
        },
        {
          subtitle: 'Third-Party Cookies',
          text: 'We may allow third-party services like Google Analytics to place cookies on your device for analytics and advertising purposes. These services have their own privacy policies governing the use of your information.'
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
          subtitle: 'Age Restriction',
          text: 'Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child without parental consent, we will take steps to delete that information promptly.'
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
          text: 'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date. Your continued use of our services after such changes constitutes your acceptance of the updated policy.'
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
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-primary-200 mt-4">
            Last Updated: December 2025
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border-l-4 border-secondary-600 p-6 rounded-r-xl mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">Our Commitment to Your Privacy <span className='text-red-600'>:</span></h2>
            <p className="text-neutral-700 leading-relaxed mb-3">
              At YatraMate, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our vehicle rental services.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              By using YatraMate's services, you consent to the data practices described in this policy. If you do not agree with this policy, please do not use our services.
            </p>
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
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please don't hesitate to contact us. We're here to help and ensure your privacy is protected.
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