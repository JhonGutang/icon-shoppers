"use client";

import { motion } from "framer-motion";
import { Users, Sprout, Store } from "lucide-react";

const AboutUs = () => {
  const features = [
    {
      icon: <Sprout className="h-8 w-8 text-green-600" />,
      title: "Fresh from Farmers",
      description: "Direct access to seasonal produce harvested just hours before delivery."
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Community First",
      description: "Every purchase directly supports local families in Pinamungajan and Balamban."
    },
    {
      icon: <Store className="h-8 w-8 text-green-600" />,
      title: "Local Artisans",
      description: "Discover handcrafted goods and unique products made by your neighbors."
    }
  ];

  return (
    <div className="py-28 bg-stone-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-black text-stone-900 mb-4"
          >
            Why Choose Icon Shoppers?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-stone-600"
          >
            We are more than just an e-commerce platform. We are a bridge between local producers and the community.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
            >
              <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{feature.title}</h3>
              <p className="text-stone-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
