import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using YatraMate\'s services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services. We reserve the right to update or modify these terms at any time without prior notice.'
    },
    {
      title: '2. Eligibility Requirements',
      content: 'To use our vehicle rental services, you must be at least 18 years old, possess a valid driving license appropriate for the vehicle type you wish to rent, and provide valid identification documents as required by law. For two-wheeler rentals, you must have a valid two-wheeler license, and for four-wheeler rentals, a valid four-wheeler license is mandatory.'
    },
    {
      title: '3. Booking and Reservations',
      content: 'All bookings are subject to vehicle availability. Once you complete a booking and payment is confirmed, you will receive a booking confirmation via email. Bookings can be modified or cancelled according to our cancellation policy. We reserve the right to refuse service or cancel bookings at our discretion.'
    },
    {
      title: '4. Payment Terms',
      content: 'Full payment is required at the time of booking unless otherwise specified. We accept various payment methods including credit/debit cards, UPI, net banking, and digital wallets. A refundable security deposit is required at vehicle pickup. All prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.'
    },
    {
      title: '5. Cancellation and Refund Policy',
      content: 'Cancellations made 48 hours or more before the scheduled pickup time are eligible for a full refund. Cancellations made between 24-48 hours before pickup will incur a 25% cancellation fee. Cancellations made within 24 hours of pickup will incur a 50% cancellation fee. No-shows will not receive any refund. Refunds are processed within 7-10 business days.'
    },
    {
      title: '6. Vehicle Usage and Responsibilities',
      content: 'You agree to use the rented vehicle in a safe, responsible, and lawful manner. The vehicle must not be used for racing, towing, or any illegal activities. You are responsible for all traffic violations, fines, and penalties incurred during the rental period. Smoking is strictly prohibited in all vehicles. The vehicle must be returned with the same fuel level as provided at pickup.'
    },
    {
      title: '7. Insurance and Liability',
      content: 'All vehicles are covered by comprehensive insurance as per Indian regulations. However, you are liable for the deductible amount in case of accidents or damages. You must report any accidents or damages immediately to YatraMate and local authorities. Failure to report incidents may result in denial of insurance coverage and full liability for damages.'
    },
    {
      title: '8. Security Deposit',
      content: 'A security deposit is required at the time of vehicle pickup. The amount varies based on vehicle type and rental duration. The deposit will be refunded within 7 business days after vehicle return, provided the vehicle is returned in the same condition without any damages, violations, or outstanding dues. Deductions from the deposit may be made for damages, cleaning fees, extra kilometers, or traffic violations.'
    },
    {
      title: '9. Prohibited Activities',
      content: 'The following activities are strictly prohibited: sub-letting or renting the vehicle to third parties, driving under the influence of alcohol or drugs, using the vehicle outside the designated service area without permission, carrying more passengers than the vehicle\'s seating capacity, transporting hazardous or illegal materials, and making any modifications to the vehicle.'
    },
    {
      title: '10. Late Returns and Extensions',
      content: 'If you wish to extend your rental period, you must contact us before the original return time. Extensions are subject to availability and additional charges. Late returns without prior approval will incur penalty charges. Unauthorized extensions may be treated as theft, and appropriate legal action will be taken.'
    },
    {
      title: '11. Damages and Accidents',
      content: 'You must inspect the vehicle before accepting it and report any pre-existing damages. Any damages occurring during your rental period are your responsibility. In case of an accident, you must immediately notify YatraMate and file a police report. Do not admit fault or make settlements without our authorization. Failure to follow proper accident procedures may result in full liability.'
    },
    {
      title: '12. Personal Data and Privacy',
      content: 'By using our services, you consent to the collection and use of your personal information as described in our Privacy Policy. We collect information necessary to process your booking and provide our services. Your data is protected and will not be shared with third parties except as required by law or for service delivery.'
    },
    {
      title: '13. Limitation of Liability',
      content: 'YatraMate and its partners are not liable for any indirect, incidental, special, or consequential damages arising from your use of our services or rental vehicles. Our total liability is limited to the amount you paid for the rental. We are not responsible for delays, cancellations, or changes due to circumstances beyond our control including weather, road conditions, or vehicle breakdowns.'
    },
    {
      title: '14. Dispute Resolution',
      content: 'Any disputes arising from these terms or your use of our services will be resolved through binding arbitration in accordance with Indian laws. The arbitration will be conducted in English, and the venue will be in the city where YatraMate is registered. Both parties agree to waive their right to a jury trial.'
    },
    {
      title: '15. Governing Law',
      content: 'These terms are governed by and construed in accordance with the laws of India. Any legal action or proceeding relating to your use of YatraMate services shall be brought exclusively in the courts of jurisdiction where our company is registered. By using our services, you consent to the jurisdiction of such courts.'
    },
    {
      title: '16. Contact Information',
      content: 'If you have any questions about these Terms of Service, please contact us at legal@yatramate.com or visit our Help Center. We are committed to addressing your concerns promptly and professionally.'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-white to-primary-50">
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
            Please read these terms carefully before using YatraMate's services
          </p>
          <p className="text-sm text-primary-200 mt-4">
            Last Updated: January 2024
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br from-primary-50 to-secondary-50 border-l-4 border-primary-600 p-6 rounded-r-xl mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">Important Notice</h2>
            <p className="text-neutral-700 leading-relaxed">
              These Terms of Service constitute a legally binding agreement between you and YatraMate. By creating an account, making a booking, or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree with any part of these terms, you must not use our services.
            </p>
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

          {/* Agreement Section */}
          <div className="mt-12 bg-linear-to-r from-primary-600 to-secondary-600 text-white p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Your Agreement</h2>
            <p className="text-primary-100 leading-relaxed mb-6">
              By continuing to use YatraMate's services, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them. If you have any questions or concerns, please contact our support team before proceeding.
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
                className="inline-block bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors duration-200 border-2 border-white text-center"
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