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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <motion.section
        className="py-20 px-4 text-center bg-gradient-to-r from-pink-600 to-indigo-600 text-white"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h1
          className="text-6xl font-bold mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          About LORAN
        </motion.h1>
        <motion.p
          className="text-xl max-w-2xl mx-auto"
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
              className="text-4xl font-bold mb-6 text-gray-800"
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
            className="bg-gradient-to-br from-pink-200 to-indigo-200 rounded-2xl h-64 flex items-center justify-center text-5xl"
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
        className="py-16 px-4 bg-white"
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
            className="grid md:grid-cols-4 gap-8"
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
                className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition"
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
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold mx-auto mb-3"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  {step.num}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
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
            className="bg-gradient-to-br from-pink-100 to-pink-50 p-8 rounded-2xl border border-pink-200"
            variants={slideInLeft}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(236, 72, 153, 0.2)' }}
          >
            <h3 className="text-3xl font-bold mb-6 text-pink-600 flex items-center gap-2">
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
                  <motion.span className="text-pink-600 font-bold">✓</motion.span>
                  <span><strong>{item.title}:</strong> {item.desc}</span>
                </motion.li>
              ))}
            </ul>
            <motion.button
              onClick={() => router.push('/catalogue')}
              className="mt-8 w-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Shopping
            </motion.button>
          </motion.div>

          {/* Designers */}
          <motion.div
            className="bg-gradient-to-br from-indigo-100 to-indigo-50 p-8 rounded-2xl border border-indigo-200"
            variants={slideInRight}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)' }}
          >
            <h3 className="text-3xl font-bold mb-6 text-indigo-600 flex items-center gap-2">
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
                  <motion.span className="text-indigo-600 font-bold">✓</motion.span>
                  <span><strong>{item.title}:</strong> {item.desc}</span>
                </motion.li>
              ))}
            </ul>
            <motion.button
              onClick={() => router.push('/signup')}
              className="mt-8 w-full bg-gradient-to-r from-indigo-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg"
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
        className="py-16 px-4 bg-gradient-to-r from-pink-600 to-indigo-600 text-white"
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
                <motion.div
                  className="text-5xl font-bold mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  {stat.num}
                </motion.div>
                <p className="text-lg opacity-90">{stat.label}</p>
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
          className="bg-gradient-to-r from-pink-50 to-indigo-50 p-8 rounded-2xl border border-pink-200"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <h3 className="text-2xl font-bold mb-4 text-pink-600">For Clients</h3>
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
                    <span className="font-bold text-pink-600 text-lg">{step.num}.</span>
                    <span><strong>{step.title}:</strong> {step.desc}</span>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <h3 className="text-2xl font-bold mb-4 text-indigo-600">For Designers</h3>
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
                    <span className="font-bold text-indigo-600 text-lg">{step.num}.</span>
                    <span><strong>{step.title}:</strong> {step.desc}</span>
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
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg"
            variants={staggerItem}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Shop Designs
          </motion.button>
          <motion.button
            onClick={() => router.push('/designers')}
            className="px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold text-lg hover:shadow-lg"
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
        className="py-12 px-4 bg-gray-900 text-white text-center"
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
            href="mailto:hello@loran.com"
            className="hover:text-pink-400 transition"
            variants={staggerItem}
            whileHover={{ scale: 1.1 }}
          >
            📧 hello@loran.com
          </motion.a>
          <motion.span variants={staggerItem}>•</motion.span>
          <motion.a
            href="tel:+2341234567890"
            className="hover:text-pink-400 transition"
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
