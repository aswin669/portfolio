"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Education() {
  const educationData = [
    {
      id: "1",
      title: "MERN Stack Development",
      institution: "Plugins Learn",
      period: "2025-present",
      status: "In Progress"
    },
    {
      id: "2",
      title: "Higher Secondary Education",
      institution: "Computer Science",
      period: "2015–2017",
      status: "Completed"
    }
  ];

  return (
    <section id="education" className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-3"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        My <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Education
        </span>
      </motion.h2>
      <motion.div
        className="h-1 w-24 bg-gradient-to-r from-indigo-400 to-pink-500 rounded mx-auto mb-12"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <div className="space-y-4">
          {educationData.map((edu, index) => (
            <motion.div
              key={edu.id}
              className="education-item glow-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ x: 5 }}
            >
              <div className="education-content">
                <div className="education-title">{edu.title}</div>
                <div className="education-institute">{edu.institution} — {edu.period}</div>
              </div>
              <div className={`text-sm ${edu.status === "Completed" ? "text-emerald-400" : "text-blue-400"}`}>
                {edu.status}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}