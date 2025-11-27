"use client";

import React from "react";
import { Skill } from "./types";
import { motion } from "framer-motion";

export default function SkillCard({ title, percent }: Skill) {
  return (
    <motion.div 
      className="card glow-card"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center gap-4">
        <motion.div 
          className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white text-xl"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {title[0]}
        </motion.div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-xs text-slate-400">{percent}%</p>
        </div>
      </div>
      <div className="skill-bar">
        <motion.div
          className="skill-progress"
          style={{ width: `${percent}%` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        ></motion.div>
      </div>
    </motion.div>
  );
}