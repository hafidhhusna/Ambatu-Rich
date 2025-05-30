'use client';

import type React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Star,
  Users,
  Coffee,
} from 'lucide-react';
import teamImage from '/public/images/home.png';

export default function AboutUs() {
  const teamMembers = [
    {
      name: 'Hafidh Husna',
      role: 'AI Engineer | Cloud Engineer | Project Manager',
      description:
        'Experienced in AI/ML systems and cloud infrastructure. Leading project management with modern methodologies and ensuring scalable deployment solutions.',
      image: teamImage,
      skills: [
        'AI/ML',
        'Cloud Architecture',
        'Database Design',
        'Project Management',
        'Kanban',
      ],
      contributions: [
        'Merancang Deployment Environment',
        'Merancang Skema Database untuk Aplikasi',
        'Menentukan Model AI yang akan Digunakan Sesuai dengan Kebutuhan',
        'Menentukan Alur Pengerjaan, Melakukan Review Progress dalam Tim dengan Kanban Board',
      ],
      social: {
        github: '#',
        linkedin: '#',
        twitter: '#',
        email: 'hafidh@ambaturich.com',
      },
    },
    {
      name: 'Mahsa Quereda Bahjah',
      role: 'Software Engineer | CI/CD | UI/UX',
      description:
        'Full-stack developer specializing in modern web technologies with expertise in DevOps practices and user interface design.',
      image: teamImage,
      skills: [
        'React',
        'CI/CD',
        'Figma',
        'Frontend/Backend Integration',
        'Deployment',
      ],
      contributions: [
        'Slicing UI/UX dari Figma',
        'Integrasi FE dan BE',
        'Handle Deployment',
        'Membuat UI project',
      ],
      social: {
        github: '#',
        linkedin: '#',
        twitter: '#',
        email: 'mahsaqueredabahjah@mail.ugm.ac.id',
      },
    },
    {
      name: 'Brian Tirafi Aufauzan',
      role: 'UI/UX Designer | Software Engineer',
      description:
        'Creative frontend developer with strong design sensibilities. Specializes in creating beautiful user interfaces and implementing complex data visualizations.',
      image: teamImage,
      skills: [
        'UI/UX Design',
        'Frontend Development',
        'Data Visualization',
        'React',
        'JavaScript',
      ],
      contributions: [
        'Membuat UI project',
        'Front-End side development',
        'Implementasi data visualization',
      ],
      social: {
        github: '#',
        linkedin: '#',
        twitter: '#',
        email: 'brian@ambaturich.com',
      },
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <main className="flex-1">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="text-center py-16 md:py-24">
            <div className="animate-fade-in-up max-w-4xl mx-auto">
              <Badge
                variant="outline"
                className="mb-6 px-4 py-2 text-sm font-medium"
              >
                About Ambatu Rich
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-8 leading-tight">
                Meet Our Development Team
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
                We are a dedicated team of Indonesian developers passionate
                about creating innovative financial technology solutions. Our
                combined expertise in AI, cloud infrastructure, and modern web
                development drives the success of Ambatu Rich.
              </p>
            </div>
          </section>

          {/* Team Members Section */}
          <section className="pb-16 md:pb-24">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Our Development Team
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed px-4">
                Meet the talented developers behind Ambatu Rich, each bringing
                unique expertise in technology, design, and project management
                to deliver exceptional financial solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden"
                >
                  <CardContent className="p-6">
                    {/* Profile Image Section */}
                    <div className="text-center mb-6">
                      <div className="relative mb-4">
                        <div className="w-28 h-28 mx-auto rounded-full overflow-hidden ring-4 ring-blue-100 dark:ring-blue-900 group-hover:ring-blue-200 dark:group-hover:ring-blue-800 transition-all duration-300">
                          <Image
                            src={member.image}
                            alt={member.name}
                            width={112}
                            height={112}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-green-500 rounded-full border-3 border-white dark:border-gray-800"></div>
                      </div>
                    </div>

                    {/* Name and Role Section */}
                    <div className="text-center mb-5">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                        {member.name}
                      </h3>
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3 leading-snug">
                        {member.role}
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="mb-5">
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-center px-2">
                        {member.description}
                      </p>
                    </div>

                    {/* Contributions Section */}
                    <div className="mb-5">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 text-center">
                        Key Contributions
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <ul className="space-y-2">
                          {member.contributions.map(
                            (contribution, contribIndex) => (
                              <li
                                key={contribIndex}
                                className="flex items-start text-left"
                              >
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
                                  {contribution}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 text-center">
                        Technical Skills
                      </h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {member.skills.map((skill, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            variant="secondary"
                            className="text-xs px-3 py-1 font-medium"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Social Links Section */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-9 h-9 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Github className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-9 h-9 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-9 h-9 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Twitter className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-9 h-9 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
