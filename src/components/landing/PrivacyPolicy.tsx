import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-black transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="prose prose-slate prose-lg max-w-none">
          <h1 className="text-4xl md:text-5xl font-black text-black mb-8 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-500 font-medium mb-12"><strong>Last updated:</strong> August 28, 2026</p>

          <p>This Privacy Policy explains how Payifi ("we," "us," or "our") collects, uses, and protects your information when you use our website and application (the "Service"). By using the Service, you agree to the practices described here.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">1. Information We Collect</h2>
          <p><strong>Account information:</strong> the email address you use to sign in (via magic-link authentication — we never store passwords).</p>
          <p><strong>Subscription data you enter:</strong> the name, category, cost, currency, billing cycle, renewal date, and any notes for each subscription you choose to track. This data exists solely for you to manage your own tracking — we don't use it for any other purpose.</p>
          <p><strong>Usage data:</strong> basic, privacy-friendly analytics about how the Service is used (e.g., which pages are visited), collected to help us understand what's working and fix what isn't. We do not use invasive tracking pixels or cross-site advertising trackers.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>To operate the Service — display your dashboard, calculate spend summaries, and manage your account</li>
            <li>To send you renewal reminder emails ahead of your subscriptions' renewal dates, via our email delivery provider</li>
            <li>To respond to support requests you send us</li>
            <li>To improve the Service based on aggregate, privacy-friendly usage patterns</li>
          </ul>
          <p>We do <strong>not</strong> use your subscription data or account information to train any AI/ML models, ours or anyone else's.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">3. How We Share Your Information</h2>
          <p><strong>We do not sell your personal data.</strong> We share information only with the infrastructure providers necessary to run the Service:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Our authentication and database provider, to store your account and subscription data securely</li>
            <li>Our email delivery provider, solely to send you renewal reminder emails</li>
          </ul>
          <p>We do not share your data with advertisers, data brokers, or any third party for marketing purposes. We do not run Meta, TikTok, or similar ad-tracking pixels on the Service.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">4. Cookies</h2>
          <p>We use only the minimal cookies necessary for you to stay logged in and for basic, privacy-friendly analytics. We do not use advertising or cross-context tracking cookies.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">5. Data Retention</h2>
          <p>We retain your account and subscription data for as long as your account is active. If you delete your account, we will delete your associated personal data within 30 days, except where retention is required by law.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">6. Your Rights</h2>
          <p>You can view, edit, or delete any subscription entry directly within the app at any time. You may request full account deletion by contacting us at <a href="mailto:hello@payifi.app" className="text-brand-600 hover:underline">hello@payifi.app</a>, and we'll process it within 30 days. If you're in the EEA, UK, or a jurisdiction with similar data protection laws, you may also have rights to access, correct, restrict, or port your data — contact us to exercise these rights.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">7. Security</h2>
          <p>We use industry-standard technical measures (encrypted storage, access-controlled databases) to protect your data. No method of transmission or storage is 100% secure, so we can't guarantee absolute security, but we take reasonable steps to protect your information.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">8. Children's Privacy</h2>
          <p>The Service is not directed at children under 13, and we do not knowingly collect personal data from children under 13. If we learn we've inadvertently collected such data, we will delete it promptly.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">9. International Data Storage</h2>
          <p>Your data may be stored on servers operated by our infrastructure providers, which may be located outside your country of residence. We take reasonable measures to ensure your data remains protected regardless of where it's processed.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Material changes will be reflected in the "Last updated" date above, and continued use of the Service after changes take effect constitutes acceptance of the revised Policy.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">11. Contact Us</h2>
          <p>Questions about this Privacy Policy or your data? Reach us at <a href="mailto:hello@payifi.app" className="text-brand-600 hover:underline">hello@payifi.app</a>.</p>
        </div>
      </div>
    </div>
  );
};
