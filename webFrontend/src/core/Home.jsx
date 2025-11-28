import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaNetworkWired,
  FaBriefcase,
  FaCalendarAlt,
  FaGraduationCap,
} from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";
import { motion } from "framer-motion";
import { AlignCenter } from "lucide-react";

const Home = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Welcome Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center text-white"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://www.shutterstock.com/image-vector/graduation-silhouette-water-color-painting-600nw-531382432.jpg" // replace with your bg image
            alt="Graduates celebration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900 via-indigo-900 to-violet-900 opacity-70"></div>
        </div>
        <motion.div
          className="z-10 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Welcome Alumni!
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-cyan-200">
            Connecting the past, present, and future
          </p>
          <Link
            to="/about"
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-indigo-600 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
          >
            Learn More
          </Link>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <FaNetworkWired className="text-5xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Networking Opportunities</h3>
              <p>Connect with fellow alumni and expand your professional network</p>
            </div>
            <div className="text-center">
              <FaBriefcase className="text-5xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Career Support</h3>
              <p>Access job boards, career counseling, and professional development resources</p>
            </div>
            <div className="text-center">
              <FaCalendarAlt className="text-5xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Exclusive Events</h3>
              <p>Participate in alumni-only events, reunions, and workshops</p>
            </div>
            <div className="text-center">
              <FaGraduationCap className="text-5xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Lifelong Learning</h3>
              <p>Enjoy continued education opportunities and access to university resources</p>
            </div>
          </div>
        </div>
      </section>
      {/* Events Section */}
      <section id="events" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-indigo-700">
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
                title: "Alumni Networking Night",
                description:
                  "Join us for an evening of networking and reconnecting with fellow alumni.",
                date: "20 September, 2025",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=800&q=80",
                title: "Career Guidance Workshop",
                description:
                  "A special workshop to help alumni and students with career opportunities.",
                date: "05 October, 2025",
              },
              {
                image:
                  "https://www.sheatcollege.com/wp-content/uploads/2022/05/istockphoto-639698498-612x612-1.jpg",
                title: "Annual Alumni Meet",
                description:
                  "Celebrate our community at the annual alumni gathering with fun activities.",
                date: "15 December, 2025",
              },
            ].map((event, idx) => (
              <motion.div
                key={idx}
                className="bg-gradient-to-b from-white to-indigo-50 rounded-lg shadow-md overflow-hidden transition duration-300 transform hover:scale-105"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-600 font-medium">
                      {event.date}
                    </span>
                    {/* ⭐ FIX: Changed <button> to <Link> and set destination to /signup for registration ⭐ */}
                    <Link
                      to="/signup"
                      className="bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-cyan-600 hover:to-indigo-500 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/news&events"
              className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-110"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Alumni Success Stories */}
      <section id="stories" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Alumni Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                name: "Harman",
                story:
                  "The alumni network has been instrumental in my career growth. I'm grateful for the connections and opportunities it has provided.",
                image:
                  "https://oidigitalinstitute.com/wp-content/uploads/2022/07/pexels-padmathilaka-wanigasekara-7616706-1024x683.jpg",
                year: "Class of 2010",
              },
              {
                id: 2,
                name: "Aishwarya",
                story:
                  "Joining the alumni association has been one of the best decisions of my life. The friendships and mentoring opportunities are priceless.",
                image:
                  "https://static.toiimg.com/thumb/msid-116568128,width-400,resizemode-4/116568128.jpg",
                year: "Class of 2015",
              },
              {
                id: 3,
                name: "Arjun",
                story:
                  "The events and networking sessions have opened so many doors for me. It feels great to give back and stay connected.",
                image:
                  "https://thepatriot.in/wp-content/uploads/2025/07/Struggles-behind-the-dream_-Indian-students-abroad-face-reality-checks.jpg",
                year: "Class of 2018",
              },
            ].map((alumni, idx) => (
              <motion.div
                key={alumni.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 transform hover:scale-105"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                <img
                  src={alumni.image}
                  alt={alumni.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{alumni.name}</h3>
                  <p className="text-gray-600 mb-4">"{alumni.story}"</p>
                  <span className="text-indigo-600 font-medium">
                    {alumni.year}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What Our Alumni Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Joining the alumni association has been one of the best decisions I've made. The networking opportunities have been invaluable for my career.",
                name: "Nisha Murugan",
                year: "Class of 2015",
                image: "/images/nisha.jpeg",
              },
              {
                quote:
                  "The alumni events have helped me stay connected with my alma mater and make new friends long after graduation.",
                name: "Saipriya Dipika V",
                year: "Class of 2008",
                image: "/images/priya.jpeg",
              },
              {
                quote:
                  "I'm grateful for the career support provided by the association. It has been crucial in helping me navigate job transitions.",
                name: "Ann Sony Varghese",
                year: "Class of 2012",
                image: "/images/ann.jpeg",
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-lg shadow-md p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                <p className="mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.year}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Contact Information
              </h3>
              <p className="mb-4">
                Feel free to reach out to us with any questions or concerns.
              </p>
              <ul className="space-y-2">
                <li>Email: info@almaconnect.com</li>
                <li>Phone: 99999-99999</li>
                <li>Address: Presidency University, Bengaluru.</li>
              </ul>
              <div className="mt-6 flex space-x-4">
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 transition duration-300"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 transition duration-300"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 transition duration-300"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 transition duration-300"
                >
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-white text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8">
            Stay connected, advance your career, and make a difference!
          </p>
          <Link
            to="/signup"
            className="text-indigo-600 px-8 py-3 rounded-full font-bold text-lg bg-indigo-100 transition duration-300 inline-block mb-8"
          >
            Become a Member
          </Link>
        </div>
      </section>

      {/* Back to Top Button */}
      {
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg transition duration-300"
          aria-label="Back to top"
        >
          <IoIosArrowUp size={24} />
        </button>
      }
    </>
  );
};

export default Home;