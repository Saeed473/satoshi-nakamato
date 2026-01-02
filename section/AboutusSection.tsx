'use client'

const AboutPageSection = () => {
  return (
    <div className="min-h-screen bg-gray-200">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Text Content */}
          <div className="flex items-center px-8 md:px-12 lg:px-16 xl:px-24 py-16 lg:py-0 min-h-125 lg:min-h-screen">
            <div className="w-full max-w-md">
              <h2 className="text-5xl lg:text-6xl font-normal mb-12 lg:mb-16 text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                About Us
              </h2>
              
              <blockquote className="border-l-[3px] border-gray-900 pl-7">
                <p className="text-gray-600 text-base lg:text-lg leading-relaxed" style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}>
                  "Air winged, above, seed whales face so void which so. Fish bring light blessed, midst light set and us rule said dominion"
                </p>
              </blockquote>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative min-h-125 lg:min-h-screen overflow-hidden">
            {/* Add your image here - this is a placeholder */}
            <div className="w-full h-full">
              <img 
                src="/woman-chair.jpg" 
                alt="Woman sitting on chair" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPageSection;