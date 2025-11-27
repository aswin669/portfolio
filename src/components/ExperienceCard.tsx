"use client";

import React, { PropsWithChildren } from "react";
import { Experience } from "./types";
import { motion } from "framer-motion";

export default function ExperienceCard({
  role,
  company,
  period,
  children,
}: PropsWithChildren<Pick<Experience, 'role' | 'company' | 'period'>>) {
  return (
    <motion.div 
      className="timeline-item glow-card"
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="timeline-content">
        <h4 className="timeline-title">{role}</h4>
        <div className="timeline-company">{company}</div>
        <div className="timeline-date">{period}</div>
        <div className="timeline-desc">{children}</div>
      </div>
    </motion.div>
  );
}