"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, Mail } from "lucide-react";

export default function PortfolioHome() {
  return (
    <section
      id="home"
      className="min-h-screen max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col-reverse md:flex-row items-center md:items-center gap-12 md:gap-16"
    >
      <motion.section
        className="md:flex-1 text-center md:text-left"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="inline-block px-4 py-2 mb-4 text-sm font-medium bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full text-indigo-300">
            👋 Welcome to my portfolio
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Aswin S
          </span>
        </motion.h1>

        <motion.h2
          className="text-xl md:text-2xl text-slate-300 font-medium mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            MERN Stack Developer
          </span>
        </motion.h2>

        <motion.p
          className="text-slate-400 text-base md:text-lg max-w-xl mb-8 mx-auto md:mx-0 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Building dynamic, efficient, and user-centric web applications using
          modern technologies. Focused on creating powerful digital solutions that make a difference.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <a
            href="#contact"
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Mail size={18} />
            Get In Touch
          </a>
          <a
            href="/resume.pdf"
            download="Aswin_MERN_Resume.pdf"
            className="btn-download flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Download size={18} />
            Download Resume
          </a>
        </motion.div>
      </motion.section>

      <motion.aside
        className="md:w-96 md:flex-shrink-0 flex justify-center md:justify-end"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative">
          <motion.div
            className="relative w-64 h-64 md:w-80 md:h-80"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {/* Animated gradient ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-75 blur-2xl animate-pulse"></div>

            {/* Profile container */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900 p-2 shadow-2xl">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden border-4 border-slate-700/50">
                <motion.img
                  src="/profile.jpg"
                  alt="Aswin S - MERN Stack Developer"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.8 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Floating code icon */}
          <motion.div
            className="absolute -left-6 -top-6 w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-glow-md"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 1.2
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            &lt;/&gt;
          </motion.div>

          {/* Floating badge */}
          <motion.div
            className="absolute -right-6 top-1/2 px-4 py-2 rounded-full bg-slate-800/90 backdrop-blur-sm border border-slate-700 shadow-xl"
            initial={{ scale: 0, x: 20 }}
            animate={{ scale: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 1.4
            }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              ✨ Available
            </span>
          </motion.div>
        </div>
      </motion.aside>
    </section>
  );
}