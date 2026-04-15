import {
  ArrowRight,
  Building2,
  Globe,
  HomeIcon,
  Layout,
  Palette,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import abujaWebShot from "../assets/Abuja-Apartments.png";
import hxafricaWebShot from "../assets/Hxafrica.png";
import pageboyWebShot from "../assets/Pageboy-Interiors.png";
import realtorsfirstShot from "../assets/Realtorsfirst.png";
import image from "../assets/Ugo_Peters_Pic2.jpg";

const tags = [
  "Real Estate Strategist",
  "Business Innovator",
  "Executive Mentor",
];

const whatIDo = [
  {
    title: "Real Estate Growth & Innovation",
    desc: "Structuring and executing high-impact real estate ventures with a focus on scalability, capital efficiency, and long-term asset performance.",
    icon: Building2,
  },
  {
    title: "SME & Business Development",
    desc: "Designing and implementing scalable business architectures for growth-stage enterprises, from early traction to long-term sustainable scale.",
    icon: TrendingUp,
  },
  {
    title: "Mentorship & Executive Coaching",
    desc: "Advising and developing high-capacity leaders through structured mentorship focused on strategic thinking and decision-making discipline.",
    icon: Users,
  },
];

const ventures = [
  {
    title: "HXafrica",
    category: "Blockchain Real Estate",
    desc: "A blockchain-enabled platform expanding access to property investment, enhancing liquidity and enabling structured participation.",
    image: hxafricaWebShot,
    icon: Globe,
    link: "https://hxafrica.com/",
  },
  {
    title: "Abuja Apartments",
    category: "Residential Solutions",
    desc: "A trusted real estate company delivering end-to-end residential solutions, including acquisition, co-ownership, and management.",
    image: abujaWebShot,
    icon: HomeIcon,
    link: "https://abuja.apartments/",
  },
  {
    title: "Realtors First",
    category: "Modern Brokerage",
    desc: "A modern brokerage platform reimagining property transactions to make buying and selling more accessible and efficient.",
    image: realtorsfirstShot,
    icon: Layout,
    link: "https://brokerage.hxafrica.co/",
  },
  {
    title: "Pageboy Interiors",
    category: "Design & Furniture",
    desc: "A design brand focused on creating functional and refined living spaces that combine aesthetics with practicality.",
    image: pageboyWebShot,
    icon: Palette,
    link: "https://pageboyinteriors.com/",
  },
];

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[140vh] max-small-desktop:min-h-[125vh] max-tablet:min-h-screen flex items-center max-medium-tablet:pt-32 max-medium-tablet:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
            alt="Modern Architecture"
            className="w-full h-full object-cover grayscale opacity-40 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background to-background" />
        </div>

        <div className="max-w-7xl px-12 max-mobile:px-4 mx-auto z-10">
          <div className="grid grid-cols-12 max-medium-tablet:grid-cols-1 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="col-span-7 max-medium-tablet:col-span-1"
            >
              <div className="flex items-center flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-gold border border-gold uppercase tracking-[.3rem] text-[10px] font-bold py-1 px-2 rounded-full bg-transparent"
                  >
                    {tag}{" "}
                  </span>
                ))}
              </div>
              <h1 className="max-tablet:text-7xl max-mobile:text-6xl max-small-mobile:text-5xl text-8xl font-serif font-bold leading-[1.1] mt-3 mb-5 tracking-tight">
                Building <span className="text-gold">High Impact</span> Ventures
                Across Africa
              </h1>
              <p className="text-foreground/60 text-2xl max-small-tablet:text-lg max-w-2xl mb-12 leading-relaxed font-light">
                Ugo Peters is a Real Estate Strategist and Business Innovator
                focused on bridging the gap between theoretical knowledge and
                real-world execution.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link
                  to="/portfolio"
                  className="px-10 py-5 bg-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all flex items-center justify-center gap-3 group"
                >
                  View Portfolio <ArrowRight size={18} />
                </Link>
                <Link
                  to="/about"
                  className="px-10 py-5 border border-border text-foreground font-bold uppercase tracking-widest text-sm hover:bg-foreground hover:text-background transition-all flex items-center justify-center"
                >
                  About Ugo
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="col-span-5 max-medium-tablet:col-span-1 max-medium-tablet:w-3/4 max-medium-tablet:-translate-x-1/2 max-medium-tablet:left-1/2 
              max-small-mobile:w-full max-small-mobile:left-0 max-small-mobile:translate-x-0 relative"
            >
              <div className="aspect-4/5 overflow-hidden border border-border shadow-2xl relative z-10">
                <img
                  src={image}
                  alt="Ugo Peters"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 max-medium-tablet:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border border-gold/20 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>
      {/* What I do */}
      <section className="py-32 max-tablet:py-24 px-12 max-mobile:px-4 bg-muted/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-24 max-tablet:mb-16">
            <span className="text-gold uppercase tracking-widest text-xs font-bold mb-4 block">
              Core focus
            </span>
            <h2 className="text-6xl max-medium-mobile:text-5xl font-serif font-bold tracking-tight">
              Strategic Execution
            </h2>
          </div>

          <div className="grid grid-cols-3 max-tablet:grid-cols-2 max-mobile:grid-cols-1 gap-12 max-tablet:gap-8">
            {whatIDo.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-10 max-mobile:p-6 bg-background border border-border hover:border-gold/30 transition-all group"
              >
                <div className="w-14 h-14 border border-gold/20 flex items-center justify-center mb-10 text-gold group-hover:bg-gold group-hover:text-black transition-all">
                  <item.icon size={28} />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-foreground/50">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Ventures & Platforms */}
      <section className="max-tablet:py-24 py-32 px-12 max-mobile:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-between items-end mb-24 max-tablet:mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-gold uppercase tracking-widest text-xs font-bold mb-4 block">
                Current Ventures
              </span>
              <h2 className="text-6xl max-medium-mobile:text-5xl font-serif font-bold tracking-tight">
                Ventures & <span className="text-gold">Platforms</span>
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="px-8 py-4 border border-gold text-gold text-xs uppercase tracking-widest hover:bg-gold hover:text-black transition-all"
            >
              View All Projects
            </Link>
          </div>

          <div className="grid grid-cols-2 max-small-tablet:grid-cols-1 max-tablet:gap-8 gap-16">
            {ventures.map((venture, idx) => (
              <motion.div
                key={venture.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="relative aspect-16/10 overflow-hidden mb-8 border border-border">
                  <img
                    src={venture.image}
                    alt={venture.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link
                      to={venture.link}
                      target="_blank"
                      className="px-8 py-3 bg-gold text-black font-bold uppercase tracking-widest text-xs"
                    >
                      Explore Platform
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between items-start gap-6">
                  <div>
                    <span className="text-gold uppercase tracking-widest text-[10px] font-bold mb-2 block">
                      {venture.category}
                    </span>
                    <h3 className="text-3xl font-serif font-bold mb-4 tracking-tight">
                      {venture.title}
                    </h3>
                    <p className="text-foreground/50 max-w-md leading-relaxed">
                      {venture.desc}
                    </p>
                  </div>
                  <Link
                    to={venture.link}
                    target="_blank"
                    className="w-12 h-12 border border-border flex items-center justify-center text-foreground group-hover:text-gold transition-colors"
                  >
                    <ArrowRight size={24} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Impact Section */}
      <section className="max-tablet:py-24 py-32 px-12 max-mobile:px-4 bg-muted/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 max-small-tablet:grid-cols-1 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-gold uppercase tracking-widest text-xs font-bold mb-4 block">
                Impact
              </span>
              <h2 className="text-6xl max-medium-mobile:text-5xl font-serif font-bold tracking-tight mb-8">
                Transformational Projects
              </h2>
              <p className="text-foreground/70 text-xl leading-relaxed mb-8 font-light italic">
                "Groundbreaking initiatives such as Abuja Apartments and
                HXafrica's tokenization platform demonstrate how innovation can
                expand access while maintaining commercial viability."
              </p>
              <p className="text-foreground/50 text-lg leading-relaxed">
                These projects reflect a commitment to solving structural
                challenges within real estate through scalable and inclusive
                models, ensuring that growth is both sustainable and accessible.
              </p>
            </motion.div>

            <div
              className="relative aspect-4/5 max-small-tablet:w-3/4 max-small-tablet:left-1/2 max-small-tablet:-translate-x-1/2 max-medium-mobile:w-full max-medium-mobile:translate-x-0
            max-medium-mobile:left-0 overflow-hidden border border-border"
            >
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
                alt="Modern Architecture"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="max-tablet:py-24 py-32 px-12 max-mobile:px-4 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-gold uppercase tracking-widest text-xs font-bold mb-6 max-medium-mobile:mb-2 block">
            Get in Touch
          </span>
          <h2 className="text-6xl max-medium-mobile:text-5xl max-small-mobile:text-4xl font-serif font-bold mb-10 max-tablet:mb-0 tracking-tight leading-tight">
            Ready to <span className="text-gold">Collaborate?</span>
          </h2>
          <p className="text-background/50 text-xl max-mobile:text-lg mb-12 leading-relaxed max-w-2xl mx-auto">
            Whether you are looking for strategic mentorship, business
            innovation, or investment opportunities, let's discuss how we can
            drive high-impact outcomes.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-4 px-12 py-6 bg-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all shadow-xl shadow-gold/10"
          >
            <span className="max-small-mobile:hidden">
              Start a conversation
            </span>
            <span className="hidden max-small-mobile:flex">Consultation</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
