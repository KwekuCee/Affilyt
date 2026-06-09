import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using Affilyt ("the Platform"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the Platform. These terms apply to all users including vendors, affiliates, learners, and visitors.`,
  },
  {
    title: "2. Description of Service",
    content: `Affilyt is a digital affiliate marketplace that connects vendors with affiliates to promote and sell digital products including courses, e-books, software, and other digital goods. Affilyt acts solely as an intermediary and is not responsible for the quality, accuracy, or delivery of products listed by vendors.`,
  },
  {
    title: "3. User Accounts",
    content: `You must provide accurate and complete information when creating an account. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately at support@affilyt.site if you suspect any unauthorised use of your account.`,
  },
  {
    title: "4. Vendor Obligations",
    content: `Vendors agree to provide accurate product descriptions, deliver purchased digital products promptly, and honour refund requests in accordance with Affilyt's Refund Policy. Vendors must not list fraudulent, illegal, or misleading products. Affilyt reserves the right to suspend or terminate any vendor account found in violation of these obligations.`,
  },
  {
    title: "5. Affiliate Obligations",
    content: `Affiliates agree to promote products honestly and transparently. Affiliates must not engage in spam, misleading advertising, cookie stuffing, or any form of fraudulent traffic generation. Commission fraud will result in immediate account termination and forfeiture of pending earnings.`,
  },
  {
    title: "6. Commissions and Payouts",
    content: `Commission rates are set by vendors and displayed on each product. Affilyt processes payouts on a weekly basis, subject to minimum withdrawal thresholds. Affilyt deducts a platform fee from each transaction as disclosed at the time of sale. All commission disputes must be raised within 14 days of the disputed transaction.`,
  },
  {
    title: "7. Intellectual Property",
    content: `All content on the Platform — including logos, design, code, and text — is the property of Affilyt or its licensors and is protected by intellectual property laws. Vendors retain ownership of their product content but grant Affilyt a non-exclusive licence to display and distribute it through the Platform.`,
  },
  {
    title: "8. Prohibited Activities",
    content: `You agree not to: (a) use the Platform for any unlawful purpose; (b) attempt to gain unauthorised access to any part of the Platform; (c) upload malicious code or interfere with Platform operations; (d) engage in market manipulation or artificial inflation of analytics; (e) resell or sublicense Platform access without written consent from Affilyt.`,
  },
  {
    title: "9. Limitation of Liability",
    content: `To the fullest extent permitted by law, Affilyt shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform. Our total liability to you for any claim shall not exceed the total fees paid by you to Affilyt in the six months preceding the claim.`,
  },
  {
    title: "10. Termination",
    content: `Affilyt reserves the right to suspend or terminate your account at any time for breach of these Terms, fraudulent activity, or any conduct we determine to be harmful to users or the Platform. Upon termination, your right to access the Platform ceases immediately and any pending payouts subject to investigation may be withheld.`,
  },
  {
    title: "11. Changes to Terms",
    content: `Affilyt may update these Terms at any time. We will notify registered users of material changes via email or an in-platform notice. Continued use of the Platform after changes take effect constitutes your acceptance of the updated Terms.`,
  },
  {
    title: "12. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the competent courts in the applicable territory.`,
  },
  {
    title: "13. Contact",
    content: `If you have any questions about these Terms of Service, please contact us at support@affilyt.site.`,
  },
];

const TermsOfService = () => (
  <div className="min-h-screen overflow-x-hidden">
    <LandingNavbar />

    <section className="pt-32 pb-16">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/5 text-primary">Legal</Badge>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
          Terms of <span className="text-gradient">Service</span>
        </h1>
        <p className="mt-5 text-muted-foreground">
          Last updated: June 2026. Please read these terms carefully before using Affilyt.
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

export default TermsOfService;
