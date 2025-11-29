import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AboutUsPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const developers = [
    {
      name: 'Soumyajit Das',
      role: 'Project Lead, Full Stack Developer',
      github: 'soumyajiitdas',
      linkedin: 'soumyajiitdas',
      email: 'soumyajit302@gmail.com',
      avatar: 'https://avatars.githubusercontent.com/u/116360739?v=4'
    },
    {
      name: 'Indrajit Ghosh',
      role: 'Frontend Developer',
      github: 'indrajit5000q-lets',
      linkedin: 'indrajit-ghosh-a53291390',
      email: 'indrajit5000q@yatramate.com',
      avatar: 'https://avatars.githubusercontent.com/u/231863193?v=4'
    },
    {
      name: 'Animesh Nandy',
      role: 'Backend Engineer',
      github: 'ani-11-pro',
      linkedin: 'contact-ani',
      email: 'animesh.nandy.04@gmail.com',
      avatar: 'https://avatars.githubusercontent.com/u/217081798?v=4'
    },
    {
      name: 'Joy Bhowmik',
      role: 'Designer, Researcher',
      github: 'joybhowmik_07',
      linkedin: 'joybhowmik_07',
      email: 'joybhowmik07@yatramate.com',
      avatar: 'https://avatars.githubusercontent.com/u/231863193?v=4'
    }
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Trust & Safety',
      description: 'We prioritize your safety with verified vehicles and transparent pricing'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Innovation',
      description: 'Leveraging technology to make vehicle rentals seamless and efficient'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Customer First',
      description: '24/7 support and dedication to delivering exceptional experiences'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Sustainability',
      description: 'Promoting eco-friendly transportation solutions for a better tomorrow'
    }
  ];

  const milestones = [
    { year: '2025', title: 'Foundation Stage', description: 'Started with a vision to revolutionize vehicle rentals' },
    { year: '2026', title: 'Journey Started', description: 'Serving and growing by providing customer satisfaction' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary-500/10 via-transparent to-secondary-500/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 
              data-testid="about-page-title"
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-6"
            >
              About <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-secondary-600">YatraMate</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 leading-relaxed">
              Your trusted companion for seamless vehicle rentals. We're on a mission to make transportation accessible, affordable, and convenient for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-linear-to-br from-primary-50 to-white p-8 md:p-10 rounded-2xl shadow-lg border border-primary-100">
              <div className="w-16 h-16 bg-linear-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-4">Our Mission</h2>
              <p className="text-neutral-700 leading-relaxed">
                To democratize transportation by providing easy access to quality vehicles at affordable prices. We believe everyone deserves the freedom to explore without barriers.
              </p>
            </div>

            <div className="bg-linear-to-br from-secondary-50 to-white p-8 md:p-10 rounded-2xl shadow-lg border border-secondary-100">
              <div className="w-16 h-16 bg-linear-to-br from-secondary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-4">Our Vision</h2>
              <p className="text-neutral-700 leading-relaxed">
                To become the most trusted and preferred vehicle rental platform across the nation, setting new standards in customer service and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-linear-to-b from-white to-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">Our Core Values</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-100 hover:border-primary-200 group"
              >
                <div className="w-16 h-16 bg-linear-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center mb-4 text-primary-600 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{value.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">Our Journey</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">Key milestones in our growth story</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-linear-to-b from-primary-500 to-secondary-500 hidden md:block" />
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-8`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-200 inline-block">
                      <div className="text-3xl font-bold text-primary-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{milestone.title}</h3>
                      <p className="text-neutral-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-linear-to-br from-primary-500 to-secondary-600 rounded-full border-4 border-white shadow-lg z-10 my-4 md:my-0" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Developers Section */}
      <section className="py-16 md:py-20 bg-linear-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">Meet the Developers</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">The talented team behind YatraMate</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {developers.map((dev, index) => (
              <div 
                key={index}
                data-testid={`developer-card-${index}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="bg-linear-to-br from-primary-500 to-secondary-600 p-6 text-center">
                  <img 
                    src={dev.avatar} 
                    alt={dev.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <h3 className="text-xl font-semibold text-white mb-1">{dev.name}</h3>
                  <p className="text-primary-100 text-sm">{dev.role}</p>
                </div>
                <div className="p-6">
                  <div className="flex justify-center space-x-4">
                    <a 
                      href={`https://github.com/${dev.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`developer-github-${index}`}
                      className="w-10 h-10 bg-neutral-100 hover:bg-neutral-900 text-neutral-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
                      aria-label={`${dev.name}'s GitHub`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                    </a>
                    <a 
                      href={`https://linkedin.com/in/${dev.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`developer-linkedin-${index}`}
                      className="w-10 h-10 bg-neutral-100 hover:bg-blue-600 text-neutral-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
                      aria-label={`${dev.name}'s LinkedIn`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a 
                      href={`mailto:${dev.email}`}
                      data-testid={`developer-email-${index}`}
                      className="w-10 h-10 bg-neutral-100 hover:bg-primary-600 text-neutral-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
                      aria-label={`Email ${dev.name}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-linear-to-r from-primary-600 via-secondary-600 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-primary-100 mb-8">Join thousands of happy customers who trust YatraMate for their travel needs</p>
          <Link 
            to="/vehicles"
            data-testid="about-browse-vehicles-btn"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-neutral-50 transition-colors duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Browse Vehicles
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;