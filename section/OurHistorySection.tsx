"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, X } from "lucide-react";

const OurHistorySection: React.FC = () => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const targetNumber = 12346;

  /* ---------------- Counter Animation ---------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounter();
          }
        });
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [hasAnimated]);

  const animateCounter = () => {
    const duration = 2500;
    const startTime = Date.now();

    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * targetNumber);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(targetNumber);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  /* ---------------- Modal Handlers ---------------- */
  const handlePlayClick = () => {
    setShowModal(true);
    setPlayVideo(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPlayVideo(false);
  };

  /* ---------------- Prevent body scroll when modal is open ---------------- */
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  /* ---------------- UI ---------------- */
  return (
    <>
      <section ref={sectionRef} className="bg-white flex items-center py-12 md:py-10 lg:py-16">
        <div className="w-full max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 items-center">

            {/* ---------------- Video Column ---------------- */}
            <div className="relative order-2 lg:order-1">
              <div className="relative w-full h-75 sm:h-100 md:h-112.5 lg:h-125 xl:h-137.5 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 shadow-xl">

                {/* Thumbnail/Overlay */}
                <div className="absolute inset-0 bg-linear-to-br bg-gray-300 z-10" />

                {/* Play Button */}
                <button
                  onClick={handlePlayClick}
                  className="absolute inset-0 z-20 flex items-center justify-center group cursor-pointer"
                  aria-label="Play video"
                >
                  <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 md:border-[5px] border-white/90 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-white backdrop-blur-sm bg-white/20 shadow-2xl">
                    <Play className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white fill-white ml-2" />
                  </div>
                </button>

                {/* Background pattern or image placeholder */}
                <div className="absolute inset-0 bg-linear-to bg-gray-400" />
              </div>
            </div>

            {/* ---------------- Content Column ---------------- */}
            <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
              <div className="space-y-4 md:space-y-6">
                <p className="text-xs md:text-sm font-semibold tracking-[0.2em] text-gray-500 uppercase">
                  OUR HISTORY
                </p>

                <h2 className="sm:text-2xl md:text-xl lg:text-[2rem] font-light text-gray-900 leading-tight">
                  Setting Industry Standards
                </h2>

                <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-xl">
                  Portland meggings chartreuse plaid palo santo, gluten-free ramps
                  iPhone etsy salvia cray kombucha copper mug single-origin coffee.
                </p>
              </div>

              {/* ---------------- Counter ---------------- */}
              <div className="pt-4 md:pt-8 space-y-3">
                <h3
                  className="sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 tracking-tight"
                  style={{
                    transform: hasAnimated ? "translateY(0)" : "translateY(30px)",
                    opacity: hasAnimated ? 1 : 0,
                    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {count.toLocaleString()}
                </h3>

                <div className="flex items-center gap-4">
                  <p className="text-xs md:text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
                    CUSTOMERS
                  </p>
                  <div className="h-px w-16 bg-gray-300" />
                </div>

                <p className="text-xs md:text-sm text-gray-600">
                  Satisfied customers worldwide and growing
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Video Modal ---------------- */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div className="relative w-full max-w-6xl mx-4 md:mx-8">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-50"
              aria-label="Close video"
            >
              <X className="w-8 h-8 md:w-10 md:h-10" />
            </button>

            {/* Video Container */}
            <div 
              className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {playVideo && (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/1KahlicghaE?autoplay=1"
                  title="Our History Video"
                  frameBorder="0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}

       <section className="w-full bg-gray-100 py-16 md:py-15 lg:py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs md:text-sm font-medium text-gray-600 uppercase mb-4">
            EST. 2017
          </p>
          <h2 className="text-3xl md:text-3xl lg:text-4xl font-light text-gray-900">
            Our Story
          </h2>
        </div>

        {/* Two Column Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column */}
          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
            <p>
              Messenger bag man braid waistcoat neutra 8-bit. Chartreuse disrupt put a bird on it quinoa jianbing. Paleo drinking vinegar brunch hashtag, skateboard cold-pressed pour-over tilde cliche. Craft beer salvia occupy retro farm-to-table cronut cardigan, gastropub keytar flannel.
            </p>

            <p>
              Unicorn jean shorts quinoa authentic cronut tilde twee YOLO, offal aesthetic yuccie iPhone truffaut seitan. Craft beer wayfarers lumbersexual DIY succulents, helvetica vexillologist next level woke hoodie keffiyeh tumblr schlitz chambray typewriter.
            </p>

            <p>
              Hexagon brunch subway tile keffiyeh.
            </p>
          </div>

          {/* Right Column */}
          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
            <p>
              Synth ethical biodiesel poutine. Bitters beard salvia lo-fi. Palo santo literally plaid edison bulb, pitchfork drinking vinegar authentic pabst street art subway tile craft beer single-origin coffee shaman dreamcatcher.
            </p>

            <p>
              Williamsburg sriracha portland, microdosing asymmetrical pork belly la croix 3 wolf moon umami.
            </p>

            <p>
              Four dollar toast truffaut fashion axe, lomo plaid meh PBR&B scenester austin paleo thundercats heirloom knausgaard farm-to-table.
            </p>
          </div>

        </div>
      </div>
    </section>

    <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-22 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm font-medium tracking-wider text-gray-500 mb-3 sm:mb-4 uppercase">
            OUR FUTURE
          </p>
          <h2 className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl font-light text-gray-900 mb-4 sm:mb-6">
            Growing Fast
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
            Thundercats art party edison bulb authentic roof party taiyaki synth gluten-free squid
            tumeric retro iPhone etsy.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6 ">
          <div className="mb-2 sm:mb-0">
            <div className="text-6xl sm:text-5xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-none">
              107
            </div>
            <div className="text-xs font-medium tracking-wider text-gray-900 mt-2 uppercase">
              OFFICES
            </div>
          </div>
          <div className="pb-2 sm:pb-4 md:pb-6">
            <p className="text-sm text-gray-500">
              Regional offices around the world
            </p>
          </div>
        </div>
      </div>
    </section>

    </>
  );
};

export default OurHistorySection;