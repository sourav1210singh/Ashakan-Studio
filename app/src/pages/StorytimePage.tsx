import { ArrowRight, Calendar, Clock } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface StorytimePageProps {
  onNavigate: (view: View, slug?: string) => void;
}

export function StorytimePage({ onNavigate }: StorytimePageProps) {
  const blogPosts = [
    {
      id: 1,
      title: "The Art of Commercial Photography: A Behind-the-Scenes Look",
      excerpt: "Discover what goes into creating stunning commercial imagery that captures brand essence and drives engagement.",
      category: "PHOTOGRAPHY",
      date: "FEB 10, 2025",
      readTime: "5 MIN READ",
      image: "/images/portfolio/fashion.jpg",
    },
    {
      id: 2,
      title: "Why Video Content is Essential for Modern Brands",
      excerpt: "Exploring the impact of video marketing and how it can transform your brand's digital presence.",
      category: "VIDEOGRAPHY",
      date: "JAN 28, 2025",
      readTime: "4 MIN READ",
      image: "/images/portfolio/vitacca-ballet.jpg",
    },
    {
      id: 3,
      title: "Working with The Monarch School: A Documentary Journey",
      excerpt: "Our experience documenting the incredible work of The Monarch School and the students who inspire us.",
      category: "DOCUMENTARY",
      date: "JAN 15, 2025",
      readTime: "6 MIN READ",
      image: "/images/portfolio/8-4Q7A9046-2.jpeg",
    },
    {
      id: 4,
      title: "Lighting Techniques for Product Photography",
      excerpt: "Professional tips and tricks for achieving perfect lighting in your product shots.",
      category: "TUTORIAL",
      date: "DEC 20, 2024",
      readTime: "8 MIN READ",
      image: "/images/portfolio/deutsch-jewelry.jpg",
    },
    {
      id: 5,
      title: "The Future of Fashion Photography in Houston",
      excerpt: "How Houston's fashion scene is evolving and what it means for photographers and brands.",
      category: "FASHION",
      date: "DEC 05, 2024",
      readTime: "5 MIN READ",
      image: "/images/portfolio/lauren-anderson.jpg",
    },
    {
      id: 6,
      title: "Building a Brand Through Visual Storytelling",
      excerpt: "How consistent, high-quality visual content can elevate your brand identity.",
      category: "BRANDING",
      date: "NOV 18, 2024",
      readTime: "7 MIN READ",
      image: "/images/portfolio/brandon-blackwood.jpg",
    },
  ];

  const categories = ["ALL", "PHOTOGRAPHY", "VIDEOGRAPHY", "DOCUMENTARY", "FASHION", "BRANDING", "TUTORIAL"];

  return (
    <>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 sm:py-32 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[120px] xl:text-[150px] text-dark tracking-tight leading-none mb-8">
                STORYTIME
              </h1>
              <p className="text-lg sm:text-xl text-dark/70 max-w-2xl">
                Insights, behind-the-scenes stories, and expert tips from the Ashkan Studios team.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-t border-dark/10 sticky top-20 bg-cream/95 backdrop-blur-sm z-30">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat, index) => (
                <button
                  key={cat}
                  className={`text-xs sm:text-sm font-medium tracking-wider px-4 py-2 rounded-full border transition-colors ${
                    index === 0 
                      ? "bg-dark text-white border-dark" 
                      : "text-dark border-dark/30 hover:bg-dark hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {blogPosts.map((post, index) => (
                <FadeIn key={post.id} delay={index * 0.1}>
                  <article className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-xs font-medium tracking-wider text-dark/50">
                        {post.category}
                      </span>
                      <span className="text-dark/30">|</span>
                      <span className="text-xs text-dark/50 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span className="text-xs text-dark/50 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl text-dark tracking-tight mb-3 group-hover:text-dark/70 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-dark/60 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-dark group-hover:gap-3 transition-all">
                      READ MORE
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 sm:py-24 bg-dark text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="max-w-2xl mx-auto text-center">
              <FadeIn>
                <h2 className="font-display text-3xl sm:text-4xl tracking-tight mb-4">
                  STAY IN THE LOOP
                </h2>
                <p className="text-white/70 mb-8">
                  Subscribe to our newsletter for the latest stories, tips, and studio updates.
                </p>
                <form className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-white/50"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-white text-dark font-medium tracking-wider text-sm"
                  >
                    SUBSCRIBE
                  </button>
                </form>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
