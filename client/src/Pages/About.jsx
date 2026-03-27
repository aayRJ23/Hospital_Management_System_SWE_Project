import React from "react";
import { Navbar } from "../Components/Navbar";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <motion.div
        className="max-w-7xl mx-auto py-16 px-4 mt-20 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-4xl font-bold text-center text-indigo-600 mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          About Us
        </motion.h1>

        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-semibold text-indigo-600 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700 text-lg">
                Our mission is to revolutionize the healthcare industry by
                leveraging technology to provide efficient, accessible, and
                comprehensive healthcare services. We strive to enhance patient
                care through seamless integration of digital solutions.
              </p>
            </motion.div>
            <motion.div
              className="flex justify-center"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="health-tech.jpg"
                alt="Healthcare Technology"
                className="rounded-xl shadow-lg"
              />
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              className="flex justify-center md:order-2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="doctors.webp"
                alt="Doctors"
                className="rounded-xl shadow-lg"
              />
            </motion.div>
            <motion.div
              className="md:order-1"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-semibold text-indigo-600 mb-4">
                Our Team
              </h2>
              <p className="text-gray-700 text-lg">
                We are a diverse team of professionals dedicated to improving
                healthcare outcomes. Our team includes experts from the fields
                of medicine, technology, and customer service, all working
                together to provide exceptional service.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-semibold text-indigo-600 mb-4">
                Our Values
              </h2>
              <p className="text-gray-700 text-lg">
                We believe in compassion, innovation, and integrity. Our values
                drive us to constantly seek better ways to serve our patients
                and to deliver healthcare solutions that are not only effective
                but also empathetic and ethical.
              </p>
            </motion.div>
            <motion.div
              className="flex justify-center"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="./values.jpg"
                alt="Values and Ethics"
                className="rounded-xl shadow-lg"
              />
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h2 className="text-3xl font-semibold text-indigo-600 mb-8">
            Meet the Team
          </h2>
          <div className="gap-16 flex flex-wrap justify-around">
            {[
              {
                name: "Aayush Chatterjee",
                role: "Chief Medical Officer",
                image: "aayush.jpg",
              },
              {
                name: "Aayush Raj",
                role: "Customer Support Lead",
                image: "raj.png",
              },
              {
                name: "Aniket Singha",
                role: "Lead Developer",
                image: "aniket.jpg",
              },
            ].map((teamMember, index) => (
              <motion.div
                key={index}
                className="text-center mx-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* <img
                  src={teamMember.image}
                  alt={teamMember.name}
                  className="rounded-full w-32 h-32 mx-auto mb-4 shadow-lg"
                /> */}
                <h3 className="text-xl font-bold text-gray-800">
                  {teamMember.name}
                </h3>
                {/* <p className="text-indigo-600">{teamMember.role}</p> */}
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </>
  );
};

export default AboutUs;
