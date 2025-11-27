"use client";

import React from "react";
import { Project } from "./types";
import { motion } from "framer-motion";

export default function ProjectCard({
  title,
  description,
  tags,
  image,
}: Project) {
  return (
    <motion.div 
      className="project-card glow-card"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {image && (
        <div className="relative overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="project-image"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      <div className="project-content">
        <h3 className="project-title">{title}</h3>

        <p className="project-desc">{description}</p>

        <div className="project-tags">
          {tags?.map((t) => (
            <span
              key={t}
              className="project-tag"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}