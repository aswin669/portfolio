"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { icon: Github, href: "https://github.com/aswin669", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/aswinseedharan", label: "LinkedIn" },
    { icon: Mail, href: "mailto:aswinseedharan689@gmail.com", label: "Email" }
  ];

  return (
    <footer className="mt-12 bg-transparent border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Social Links */}
        <motion.div
          className="flex justify-center gap-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-slate-700/50 transition-all duration-300"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              aria-label={social.label}
            >
              <social.icon size={20} />
            </motion.a>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="text-center text-slate-400 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          © {new Date().getFullYear()} Aswin S | Built with ❤️ using React & Tailwind CSS
        </motion.div>
      </div>
    </footer>
  );
}