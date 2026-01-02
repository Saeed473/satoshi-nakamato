'use client';

import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full bg-white">
      {/* Title Section */}
      <div className='flex justify-center items-center pt-16 pb-12'>
        <h1 className='text-4xl md:text-5xl font-normal text-gray-900'>
          Privacy Policy
        </h1>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 pb-16">
        
        {/* Who we are Section */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
            Who we are
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our website address is: https://goya.everthemes.com/demo.
          </p>
        </section>

        {/* What personal data Section */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-6">
            What personal data we collect and why we collect it
          </h2>
          
          {/* Comments Subsection */}
          <h3 className="text-base font-medium text-gray-900 mb-3">
            Comments
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment.
          </p>

          {/* Media Subsection */}
          <h3 className="text-base font-medium text-gray-900 mb-3">
            Media
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
          </p>

          {/* Contact forms Subsection */}
          <h3 className="text-base font-medium text-gray-900 mb-8">
            Contact forms
          </h3>

          {/* Cookies Subsection */}
          <h3 className="text-base font-medium text-gray-900 mb-3">
            Cookies
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            If you have an account and you log in to this site, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.
          </p>

          {/* Embedded content Subsection */}
          <h3 className="text-base font-medium text-gray-900 mb-3">
            Embedded content from other websites
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.
          </p>

          {/* Analytics Subsection */}
          <h3 className="text-base font-medium text-gray-900 mb-8">
            Analytics
          </h3>
        </section>

        {/* Who we share your data with Section */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
            Who we share your data with
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.
          </p>
        </section>

        {/* How long we retain your data Section */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
            How long we retain your data
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
          </p>
        </section>

        {/* What rights you have over your data Section */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
            What rights you have over your data
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
          </p>
        </section>

        {/* Where we send your data Section */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
            Where we send your data
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Visitor comments may be checked through an automated spam detection service.
          </p>
        </section>

        {/* Your contact information Section */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
            Your contact information
          </h2>
        </section>

        {/* Additional information Section */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
            Additional information
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.
          </p>
        </section>

        {/* How we protect your data Section */}
        <section className="mb-10">
          <h2 className="text-xl md:text-xl font-normal text-gray-900 mb-4">
            How we protect your data
          </h2>
        </section>

        {/* What data breach procedures Section */}
        <section className="mb-10">
          <h2 className="text-xl md:text-xl font-normal text-gray-900 mb-4">
            What data breach procedures we have in place
          </h2>
        </section>

        {/* What third parties Section */}
        <section className="mb-10">
          <h2 className="text-xl md:text-xl font-normal text-gray-900 mb-4">
            What third parties we receive data from
          </h2>
        </section>
        <section className="mb-10">
          <h2 className="text-xl md:text-xl font-normal text-gray-900 mb-4">
           What automated decision making and/or profiling we do with user data
          </h2>
        </section>
        <section className="mb-10">
          <h2 className="text-xl md:text-xl font-normal text-gray-900 mb-4">
          Industry regulatory disclosure requirements
          </h2>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;