import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    title: "1. Overview",
    content: `Affilyt operates as a marketplace connecting vendors and buyers of digital products. Because digital products are delivered instantly and cannot be "returned" in the traditional sense, refunds are subject to the conditions outlined below. This policy applies to all purchases made through the Affilyt Platform.`,
  },
  {
    title: "2. Eligibility for Refunds",
    content: `You may be eligible for a refund if: (a) the product was not delivered or accessible after purchase; (b) the product is materially different from what was described at the time of sale; (c) the product contains technical errors that prevent its use and the vendor has been unable to resolve them within 5 business days; or (d) a duplicate charge was made in error.`,
  },
  {
    title: "3. Non-Refundable Situations",
    content: `Refunds will not be issued in the following circumstances: (a) you have already downloaded, accessed, or consumed the digital product; (b) you change your mind after purchase; (c) you claim incompatibility with your device when compatibility requirements were clearly disclosed; (d) the request is made more than 14 days after the purchase date; (e) the purchase was made under a promotional or discounted price that explicitly excluded refunds.`,
  },
  {
    title: "4. Course and Digital Course Refunds",
    content: `For online courses, a refund may be requested within 7 days of purchase provided that no more than 20% of the course content has been consumed. Once a certificate of completion has been issued or a significant portion of the course has been completed, no refund will be granted.`,
  },
  {
    title: "5. How to Request a Refund",
    content: `To request a refund, email support@affilyt.site with the subject line "Refund Request" and include: your registered email address, the order ID, the product name, and a clear description of the issue. We aim to respond to all refund requests within 2 business days.`,
  },
  {
    title: "6. Refund Processing",
    content: `Approved refunds are processed back to the original payment method within 5–10 business days, depending on your bank or payment provider. Affilyt's platform fee is non-refundable. Affiliate commissions linked to refunded orders will be reversed and deducted from the affiliate's pending balance.`,
  },
  {
    title: "7. Vendor Responsibilities",
    content: `Vendors are ultimately responsible for resolving product issues with buyers. Affilyt may facilitate the refund process and may deduct approved refund amounts from the vendor's next payout. Vendors with a high refund rate may be subject to additional review or removal from the Platform.`,
  },
  {
    title: "8. Chargebacks",
    content: `We strongly encourage buyers to contact us before initiating a chargeback with their bank. Unjustified chargebacks may result in account suspension. If a chargeback is filed, Affilyt will provide transaction evidence to the relevant payment processor in accordance with its dispute resolution process.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `Affilyt reserves the right to update this Refund Policy at any time. Changes will be communicated via email or an in-platform notice. Continued use of the Platform after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "10. Contact",
    content: `For refund enquiries or disputes, please contact support@affilyt.site. We are committed to resolving all issues fairly and promptly.`,
  },
];

const RefundPolicy = () => (
  <div className="min-h-screen overflow-x-hidden">
    <LandingNavbar />

    <section className="pt-32 pb-16">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/5 text-primary">Legal</Badge>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
          Refund <span className="text-gradient">Policy</span>
        </h1>
        <p className="mt-5 text-muted-foreground">
          Last updated: June 2026. We want every purchase to be a positive experience.
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

export default RefundPolicy;
