import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    title: "1. Introduction",
    content: `Affilyt ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights regarding that data when you use our Platform at affilyt.site.`,
  },
  {
    title: "2. Information We Collect",
    content: `We collect information you provide directly, such as your name, email address, payment details, and profile information when you register or transact on the Platform. We also collect usage data automatically — including IP addresses, browser type, pages visited, referral URLs, and device identifiers — through cookies and similar tracking technologies.`,
  },
  {
    title: "3. How We Use Your Information",
    content: `We use your information to: (a) operate and improve the Platform; (b) process transactions and payouts; (c) send transactional emails and important account notices; (d) detect and prevent fraud and abuse; (e) analyse usage trends to enhance user experience; (f) comply with legal obligations. We do not sell your personal data to third parties.`,
  },
  {
    title: "4. Cookies and Tracking",
    content: `Affilyt uses cookies and similar technologies to maintain session state, track affiliate link attribution, and analyse Platform performance. You can control cookie preferences through your browser settings. Disabling cookies may affect certain Platform functionality, including affiliate link tracking.`,
  },
  {
    title: "5. Data Sharing",
    content: `We may share your information with: (a) vendors and affiliates only to the extent necessary to fulfil a transaction; (b) payment processors to handle transactions securely; (c) analytics providers under strict data processing agreements; (d) law enforcement or regulatory bodies when required by law. We require all third parties to respect your data and treat it in accordance with applicable privacy laws.`,
  },
  {
    title: "6. Data Retention",
    content: `We retain your personal data for as long as your account is active or as needed to provide services. If you close your account, we will delete or anonymise your data within 90 days, except where we are required to retain it for legal or financial compliance purposes.`,
  },
  {
    title: "7. Your Rights",
    content: `Depending on your jurisdiction, you may have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your data; object to or restrict certain processing; and request portability of your data. To exercise any of these rights, contact us at support@affilyt.site.`,
  },
  {
    title: "8. Data Security",
    content: `We implement industry-standard security measures including encryption in transit (TLS), hashed passwords, and access controls to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "9. Children's Privacy",
    content: `Affilyt is not directed at children under the age of 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately and we will take steps to delete it.`,
  },
  {
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on the Platform. Your continued use of the Platform after changes are posted constitutes your acceptance of the updated policy.`,
  },
  {
    title: "11. Contact Us",
    content: `If you have questions or concerns about this Privacy Policy or how we handle your data, please reach out at support@affilyt.site.`,
  },
];

const PrivacyPolicy = () => (
  <div className="min-h-screen overflow-x-hidden">
    <LandingNavbar />

    <section className="pt-32 pb-16">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/5 text-primary">Legal</Badge>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
          Privacy <span className="text-gradient">Policy</span>
        </h1>
        <p className="mt-5 text-muted-foreground">
          Last updated: June 2026. Your privacy matters to us — here is exactly how we handle your data.
        </p>
      </div>
    </section>

    <section className="pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.title} className="space-y-3">
              <h2 className="font-display text-xl font-semibold">{s.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default PrivacyPolicy;
