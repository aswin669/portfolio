"use client";

import React from "react";
import SkillCard from "./SkillCard";
import { skills } from "../data/skills";
import { motion } from "framer-motion";

export default function Skills() {
  return (
    <section id="skills" className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-3"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        My{" "}
        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Skills
        </span>
      </motion.h2>
      <motion.div
        className="h-1 w-24 bg-gradient-to-r from-indigo-400 to-pink-500 rounded mx-auto mb-12"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      ></motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        {skills.map((s, index) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            viewport={{ once: true }}
          >
            <SkillCard {...s} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="mt-12">
          <h4 className="text-lg font-semibold text-slate-300 mb-4 text-center">
            Additional Technologies
          </h4>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "Git",
              "GitHub",
              "VS Code",
              "Postman",
              "Responsive Design",
              "Express.js",
              "REST APIs",
              "Tailwind CSS",
            ].map((t, index) => (
              <motion.span
                key={t}
                className="text-xs bg-slate-800/70 backdrop-blur-sm px-4 py-2.5 rounded-full border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-700/70 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}