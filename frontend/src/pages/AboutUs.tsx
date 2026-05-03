import React from 'react';
import { motion } from 'motion/react';
import { Users, Globe, Award, Heart, Mail, Twitter, Linkedin, Github } from 'lucide-react';

const teamMembers = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Founder',
    image: '/team/member1.png',
    bio: 'Passionate about democratizing education through AI. Former educator with 10+ years experience.',
    social: { twitter: '#', linkedin: '#', github: '#' }
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CTO',
    image: '/team/member2.png',
    bio: 'AI researcher and full-stack architect. Obsessed with building intuitive learning experiences.',
    social: { twitter: '#', linkedin: '#', github: '#' }
  },
  {
    name: 'Elena Volkov',
    role: 'Head of Design',
    image: '/team/member3.png',
    bio: 'Visual storyteller focused on making complex educational data beautiful and accessible.',
    social: { twitter: '#', linkedin: '#', github: '#' }
  },
  {
    name: 'David Okafor',
    role: 'Product Lead',
    image: '/team/member4.png',
    bio: 'Strategic thinker dedicated to student success and product-led growth.',
    social: { twitter: '#', linkedin: '#', github: '#' }
  }
];

export const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-20 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-[-10%] w-[35%] h-[35%] bg-purple-500/10 rounded-full blur-[110px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Hero Section - Clean Modern Redesign */}
        <div className="relative pt-24 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-center max-w-5xl mx-auto px-4"
          >
            {/* Clean, Elegant Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-8 leading-[1.1]">
              Empowering Students <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">
                Through Innovation
              </span>
            </h1>

            {/* Refined Description Card */}
            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-12">
                We believe that every student deserves a <span className="text-slate-900 dark:text-white font-bold">personalized learning experience</span>. 
                Acadify was built to turn static study materials into <span className="text-indigo-600 dark:text-indigo-400 font-bold">interactive, AI-powered tools</span> that adapt to how you learn.
              </p>
              
              {/* Subtle visual divider */}
              <div className="flex justify-center items-center gap-4">
                <div className="h-px w-12 bg-slate-200 dark:bg-slate-800" />
                <Users className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                <div className="h-px w-12 bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </motion.div>
        </div>
        {/* Team Section */}
        <div id="team">
          <div className="text-center mb-20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-8 py-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-xl"
            >
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Team</span>
              </h2>
              <div className="mx-auto h-2 w-20 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 mb-6" />
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                A diverse group of educators, designers, and engineers working together to reshape the future of study.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 border border-slate-200 dark:border-white/10 shadow-2xl">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                  
                  {/* Social Links on Hover */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-center gap-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                    <a href={member.social.twitter} className="w-10 h-10 rounded-full bg-slate-900/50 flex items-center justify-center text-white hover:bg-white hover:text-indigo-600 transition-all">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href={member.social.linkedin} className="w-10 h-10 rounded-full bg-slate-900/50 flex items-center justify-center text-white hover:bg-white hover:text-indigo-600 transition-all">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href={member.social.github} className="w-10 h-10 rounded-full bg-slate-900/50 flex items-center justify-center text-white hover:bg-white hover:text-indigo-600 transition-all">
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{member.name}</h4>
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-3">{member.role}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-12 rounded-[3rem] bg-indigo-600 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[140%] bg-white/20 rounded-full blur-[50px]" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Want to join our mission?</h2>
            <p className="text-indigo-100 mb-10 text-lg max-w-xl mx-auto">
              We're always looking for passionate individuals to help us build the next generation of educational tools.
            </p>
            <button className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl">
              View Openings
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
