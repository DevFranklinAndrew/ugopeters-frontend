import { ArrowRight, BookOpen, Briefcase } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import pay100WebShot from "../assets/100pay.png";
import abujaWebShot from "../assets/Abuja-Apartments.png";
import hxafricaWebShot from "../assets/Hxafrica.png";
import pageboyWebShot from "../assets/Pageboy-Interiors.png";
import realtorsfirstShot from "../assets/Realtorsfirst.png";

const projects = [
  {
    title: "HXafrica",
    category: "Blockchain Real Estate",
    impact:
      "Expanding access to property investment through blockchain-enabled tokenization.",
    desc: "A blockchain-enabled real estate platform reducing entry barriers, enhancing liquidity, and enabling structured participation for low- and middle-income earners.",
    image: hxafricaWebShot,
    link: "https://hxafrica.com/",
  },
  {
    title: "Abuja Apartments",
    category: "Residential Solutions",
    impact:
      "Delivering end-to-end residential solutions and property management in Nigeria's capital.",
    desc: "A trusted Abuja-based real estate company providing property acquisition, co-ownership, sales, rentals, and management services.",
    image: abujaWebShot,
    link: "https://abuja.apartments/",
  },
  {
    title: "Realtors First",
    category: "Modern Brokerage",
    impact:
      "Reimagining property transactions for global accessibility and efficiency.",
    desc: "A modern brokerage platform making buying and selling more accessible, efficient, and globally connected through innovative digital frameworks.",
    image: realtorsfirstShot,
    link: "https://brokerage.hxafrica.co/",
  },
  {
    title: "Pageboy Interiors",
    category: "Design & Furniture",
    impact:
      "Creating functional and refined living spaces that combine aesthetics with practicality.",
    desc: "A design and furniture brand focused on delivering high-quality, functional interior solutions for modern residential and commercial spaces.",
    image: pageboyWebShot,
    link: "https://pageboyinteriors.com/",
  },
  {
    title: "100pay",
    category: "Digital Finance",
    impact:
      "It's all 0s and 1s in Digital Finance—yet it reads as 100. Borders shouldn't limit potential.",
    desc: "We solved them with products and tools tailored to help you reach your personal and business finance goals in todays world driven by AI & digital finance.",
    image: pay100WebShot,
    link: "https://100pay.co/",
  },
];

const Portfolio = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-48 max-medium-tablet:pt-32 max-medium-tablet:pb-20 pb-32 px-12 max-mobile:px-4 bg-muted/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold uppercase tracking-[.3rem] text-xs font-bold mb-6 block">
              Case Studies
            </span>
            <h1 className="text-8xl max-tablet:text-7xl max-mobile:text-6xl max-small-mobile:text-5xl font-serif font-bold leading-[1.1] mb-8 tracking-tight">
              Selected <br />
              <span className="text-gold">Ventures</span>
            </h1>
            <p className="text-foreground/60 text-2xl max-w-2xl leading-relaxed font-light max-small-tablet:text-lg">
              A portfolio of high-impact ventures driving innovation and
              delivering long-term value across Africa's evolving real estate
              landscape.
            </p>
          </motion.div>
        </div>
      </section>
      {/* Projects Grid */}
      <section className="py-32 px-12 max-tablet:py-24 max-mobile:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-20 max-small-tablet:grid-cols-1 max-small-tablet:gap-12">
            {projects.map((project, index) => (
              <motion.a
                target="_blank"
                href={project.link}
                key={project.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group flex flex-col"
              >
                <div className="relative aspect-16/10 overflow-hidden mb-8 border border-border">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col grow">
                  <span className="text-gold uppercase tracking-widest text-xs font-bold mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-3xl font-serif font-bold mb-4 tracking-tight group-hover:text-gold transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-foreground/50 mb-8 leading-relaxed text-lg">
                    {project.desc}
                  </p>
                  <div className="mt-auto p-8 max-mobile:p-6 bg-muted/5 border-l-4 border-gold">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 block mb-3">
                      Impact Outcome
                    </span>
                    <p className="text-foreground/90 font-medium italic text-lg leading-relaxed">
                      {project.impact}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
      {/* Quote Section */}
      <section className="py-32 max-tablet:py-16 bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-px bg-gold mx-auto mb-12" />
            <blockquote className="text-4xl max-mobile:text-2xl font-serif font-bold leading-tight italic tracking-tight mb-12">
              “The need for speed in building a business in Nigeria cannot be
              overstated. Delivering solutions to market faster creates a
              decisive advantage. Speed of execution is, in itself, a form of
              currency.”
            </blockquote>
            <div className="w-16 h-px bg-gold mx-auto" />
          </motion.div>
        </div>
      </section>
      {/* Services Section */}
      <section className="py-32 px-12 max-tablet:py-24 max-mobile:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-24 max-small-tablet:mb-16">
            <span className="text-gold uppercase tracking-widest text-xs font-bold mb-4 block">
              Strategic Support
            </span>
            <h2 className="text-6xl max-medium-mobile:text-5xl font-serif font-bold tracking-tight">
              Services to Elevate Growth
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-12 max-medium-tablet:grid-cols-1 max-mobile:gap-8">
            {[
              {
                title: "Mentorship in Business Leadership & Entrepreneurship",
                desc: "Ugo Peters provides direct mentorship to entrepreneurs building and scaling ventures. His experience leading HXafrica offers practical insight into identifying market gaps, structuring solutions, and executing growth strategies within real operating environments.",
                icon: BookOpen,
              },
              {
                title: "Coaching on Strategic Business Development",
                desc: "Drawing from leadership roles across multiple organizations, Ugo Peters provides coaching on strategic growth, partnership development, and operational structuring. His focus is on helping businesses build clarity in direction.",
                icon: Briefcase,
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-10 max-mobile:p-6 bg-card border border-border hover:border-gold/30 transition-all group"
              >
                <div className="w-16 h-16 border border-gold/20 flex items-center justify-center text-gold mb-10 group-hover:bg-gold group-hover:text-black transition-all">
                  <service.icon size={32} />
                </div>
                <h3 className="text-3xl font-serif font-bold mb-8 tracking-tight leading-tight">
                  {service.title}
                </h3>
                <p className="text-foreground/50 text-lg leading-relaxed mb-12">
                  {service.desc}
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 text-gold uppercase tracking-widest text-xs font-bold hover:gap-6 transition-all"
                >
                  Learn more <ArrowRight size={20} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-12 max-tablet:py-24 max-mobile:px-4 bg-muted/5 border-l-4 border-gold">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-7xl max-medium-tablet:text-6xl max-small-mobile:text-5xl font-serif font-bold mb-12 max-medium-tablet:mb-6 tracking-tight leading-tight">
              Let’s Build Your <br />
              <span className="text-gold">Next Venture</span>
            </h2>
            <p className="text-foreground/70 text-xl max-medium-tablet:text-lg leading-relaxed font-light mb-16 max-medium-tablet:mb-12 max-w-2xl">
              Partner with Ugo Peters to bring clarity, structure, and execution
              to your vision. With a proven track record across
              innovation-driven projects.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-4 px-12 py-6 bg-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all shadow-xl shadow-gold/10"
            >
              Get in Touch <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
export default Portfolio;
