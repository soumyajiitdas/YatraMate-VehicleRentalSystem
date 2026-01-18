import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing and using YatraMate\'s vehicle rental platform, you accept and agree to be bound by the terms and provisions of this agreement. These terms apply to all users including customers, vendors, and office staff. If you do not agree to these terms, please do not use our services. We reserve the right to update or modify these terms at any time without prior notice, and your continued use constitutes acceptance of any changes.'
    },
    {
      title: 'User Roles and Eligibility',
      content: 'YatraMate supports multiple user roles: (1) Customers - Must be at least 18 years old with a valid driving license appropriate for the vehicle type (two-wheeler license for bikes, four-wheeler license for cars) and valid government-issued identification. (2) Vendors - Individuals or organizations registering to list vehicles must provide valid business or personal identification documents and meet all legal requirements for vehicle rental operations. (3) Office Staff - Authorized personnel assigned by YatraMate to manage pickups, returns, and booking operations. (4) Administrators - YatraMate personnel with full system access for platform management.'
    },
    {
      title: 'Customer Booking Terms',
      content: 'Bookings are subject to vehicle availability. To complete a booking, you must: (1) Select a vehicle and specify pickup date/time, (2) Review the estimated cost breakdown showing hourly and daily rates, (3) Pay 40% advance payment through Razorpay to confirm your booking, (4) Receive a booking confirmation with a unique reference. Bookings can be modified or cancelled subject to our cancellation policy. We reserve the right to refuse or cancel bookings at our discretion if terms are violated.'
    },
    {
      title: 'Payment Structure',
      content: 'YatraMate operates on a split payment model: (1) Advance Payment - 40% of estimated rental cost is required at booking time via Razorpay (credit/debit cards, UPI, net banking, wallets). This confirms your reservation. (2) Final Payment - Remaining amount calculated based on actual distance traveled (odometer reading) and time used, plus any damage costs, is collected at vehicle return. Final payment can be made via cash or online. (3) Security Deposits - A refundable deposit may be required at pickup for high-value vehicles. All prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.'
    },
    {
      title: 'Cost Calculation',
      content: 'Final rental cost is calculated using: (1) Time-based charges - Based on total rental duration at hourly/daily rates determined by vehicle\'s pricing package, (2) Distance-based charges - Based on kilometers traveled (ending odometer - starting odometer) at per-km rate, (3) Damage costs - Any damages assessed during return inspection are added to the final bill. Pricing packages are automatically assigned based on vehicle type (bike/car) and engine CC. You will see estimated costs before booking, but final costs depend on actual usage.'
    },
    {
      title: 'Cancellation and Refund Policy',
      content: 'For Customer Cancellations: (1) Cancellations made 48+ hours before scheduled pickup are eligible for a full refund of advance payment minus a 5% processing fee. (2) Cancellations made 24-48 hours before pickup will incur a 25% cancellation fee. (3) Cancellations within 24 hours of pickup will incur a 50% cancellation fee. (4) No-shows (failure to pick up without cancellation) will forfeit the entire advance payment. For Staff Rejections: If our office staff reject your booking (document issues, vehicle unavailability, etc.), you are entitled to a full refund. Refunds are processed within 7-10 business days to the original payment method.'
    },
    {
      title: 'Vehicle Pickup Requirements',
      content: 'At the scheduled pickup time, you must present: (1) Valid original driving license (two-wheeler for bikes, four-wheeler for cars - learner\'s licenses not accepted), (2) Government-issued ID proof (Aadhaar Card, PAN Card, Voter ID, Passport, or Driving License), (3) Booking confirmation or Bill ID. Our office staff will: (1) Verify your identity, (2) Record your ID details, (3) Note the starting odometer reading, (4) Generate a Bill ID for your rental, (5) Provide you with the vehicle keys and necessary documents. Failure to provide valid documents will result in booking rejection with refund per cancellation policy.'
    },
    {
      title: 'Vehicle Usage Responsibilities',
      content: 'As a renter, you agree to: (1) Drive safely and obey all traffic laws, (2) Not exceed the vehicle\'s passenger capacity, (3) Not use the vehicle for racing, towing, or commercial purposes without permission, (4) Not allow unlicensed drivers to operate the vehicle, (5) Not transport illegal substances or engage in illegal activities, (6) Maintain fuel levels (return with same level as pickup or pay for difference), (7) Report any accidents or mechanical issues immediately to our 24/7 helpline, (8) Not smoke inside the vehicle, (9) Not take the vehicle outside designated service areas without prior approval, (10) Return the vehicle in the same condition as received (normal wear excepted).'
    },
    {
      title: 'Vehicle Return Process',
      content: 'At the end of your rental: (1) Return the vehicle to the same pickup location at or before the agreed time, (2) Our staff will record the ending odometer reading, (3) A vehicle inspection will be conducted to assess condition, (4) If damages are found, they will be documented with photos and costs assessed, (5) Final cost is calculated (distance + time + damages - advance paid), (6) Pay the remaining balance via cash or online, (7) Receive final receipt with complete trip summary. Late returns without prior approval will incur additional hourly charges. Extensions must be requested before the original return time and are subject to availability.'
    },
    {
      title: 'Damage and Liability',
      content: 'You are responsible for: (1) Any damage to the vehicle during your rental period not covered by insurance, (2) Traffic violations, fines, and penalties incurred during the rental, (3) Towing charges if the vehicle is illegally parked, (4) Loss or damage to vehicle keys, (5) Interior damage including stains, burns, or tears. Damage Assessment: Our staff will inspect the vehicle at return. Any damages will be documented with photographs, and costs will be determined based on repair estimates. Damage costs are deducted from your security deposit or added to your final bill. Pre-existing damages must be noted at pickup; otherwise, you may be held responsible.'
    },
    {
      title: 'Insurance Coverage',
      content: 'All YatraMate vehicles are covered by comprehensive insurance as per Indian regulations, which includes: (1) Third-party liability coverage, (2) Own damage coverage for accidents. However, you remain liable for: (1) Insurance deductible amounts, (2) Damages caused by negligence or policy violations, (3) Damages not covered by insurance (theft due to negligence, interior damage, etc.), (4) Any costs if you fail to report accidents properly. In case of an accident: (1) Contact our 24/7 helpline immediately, (2) Do not leave the accident scene, (3) File a police report if required, (4) Do not admit fault or make settlements without our authorization, (5) Provide all requested documentation for insurance claims.'
    },
    {
      title: 'Vendor Terms and Conditions',
      content: 'Vendors listing vehicles on YatraMate agree to: (1) Provide accurate and complete vehicle information (name, model, registration, engine details), (2) Upload valid and current documents (RC, insurance), (3) Maintain vehicles in roadworthy condition, (4) Ensure all listed vehicles have valid registration and insurance, (5) Not list stolen or disputed vehicles, (6) Accept YatraMate\'s pricing packages based on vehicle specifications, (7) Allow platform commission deduction from earnings, (8) Respond promptly to admin queries regarding vehicles, (9) Remove vehicles from listing when sold or unavailable, (10) Comply with all applicable local and national regulations. Vendor Registration requires: Valid ID proof, Business documents (for organizations), Address verification. Vehicle approval is subject to admin review within 24-48 hours.'
    },
    {
      title: 'Vendor Earnings and Payments',
      content: 'Vendors earn money when their vehicles are rented: (1) Earnings are calculated based on bookings completed (customer returned vehicle and paid), (2) YatraMate deducts a platform commission from each booking, (3) Vendors can view detailed earnings reports in their dashboard (filter by day, week, month, year), (4) Earnings show: pickup/return details, distance traveled, damage costs, final amount. Earnings Tracking: (1) Total earnings across all vehicles, (2) Per-vehicle statistics (bookings, distance, hours), (3) Currently booked vehicles count. Payment schedules and commission rates are specified in the Vendor Agreement provided during registration.'
    },
    {
      title: 'Office Staff Responsibilities',
      content: 'Office staff authorized by YatraMate are responsible for: (1) Verifying customer identity and documents at pickup, (2) Recording accurate odometer readings, (3) Generating Bill IDs for confirmed pickups, (4) Inspecting vehicles at return and documenting condition, (5) Assessing and recording damage costs fairly, (6) Processing final payments (cash or online), (7) Handling booking rejections with valid reasons, (8) Processing refund status updates, (9) Maintaining professional conduct with all customers, (10) Keeping login credentials confidential, (11) Reporting suspicious activities to management. Staff must not: Accept bribes, Skip verification steps, Share customer data externally, Process personal bookings.'
    },
    {
      title: 'Prohibited Activities',
      content: 'The following activities are strictly prohibited on YatraMate: (1) Creating fake accounts or providing false information, (2) Attempting to bypass payment systems, (3) Sub-renting vehicles to third parties, (4) Using the platform for illegal activities, (5) Harassing staff, vendors, or other users, (6) Attempting to access unauthorized system areas, (7) Manipulating reviews or ratings, (8) Sharing account credentials, (9) Using automated systems to make bookings, (10) Violating intellectual property rights. Violations may result in account suspension, booking cancellation, legal action, and forfeiture of payments.'
    },
    {
      title: 'Intellectual Property',
      content: 'All content on YatraMate including but not limited to: logos, trademarks, text, images, software, and design elements are the property of YatraMate or its licensors. You may not: (1) Copy, reproduce, or distribute our content without permission, (2) Use our trademarks without authorization, (3) Reverse engineer our software, (4) Create derivative works from our platform. User-generated content (reviews, feedback) grants YatraMate a non-exclusive license to use, display, and distribute such content.'
    },
    {
      title: 'Limitation of Liability',
      content: 'YatraMate and its partners are not liable for: (1) Indirect, incidental, special, or consequential damages, (2) Loss of profits or business opportunities, (3) Delays or failures due to circumstances beyond our control (weather, traffic, breakdowns), (4) Actions of third parties including vendors and customers, (5) Technical failures or service interruptions, (6) Accuracy of information provided by vendors. Our total liability is limited to the amount you paid for the specific booking in question. This limitation applies to the fullest extent permitted by law.'
    },
    {
      title: 'Indemnification',
      content: 'You agree to indemnify, defend, and hold harmless YatraMate, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, costs, or expenses (including legal fees) arising from: (1) Your use of our services, (2) Your violation of these terms, (3) Your violation of any third-party rights, (4) Your negligent or wrongful conduct, (5) Any content you submit to the platform.'
    },
    {
      title: 'Dispute Resolution',
      content: 'For any disputes arising from these terms or your use of YatraMate: (1) First, contact our support team to attempt informal resolution, (2) If unresolved, disputes will be settled through binding arbitration in accordance with the Arbitration and Conciliation Act, 1996 (India), (3) Arbitration will be conducted in English, (4) The venue will be in the city where YatraMate is registered, (5) Both parties agree to waive rights to a jury trial, (6) Class action lawsuits are not permitted. Exceptions: Claims for injunctive relief or intellectual property violations may be brought in courts of competent jurisdiction.'
    },
    {
      title: 'Governing Law',
      content: 'These Terms of Service are governed by and construed in accordance with the laws of India. Any legal action or proceeding relating to your access to or use of YatraMate shall be brought exclusively in the courts of competent jurisdiction in India. By using our services, you consent to the jurisdiction and venue of such courts. If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.'
    },
    {
      title: 'Modifications to Service',
      content: 'YatraMate reserves the right to: (1) Modify or discontinue any feature or service without notice, (2) Change pricing structures with reasonable notice, (3) Update these terms at any time, (4) Suspend or terminate user accounts for violations, (5) Add or remove supported cities and locations. We will make reasonable efforts to notify users of significant changes through email or platform notifications.'
    },
    {
      title: 'Contact Information',
      content: 'For questions about these Terms of Service, contact us at: Email: legal@yatramate.com | Support: support@yatramate.com | Phone: +91-000-000-0000 | Address: 123 Business Park, Tech City, India. For urgent matters related to ongoing rentals, use our 24/7 helpline. Visit our Help Center at /help for FAQs and detailed guides for customers, vendors, and staff.'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden bg-linear-to-r from-primary-600 via-secondary-600 to-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 
            data-testid="terms-page-title"
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
          >
            Terms of Service
          </h1>
          <p className="text-lg md:text-xl text-primary-100">
            Complete terms and conditions for all users - customers, vendors, and staff
          </p>
          <p className="text-sm text-primary-200 mt-4">
            Last Updated: January 2026
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border-l-4 border-primary-600 p-6 rounded-r-xl mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">Important Notice <span className='text-red-600'>:</span></h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              These Terms of Service constitute a legally binding agreement between you and YatraMate. By creating an account, making a booking, listing a vehicle, or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these terms.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              This document covers terms for all user types: <strong>Customers</strong> who rent vehicles, <strong>Vendors</strong> who list vehicles for rental, and <strong>Office Staff</strong> who manage operations. Please read the sections relevant to your role carefully.
            </p>
          </div>

          {/* Quick Reference Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <h3 className="font-bold text-neutral-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                Payment Summary
              </h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• <strong>40%</strong> advance at booking</li>
                <li>• <strong>60%</strong> remaining at return</li>
                <li>• Final cost = Distance + Time + Damages</li>
                <li>• Secure payments via Razorpay</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
              <h3 className="font-bold text-neutral-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cancellation Quick Guide
              </h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• <strong>Cancel</strong> pickups from your Bookings page</li>
                <li>• <strong>Reject</strong> the pickup if the vehicle has issues</li>
                <li>• <strong>Full refund</strong> applies if rejected during pickup</li>
                <li>• <strong>No refunds</strong> after pickup acceptance</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
              <h3 className="font-bold text-neutral-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pickup Requirements
              </h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Valid driving license (original)</li>
                <li>• Government ID (Aadhaar/PAN/Passport)</li>
                <li>• Booking confirmation or Bill ID</li>
                <li>• Minimum age: 18 years</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
              <h3 className="font-bold text-neutral-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                </svg>
                Vendor Essentials
              </h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Valid ID & business documents</li>
                <li>• Vehicle RC & insurance required</li>
                <li>• 24-48hr approval time</li>
                <li>• Commission deducted per booking</li>
              </ul>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div 
                key={index}
                data-testid={`terms-section-${index}`}
                className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-neutral-200 hover:shadow-lg transition-shadow duration-200"
              >
                <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4 flex items-start">
                  <span className="bg-linear-to-r from-primary-500 to-secondary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 shrink-0 mt-1">
                    {index + 1}
                  </span>
                  <span>{section.title}</span>
                </h2>
                <p className="text-neutral-700 leading-relaxed ml-11">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Key Highlights */}
          <div className="mt-12 bg-amber-50 border border-amber-200 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Key Points to Remember
            </h3>
            <ul className="space-y-2 text-amber-900">
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span><strong>Always carry valid ID and license</strong> - Bookings cannot be processed without proper documents.</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span><strong>Report accidents immediately</strong> - Failure to report may void insurance coverage.</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span><strong>Return on time</strong> - Late returns without prior approval incur additional charges.</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span><strong>Vendors must maintain accurate listings</strong> - Incorrect information may result in account suspension.</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span><strong>Staff decisions are final</strong> - Regarding vehicle condition assessment and damage costs.</span>
              </li>
            </ul>
          </div>

          {/* Agreement Section */}
          <div className="mt-12 bg-linear-to-r from-primary-600 to-secondary-600 text-white p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Your Agreement</h2>
            <p className="text-primary-100 leading-relaxed mb-6">
              By continuing to use YatraMate's services, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them. These terms protect both you and YatraMate, ensuring a safe and fair experience for all users - customers, vendors, and staff.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/help"
                data-testid="terms-help-center-btn"
                className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-neutral-50 transition-colors duration-200 text-center"
              >
                Contact Support
              </Link>
              <Link
                to="/privacy"
                data-testid="terms-privacy-link"
                className="inline-block bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-colors duration-200 border-2 border-white text-center"
              >
                View Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
