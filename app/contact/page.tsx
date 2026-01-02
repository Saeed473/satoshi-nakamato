'use client'
import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false
  });

  const [showFormError, setShowFormError] = useState(false);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const newErrors = {
      name: formData.name.trim() === '',
      email: formData.email.trim() === '',
      message: formData.message.trim() === ''
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error);
    setShowFormError(hasErrors);

    if (!hasErrors) {
      console.log('Form submitted:', formData);
      setShowFormError(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col md:flex-row">
        {/* Left Side - Map Placeholder */}
        <div className="w-full md:w-1/2 bg-gray-200 min-h-75 md:min-h-screen flex items-start justify-start p-8">
          <p className="text-gray-500 text-sm">Please fill out Google Maps API Key</p>
        </div>

        {/* Right Side - Contact Info */}
        <div className="w-full md:w-1/2 bg-white px-6 md:px-16 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
            {/* Visit Us */}
            <div>
              <h2 className="text-2xl md:text-3xl font-normal mb-6 md:mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                Visit Us
              </h2>
              <div className="space-y-1 text-gray-600" style={{ fontSize: '14px', lineHeight: '1.8' }}>
                <p>One Chase Manhattan Plaza</p>
                <p>New York, NY 10005, USA</p>
                <p className="pt-2">+1 554 883 2032</p>
              </div>
            </div>

            {/* Get in Touch */}
            <div>
              <h2 className="text-2xl md:text-3xl font-normal mb-6 md:mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                Get in Touch
              </h2>
              <div className="space-y-1 text-gray-600 mb-6 md:mb-8" style={{ fontSize: '14px', lineHeight: '1.8' }}>
                <p>Prism truffaut neutra blue bottle letterpress</p>
                <p>plaid churchkey.</p>
                <p>hello@example.com</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="font-normal mb-3 text-gray-600">Contact Me</h3>
            <p className="text-xs text-gray-500 mb-6">
              Fields marked with an <span className="text-gray-300">*</span> are required
            </p>

            <div className="space-y-5">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.name ? 'border-red-400' : 'border-gray-300'} bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400`}
                  style={{ fontSize: '14px' }}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-2">This is a required field.</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-400' : 'border-gray-300'} bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400`}
                  style={{ fontSize: '14px' }}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-2">This is a required field.</p>
                )}
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Message *"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 border ${errors.message ? 'border-red-400' : 'border-gray-300'} bg-white text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:border-gray-400`}
                  style={{ fontSize: '14px' }}
                />
                {errors.message && (
                  <p className="text-red-400 text-xs mt-2">This is a required field.</p>
                )}
              </div>

              <div>
                <button
                  onClick={handleSubmit}
                  className="px-10 py-3 bg-black text-white font-normal hover:bg-gray-800 transition-colors text-sm"
                >
                  Submit
                </button>
              </div>

              {showFormError && (
                <div className="bg-red-50 border border-red-200 rounded px-4 py-3">
                  <p className="text-red-400 text-sm">Please correct errors before submitting this form.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;