import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import ParticlesBackground from "../components/ParticlesBackground";
import Astra from "../assets/Astra.png";
import { usePortfolio } from "../context/PortfolioContext";

// Environment variables
const SERVICE_ID = import.meta.env.VITE_SERVICE_ID || "service_114fawh";
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID || "template_4yjctfh";
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY || "2t3kKC_x77fDy3kWJ";

export default function Contact() {
  const { addMessage } = usePortfolio();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    idea: ""
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Allow numbers, $, commas, k, and dashes in budget
    if (name === "budget" && value && !/^[\d$,\s.kK+-]+$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.service) newErrors.service = "Please select a service";
    if (!formData.idea.trim()) newErrors.idea = "Please explain your idea";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus("sending");

    const templateParams = {
      from_name: formData.name.trim(),
      reply_to: formData.email.trim(),
      service_needed: formData.service,
      budget: formData.budget.trim() || "N/A",
      message: formData.idea.trim(),
    };

    // 1. Immediately save to Admin Panel inbox
    if (addMessage) {
      addMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        service: formData.service,
        budget: formData.budget.trim() || "N/A",
        message: formData.idea.trim()
      });
    }

    // 2. Attempt sending via EmailJS
    try {
      if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      }
      setStatus("success");
    } catch (err) {
      console.warn("EmailJS notification issue (saved to admin inbox):", err);
      // Still show success since it's saved in Admin inbox
      setStatus("success");
    }

    setFormData({
      name: "",
      email: "",
      service: "",
      budget: "",
      idea: "",
    });
  };

  return (
    <section id="contact" className="w-full min-h-screen relative bg-black overflow-hidden text-white py-16 sm:py-24 px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-center">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-15 blur-[140px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[380px] h-[380px] rounded-full bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63] opacity-15 blur-[140px] animate-pulse delay-500" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
        
        {/* Left Side - Image Section */}
        <motion.div
          className="w-full lg:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: -50, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src={Astra}
            alt="Astra Avatar"
            className="w-52 sm:w-64 md:w-80 lg:w-[460px] rounded-2xl shadow-2xl object-cover"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Right Side - Form Section */}
        <motion.div 
          className="w-full lg:w-1/2 bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 backdrop-blur-md"
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-white"
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Let's Work Together
          </motion.h2>
          <motion.p
            className="text-sm text-gray-300 mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Have a project in mind, a question, or an opportunity? Reach out directly!
          </motion.p>
          
          <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            
            {/* Name Input */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Your Name <span className="text-red-500">*</span></label>
              <input 
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={`p-3 rounded-md bg-white/10 border ${errors.name ? "border-red-500" : "border-gray-600 focus:border-blue-500"} text-white focus:outline-none transition`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Your Email <span className="text-red-500">*</span></label>
              <input 
                type="email"
                name="email"
                placeholder="hello@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`p-3 rounded-md bg-white/10 border ${errors.email ? "border-red-500" : "border-gray-600 focus:border-blue-500"} text-white focus:outline-none transition`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
            </div>

            {/* Service Select Option */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Service Needed <span className="text-red-500">*</span></label>
              <select 
                name="service"
                value={formData.service}
                onChange={handleChange}
                className={`p-3 rounded-md bg-white/10 border ${errors.service ? "border-red-500" : "border-gray-600 focus:border-blue-500"} text-white focus:outline-none transition`}
              >
                <option value="" disabled className="text-gray-400 bg-neutral-900">Something in mind?</option>
                <option value="Web Development" className="text-black bg-white">Web Development</option>
                <option value="AI Development" className="text-black bg-white">AI Development</option>
                <option value="Mobile Application" className="text-black bg-white">Mobile Application</option>
                <option value="Other" className="text-black bg-white">Others</option>
              </select>
              {errors.service && <p className="text-red-500 text-xs mt-0.5">{errors.service}</p>}
            </div>

            {/* Conditional Budget Input */}
            {formData.service && formData.service !== "Other" && (
              <motion.div 
                className="flex flex-col gap-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <label className="text-sm font-medium">Budget (USD) <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  name="budget"
                  placeholder="e.g. 1500"
                  value={formData.budget}
                  onChange={handleChange}
                  className={`p-3 rounded-md bg-white/10 border ${errors.budget ? "border-red-500" : "border-gray-600 focus:border-blue-500"} text-white focus:outline-none transition`}
                />
                {errors.budget && <p className="text-red-500 text-xs mt-0.5">{errors.budget}</p>}
              </motion.div>
            )}

            {/* Idea Textarea Input */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Explain Your Idea <span className="text-red-500">*</span></label>
              <textarea 
                name="idea"
                rows={4}
                placeholder="Tell us about your project goals..."
                value={formData.idea}
                onChange={handleChange}
                className={`p-3 rounded-md bg-white/10 border ${errors.idea ? "border-red-500" : "border-gray-600 focus:border-blue-500"} text-white focus:outline-none transition resize-none`}
              ></textarea>
              {errors.idea && <p className="text-red-500 text-xs mt-0.5">{errors.idea}</p>}
            </div>

            {/* Form submission feedbacks */}
            {status && (
              <p className={`text-sm font-medium ${status === "success" ? "text-green-400" : status === "error" ? "text-rose-400" : "text-yellow-400"}`}>
                {status === "sending" && "⏳ Sending your message..."}
                {status === "success" && "✅ Message sent successfully! We'll get back to you soon."}
                {status === "error" && "❌ Something went wrong. Please try again later."}
              </p>
            )}

            {/* Action Button */}
            <motion.button 
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-md font-semibold transition mt-2 shadow-md disabled:cursor-not-allowed"
              whileHover={status !== "sending" ? { scale: 1.02 } : {}}
              whileTap={status !== "sending" ? { scale: 0.98 } : {}}
              disabled={status === "sending"}
              type="submit"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}