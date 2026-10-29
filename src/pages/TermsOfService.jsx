
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Scale,
  ShieldCheck,
  UserRound,
  BriefcaseBusiness,
  BrainCircuit,
  CreditCard,
  LockKeyhole,
  FileText,
  AlertTriangle,
  Ban,
  Globe,
  Mail,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  Gavel,
} from "lucide-react";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    icon: CheckCircle2,
    content: [
      "Welcome to Quantahire. These Terms of Service govern your access to and use of the Quantahire website, applications, recruitment tools, and related services.",
      "By creating an account, accessing our platform, or using any of our services, you agree to be bound by these Terms of Service and our Privacy Policy.",
      "If you do not agree with these terms, you should not use the platform.",
      "You must have the legal capacity to enter into a binding agreement and meet any applicable age or eligibility requirements to use Quantahire.",
    ],
  },
  {
    id: "services",
    title: "2. Description of Services",
    icon: Globe,
    content: [
      "Quantahire is a technology-driven recruitment platform designed to connect job seekers with employers and recruitment organizations.",
      "Our services may include job discovery, job listings, candidate profiles, recruitment management, intelligent job matching, AI-assisted career tools, and subscription-based features.",
      "Some features may be introduced, modified, restricted, or discontinued as the platform evolves.",
      "Quantahire acts as a technology platform and does not automatically become a party to employment agreements between candidates and employers.",
    ],
  },
  {
    id: "accounts",
    title: "3. User Accounts and Registration",
    icon: UserRound,
    content: [
      "Users may register as job seekers or employers, depending on the services they intend to access.",
      "You agree to provide accurate, complete, and up-to-date information during registration and throughout your use of the platform.",
      "You are responsible for maintaining the confidentiality of your login credentials and for activities conducted through your account.",
      "You must not impersonate another person, create fraudulent accounts, or use another user's account without authorization.",
      "If you suspect unauthorized access to your account, you should notify Quantahire promptly.",
    ],
  },
  {
    id: "job-seekers",
    title: "4. Responsibilities of Job Seekers",
    icon: UserRound,
    content: [
      "Job seekers are responsible for ensuring that information submitted through their profiles, resumes, applications, and professional portfolios is accurate and truthful.",
      "You must not submit false qualifications, fabricated work experience, misleading credentials, or information belonging to another person without authorization.",
      "You are responsible for reviewing job descriptions, employer requirements, application instructions, and employment conditions before applying.",
      "Using Quantahire does not guarantee job placement, interviews, employment offers, or any particular recruitment outcome.",
    ],
  },
  {
    id: "employers",
    title: "5. Responsibilities of Employers",
    icon: BriefcaseBusiness,
    content: [
      "Employers and recruitment organizations must provide accurate company information and publish genuine employment opportunities.",
      "Job listings must not contain misleading compensation information, fraudulent opportunities, discriminatory requirements prohibited by applicable law, or unlawful recruitment conditions.",
      "Employers are responsible for their recruitment decisions, communications, interviews, employment offers, and compliance with applicable employment and data protection laws.",
      "Candidate information accessed through Quantahire must only be used for legitimate recruitment purposes and must not be sold, misused, or disclosed without a lawful basis.",
      "Quantahire may review, restrict, or remove job listings or employer accounts that appear to violate these terms.",
    ],
  },
  {
    id: "ai",
    title: "6. AI-Powered Matching and Automated Tools",
    icon: BrainCircuit,
    content: [
      "Quantahire may provide intelligent job recommendations, candidate matching, AI-assisted recruitment tools, and automated workflows.",
      "These technologies may use information such as skills, experience, qualifications, preferences, and job requirements to generate recommendations.",
      "AI-generated outputs are informational and should not be treated as guarantees of suitability, hiring success, or employment eligibility.",
      "Users remain responsible for reviewing AI-generated recommendations, application materials, and other automated outputs before relying on them.",
      "Where automated application features are offered, users must only use them in ways permitted by applicable law and the rules of relevant third-party platforms.",
      "Quantahire may impose reasonable limits on automated features to maintain security, reliability, and responsible use.",
    ],
  },
  {
    id: "subscriptions",
    title: "7. Subscriptions and Paid Services",
    icon: CreditCard,
    content: [
      "Certain Quantahire features may require a paid subscription or other payment.",
      "Subscription plans, available features, billing intervals, applicable taxes, and prices will be displayed before purchase.",
      "By purchasing a paid service, you authorize the applicable payment provider to process the charges associated with your selected plan.",
      "If a subscription renews automatically, the renewal terms and cancellation instructions will be disclosed during checkout.",
      "You are responsible for maintaining valid payment information and reviewing the terms of the subscription you select.",
      "Quantahire may modify subscription prices or features, subject to applicable notice requirements and consumer protection laws.",
    ],
  },
  {
    id: "refunds",
    title: "8. Cancellation and Refunds",
    icon: RefreshCw,
    content: [
      "Users may cancel subscriptions according to the cancellation options and conditions presented with their selected plan.",
      "Unless otherwise stated at purchase, cancellation of a recurring subscription ordinarily prevents future renewals rather than automatically refunding the current billing period.",
      "Refund eligibility depends on the applicable plan terms, the circumstances of the transaction, and mandatory consumer protection laws.",
      "Where a refund is required by applicable law, those legal rights will take precedence over conflicting provisions in these terms.",
      "For billing disputes or refund requests, users should contact Quantahire through the official support channels.",
    ],
  },
  {
    id: "acceptable-use",
    title: "9. Acceptable Use",
    icon: ShieldCheck,
    content: [
      "You agree to use Quantahire only for lawful purposes and in accordance with these Terms of Service.",
      "You must not use the platform to conduct fraud, distribute malware, harvest personal information, send unsolicited bulk messages, or interfere with other users.",
      "You must not attempt unauthorized access to accounts, databases, infrastructure, or restricted platform features.",
      "Automated scraping, excessive requests, or attempts to bypass platform security controls are prohibited unless expressly authorized.",
      "You must not publish content that infringes intellectual property rights or violates applicable laws.",
    ],
  },
  {
    id: "content",
    title: "10. User Content and Intellectual Property",
    icon: FileText,
    content: [
      "Users retain ownership of content they lawfully submit, including resumes, professional information, company descriptions, and job postings.",
      "By submitting content, you grant Quantahire a non-exclusive license to host, store, process, reproduce, and display that content to the extent reasonably necessary to provide the services and features you choose to use.",
      "You represent that you have the necessary rights and permissions to upload and share the content you submit.",
      "The Quantahire name, branding, software, website design, and proprietary platform technologies remain the property of their respective owners and are protected by applicable intellectual property laws.",
      "You may not reproduce, redistribute, reverse engineer, or commercially exploit protected platform materials except where permitted by law or expressly authorized.",
    ],
  },
  {
    id: "privacy",
    title: "11. Privacy and Data Protection",
    icon: LockKeyhole,
    content: [
      "Your use of Quantahire is also governed by our Privacy Policy, which describes how personal information is collected, used, stored, and shared.",
      "Quantahire aims to handle personal information in accordance with applicable data protection requirements, including relevant Kenyan data protection laws.",
      "Users must respect the privacy and confidentiality of information obtained through the platform.",
      "Employers and other recipients of candidate information may have independent legal obligations regarding the personal information they receive.",
    ],
  },
  {
    id: "third-party",
    title: "12. Third-Party Services",
    icon: Globe,
    content: [
      "Quantahire may integrate with third-party services, including payment processors, authentication providers, cloud hosting providers, and external recruitment platforms.",
      "Your use of third-party websites and services may be subject to their separate terms and privacy policies.",
      "Quantahire does not control third-party websites and is not responsible for their independent policies, content, or actions, except where responsibility is imposed by applicable law.",
      "Users should review the terms of any third-party services they choose to access.",
    ],
  },
  {
    id: "disclaimer",
    title: "13. Disclaimers",
    icon: AlertTriangle,
    content: [
      "Quantahire strives to provide a reliable, secure, and useful recruitment platform, but services may occasionally be interrupted, delayed, or unavailable.",
      "We do not guarantee that every job listing, employer profile, candidate profile, or AI-generated recommendation will be accurate, complete, or suitable for a particular purpose.",
      "Quantahire does not guarantee employment, candidate availability, hiring outcomes, or the conduct of other platform users.",
      "To the extent permitted by applicable law, services are provided on an as-available basis without warranties that cannot reasonably be guaranteed.",
      "Nothing in these terms excludes warranties, obligations, or protections that cannot lawfully be excluded.",
    ],
  },
  {
    id: "liability",
    title: "14. Limitation of Liability",
    icon: Scale,
    content: [
      "To the extent permitted by applicable law, Quantahire is not responsible for indirect or consequential losses arising from the use of the platform, including lost opportunities, lost profits, or business interruption.",
      "Quantahire is not responsible for independent employment decisions or unlawful conduct by employers, candidates, or third parties solely because they interact through the platform.",
      "These limitations do not exclude liability that cannot legally be limited or excluded, including liability arising from fraud or other non-excludable legal obligations.",
      "Your statutory rights and remedies remain unaffected where applicable law requires them.",
    ],
  },
  {
    id: "termination",
    title: "15. Account Suspension and Termination",
    icon: Ban,
    content: [
      "Quantahire may suspend, restrict, or terminate accounts where there is a reasonable basis to believe that these terms have been violated, fraudulent activity has occurred, or platform security is at risk.",
      "We may remove misleading job postings, abusive content, or other materials that violate our policies.",
      "Users may request account closure through available account settings or official support channels.",
      "Following account termination, certain information may be retained where necessary for legal compliance, dispute resolution, security, or other lawful purposes.",
      "Where appropriate and legally required, we will provide notice or an opportunity to challenge account restrictions.",
    ],
  },
  {
    id: "changes",
    title: "16. Changes to These Terms",
    icon: RefreshCw,
    content: [
      "Quantahire may update these Terms of Service to reflect changes in our platform, business operations, legal obligations, or available features.",
      "When material changes are made, we will provide appropriate notice where required by law.",
      "The effective date displayed on this page indicates when the current version became applicable.",
      "If you do not agree with updated terms, you should discontinue using the affected services and may request account closure.",
    ],
  },
  {
    id: "law",
    title: "17. Governing Law and Disputes",
    icon: Gavel,
    content: [
      "These Terms of Service are intended to be interpreted in accordance with the applicable laws of Kenya, subject to mandatory legal protections that may apply to users in other jurisdictions.",
      "If a dispute arises, users are encouraged to contact Quantahire first so that the matter can be reviewed and an appropriate resolution attempted.",
      "Nothing in these terms prevents users from exercising rights to approach competent courts, regulators, or other authorities where permitted by law.",
    ],
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#F8F9FF] text-slate-800">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-[#18124A] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#18124A] via-[#34238C] to-[#5145E5]" />

        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#14E0C8]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-indigo-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 lg:px-12 lg:pb-24 lg:pt-16">
          <Link
            to="/"
            className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-indigo-100 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to home
          </Link>

          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#14E0C8]/30 bg-[#14E0C8]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#6FFFEF]">
              <Scale size={16} />
              Legal & platform guidelines
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Terms of{" "}
              <span className="text-[#14E0C8]">Service</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-indigo-100/85 sm:text-lg">
              Please read these terms carefully to understand
              your rights, responsibilities, and the conditions
              for using Quantahire's recruitment platform.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-indigo-100">
                Effective: October 29, 2026
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-indigo-100">
                Applies to job seekers & employers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#18124A]">
                On this page
              </h2>

              <nav
                aria-label="Terms of Service sections"
                className="space-y-1"
              >
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-indigo-50 hover:text-[#5145E5]"
                  >
                    <span>{section.title}</span>
                    <ChevronRight
                      size={15}
                      className="shrink-0 opacity-0 transition group-hover:opacity-100"
                    />
                  </a>
                ))}

                <a
                  href="#contact"
                  className="flex rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-indigo-50 hover:text-[#5145E5]"
                >
                  18. Contact us
                </a>
              </nav>
            </div>
          </aside>

          {/* Main terms */}
          <main className="min-w-0 space-y-6">
            {/* Introduction */}
            <div className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck
                  size={23}
                  className="text-[#5145E5]"
                />

                <h2 className="text-xl font-bold text-[#18124A]">
                  Before You Get Started
                </h2>
              </div>

              <p className="text-sm leading-8 text-slate-600 sm:text-base">
                These Terms of Service establish the rules for
                accessing and using Quantahire. They are designed
                to support a safe, transparent, and responsible
                recruitment environment for candidates, employers,
                and other platform participants.
              </p>

              <Link
                to="/privacy"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#5145E5] hover:underline"
              >
                Read our Privacy Policy
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Terms sections */}
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                >
                  <div className="mb-5 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5145E5]/10 text-[#5145E5]">
                      <Icon size={23} />
                    </div>

                    <h2 className="pt-2 text-xl font-extrabold tracking-tight text-[#18124A] sm:text-2xl">
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {section.content.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-sm leading-8 text-slate-600 sm:text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              );
            })}

            {/* Contact section */}
            <article
              id="contact"
              className="scroll-mt-8 rounded-3xl bg-[#18124A] p-7 text-white sm:p-10"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14E0C8]/15 text-[#14E0C8]">
                <Mail size={23} />
              </div>

              <h2 className="text-2xl font-extrabold">
                18. Contact Us
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-8 text-indigo-100/85 sm:text-base">
                If you have questions about these Terms of
                Service, subscription billing, account access,
                or the use of Quantahire, please contact our
                support team through the official contact page.
              </p>

              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#14E0C8] px-5 py-3 text-sm font-bold text-[#18124A] transition hover:bg-[#6FFFEF]"
              >
                Contact Quantahire
                <ArrowRight size={17} />
              </Link>
            </article>

            {/* Bottom navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500">
              <p>
                © {new Date().getFullYear()} Quantahire.
                All rights reserved.
              </p>

              <Link
                to="/privacy"
                className="font-semibold text-[#5145E5] hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}
