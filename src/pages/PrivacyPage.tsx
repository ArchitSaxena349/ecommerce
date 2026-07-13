import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PrivacyPage: React.FC = () => (
  <div className="bg-gray-50 py-16">
    <article className="container mx-auto max-w-3xl px-4">
      <header className="mb-10 text-center"><ShieldCheck className="mx-auto mb-4 h-12 w-12 text-indigo-600" /><h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1><p className="mt-3 text-gray-600">Last updated: July 14, 2026</p></header>
      <div className="space-y-8 rounded-lg bg-white p-8 shadow-sm text-gray-700">
        <section><h2 className="text-xl font-semibold text-gray-900">Information we collect</h2><p className="mt-2">We collect the contact, account, shipping, and order information you provide when you shop with Lumina. We also collect limited technical information needed to operate and protect the site.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-900">How we use information</h2><p className="mt-2">We use your information to process orders, provide customer support, prevent fraud, improve our services, and send order-related communications.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-900">Payments and service providers</h2><p className="mt-2">Payments are processed by our payment providers. We do not store full card details. We share only the information necessary for payment processing, delivery, analytics, and customer support.</p></section>
        <section><h2 className="text-xl font-semibold text-gray-900">Your choices</h2><p className="mt-2">You may update account information and saved addresses from your account page. To request access to or deletion of personal data, contact support@lumina.com.</p></section>
      </div>
    </article>
  </div>
);

export default PrivacyPage;
