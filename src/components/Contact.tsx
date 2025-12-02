"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.message) {
        setPopupMessage("Please fill in all fields.");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        setIsSubmitting(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setPopupMessage("Please enter a valid email address.");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        setIsSubmitting(false);
        return;
      }

      // Send message directly through API
      let response;
      try {
        response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
          }),
        });
      } catch (fetchError) {
        console.error('Network error:', fetchError);
        throw new Error(`Network error: ${fetchError.message}`);
      }

      if (response.ok) {
        // Show success popup
        setPopupMessage("Message sent successfully! ✓");
        setShowPopup(true);

        // Reset form
        setFormData({ name: "", email: "", message: "" });
      } else {
        // Get error details from response
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        const errorMessage = errorData.details || errorData.error || 'Failed to send message';
        throw new Error(errorMessage);
      }

      // Hide popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } catch (error) {
      console.error('Contact form error:', error);
      let errorMessage = "Failed to send message. Please try again.";
      
      // Check if it's a response object with error details
      if (error instanceof Response) {
        // Handle HTTP errors
        errorMessage = `Failed to send message. Server responded with status ${error.status}.`;
      } else if (error && typeof error === 'object') {
        if ('details' in error) {
          errorMessage = `Failed to send message: ${error.details}`;
        } else if ('message' in error) {
          errorMessage = `Failed to send message: ${error.message}`;
        }
      } else if (error && typeof error === 'string') {
        errorMessage = `Failed to send message: ${error}`;
      }
      
      setPopupMessage(errorMessage);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 5000); // Show error for longer
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { label: "Phone", value: "+91 8157099669", link: "tel:+918157099669" },
    { label: "Email", value: "aswinsreedharan669@gmail.com", link: "mailto:aswinsreedharan669@gmail.com" },
    { label: "GitHub", value: "aswin669", link: "https://github.com/aswin669" },
    { label: "LinkedIn", value: "Aswinseedharan", link: "https://www.linkedin.com/in/aswinseedharan" }
  ];

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-3"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Get In <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Touch
        </span>
      </motion.h2>
      <motion.div
        className="h-1 w-24 bg-gradient-to-r from-indigo-400 to-pink-500 rounded mx-auto mb-12"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      />

      <div className="contact-grid">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="space-y-4">
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.label}
                href={info.link}
                target={info.label === "GitHub" || info.label === "LinkedIn" ? "_blank" : undefined}
                rel={info.label === "GitHub" || info.label === "LinkedIn" ? "noopener noreferrer" : undefined}
                className="contact-info glow-card block cursor-pointer hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ x: 5 }}
              >
                <strong className="contact-label">{info.label}:</strong>
                <div className="contact-value">{info.value}</div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <form className="contact-form glow-card" onSubmit={handleSubmit}>
            <motion.input
              type="text"
              name="name"
              placeholder="Your Name"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              viewport={{ once: true }}
            />
            <motion.input
              type="email"
              name="email"
              placeholder="Your Email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              viewport={{ once: true }}
            />
            <motion.textarea
              name="message"
              placeholder="Your Message"
              className="textarea-field"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              viewport={{ once: true }}
            />
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="contact-submit pulse-button disabled:opacity-50 disabled:cursor-not-allowed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Success/Error Popup */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-lg shadow-2xl flex items-center gap-3"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-medium">{popupMessage}</span>
        </motion.div>
      )}
    </section>
  );
}