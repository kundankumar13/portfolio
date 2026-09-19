import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import ParticlesBackground from "../components/ParticlesBackground";
import Astra from "../assets/Astra.png";

// Environment variables
const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

export default function Contact() {
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
    
    
    if (name === "budget" && value && !/^\d+$/.test(value)) return;

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

    
    if (formData.service && formData.service !== "Other" && !formData.budget.trim()) {
      newErrors.budget = "Budget is required";
    }

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
      budget: formData.service === "Other" ? "N/A" : formData.budget,
      message: formData.idea.trim(),
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      setStatus("success");
      
      
      setFormData({
        name: "",
        email: "",
        service: "",
        budget: "",
        idea: "",
      });
    } catch (err) {
      console.error("Emailjs integration error:", err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="w-full min-h-screen relative bg-black overflow-hidden text-white py-20 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10">
      <ParticlesBackground />

      <div className="relative z-10 w-full flex flex-col md:flex-row items-center gap-10">
        
        {/* Left Side - Image Section */}
        <motion.div
          className="w-full md:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src={Astra}
            alt="Astra Avatar"
            className="w-72 md:w-[500px] rounded-2xl shadow-2xl object-cover"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Right Side - Form Section */}
        <motion.div 
          className="w-full md:w-1/2 bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6 tracking-wide">
            Let's Work Together
          </h2>
          
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