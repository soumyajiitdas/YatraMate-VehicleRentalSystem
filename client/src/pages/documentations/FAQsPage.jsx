import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQsPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqCategories = [
    {
      category: 'Booking & Reservations',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      faqs: [
        {
          question: 'How do I book a vehicle on YatraMate?',
          answer: 'Booking is simple! Browse our vehicle catalog, select your preferred vehicle, choose your pickup and return dates, complete the booking form with your details, and make the payment. You\'ll receive a confirmation email with all the details.'
        },
        {
          question: 'Can I modify or cancel my booking?',
          answer: 'Yes, you can modify or cancel your booking through your account dashboard. Cancellations made 48 hours before pickup are eligible for a full refund. Cancellations within 48 hours may incur a small fee.'
        },
        {
          question: 'What documents do I need for booking?',
          answer: 'You need a valid driving license, government-issued ID proof (Aadhaar/PAN/Passport), and a registered account on YatraMate. For bikes, a two-wheeler license is required, and for cars, a four-wheeler license.'
        },
        {
          question: 'How far in advance can I book?',
          answer: 'You can book vehicles up to 3 months in advance. We recommend booking early, especially during peak seasons and holidays, to ensure availability of your preferred vehicle.'
        }
      ]
    },
    {
      category: 'Payments & Pricing',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit/debit cards, UPI payments, net banking, and popular digital wallets. All transactions are secured with industry-standard encryption.'
        },
        {
          question: 'Are there any hidden charges?',
          answer: 'No, we believe in transparent pricing. The price you see includes all standard charges. Additional costs may apply only for extras like GPS, child seats, or if you exceed the included kilometer limit.'
        },
        {
          question: 'Is a security deposit required?',
          answer: 'Yes, a refundable security deposit is required at the time of vehicle pickup. The amount varies based on the vehicle type and rental duration. It\'s refunded within 7 business days after vehicle return.'
        },
        {
          question: 'Do you offer any discounts or promotions?',
          answer: 'Yes! We regularly offer seasonal promotions, first-time user discounts, and loyalty rewards. Subscribe to our newsletter or check our Pricing page for current offers.'
        }
      ]
    },
    {
      category: 'Vehicle Pickup & Return',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      faqs: [
        {
          question: 'Where can I pick up my vehicle?',
          answer: 'You can pick up your vehicle from any of our partner locations in your selected city. The exact address will be provided in your booking confirmation email.'
        },
        {
          question: 'What if I\'m late for pickup?',
          answer: 'Please inform us as soon as possible if you\'re running late. We hold your reservation for up to 2 hours. Beyond that, the booking may be cancelled, and cancellation charges will apply.'
        },
        {
          question: 'Can I return the vehicle to a different location?',
          answer: 'Yes, we offer one-way rentals for select routes. Additional charges may apply based on the distance between pickup and drop-off locations. Check availability during booking.'
        },
        {
          question: 'What\'s the process for returning the vehicle?',
          answer: 'Return the vehicle to the designated location at the agreed time. Our staff will inspect the vehicle, verify fuel levels, and process your security deposit refund if everything is in order.'
        }
      ]
    },
    {
      category: 'Insurance & Safety',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      faqs: [
        {
          question: 'Are the vehicles insured?',
          answer: 'Yes, all our vehicles come with comprehensive insurance coverage. This includes third-party liability and own damage coverage as per government regulations.'
        },
        {
          question: 'What happens if there\'s an accident?',
          answer: 'In case of an accident, immediately contact our 24/7 support helpline. Do not leave the accident site. File a police report if required. We\'ll guide you through the insurance claim process.'
        },
        {
          question: 'Am I responsible for damages?',
          answer: 'Minor wear and tear is expected, but you\'re responsible for any damages beyond normal usage. This is why we collect a security deposit. Damages will be assessed and deducted from your deposit if applicable.'
        },
        {
          question: 'Are helmets provided with bike rentals?',
          answer: 'Yes, we provide complimentary helmets with all bike rentals. We sanitize them after each use. You\'re also welcome to bring your own helmet.'
        }
      ]
    },
    {
      category: 'Account & Support',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click on the "Register" button, fill in your details including name, email, phone number, and create a password. Verify your email, and you\'re all set to start booking!'
        },
        {
          question: 'I forgot my password. What should I do?',
          answer: 'Click on "Forgot Password" on the login page, enter your registered email, and we\'ll send you a password reset link. Follow the instructions to create a new password.'
        },
        {
          question: 'How can I contact customer support?',
          answer: 'You can reach us through our Help Center, email us at support@yatramate.com, call our 24/7 helpline, or use the live chat feature on our website.'
        },
        {
          question: 'Can I become a vehicle vendor on YatraMate?',
          answer: 'Absolutely! Visit our Vendor page to learn more about partnering with us. You can register as a vendor, list your vehicles, and start earning. We provide all the support you need.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary-500/10 via-transparent to-secondary-500/10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 
            data-testid="faq-page-title"
            className="text-4xl md:text-5xl lg:text-6xl font-display leading-tight font-bold text-neutral-900 mb-6"
          >
            Frequently Asked <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-secondary-600">Questions</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600">
            Find answers to common questions about YatraMate's vehicle rental services
          </p>
        </div>
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
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
          <div className="absolute -bottom-20 right-16 w-12 h-12 bg-yellow-300 rounded-full opacity-50 blur-md" />
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center text-white">
                  {category.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900">
                  {category.category} <span className='text-red-500'>:</span>
                </h2>
              </div>
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openIndex === globalIndex;
                  return (
                    <div 
                      key={faqIndex}
                      className="bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50 rounded-xl shadow-md border border-primary-100 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                    >
                      <button
                        onClick={() => toggleFAQ(globalIndex)}
                        data-testid={`faq-question-${globalIndex}`}
                        className="w-full px-6 py-5 text-left flex items-center justify-between"
                      >
                        <span className="text-lg font-semibold text-neutral-900 pr-4">
                          {faq.question}
                        </span>
                        <svg
                          className={`w-6 h-6 text-primary-600 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
                      >
                        <div className="px-6 pb-5 pt-2">
                          <p className="text-neutral-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-16 bg-linear-to-r from-primary-600 via-secondary-600 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Can't find the answer you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/help"
              data-testid="faq-help-center-btn"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-neutral-50 transition-colors duration-200 shadow-xl"
            >
              Visit Help Center
            </Link>
            <a
              href="mailto:support@yatramate.com"
              data-testid="faq-email-support-btn"
              className="inline-block bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary-700 transition-colors duration-200 border-2 border-white"
            >
              Email Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQsPage;