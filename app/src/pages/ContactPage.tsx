import { useState } from "react";
import { MapPin, Phone, Mail, Instagram, Linkedin, Send } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface ContactPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Thank you for your inquiry! We'll be in touch soon.");
  };

  const projectTypes = [
    "Photography",
    "Videography",
    "Campaign",
    "Creative Direction",
    "Other",
  ];

  return (
    <>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 sm:py-32 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[120px] xl:text-[150px] text-dark tracking-tight leading-none mb-8">
                CONTACT
              </h1>
              <p className="text-lg sm:text-xl text-dark/70 max-w-2xl">
                Ready to start your next project? We'd love to hear from you. 
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 sm:py-24 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Form */}
              <FadeIn>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium tracking-wider text-dark mb-2">
                      NAME
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-dark/20 rounded-lg focus:border-dark focus:outline-none transition-colors bg-transparent"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium tracking-wider text-dark mb-2">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-dark/20 rounded-lg focus:border-dark focus:outline-none transition-colors bg-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium tracking-wider text-dark mb-2">
                      COMPANY
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 border border-dark/20 rounded-lg focus:border-dark focus:outline-none transition-colors bg-transparent"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium tracking-wider text-dark mb-2">
                      PROJECT TYPE
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-3 border border-dark/20 rounded-lg focus:border-dark focus:outline-none transition-colors bg-transparent"
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium tracking-wider text-dark mb-2">
                      MESSAGE
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 border border-dark/20 rounded-lg focus:border-dark focus:outline-none transition-colors bg-transparent resize-none"
                      placeholder="Tell us about your project..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-dark text-white font-medium tracking-wider text-sm group"
                  >
                    SEND MESSAGE
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </FadeIn>

              {/* Contact Info */}
              <FadeIn delay={0.1}>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl text-dark tracking-tight mb-4">
                      GET IN TOUCH
                    </h3>
                    <p className="text-dark/70 leading-relaxed">
                      Whether you have a specific project in mind or just want to explore 
                      possibilities, we're here to help bring your vision to life.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <a
                      href="mailto:info@ashkanstudios.com"
                      className="flex items-center gap-4 text-dark hover:text-dark/70 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full border border-dark/20 flex items-center justify-center">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-dark/50">EMAIL</p>
                        <p className="font-medium">info@ashkanstudios.com</p>
                      </div>
                    </a>

                    <a
                      href="tel:3463357973"
                      className="flex items-center gap-4 text-dark hover:text-dark/70 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full border border-dark/20 flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-dark/50">PHONE</p>
                        <p className="font-medium">(346) 335-7973</p>
                      </div>
                    </a>

                    <div className="flex items-center gap-4 text-dark">
                      <div className="w-12 h-12 rounded-full border border-dark/20 flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-dark/50">LOCATION</p>
                        <p className="font-medium">1502 Sawyer St #108, Houston, TX</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-dark/50 mb-4">FOLLOW US</p>
                    <div className="flex gap-4">
                      <a
                        href="https://instagram.com/ashkanstudios"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full border border-dark/20 flex items-center justify-center hover:bg-dark hover:text-white transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a
                        href="https://linkedin.com/company/ashkan-studios"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full border border-dark/20 flex items-center justify-center hover:bg-dark hover:text-white transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Booking Links Section */}
        <section className="py-16 sm:py-24 bg-dark text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <FadeIn>
              <h2 className="font-display text-3xl sm:text-4xl tracking-tight mb-6">
                PREFER TO BOOK A CALL?
              </h2>
              <p className="text-white/70 mb-8 max-w-xl mx-auto">
                Schedule a consultation at a time that works for you.
              </p>
              <a
                href="https://calendly.com/ashkanstudios"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-dark font-medium tracking-wider text-sm"
              >
                BOOK A CONSULTATION
              </a>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
