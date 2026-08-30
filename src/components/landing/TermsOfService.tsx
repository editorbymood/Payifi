import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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
          <h1 className="text-4xl md:text-5xl font-black text-black mb-8 tracking-tight">Terms of Service</h1>
          <p className="text-slate-500 font-medium mb-12"><strong>Last updated:</strong> August 28, 2026</p>

          <p>Welcome to Payifi. These Terms of Service ("Terms") govern your access to and use of the Payifi website and application (collectively, the "Service"), operated by Payifi ("we," "us," or "our"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use the Service.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">1. Eligibility</h2>
          <p>You must be at least 13 years old to use the Service. If you are between 13 and 18, you may only use the Service with the consent and supervision of a parent or guardian. By using the Service, you confirm that you meet this requirement.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">2. What Payifi Does</h2>
          <p>Payifi helps you keep track of your personal subscriptions — the services you're paying for, when they renew, and what they cost — and sends you email reminders ahead of upcoming renewal dates.</p>
          <p><strong>Payifi does not process payments, charge you, or charge any subscription on your behalf.</strong> All subscription details (name, cost, renewal date, etc.) are manually entered by you for your own tracking purposes. We have no relationship with, and cannot cancel, modify, or affect, any third-party subscription you track in the app.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">3. Your Account</h2>
          <p>You're responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. Notify us promptly if you suspect unauthorized access.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to access data or accounts that aren't yours</li>
            <li>Interfere with or disrupt the Service's security or infrastructure</li>
            <li>Use automated scripts to scrape or extract data from the Service</li>
          </ul>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">5. Your Content</h2>
          <p>You retain full ownership of the subscription data and any other information you enter into Payifi. By using the Service, you grant us a limited, non-exclusive license to store and process that data solely for the purpose of operating the Service for you (e.g., displaying your dashboard, sending your renewal reminders). We do not use your subscription data for any purpose beyond providing the Service to you.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">6. Third-Party Services</h2>
          <p>Payifi relies on third-party infrastructure providers to operate — including authentication and database hosting, and email delivery for renewal reminders. Your use of the Service is also subject to those providers' own terms where applicable. We are not responsible for outages or failures originating from third-party infrastructure, though we'll do our best to keep things running smoothly.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">7. No Financial Advice</h2>
          <p>Payifi is a personal organization and reminder tool. It does not provide financial, budgeting, or investment advice. Any totals, summaries, or spend calculations shown in the app are based solely on the data you enter and are provided for informational convenience only. You are responsible for verifying accuracy and for your own financial decisions.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">8. Fees</h2>
          <p>Payifi is currently free to use during its early/waitlist stage. If we introduce paid plans in the future, we will provide clear notice before any charges apply, and continued use of paid features after that point will constitute acceptance of the then-current pricing terms.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">9. Termination</h2>
          <p>We may suspend or terminate your access to the Service at any time, with or without notice, particularly in cases of misuse or violation of these Terms. You may stop using the Service and request account deletion at any time (see our Privacy Policy).</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">10. Disclaimer of Warranties</h2>
          <p>The Service is provided "as is" and "as available," without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee that reminder emails will always be delivered on time or at all — third-party email delivery can fail, and important renewals should still be independently verified by you.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">11. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages — including any subscription charge you incur because a reminder email was delayed, undelivered, or inaccurate. Payifi is a convenience tool, not a guarantee against unwanted renewals.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">12. Changes to the Service and These Terms</h2>
          <p>We may update these Terms or modify the Service at any time. Material changes will be reflected by an updated "Last updated" date above. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">13. Governing Law</h2>
          <p>These Terms are governed by the laws of India, and any disputes arising from these Terms will be subject to the exclusive jurisdiction of the courts of New Delhi, India.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">14. Contact</h2>
          <p>Questions about these Terms? Reach us at <a href="mailto:hello@payifi.app" className="text-brand-600 hover:underline">hello@payifi.app</a>.</p>
        </div>
      </div>
    </div>
  );
};
