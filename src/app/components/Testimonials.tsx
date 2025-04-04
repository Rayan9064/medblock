'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Marquee from 'react-fast-marquee';

const testimonials = [
  {
    text: "MedBlock ensures my medical history is always accessible, no matter where I am. No more lost reports or paperwork!",
    author: {
      name: "Emily Carter",
      handle: "emilyc",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    text: "As a doctor, quick and secure access to patient history is a game changer. MedBlock eliminates unnecessary delays in treatment.",
    author: {
      name: "Dr. Raj Mehta",
      handle: "drrajm",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    text: "Our hospital has greatly benefited from MedBlock’s decentralized storage. Secure, tamper-proof records make compliance effortless.",
    author: {
      name: "Jessica Thompson",
      handle: "jessicat",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    text: "Verifying patient records for research has never been easier. MedBlock provides transparency while maintaining privacy.",
    author: {
      name: "Dr. Alan Foster",
      handle: "dralanf",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
];


function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <Card className="p-6 mx-4 w-[350px] bg-white dark:bg-black/[0.9]">
      <p className="text-zinc-400 mb-4">{testimonial.text}</p>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={testimonial.author.avatar} alt={testimonial.author.name} />
          <AvatarFallback>{testimonial.author.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="pt-0.5 text-sm leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-lg md:leading-[1.875rem] text-balance bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-orange-500 bg-clip-text text-transparent">{testimonial.author.name}</p>
          <p className="text-sm text-gray-400">@{testimonial.author.handle}</p>
        </div>
      </div>
    </Card>
  );
}

export function TestimonialSection() {
  return (
    <section className="py-20 px-4 md:px-8 overflow-hidden bg-purple-950/10 dark:bg-purple-800/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="max-w-7xl mx-auto">
      <motion.h2 
        className="text-4xl tracking-tighter font-geist bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 text-center pt-2 mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Real Stories from <br />
        Patients, Doctors, and Healthcare Providers
      </motion.h2>
      
      <div className="relative">
        <Marquee
        gradient={false}
        speed={40}
        pauseOnHover={true}
        className="py-4"
        >
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
        </Marquee>
      </div>
      </div>
    </section>
  );
}