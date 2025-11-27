"use client";

import React from "react";
import ExperienceCard from "./ExperienceCard";
import type { Experience } from "./types";
import { motion } from "framer-motion";

export default function About() {
  const experiences: Experience[] = [
    {
      id: "1",
      role: "MERN Stack Intern",
      company: "Plugins Learn Ltd.",
      period: "2024–2025",
      description: "Hands-on experience in full-stack development and API integration."
    },
    {
      id: "2",
      role: "Self-Taught Developer",
      company: "Independent Learning",
      period: "2024",
      description: "Learned MERN stack through structured resources and practical projects."
    }
  ];

  return (
    <section id="about" className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-3"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        About <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Me
        </span>
      </motion.h2>
      <motion.div
        className="h-1 w-24 bg-gradient-to-r from-indigo-400 to-pink-500 rounded mx-auto mb-12"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      />

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="about-description">
            I am a MERN stack developer passionate about building real-world
            digital solutions using modern technologies.
          </p>

          <div className="about-grid">
            <div className="about-info">Languages: English, Malayalam, Hindi</div>
            <div className="about-info">Location: India</div>
            <div className="about-info">Experience: 1+ Years</div>
            <div className="about-info">Availability: Open to Work</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold mb-4">Career Journey</h3>
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <ExperienceCard
                  role={exp.role}
                  company={exp.company}
                  period={exp.period}
                >
                  {exp.description}
                </ExperienceCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}