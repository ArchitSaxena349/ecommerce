import React from 'react';
import { Briefcase, Heart, Mail, Sparkles } from 'lucide-react';

const CareersPage: React.FC = () => (
  <div className="bg-gray-50 py-16">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-3xl text-center">
        <Briefcase className="mx-auto mb-4 h-12 w-12 text-indigo-600" />
        <h1 className="text-4xl font-bold text-gray-900">Build the future of shopping with us</h1>
        <p className="mt-5 text-lg text-gray-600">Lumina brings thoughtful products and a smoother shopping experience to customers everywhere.</p>
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
        {[
          { icon: Sparkles, title: 'Make an impact', text: 'Help shape products and experiences that customers use every day.' },
          { icon: Heart, title: 'Grow together', text: 'Work in a supportive team that values curiosity, ownership, and learning.' },
          { icon: Briefcase, title: 'Work with purpose', text: 'Bring your perspective to a business that puts customers first.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-lg bg-white p-6 text-center shadow-sm">
            <Icon className="mx-auto mb-3 h-8 w-8 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-600">{text}</p>
          </div>
        ))}
      </div>
      <section className="mx-auto mt-12 max-w-3xl rounded-lg bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Open applications</h2>
        <p className="mt-3 text-gray-600">We are always interested in meeting people with strengths in customer experience, product, engineering, operations, and merchandising.</p>
        <a href="mailto:careers@lumina.com" className="mt-6 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
          <Mail className="mr-2 h-5 w-5" /> Send your application
        </a>
      </section>
    </div>
  </div>
);

export default CareersPage;
