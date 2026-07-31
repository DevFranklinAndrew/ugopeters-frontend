import {
  LuCheck,
  LuMail,
  LuMapPin,
  LuSend,
  LuFacebook,
  LuInstagram,
  LuLinkedin,
} from "react-icons/lu";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "../components/Select";
import { useSubmitMessage } from "../hooks/useMessages";
import {
  contactSchema,
  type ContactFormValues,
} from "../schemas/contact.schema";

const REASON_OPTIONS = [
  "Strategic Partnership",
  "Real Estate Consulting",
  "Speaking Engagement",
  "Executive Mentorship",
  "Media Inquiry",
];

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const submit = useSubmitMessage();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      reason: REASON_OPTIONS[0],
      subject: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit((values) =>
    submit.mutate(values, {
      onSuccess: () => {
        setIsSubmitted(true);
        reset();
      },
    }),
  );

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-48 pb-32 max-medium-tablet:pt-32 max-medium-tablet:pb-20 px-12 bg-muted/5 max-mobile:px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-6 block">
              Inquiries
            </span>
            <h1 className="text-8xl max-tablet:text-7xl max-mobile:text-6xl max-small-mobile:text-5xl font-serif font-bold leading-[1.1] mb-8 tracking-tight">
              Let’s Discuss <br />
              <span className="text-gold">The Future</span>
            </h1>
            <p className="text-foreground/60 text-2xl max-w-2xl leading-relaxed font-light max-small-tablet:text-lg">
              Ugo Peters is available for high-level strategic consulting,
              international speaking engagements, and institutional real estate
              partnerships.
            </p>
          </motion.div>
        </div>
      </section>
      {/* Contact Content */}
      <section className="py-32 px-12 max-tablet:py-24 max-mobile:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-24 max-tablet:gap-12 max-tablet:grid-cols-1">
            {/* Contact Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="space-y-16 max-mobile:space-y-10">
                  <div>
                    <h3 className="text-gold uppercase tracking-widest font-bold mb-8">
                      Contact Details
                    </h3>
                    <div className="space-y-8">
                      <div className="flex items-start gap-6 max-mobile:gap-4  group">
                        <div className="w-12 h-12 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all shrink-0">
                          <LuMail size={20} />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest font-bold text-foreground/40 mb-1">
                            Executive Correspondence
                          </p>
                          <a
                            href="mailto:info@ugopeters.com"
                            className="text-2xl font-serif hover:text-gold transition-colors"
                          >
                            info@ugopeters.com
                          </a>
                        </div>
                      </div>
                      {/* <div className="flex items-start gap-6 group">
                        <div className="w-12 h-12 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all shrink-0">
                          <Phone size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-1">
                            Direct Line
                          </p>
                          <p className="text-2xl font-serif">
                            +44 (0) 20 7946 0123
                          </p>
                        </div>
                      </div> */}
                      <div className="flex items-start gap-6 group">
                        <div className="w-12 h-12 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all shrink-0">
                          <LuMapPin size={20} />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest font-bold text-foreground/40 mb-1">
                            Primary Office
                          </p>
                          <p className="text-xl md:text-2xl font-serif">
                            3 Portharcourt Crescent, Area 11, Garki, Abuja.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gold uppercase tracking-widest font-bold mb-8">
                      Professional Network
                    </h3>
                    <div className="flex gap-4">
                      {[
                        {
                          icon: LuFacebook,
                          label: "Facebook",
                          href: "https://web.facebook.com/ugopeters",
                        },
                        {
                          icon: LuLinkedin,
                          label: "Linkedin",
                          href: "https://www.linkedin.com/in/ugo-peters/",
                        },
                        {
                          icon: LuInstagram,
                          label: "Instagram",
                          href: "https://www.instagram.com/1b40_ng?igsh=MTgxN3lveWF4NDZpdg%3D%3D",
                        },
                      ].map((social) => (
                        <a
                          href={social.href}
                          key={social.label}
                          aria-label={social.label}
                          target="_blank"
                          className="w-14 h-14 border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-all"
                        >
                          <social.icon size={24} />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="p-10 max-mobile:p-6 bg-muted/5 border-l-4 border-gold">
                    <p className="text-foreground/70 italic text-lg leading-relaxed">
                      "Confidentiality and professional integrity are the
                      foundations of every executive engagement."
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Form Container */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card border border-border p-12 max-mobile:px-6 shadow-2xl shadow-black/5 relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      className="text-center py-20"
                    >
                      <div className="w-20 h-20 bg-gold text-black flex items-center justify-center mb-8 rounded-full mx-auto">
                        <LuCheck size={32} />
                      </div>
                      <h3 className="text-4xl font-serif font-bold mb-6">
                        Inquiry Received
                      </h3>
                      <p className="text-foreground/50 text-lg leading-relaxed max-w-md mx-auto font-light">
                        Thank you for your interest. Ugo's executive office has
                        received your message and will review it within 48
                        business hours.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="mt-12 text-gold uppercase tracking-widest text-[10px] font-bold border-b border-gold/30 pb-1 hover:border-gold transition-all"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form
                      key="form"
                      onSubmit={onSubmit}
                      noValidate
                      className="space-y-10"
                    >
                      <div className="grid grid-cols-2 gap-10 max-small-tablet:gap-6 max-medium-mobile:grid-cols-1">
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                            Full Name
                          </label>
                          <input
                            type="text"
                            {...register("name")}
                            className="w-full bg-transparent border-b border-border py-3 focus:border-gold focus:outline-none transition-colors text-lg font-serif"
                            placeholder="Ex: Aliko Dangote"
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm font-medium">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                            Reason for Contact
                          </label>
                          <Controller
                            control={control}
                            name="reason"
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={field.onChange}
                                invalid={Boolean(errors.reason)}
                                ariaLabel="Reason for Contact"
                                options={REASON_OPTIONS.map((r) => ({
                                  value: r,
                                  label: r,
                                }))}
                              />
                            )}
                          />
                          {errors.reason && (
                            <p className="text-red-500 text-sm font-medium">
                              {errors.reason.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                          Email Address
                        </label>
                        <input
                          type="email"
                          {...register("email")}
                          className="w-full bg-transparent border-b border-border py-3 focus:border-gold focus:outline-none transition-colors text-lg font-serif"
                          placeholder="Ex: executive@company.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm font-medium">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                          Subject
                        </label>
                        <input
                          type="text"
                          {...register("subject")}
                          className="w-full bg-transparent border-b border-border py-3 focus:border-gold focus:outline-none transition-colors text-lg font-serif"
                          placeholder="Brief summary"
                        />
                        {errors.subject && (
                          <p className="text-red-500 text-sm font-medium">
                            {errors.subject.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                          Message
                        </label>
                        <textarea
                          {...register("message")}
                          rows={5}
                          className="w-full bg-transparent border-b border-border py-3 focus:border-gold focus:outline-none transition-colors text-lg font-serif resize-none"
                          placeholder="Please provide details regarding your proposal..."
                        />
                        {errors.message && (
                          <p className="text-red-500 text-sm font-medium">
                            {errors.message.message}
                          </p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={submit.isPending}
                        className="w-auto max-mobile:w-full px-12 py-6 bg-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all shadow-xl shadow-gold/10 flex items-center justify-center gap-4 group disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {submit.isPending ? "Sending…" : "Send Message"}
                        <LuSend
                          size={18}
                          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      </button>
                    </form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="h-125 max-mobile:h-72 bg-muted/10 relative overflow-hidden opacity-50 hover:opacity-100 transition-all duration-1000">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <LuMapPin
              size={48}
              className="text-gold mx-auto mb-4 animate-bounce"
            />
            <p className="text-gold font-serif text-2xl">
              Garki, Abuja, Nigeria
            </p>
          </div>
        </div>
        <div className="absolute inset-0 border-y border-border pointer-events-none" />
      </section>
    </div>
  );
};
export default Contact;
