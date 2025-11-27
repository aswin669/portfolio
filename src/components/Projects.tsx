"use client";

import React from "react";
import ProjectCard from "./ProjectCard";
import { projects } from "../data/projects";
import { motion } from "framer-motion";

export default function Projects() {
  return (
    <section id="projects" className="max-w-7xl mx-auto px-6 py-16 text-center">
      <motion.h2
        className="projects-title"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        My{" "}<span className="gradient-accent bg-clip-text text-transparent">Projects</span>
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
        {projects.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            viewport={{ once: true }}
          >
            <ProjectCard {...p} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}