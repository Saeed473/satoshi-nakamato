'use client'
import React, { useState } from 'react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
}

interface TeamCardProps {
  member: TeamMember;
}

const PinterestIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.545 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
  </svg>
);

const TeamCard: React.FC<TeamCardProps> = ({ member }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-full aspect-3/4 bg-gray-200 overflow-hidden group cursor-pointer mb-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-5 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <a
            href="#"
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Facebook"
          >
            <Facebook size={20} />
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Pinterest"
          >
            <PinterestIcon />
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>
      <h3 className="text-gray-900 text-lg font-normal mb-2">{member.name}</h3>
      <p className="text-gray-500 text-sm">{member.role}</p>
    </div>
  );
};

const TeamSection: React.FC = () => {
  const teamMembers: TeamMember[] = [
    { name: 'John Nicholson', role: 'Developer' },
    { name: 'Sandra Monroe', role: 'Marketing' },
    { name: 'Denisse MacDonnell', role: 'CEO' },
  ];

  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-12 lg:gap-20">
          {/* Left Content */}
          <div>
            <p className="text-xs tracking-[0.2em] text-gray-600 uppercase mb-6">
              FOUNDERS
            </p>
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-8">
              Key People
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Yielding fowl their brought is own day place fruit creature our day lesser cant bring hath after.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Divide there forth fruitful.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {teamMembers.map((member, index) => (
              <TeamCard key={index} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;