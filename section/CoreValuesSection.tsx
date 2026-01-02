import React from 'react';
import { Trash2, Wifi, Share2 } from 'lucide-react';

const CoreValuesSection: React.FC = () => {
  const values = [
    {
      icon: Trash2,
      title: "Cruises & Water Tours",
      description: "Sustainable direct trade paleo semiotics."
    },
    {
      icon: Wifi,
      title: "Night Life",
      description: "Master cleanse franzen a bird brooklyn."
    },
    {
      icon: Share2,
      title: "Hiking",
      description: "Gluten-free ramps iPhone etsy coffee."
    }
  ];

  return (
    <section className="w-full bg-gray-50 py-16 sm:py-20 md:py-24 lg:py-26 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <p className="text-xs sm:text-sm font-medium tracking-widest text-gray-700 mb-4 uppercase">
            CORE VALUES
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Humblebrag gochujang pabst, master cleanse franzen vexillologist.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 lg:gap-14">
          {values.map((value, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="mb-6 sm:mb-8">
                <value.icon 
                  className="w-12 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 text-gray-700" 
                  strokeWidth={1.5}
                />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-light text-gray-900 mb-3 sm:mb-4">
                {value.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;