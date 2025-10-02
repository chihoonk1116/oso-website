import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface HeroSectionProps {
  onPortfolioClick?: () => void
}

const HeroSection: React.FC<HeroSectionProps> = ({ onPortfolioClick }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 1.1,
      filter: 'brightness(0.8)'
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      filter: 'brightness(1)'
    }
  }

  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0
    }
  }

  const containerVariants = {
    hidden: {},
    visible: {}
  }

  return (
    <div className="min-h-screen bg-white text-black" ref={ref}>
      {/* Title Section */}
      <div className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 tracking-tight"
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            OSO FILM
          </motion.h1>
        </div>
      </div>

      {/* Grid Section */}
      <motion.div 
        className="px-6 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ staggerChildren: 0.1 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-6 gap-6 mb-16">
            
            {/* Image 1 - Top left, large */}
            <motion.div 
              className="col-span-3 h-[300px] overflow-hidden group cursor-pointer"
              variants={imageVariants}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onClick={onPortfolioClick}
            >
              <div className="relative w-full h-full">
                <img 
                  src={`${import.meta.env.BASE_URL}snap.jpg`}
                  alt="Grid Image 1" 
                  className="w-full h-full object-cover transition duration-500"
                />
                {/* Subtle black overlay hidden by default, fades in on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Centered text that appears on hover with slide animation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="uppercase text-xl md:text-2xl font-semibold text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">snap</span>
                </div>
              </div>
            </motion.div>

            {/* Image 2 - Top right, large */}
            <motion.div 
              className="col-span-3 h-[300px] overflow-hidden group cursor-pointer"
              variants={imageVariants}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              <div className="relative w-full h-full">
                <img 
                  src={`${import.meta.env.BASE_URL}wedding.webp`}
                  alt="Grid Image 2" 
                  className="w-full h-full object-cover transition duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xl md:text-2xl font-semibold text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 uppercase">wedding</span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Middle Text Section */}
          <motion.div 
            className="text-center mb-16"
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-12 text-sm uppercase tracking-wider text-gray-600">
              <span 
                className="border-b border-gray-300 pb-2 md:border-b-0 md:pb-0 cursor-pointer hover:text-black transition-colors duration-300"
                onClick={onPortfolioClick}
              >
                Portfolio
              </span>
              <span className="border-b border-gray-300 pb-2 md:border-b-0 md:pb-0">Videos</span>
              <span className="border-b border-gray-300 pb-2 md:border-b-0 md:pb-0">About</span>
              <span className="border-b border-gray-300 pb-2 md:border-b-0 md:pb-0">Inquire</span>
            </div>
          </motion.div>

          {/* Bottom Images Grid */}
          <div className="grid grid-cols-6 gap-6 mb-16">
            
            {/* Image 3 - Bottom left */}
            <motion.div 
              className="col-span-3 h-[300px] overflow-hidden group cursor-pointer"
              variants={imageVariants}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <div className="relative w-full h-full">
                <img 
                  src={`${import.meta.env.BASE_URL}baby.jpeg`}
                  alt="Grid Image 3" 
                  className="w-full h-full object-cover transition duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xl md:text-2xl font-semibold text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 uppercase">baby</span>
                </div>
              </div>
            </motion.div>

            {/* Image 4 - Bottom right */}
            <motion.div 
              className="col-span-3 h-[300px] overflow-hidden group cursor-pointer"
              variants={imageVariants}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            >
              <div className="relative w-full h-full">
                <img 
                  src={`${import.meta.env.BASE_URL}family.jpeg`}
                  alt="Grid Image 4" 
                  className="w-full h-full object-cover transition duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xl md:text-2xl font-semibold text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 uppercase">family</span>
                </div>
              </div>
            </motion.div>
          </div>
          {/* Bottom Text Section */}
          <motion.div 
            className="text-center mb-16"
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-12 text-sm uppercase tracking-wider text-gray-600">
              <span className="border-b border-gray-300 pb-2 md:border-b-0 md:pb-0">Text</span>
            </div>
          </motion.div>

          {/* Bottom Videos Grid */}
          <div className="grid grid-cols-6 gap-6">
            
            {/* video 1 - Bottom left */}
            <motion.div 
              className="col-span-3 h-[300px] overflow-hidden group cursor-pointer"
              variants={imageVariants}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <div className="relative w-full h-full">
                <video 
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition duration-500"
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xl md:text-2xl font-semibold text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">About</span>
                </div>
              </div>
            </motion.div>

            {/* video2 - Bottom right */}
            <motion.div 
              className="col-span-3 h-[300px] overflow-hidden group cursor-pointer"
              variants={imageVariants}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            >
              <div className="relative w-full h-full">
                <video 
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition duration-500"
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xl md:text-2xl font-semibold text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">Inquire</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default HeroSection