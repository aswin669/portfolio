"use client";

import React from "react";
import ExperienceCard from "./ExperienceCard";
import type { Experience } from "./types";
import { motion } from "framer-motion";

export default function Experience() {
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
    },
    {
      id: "3",
      role: "Backend Developer",
      company: "MCABEE",
      period: "2025–Present",
      description: "Developing and maintaining server-side applications using Node.js, Express, and MongoDB. Implementing RESTful APIs, optimizing performance, and ensuring scalability."
    },
  ];

  return (
    <section id="experience" className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-3"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Work <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Experience
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
    </section>
  );
}