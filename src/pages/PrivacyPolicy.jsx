
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  LockKeyhole,
  Database,
  UserRound,
  BriefcaseBusiness,
  BrainCircuit,
  Cookie,
  Share2,
  Clock3,
  UserCheck,
  Mail,
  ArrowLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

const sections = [
  {
    id: "information",
    title: "1. Information We Collect",
    icon: Database,
    content: [
      "When you register for Quantahire, we collect information necessary to create and manage your account, including your name, email address, username, phone number where provided, and account type.",
      "For job seekers, we may collect professional information such as employment history, skills, education, qualifications, preferred work location, resumes, portfolio links, and job applications.",
      "For employers, we may collect company names, business contact information, company descriptions, locations, job postings, and recruitment-related information.",
      "We may also collect technical information such as IP addresses, browser types, device information, and usage activity to maintain platform security and improve our services.",
    ],
  },
  {
    id: "usage",
    title: "2. How We Use Your Information",
    icon: UserRound,
    content: [
      "We use your personal information to provide and maintain Quantahire's recruitment and job discovery services.",
      "This includes creating accounts, managing professional profiles, displaying job opportunities, processing applications, facilitating communication between candidates and employers, and providing customer support.",
      "We may also use information to improve our platform, detect fraudulent activity, protect users, and comply with applicable legal obligations.",
      "Where required by law, we will obtain your consent before sending promotional communications.",
    ],
  },
  {
    id: "recruitment",
    title: "3. Job Applications and Employer Access",
    icon: BriefcaseBusiness,
    content: [
      "When you apply for a job through Quantahire, information included in your application may be shared with the relevant employer or recruitment organization.",
      "This information may include your name, professional profile, resume, qualifications, contact details, and other information you choose to provide.",
      "Employers are responsible for handling candidate information they receive in accordance with applicable data protection laws.",
      "Quantahire does not guarantee employment, interview invitations, or recruitment outcomes.",
    ],
  },
  {
    id: "ai",
    title: "4. AI-Powered Matching and Automated Features",
    icon: BrainCircuit,
    content: [
      "Quantahire may use artificial intelligence, matching algorithms, and related technologies to recommend job opportunities, analyze professional information, and assist with recruitment workflows.",
      "These features may process information such as your skills, experience, qualifications, job preferences, and relevant job descriptions.",
      "AI-generated recommendations and assessments are intended to support decision-making and may not always be accurate or complete.",
      "Where automated features materially affect users, we aim to provide appropriate transparency and applicable privacy protections.",
    ],
  },
  {
    id: "sharing",
    title: "5. Information Sharing",
    icon: Share2,
    content: [
      "We do not sell your personal information to advertisers.",
      "We may share information with employers when you apply for jobs or otherwise choose to make your professional information available.",
      "We may use trusted technology providers to support services such as cloud hosting, authentication, communications, analytics, and payment processing.",
      "We may also disclose information when required by applicable law, legal proceedings, or legitimate security investigations.",
    ],
  },
  {
    id: "security",
    title: "6. Data Security",
    icon: LockKeyhole,
    content: [
      "We use reasonable technical and organizational safeguards designed to protect personal information from unauthorized access, alteration, disclosure, or destruction.",
      "These safeguards may include authentication controls, encrypted connections, restricted access, and monitoring of suspicious activity.",
      "However, no internet-based service can guarantee absolute security. Users should protect their passwords and notify us if they suspect unauthorized access.",
    ],
  },
  {
    id: "cookies",
    title: "7. Cookies and Similar Technologies",
    icon: Cookie,
    content: [
      "Quantahire may use cookies or similar technologies to support essential website functions, maintain sessions, remember preferences, and understand how the platform is used.",
      "Some cookies may be necessary for authentication and security, while optional technologies may be used for analytics or service improvements.",
      "Where applicable, we will provide appropriate choices regarding non-essential cookies.",
      "You can also manage cookies through your browser settings, although disabling essential cookies may affect certain platform features.",
    ],
  },
  {
    id: "retention",
    title: "8. Data Retention",
    icon: Clock3,
    content: [
      "We retain personal information for as long as reasonably necessary to provide our services, fulfill the purposes described in this policy, resolve disputes, and comply with legal obligations.",
      "Retention periods may vary depending on the type of information, account activity, applicable laws, and legitimate business requirements.",
      "When information is no longer required, we will take appropriate steps to delete, anonymize, or securely retain it where legally necessary.",
    ],
  },
  {
    id: "rights",
    title: "9. Your Privacy Rights",
    icon: UserCheck,
    content: [
      "Depending on applicable data protection laws, you may have rights to access, correct, update, or request deletion of your personal information.",
      "You may also have rights to object to certain processing, withdraw consent where processing is based on consent, request data portability, or raise concerns about how your information is handled.",
      "You can update certain profile details through your Quantahire account or contact us to make a privacy-related request.",
      "We may need to verify your identity before fulfilling certain requests and may retain information where required by law.",
    ],
  },
  {
    id: "children",
    title: "10. Children's Privacy",
    icon: ShieldCheck,
    content: [
      "Quantahire is intended for individuals who are legally permitted to use employment and recruitment services.",
      "We do not knowingly seek to collect personal information from children in circumstances where parental consent or other legal authorization is required.",
      "If we discover that information has been collected in violation of applicable children's privacy laws, we will take appropriate action.",
    ],
  },
  {
    id: "changes",
    title: "11. Changes to This Privacy Policy",
    icon: FileText,
    content: [
      "We may update this Privacy Policy to reflect changes in our services, technologies, legal requirements, or privacy practices.",
      "When changes are made, we will update the effective date on this page and provide additional notice where required.",
      "We encourage users to review this policy periodically.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F8F9FF] text-slate-800">
      {/* Hero */}
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
              <ShieldCheck size={16} />
              Your privacy matters
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Privacy <span className="text-[#14E0C8]">Policy</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-indigo-100/85 sm:text-lg">
              Learn how Quantahire collects, uses, protects, and
              manages personal information when you explore
              opportunities, apply for jobs, or recruit talent.
            </p>

            <p className="mt-7 text-sm text-indigo-200">
              Effective date: October 29, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Table of contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#18124A]">
                On this page
              </h2>

              <nav aria-label="Privacy policy sections" className="space-y-1">
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
                  12. Contact us
                </a>
              </nav>
            </div>
          </aside>

          {/* Policy */}
          <main className="min-w-0 space-y-6">
            <div className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#18124A]">
                Introduction
              </h2>
              <p className="mt-3 text-sm leading-8 text-slate-600 sm:text-base">
                Welcome to Quantahire. This Privacy Policy explains
                how personal information is handled when you use
                our website and recruitment services. It applies
                to job seekers, employers, and other visitors
                interacting with our platform.
              </p>
            </div>

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

            {/* Contact */}
            <article
              id="contact"
              className="scroll-mt-8 rounded-3xl bg-[#18124A] p-7 text-white sm:p-10"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14E0C8]/15 text-[#14E0C8]">
                <Mail size={23} />
              </div>

              <h2 className="text-2xl font-extrabold">
                12. Contact Us
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-8 text-indigo-100/85 sm:text-base">
                If you have questions about this Privacy Policy,
                how your information is handled, or wish to
                exercise your privacy rights, please contact
                the Quantahire team through our official
                contact page.
              </p>

              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#14E0C8] px-5 py-3 text-sm font-bold text-[#18124A] transition hover:bg-[#6FFFEF]"
              >
                Contact Quantahire
                <ChevronRight size={17} />
              </Link>
            </article>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500">
              <p>
                © {new Date().getFullYear()} Quantahire.
                All rights reserved.
              </p>

              <Link
                to="/terms"
                className="font-semibold text-[#5145E5] hover:underline"
              >
                Terms of Service
              </Link>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}
