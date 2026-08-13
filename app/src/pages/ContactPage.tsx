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
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      /* Backend differs by host:
         - Vercel preview (ashakan-studio.vercel.app): /api/contact
           serverless function.
         - Live site (ashkanstudios.com on WP Engine): a static React
           build with NO WordPress installed, so the backend is the
           standalone /contact.php endpoint (repo: wp-engine/contact.php)
           uploaded to the webroot. The /wp-json entries are harmless
           fallbacks in case the site ever runs inside WordPress again
           (the wrapper-theme REST endpoint from wordpress-theme/).
         Every response is verified to be JSON with { ok: true } - the
         SPA catch-all returns index.html with HTTP 200 for unknown
         paths, which previously made the form claim "sent" without
         any email actually being sent. */
      const endpoints = window.location.hostname.endsWith(".vercel.app")
        ? ["/api/contact"]
        : [
            "/contact.php",
            "/wp-json/ashkan/v1/contact",
            "/?rest_route=/ashkan/v1/contact",
          ];

      let confirmed = false;
      let apiError = "";
      for (const url of endpoints) {
        let res: Response;
        try {
          res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
        } catch {
          continue; // network hiccup - try the next endpoint
        }
        const data: unknown = await res.json().catch(() => null);
        if (!data || typeof data !== "object") {
          continue; // got HTML (SPA catch-all / cache), not the API - try next
        }
        if (res.ok && (data as { ok?: boolean }).ok === true) {
          confirmed = true;
        } else {
          apiError =
            (data as { error?: string }).error || "Failed to send your message.";
        }
        break; // a real API answered (success or error) - stop trying
      }

      if (!confirmed) {
        throw new Error(apiError || "Failed to send your message.");
      }
      setStatus("sent");
      setFormData({ name: "", email: "", company: "", projectType: "", message: "" });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
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
              {/* Visible heading carries the H1 (was an h2 under an
                  sr-only h1 - see ServicesPage). Styling untouched. */}
              <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[120px] xl:text-[150px] text-dark tracking-tight leading-none mb-8">
                CONTACT
              </h1>
              {/* Brandi 5/7/26 (PDF page 75) - wording softened from
                  the original 'within 24 hours' to 'as soon as possible'
                  so we don't commit to a hard turnaround on the page. */}
              <p className="text-lg sm:text-xl text-dark/70 max-w-2xl">
                Ready to start your next project? We'd love to hear from you.
                Fill out the form below and we'll get back to you as soon as possible.
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
                    disabled={status === "sending"}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-dark text-white font-medium tracking-wider text-sm group disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? "SENDING..." : "SEND MESSAGE"}
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  {status === "sent" && (
                    <p className="text-sm text-dark mt-2">
                      Thank you &mdash; your message has been sent. We&rsquo;ll be in touch soon.
                    </p>
                  )}
                  {status === "error" && (
                    <p className="text-sm text-red-600 mt-2">
                      {errorMsg} You can also email us directly at info@ashkanstudios.com.
                    </p>
                  )}
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

        {/* Removed per Brandi 5/7/26 (PDF page 77 - 'Completely remove'):
            the 'PREFER TO BOOK A SESSION?' booking links section. The
            VIEW SESSION TYPES + SCHEDULE A CALL Calendly buttons that
            lived in this section have been dropped to keep CONTACT a
            pure inquiry-form page. */}
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
