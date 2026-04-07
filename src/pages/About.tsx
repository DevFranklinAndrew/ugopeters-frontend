import { ArrowRight, Lightbulb, Target, Users } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import image from "../assets/Ugo_Peters_Pic3.jpg";
const About = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-48 max-medium-tablet:pt-32 max-medium-tablet:pb-20 pb-32 px-12 max-mobile:px-4 bg-muted/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 max-medium-tablet:grid-cols-1 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-gold uppercase tracking-[.3rem] text-xs font-bold mb-6 block">
                Executive profile
              </span>
              <h1 className="max-tablet:text-7xl max-mobile:text-6xl max-small-mobile:text-5xl text-8xl max font-serif font-bold leading-[1.1] mb-12 tracking-tight">
                About <br /> <span className="text-gold">Ugo Peters</span>
              </h1>
              <div className="space-y-8 text-foreground/70 text-xl leading-relaxed font-light max-small-tablet:text-lg">
                <p className="text-foreground font-medium text-3xl font-serif italic leading-tight">
                  Ugo Peters is a Real Estate Strategist, Business Innovator,
                  and Executive Mentor focused on building and scaling
                  high-impact ventures across Africa.
                </p>
                <p>
                  His work sits at the intersection of real estate, business
                  strategy, and leadership development, with a clear emphasis on
                  execution within complex and evolving markets. He is deeply
                  committed to bridging the gap between theoretical knowledge
                  and real-world application, particularly for entrepreneurs
                  operating in Sub-Saharan Africa.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative max-medium-tablet:w-3/4 max-medium-tablet:-translate-x-1/2 max-medium-tablet:left-1/2 max-small-mobile:w-full max-small-mobile:left-0 max-small-mobile:translate-x-0"
            >
              <div className="aspect-4/5 overflow-hidden border border-border p-4 bg-background">
                <img
                  src={image}
                  alt="Ugo Peters Portrait"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
          <div className="mt-8 space-y-8 text-foreground/70 text-xl leading-relaxed font-light max-small-tablet:text-lg">
            <p>
              This platform is dedicated to business education, my goal is to
              bridge the gap between theoretical knowledge and real-world
              application for entrepreneurs in Sub-Saharan Africa. Through this
              medium, I aim to provide practical insights on entrepreneurship,
              business, innovation, investment, and leadership.
            </p>
            <p>
              My target audience comprises early-stage and aspiring
              entrepreneurs who need actionable information to gain a
              competitive advantage in navigating the dynamic business landscape
              of the region.
            </p>
            <p>
              Together, we will move beyond technical jargon and superficial
              success stories. My commitment is to share grounded, practical
              business insights and stimulate meaningful conversations that
              foster sound decision-making and sustainable growth. This platform
              is more than a resource; it is a collaborative space for coaching
              and mentorship, empowering you to build resilient and thriving
              enterprises.
            </p>
          </div>
        </div>
      </section>
      {/* Narrative Section */}
      <section className="py-32 px-12 max-tablet:py-24 max-mobile:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 max-medium-tablet:grid-cols-1 max-medium-tablet:gap-16 gap-24">
            <div>
              <span className="text-gold uppercase tracking-widest text-xs font-bold mb-4 block">
                Philosophy
              </span>
              <h2 className="text-6xl max-medium-mobile:text-5xl font-serif font-bold tracking-tight leading-tight">
                Execution Over <br />
                <span className="text-gold">Abstraction</span>
              </h2>
            </div>
            <div className="space-y-8 text-xl text-foreground/60 leading-relaxed font-light">
              <p>
                Ugo’s approach is grounded in practical experience rather than
                abstract frameworks. He prioritizes clarity, disciplined
                execution, and long-term value creation, consistently focusing
                on what works within real operating environments rather than
                what is conceptually appealing.
              </p>
              <p>
                Beyond his ventures, he shares structured insights on
                entrepreneurship, innovation, investment, and leadership,
                providing entrepreneurs with actionable knowledge required to
                navigate uncertainty, make sound decisions, and build resilient
                businesses.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Purpose Section */}
      <section className="py-32 px-12 max-tablet:py-24 max-mobile:px-4 bg-foreground text-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-16 items-center max-medium-tablet:grid-cols-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-gold uppercase tracking-widest text-xs font-bold mb-6 block">
                Mission
              </span>
              <h2 className="text-7xl max-medium-mobile:text-6xl font-serif font-bold mb-12 tracking-tight">
                Purpose
              </h2>

              <div className="space-y-8 text-background/60 text-xl leading-relaxed font-light mb-12">
                <p>
                  Ugo Peters operates with a clear philosophy: business
                  knowledge must be practical, contextual, and applicable. He
                  does not rely on imported concepts or theoretical models that
                  fail to translate effectively within African markets.
                </p>
                <p className="text-background font-medium italic">
                  His work is not centered on motivation. Instead, the focus is
                  on developing discipline, strategic clarity, and execution
                  capability.
                </p>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-4 px-12 py-6 bg-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all shadow-xl shadow-gold/10"
              >
                Book a Call
                <ArrowRight size={20} />
              </Link>
            </motion.div>
            <div className="p-16 max-mobile:p-6 border border-background/10 bg-background/5 backdrop-blur-sm">
              <p className="text-background/80 text-2xl font-serif italic leading-relaxed">
                "He strongly believes that culture shapes execution, and that
                strategy without contextual alignment is ineffective. Success
                alone is often an incomplete and unreliable teacher."
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Approach & Philosophy Section */}
      <section className="py-32 px-12 max-tablet:py-24 max-mobile:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-24 max-tablet:mb-16 text-center">
            <span className="text-gold uppercase tracking-widest text-xs font-bold mb-4 block">
              Methodology
            </span>
            <h2 className="text-6xl max-medium-mobile:text-5xl font-serif font-bold tracking-tight">
              Approach & Philosophy
            </h2>
          </div>

          <div className="grid grid-cols-3 max-tablet:grid-cols-2 max-mobile:grid-cols-1 gap-12 max-tablet:gap-8">
            {[
              {
                title: "Sustainable Impact & Growth",
                desc: "Ugo Peters focuses on delivering measurable, results-driven growth that is both sustainable and scalable. Every initiative is designed with long-term value creation in mind.",
                icon: Target,
              },
              {
                title: "Collaborative Partnerships",
                desc: "His leadership style is rooted in collaboration and alignment. He works closely with partners and stakeholders to build solutions based on transparency and shared objectives.",
                icon: Users,
              },
              {
                title: "Innovation with Purpose",
                desc: "Ugo combines data-driven insight with disciplined creativity to solve complex problems. Ensuring that ideas are implementable and capable of delivering tangible results.",
                icon: Lightbulb,
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-10 max-mobile:p-6 bg-card border border-border hover:border-gold/30 transition-all group"
              >
                <div className="w-16 h-16 border border-gold/20 flex items-center justify-center mb-10 text-gold group-hover:bg-gold group-hover:text-black transition-all">
                  <item.icon size={32} />
                </div>
                <h3 className="text-3xl font-serif font-bold mb-6 tracking-tight leading-tight">
                  {item.title}
                </h3>
                <p className="text-foreground/50 text-base leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default About;
