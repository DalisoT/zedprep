import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  MessageCircle,
  BarChart3,
  Users,
  BookOpen,
  ArrowRight,
  Phone,
  GraduationCap,
} from "lucide-react";

// TODO before launch: replace the WhatsApp number and email with real contact details
const CONTACT_WHATSAPP = "260970000000"; // Format: country code + number, no plus sign
const CONTACT_EMAIL = "hello@zedprep.co.zm";
const WHATSAPP_PILOT_MESSAGE =
  "Hi%2C%20I%27d%20like%20to%20pilot%20ZedPrep%20at%20my%20school";

const features = [
  {
    icon: BookOpen,
    title: "ECZ past papers",
    desc: "Form 3 to 5 past papers, organized by topic and tagged with ECZ syllabus codes.",
  },
  {
    icon: Sparkles,
    title: "AI marks short answers",
    desc: "No more hours of hand-marking. Our AI grades free-text answers in seconds.",
  },
  {
    icon: BarChart3,
    title: "Simulated exams",
    desc: "Real exam conditions — timed, randomized, with end-of-exam reports.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp parent updates",
    desc: "Parents get a weekly progress digest on WhatsApp. No app install required.",
  },
  {
    icon: Users,
    title: "School dashboard",
    desc: "See which students need help, which topics your class is weak on, at a glance.",
  },
  {
    icon: GraduationCap,
    title: "Works on any phone",
    desc: "Progressive web app. Works on a K200 smartphone, with slow data, even offline.",
  },
];

const steps = [
  {
    step: "1",
    title: "Your teachers upload questions",
    desc: "Paste a past paper question, set the mark scheme, add a diagram. Takes 2 minutes per question.",
  },
  {
    step: "2",
    title: "Students practice on their phones",
    desc: "They sign up with a school code, pick their grade and subjects, and start practising immediately.",
  },
  {
    step: "3",
    title: "Track progress in real time",
    desc: "You see a dashboard. Parents get WhatsApp. Students get a clearer path to their exams.",
  },
];

const pilotIncludes = [
  "Full access to all features",
  "Up to 500 students per school",
  "Your teachers get co-creator status",
  "Priority support from the founder",
  "No credit card, no commitment",
  "You help shape the product",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur z-50">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <span className="font-bold text-lg text-gray-900">ZedPrep</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-800 transition"
            >
              Sign up your school
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full px-3 py-1 mb-6">
          <Sparkles className="w-4 h-4 text-brand-700" />
          <span className="text-sm text-brand-800 font-medium">
            Built for Zambian schools
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Get your students
          <br />
          <span className="text-brand-700">ECZ-ready</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          The first revision platform built around the Zambian syllabus.
          AI-marked past papers, simulated exams, and weekly WhatsApp updates
          for parents — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-brand-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-brand-800 transition inline-flex items-center justify-center gap-2"
          >
            Sign up your school <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/student/signup"
            className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition inline-flex items-center justify-center gap-2"
          >
            Join as a student
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          Free for the first 3 schools · One full term · No credit card needed
        </p>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything your students need to pass
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From past papers to parent reports, built for the way Zambian
              schools actually work.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl border border-gray-100"
              >
                <feature.icon className="w-8 h-8 text-brand-700 mb-4" />
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Up and running in a week
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No complicated setup. Your teachers don&apos;t need to be techies.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-brand-700 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pilot CTA */}
      <section id="pilot" className="bg-brand-700 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pilot ZedPrep at your school — free
          </h2>
          <p className="text-lg md:text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            We&apos;re taking the first 3 schools on a free one-term pilot. Your
            teachers become co-creators of the content. You get a full year of
            feedback input.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left mb-10">
            {pilotIncludes.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent-300 mt-0.5 flex-shrink-0" />
                <span className="text-brand-50">{item}</span>
              </div>
            ))}
          </div>
          <a
            href={`https://wa.me/${CONTACT_WHATSAPP}?text=${WHATSAPP_PILOT_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-brand-700 px-8 py-4 rounded-lg font-semibold hover:bg-brand-50 transition"
          >
            <Phone className="w-5 h-5" /> Apply on WhatsApp
          </a>
          <p className="text-sm text-brand-200 mt-6">
            Or email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline hover:text-white"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Z</span>
              </div>
              <span className="font-bold text-white">ZedPrep</span>
            </div>
            <div className="text-sm">Built in Zambia, for Zambian students.</div>
            <div className="text-sm">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="hover:text-white"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            © 2026 ZedPrep. A learning platform for Zambian schools.
          </div>
        </div>
      </footer>
    </div>
  );
}
