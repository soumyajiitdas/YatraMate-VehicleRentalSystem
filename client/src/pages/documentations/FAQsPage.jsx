import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQsPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqCategories = [
    {
      category: 'Getting Started',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      faqs: [
        {
          question: 'What is YatraMate?',
          answer: 'YatraMate is a comprehensive online vehicle rental platform that connects customers with verified vehicle vendors. You can rent cars and bikes for daily use, trips, or special occasions. Our platform ensures transparent pricing, verified vehicles, and secure transactions.'
        },
        {
          question: 'How do I create an account?',
          answer: 'Click on "Register" button, fill in your details (name, email, phone, password). You\'ll receive a 6-digit OTP on your email. Enter the OTP to verify your account, and you\'re ready to start booking! The OTP is valid for 10 minutes.'
        },
        {
          question: 'Who can use YatraMate?',
          answer: 'YatraMate is designed for: 1) Customers - Anyone 18+ years with a valid driving license can rent vehicles. 2) Vendors - Vehicle owners who want to list and rent out their cars/bikes. 3) Office Staff - YatraMate employees who manage pickups and returns. 4) Administrators - Platform managers with full system access.'
        },
        {
          question: 'What types of vehicles are available?',
          answer: 'We offer both two-wheelers (bikes/scooters) and four-wheelers (cars). Vehicles are categorized by engine capacity (CC) with different pricing packages. You can filter vehicles by type, location, availability, and price range.'
        }
      ]
    },
    {
      category: 'Booking Process',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      faqs: [
        {
          question: 'How do I book a vehicle?',
          answer: 'Step 1: Browse vehicles on our platform and select your preferred one. Step 2: Click "Book Now" and choose your pickup date, time, and location. Step 3: Submit the booking request. Step 4: Visit the pickup location at the scheduled time with your ID and driving license. No advance payment is required - you pay after returning the vehicle!'
        },
        {
          question: 'What documents do I need for pickup?',
          answer: 'At pickup, you need to provide: 1) Valid Government ID (Aadhaar Card, PAN Card, Passport, Voter ID, or Driving License) 2) Valid Driving License (Two-wheeler license for bikes, Four-wheeler license for cars). Our office staff will verify these documents before handing over the vehicle.'
        },
        {
          question: 'Can I modify my booking?',
          answer: 'Currently, bookings cannot be modified after submission. If you need to change details, please cancel the existing booking (no charges before pickup) and create a new one. We\'re working on adding modification features in future updates.'
        },
        {
          question: 'How far in advance can I book?',
          answer: 'You can book vehicles up to 3 months in advance. We recommend booking early during peak seasons, holidays, and weekends to ensure availability of your preferred vehicle.'
        },
        {
          question: 'What happens after I submit a booking?',
          answer: 'After submission: 1) Booking status becomes "Booking Requested" 2) Vehicle is temporarily marked as "Booked" 3) You\'ll receive a confirmation email 4) Visit the pickup location at scheduled time 5) Office staff will verify your documents and hand over the vehicle 6) A unique Bill ID is generated at pickup.'
        }
      ]
    },
    {
      category: 'Pricing & Payments',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      faqs: [
        {
          question: 'How is the rental cost calculated?',
          answer: 'Our pricing is based on actual usage. We calculate: 1) Distance Cost = KM traveled × Price per KM 2) Time Cost = Hours used × Price per Hour. Your final cost = MAX(Distance Cost, Time Cost) + Damage Cost (if any). You pay whichever is higher between distance and time, ensuring fair pricing for your trip.'
        },
        {
          question: 'What are the pricing packages?',
          answer: 'Packages are based on vehicle type and engine capacity (CC). For example: Economy Bike (100-150CC) at ₹30/hour or ₹3/km, Standard Car (1200-1600CC) at ₹150/hour or ₹15/km. Visit our Pricing page to see all current packages with detailed rates.'
        },
        {
          question: 'Do I need to pay in advance?',
          answer: 'No! YatraMate follows a pay-after-use model. You don\'t need to pay any advance or deposit while booking. Payment is collected only after you return the vehicle, based on actual usage.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept: 1) Cash - Pay directly at the return location 2) Online Payment - Credit/Debit cards, UPI, Net Banking via Razorpay. Choose your preferred method at the time of return.'
        },
        {
          question: 'Are there any hidden charges?',
          answer: 'Absolutely not! We believe in 100% transparent pricing. The price you see on the package is what you pay. Additional charges only apply if: 1) Vehicle is damaged during rental 2) Late return fees (if applicable). All charges are clearly communicated before finalizing.'
        },
        {
          question: 'What about fuel charges?',
          answer: 'Fuel is NOT included in the rental price. You receive the vehicle with a certain fuel level and must return it with the same level. If returned with less fuel, charges may apply.'
        }
      ]
    },
    {
      category: 'Pickup & Return',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      faqs: [
        {
          question: 'Where can I pick up the vehicle?',
          answer: 'Pickup locations are specified for each vehicle and shown in the booking confirmation. Visit the designated YatraMate partner location at your scheduled time. The address and any special instructions will be included in your confirmation email.'
        },
        {
          question: 'What happens at pickup?',
          answer: 'At pickup, our office staff will: 1) Verify your ID and Driving License 2) Record the vehicle\'s current odometer reading 3) Check the vehicle plate number 4) Generate a Bill ID (BILL-YYYYMMDD-XXXXX) 5) Hand over the vehicle keys 6) Send you a pickup confirmation email with all details.'
        },
        {
          question: 'What if I am late for pickup?',
          answer: 'Please inform us as soon as possible if you\'re running late. We hold your reservation for up to 2 hours. If you don\'t show up or don\'t inform us, the booking may be cancelled by staff.'
        },
        {
          question: 'How do I return the vehicle?',
          answer: 'Return the vehicle to the same pickup location. Our staff will: 1) Record the final odometer reading 2) Verify vehicle details (plate, engine, chassis numbers) 3) Inspect vehicle condition 4) Calculate final cost 5) Process your payment 6) Send return confirmation email with complete bill.'
        },
        {
          question: 'What if I return late?',
          answer: 'Extra hours will be charged according to the package rate. Always try to return on time or inform us in advance if you need an extension. Unauthorized late returns may result in additional penalties.'
        },
        {
          question: 'Can I return to a different location?',
          answer: 'Currently, vehicles must be returned to the same location where you picked them up. One-way rentals may be available for select routes in the future.'
        }
      ]
    },
    {
      category: 'Cancellation & Refunds',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      faqs: [
        {
          question: 'Can I cancel my booking?',
          answer: 'Yes! You can cancel any booking that is in "Booking Requested" status (before pickup). Go to your Bookings page, select the booking, and click Cancel. You\'ll need to provide a cancellation reason.'
        },
        {
          question: 'Are there cancellation charges?',
          answer: 'Since YatraMate doesn\'t require advance payment, most cancellations are free! If you\'ve made any advance payment, refund will be processed within 7-10 business days.'
        },
        {
          question: 'What if the office staff rejects my booking?',
          answer: 'In rare cases, staff may reject a booking due to document issues, vehicle unavailability, or other reasons. You\'ll receive an email notification with the rejection reason. Any advance payments will be refunded.'
        },
        {
          question: 'How do I get a refund?',
          answer: 'Refunds for cancelled bookings (where advance payment was made) are automatically processed. Status changes to "Refund Pending" and then "Completed" once processed. Refunds typically take 7-10 business days to reflect in your account.'
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
          answer: 'Yes! All vehicles on YatraMate come with comprehensive insurance coverage as per government regulations. This includes third-party liability and own damage coverage.'
        },
        {
          question: 'What happens if there is an accident?',
          answer: 'In case of an accident: 1) Ensure your safety first 2) Contact local police if required 3) Call our 24/7 support immediately 4) Do NOT leave the accident site 5) We\'ll guide you through the insurance claim process. Never admit fault or make settlements without our authorization.'
        },
        {
          question: 'Am I responsible for damages?',
          answer: 'You\'re responsible for damages beyond normal wear and tear. At return, staff will inspect the vehicle. If damages are found, they\'ll be assessed and added to your final bill. Minor scratches may be covered, but significant damage will be charged.'
        },
        {
          question: 'Are helmets provided with bikes?',
          answer: 'Yes! Complimentary helmets are provided with all bike rentals. We sanitize them after each use for your safety. You\'re also welcome to bring your own helmet.'
        },
        {
          question: 'What safety measures does YatraMate take?',
          answer: 'We ensure: 1) All vehicles have valid RC and insurance 2) Regular maintenance checks 3) Vendor verification before approval 4) Customer ID verification at pickup 5) 24/7 emergency support'
        }
      ]
    },
    {
      category: 'For Vendors',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      faqs: [
        {
          question: 'How do I become a vendor?',
          answer: 'Visit our Vendor page and fill the registration form. You\'ll need: Name, Email, Phone, Address, ID proof (PAN/Aadhaar/DL for individuals or Business Registration for companies), and Password. After email verification via OTP, your account goes for admin approval. Once approved, you can start listing vehicles!'
        },
        {
          question: 'What documents do vendors need?',
          answer: 'For Individuals: PAN Card, Driving License, Passport, or Aadhaar Card. For Organizations: Business Registration Certificate or Business Tax ID. All documents must be valid and clearly readable.'
        },
        {
          question: 'How do I list my vehicles?',
          answer: 'After vendor approval: 1) Go to Vendor Dashboard 2) Click "Add New Vehicle" 3) Fill vehicle details (name, model, brand, registration, engine, chassis numbers) 4) Upload RC, Insurance documents, and vehicle images 5) Submit for admin approval. Once approved, your vehicle becomes available for booking!'
        },
        {
          question: 'How do I track my earnings?',
          answer: 'Your Vendor Dashboard shows: 1) Total earnings overview 2) Filter earnings by Day/Week/Month/Year 3) Detailed breakdown of each completed booking 4) Vehicle-wise earnings analysis'
        },
        {
          question: 'When do I get paid?',
          answer: 'Earnings are tracked automatically when customers complete their rentals. Payment settlements are processed according to our vendor payment schedule. Check your dashboard for detailed payment history.'
        },
        {
          question: 'What happens if my vehicle is damaged?',
          answer: 'Damage costs are collected from customers during return. These are recorded in the booking details. Insurance claims for major damages are handled as per the vehicle\'s insurance policy.'
        }
      ]
    },
    {
      category: 'For Office Staff',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      faqs: [
        {
          question: 'How do I process a pickup?',
          answer: 'In your Staff Dashboard: 1) Find the booking in "Booking Requested" status 2) Click "Confirm Pickup" 3) Fill pickup details: Date, Time, Odometer reading, Vehicle plate number, Customer ID type and number, any notes 4) Submit. This generates a Bill ID and changes status to "Picked Up".'
        },
        {
          question: 'How do I process a return?',
          answer: '1) Find the booking in "Picked Up" status 2) Click "Process Return" 3) Fill return details: Date, Time, Final odometer reading, Verify vehicle numbers, Vehicle condition (Perfect/Damaged), Damage cost if applicable, Amount paid 4) Select payment method (Cash/Online) 5) Submit to complete the rental.'
        },
        {
          question: 'How is the final cost calculated?',
          answer: 'System calculates automatically: Distance = End Odometer - Start Odometer, Duration = Return Time - Pickup Time. Distance Cost = Distance × Price per KM, Time Cost = Hours × Price per Hour. Final Cost = MAX(Distance Cost, Time Cost) + Damage Cost. This ensures customers pay fairly based on actual usage.'
        },
        {
          question: 'How do I reject a booking?',
          answer: 'For valid reasons (document issues, vehicle problems, etc.): 1) Find the booking in "Booking Requested" status 2) Click "Reject" 3) Provide rejection reason 4) Submit. Customer is notified via email. Vehicle status returns to "Available".'
        },
        {
          question: 'How do I mark a refund as completed?',
          answer: 'For cancelled bookings with pending refunds: 1) Find the cancelled booking with "Refund Pending" status 2) Once refund is processed in your payment system 3) Click "Mark Refund Completed" 4) Status updates to "Refund Completed"'
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
          question: 'I forgot my password. What should I do?',
          answer: 'Click "Forgot Password" on the login page. Enter your registered email. You\'ll receive a password reset link valid for 10 minutes. Click the link and create a new password. You can then login with your new password.'
        },
        {
          question: 'How do I change my password?',
          answer: 'Go to Profile > Change Password. Enter your current password for verification. An OTP will be sent to your email. Enter the OTP and your new password to complete the change.'
        },
        {
          question: 'How do I update my profile?',
          answer: 'Go to Profile page. Click "Edit Profile". Update your name, phone number, or address. Save changes. Note: Email cannot be changed as it\'s your primary identifier.'
        },
        {
          question: 'How can I contact customer support?',
          answer: 'Multiple ways to reach us: 1) Email: support@yatramate.com 2) Phone: Our 24/7 helpline (number on Help page) 3) Help Center contact form 4) For emergencies during rental, call our emergency number immediately.'
        },
        {
          question: 'I didn\'t receive my OTP. What should I do?',
          answer: 'Wait for 2-3 minutes as sometimes there\'s a slight delay. Check your spam/junk folder. Click "Resend OTP" button if available. Ensure your email is correctly spelled. Still having issues? Contact support.'
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
            Everything you need to know about YatraMate - for customers, vendors, and staff
          </p>
        </div>
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-6 w-32 h-32 bg-red-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-6 -left-12 w-20 h-20 bg-blue-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-20 left-4 w-14 h-14 bg-yellow-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-16 right-24 w-28 h-28 bg-pink-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-32 right-10 w-16 h-16 bg-purple-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-44 right-16 w-12 h-12 bg-green-300 rounded-full opacity-50 blur-md" />
          <div className="absolute -bottom-10 right-8 w-24 h-24 bg-red-300 rounded-full opacity-50 blur-md" />
          <div className="absolute -bottom-4 right-24 w-16 h-16 bg-blue-300 rounded-full opacity-50 blur-md" />
          <div className="absolute -bottom-20 right-16 w-12 h-12 bg-yellow-300 rounded-full opacity-50 blur-md" />
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-neutral-600 mb-4">Jump to section:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {faqCategories.map((category, index) => (
              <a
                key={index}
                href={`#category-${index}`}
                className="px-4 py-2 bg-neutral-100 hover:bg-primary-100 text-neutral-700 hover:text-primary-700 rounded-full text-sm font-medium transition-colors"
              >
                {category.category}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} id={`category-${categoryIndex}`} className="mb-12 scroll-mt-24">
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
                        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}
                      >
                        <div className="px-6 pb-5 pt-2">
                          <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{faq.answer}</p>
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
