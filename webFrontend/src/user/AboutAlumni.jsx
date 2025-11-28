// src/pages/AboutAlumni.jsx (or similar path)
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBookReader, FaHandsHelping, FaGlobe } from "react-icons/fa";

const iconVariants = {
  hidden: { scale: 0, rotate: 180 },
  visible: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 100 } },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const AboutAlumni = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-cyan-800 to-indigo-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold mb-3"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            Our Mission: Connecting Generations
          </motion.h1>
          <motion.p
            className="text-xl text-cyan-200"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            A vibrant community dedicated to supporting each other and our alma mater.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">
            Pillars of AlmaConnect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: FaBookReader, title: "Nurturing Growth", desc: "Foster intellectual and professional development through mentorship and lifelong learning." },
              { icon: FaHandsHelping, title: "Community Impact", desc: "Mobilize alumni resources for scholarships, campus projects, and social causes." },
              { icon: FaGlobe, title: "Global Network", desc: "Build a worldwide professional and social network for all graduates." },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center p-8 bg-indigo-50 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.3 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="text-6xl text-indigo-600 mb-4 mx-auto w-fit"
                  variants={iconVariants}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ delay: index * 0.3 + 0.5 }}
                  viewport={{ once: true }}
                >
                  <item.icon />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-indigo-700">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline/Impact Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-cyan-700 mb-12">
            Our Journey & Impact
          </h2>
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <motion.div 
              className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-10"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4">From Founding to Future</h3>
              <p className="text-gray-600 mb-4">
                Established in 2020, the AlmaConnect Association has grown from a small group of enthusiastic graduates to a global network of thousands. Our history is a testament to the power of commitment and connection.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>2020 Formal establishment of the Alumni Association.</li>
                <li>2021 Launched the first digital alumni directory.</li>
                <li>2023 Crossed 5,000 members worldwide.</li>
                <li>2024 Raised ₹50L for the annual scholarship fund.</li>
              </ul>
              <Link
                to="/alumnidirectory"
                className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 shadow-md"
              >
                See Our Directory
              </Link>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://presidencyuniversity.in/assets/images/som-images-7.webp" 
                alt="Alumni event group photo" 
                className="rounded-xl shadow-2xl object-cover w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white text-center">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold mb-4 text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to Connect?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Join the network that keeps you tied to your roots.
          </motion.p>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-indigo-600 hover:to-cyan-500 text-white font-bold py-3 px-10 rounded-full shadow-xl transition duration-300 transform hover:scale-105"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutAlumni;