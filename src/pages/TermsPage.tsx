import React from 'react';
import { FileText } from 'lucide-react';

const TermsPage: React.FC = () => (
  <div className="bg-gray-50 py-16">
    <article className="container mx-auto max-w-3xl px-4">
      <header className="mb-10 text-center"><FileText className="mx-auto mb-4 h-12 w-12 text-indigo-600" /><h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1><p className="mt-3 text-gray-600">Last updated: July 14, 2026</p></header>
      <div className="space-y-8 rounded-lg bg-white p-8 shadow-sm text-gray-700">
        <section><h2 className="text-xl font-semibold text-gray-900">Using Lumina</h2><p className="mt-2">By using Lumina, you agree to provide accurate information, keep your account secure, and use the site only for lawful purposes.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-900">Orders and pricing</h2><p className="mt-2">Product availability and prices can change. An order is accepted when we send confirmation. We may correct obvious pricing or availability errors before an order is fulfilled.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-900">Returns and support</h2><p className="mt-2">For help with an order, contact support@lumina.com with your order number. Any applicable return, refund, and delivery terms are provided during checkout or with your order confirmation.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-900">Updates to these terms</h2><p className="mt-2">We may update these terms as our service changes. Continued use of Lumina after an update means you accept the revised terms.</p></section>
      </div>
    </article>
  </div>
);

export default TermsPage;
