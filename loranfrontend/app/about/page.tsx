'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
};

const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8 },
};

const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6 },
};

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <motion.section
        className="relative py-16 md:py-20 px-4 text-center overflow-hidden"
        style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h1
          className="font-bold mb-4"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)", fontSize: "clamp(32px, 9vw, 64px)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          About LORAN
        </motion.h1>
        <motion.p
          className="max-w-2xl mx-auto"
          style={{ color: "var(--muted)", fontSize: "clamp(15px, 4vw, 18px)", lineHeight: 1.7 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Connecting bespoke fashion with talented designers. Get custom, handcrafted wear designed just for you.
        </motion.p>
      </motion.section>

      {/* Mission */}
      <motion.section className="py-16 px-4 max-w-6xl mx-auto" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div variants={slideInLeft}>
            <motion.h2
              className="mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)", fontSize: "clamp(24px, 6vw, 36px)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Our Mission
            </motion.h2>
            <motion.p
              className="text-gray-700 text-lg mb-4"
              variants={staggerItem}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              LORAN is a vibrant community connecting fashion-forward clients with skilled independent designers and tailors. We believe everyone deserves clothing that fits perfectly and reflects their unique style.
            </motion.p>
            <motion.p
              className="text-gray-700 text-lg mb-4"
              variants={staggerItem}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Our platform empowers designers to showcase their work and clients to access bespoke, custom-made garments without the traditional boutique markup.
            </motion.p>
          </motion.div>
          <motion.div
            className="rounded-2xl h-48 md:h-64 flex items-center justify-center text-5xl"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
            variants={slideInRight}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            ✨
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="py-12 md:py-16 px-4"
        style={{ background: "var(--surface)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-16 text-gray-800"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            How LORAN Works
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { num: 1, title: 'Browse', desc: 'Explore our catalogue of unique designs by talented designers', icon: '👀' },
              { num: 2, title: 'Order', desc: 'Select your style and provide measurements for perfect fit', icon: '📋' },
              { num: 3, title: 'Connect', desc: 'Get matched with a skilled tailor who brings your vision to life', icon: '🤝' },
              { num: 4, title: 'Receive', desc: 'Get your custom, bespoke garment delivered to your door', icon: '📦' },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="text-center p-5 md:p-6 rounded-xl transition-all"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                variants={staggerItem}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  {step.icon}
                </motion.div>
                <motion.div
                  className="flex items-center justify-center w-10 h-10 rounded-full font-bold mx-auto mb-3"
                  style={{ background: "var(--accent)", color: "var(--highlight)" }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  {step.num}
                </motion.div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>{step.title}</h3>
                <p className="text-sm" style={{ color: "var(--muted)" }}>{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Client & Designer Benefits */}
      <motion.section className="py-16 px-4 max-w-6xl mx-auto" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
        <motion.h2
          className="text-4xl font-bold text-center mb-16 text-gray-800"
          variants={fadeInUp}
        >
          Why Join LORAN?
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Clients */}
          <motion.div
            className="p-6 md:p-8 rounded-2xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
          >
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", color: "var(--highlight)" }}>
              👗 For Clients
            </h3>
            <ul className="space-y-4 text-gray-700">
              {[
                { title: 'Bespoke Quality', desc: 'Custom-designed garments made specifically for you' },
                { title: 'Perfect Fit', desc: 'Precise measurements ensure clothing that fits like a glove' },
                { title: 'Affordability', desc: 'Direct connection with designers means better prices' },
                { title: 'Uniqueness', desc: 'Stand out with one-of-a-kind pieces' },
                { title: 'AI Try-On', desc: 'Visualize designs before ordering' },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  className="flex gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <motion.span style={{ color: "var(--highlight)", fontWeight: "bold" }}>✓</motion.span>
                  <span style={{ color: "var(--muted)" }}><strong style={{ color: "var(--text)" }}>{item.title}:</strong> {item.desc}</span>
                </motion.li>
              ))}
            </ul>
            <motion.button
              onClick={() => router.push('/catalogue')}
              className="mt-8 w-full py-3 font-semibold"
              style={{ background: "var(--highlight)", color: "#0E2A22", borderRadius: "3px" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Shopping
            </motion.button>
          </motion.div>

          {/* Designers */}
          <motion.div
            className="p-6 md:p-8 rounded-2xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
          >
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", color: "var(--highlight)" }}>
              ✂️ For Designers
            </h3>
            <ul className="space-y-4 text-gray-700">
              {[
                { title: 'Showcase Talent', desc: 'Build your portfolio and reputation' },
                { title: 'Direct Sales', desc: 'No middlemen, keep more of your earnings' },
                { title: 'Growing Community', desc: 'Access to an expanding client base' },
                { title: 'Flexible Pricing', desc: 'Set your own rates and terms' },
                { title: 'Easy Management', desc: 'Track orders and client communications in one place' },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  className="flex gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <motion.span style={{ color: "var(--highlight)", fontWeight: "bold" }}>✓</motion.span>
                  <span style={{ color: "var(--muted)" }}><strong style={{ color: "var(--text)" }}>{item.title}:</strong> {item.desc}</span>
                </motion.li>
              ))}
            </ul>
            <motion.button
              onClick={() => router.push('/signup')}
              className="mt-8 w-full py-3 font-semibold"
              style={{ background: "var(--highlight)", color: "#0E2A22", borderRadius: "3px" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join as Designer
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Community Stats */}
      <motion.section
        className="py-12 md:py-16 px-4"
        style={{ background: "var(--surface)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Our Growing Community
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-4 gap-8 text-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { num: '500+', label: 'Active Designers' },
              { num: '10K+', label: 'Happy Clients' },
              { num: '50K+', label: 'Custom Orders' },
              { num: '98%', label: 'Satisfaction Rate' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ scale: 1.1, y: -10 }}
              >
                <motion.div className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--highlight)" }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  {stat.num}
                </motion.div>
                <p className="text-sm md:text-base" style={{ color: "var(--muted)" }}>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Process Details */}
      <motion.section
        className="py-16 px-4 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-4xl font-bold text-center mb-12 text-gray-800"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          The Bespoke Process
        </motion.h2>
        <motion.div
          className="p-6 md:p-8 rounded-2xl"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "var(--highlight)" }}>For Clients</h3>
              <ol className="space-y-4 text-gray-700">
                {[
                  { num: 1, title: 'Browse Designs', desc: 'Explore the catalogue of unique pieces by talented designers' },
                  { num: 2, title: 'Add Measurements', desc: 'Provide your measurements for perfect fit (or use AI Try-On)' },
                  { num: 3, title: 'Place Order', desc: 'Confirm order details and make payment securely' },
                  { num: 4, title: 'Get Matched', desc: 'We connect you with the perfect designer/tailor for your style' },
                  { num: 5, title: 'Receive Custom Wear', desc: 'Your bespoke garment arrives, perfectly tailored' },
                ].map((step, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <span className="font-bold text-lg" style={{ color: "var(--highlight)" }}>{step.num}.</span>
                    <span style={{ color: "var(--muted)" }}><strong style={{ color: "var(--text)" }}>{step.title}:</strong> {step.desc}</span>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "var(--highlight)" }}>For Designers</h3>
              <ol className="space-y-4 text-gray-700">
                {[
                  { num: 1, title: 'Set Up Profile', desc: 'Create your designer profile with portfolio and rates' },
                  { num: 2, title: 'Upload Designs', desc: 'Showcase your best work and design styles' },
                  { num: 3, title: 'Receive Orders', desc: 'Get matched with clients who love your aesthetic' },
                  { num: 4, title: 'Craft Bespoke Wear', desc: 'Create custom garments tailored to client specs' },
                  { num: 5, title: 'Get Paid', desc: 'Receive payment directly once order is confirmed complete' },
                ].map((step, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <span className="font-bold text-lg" style={{ color: "var(--highlight)" }}>{step.num}.</span>
                    <span style={{ color: "var(--muted)" }}><strong style={{ color: "var(--text)" }}>{step.title}:</strong> {step.desc}</span>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-4xl font-bold mb-6 text-gray-800"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          Ready to Start Your Bespoke Journey?
        </motion.h2>
        <motion.p
          className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Join thousands of clients and designers who are transforming the way custom fashion is made and sold.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => router.push('/catalogue')}
            className="px-8 py-4 font-semibold text-base"
            style={{ background: "var(--highlight)", color: "#0E2A22", borderRadius: "3px" }}
            variants={staggerItem}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Shop Designs
          </motion.button>
          <motion.button
            onClick={() => router.push('/designers')}
            className="px-8 py-4 font-semibold text-base"
            style={{ border: "1px solid var(--border)", color: "var(--text)", borderRadius: "3px" }}
            variants={staggerItem}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Designers
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Footer Contact */}
      <motion.section
        className="py-10 px-4 text-center"
        style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.h3
          className="text-2xl font-bold mb-4"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          Get in Touch
        </motion.h3>
        <motion.p
          className="mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Have questions? We'd love to hear from you!
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.a
            href="mailto:hello@loran.com" className="transition" style={{ color: "var(--muted)" }}
            variants={staggerItem}
            whileHover={{ scale: 1.1 }}
          >
            📧 hello@loran.com
          </motion.a>
          <motion.span variants={staggerItem}>•</motion.span>
          <motion.a
            href="tel:+2341234567890" className="transition" style={{ color: "var(--muted)" }}
            variants={staggerItem}
            whileHover={{ scale: 1.1 }}
          >
            📱 +234 (0) 123 456 7890
          </motion.a>
        </motion.div>
      </motion.section>
    </div>
  );
}
