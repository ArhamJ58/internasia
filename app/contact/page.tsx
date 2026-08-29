import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import EnquiryForm from '@/components/EnquiryForm';
import Monogram from '@/components/Monogram';
import { Reveal } from '@/components/Motion';
import { company, visit } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Visit the Saii Jewels atelier at ${company.address.room}, ${company.address.street}, ${company.address.city}. Appointments preferred.`,
};

const mapQuery = encodeURIComponent(
  `${company.address.room}, ${company.address.street}, ${company.address.city} ${company.address.postalCode}, ${company.address.country}`,
);

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Visit" lede={visit.body} />

      <section className="bg-ivory py-28">
        <div className="shell grid gap-20 lg:grid-cols-[1fr_0.8fr]">
          {/* Enquiry */}
          <div>
            <Reveal>
              <h2 className="display text-4xl text-onyx">Make an enquiry</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-5 max-w-lg font-sans text-base leading-relaxed text-muted">
                Tell us a little about what you are after and we will reply with a time. Enquiries
                in English or Japanese are equally welcome.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-14">
                <EnquiryForm />
              </div>
            </Reveal>
          </div>

          {/* Details */}
          <Reveal delay={140}>
            <aside className="bg-onyx p-10 text-ivory lg:sticky lg:top-28">
              <Monogram className="h-12 w-auto text-gold" title="" />

              <h2 className="eyebrow-on-dark mt-9">The atelier</h2>
              <address className="mt-5 not-italic font-sans text-base leading-relaxed text-ivory/75">
                {company.address.room}
                <br />
                {company.address.street}
                <br />
                {company.address.city} {company.address.postalCode}
                <br />
                {company.address.country}
              </address>
              <p className="mt-4 font-jp text-xs leading-relaxed text-ivory/40">
                {company.address.ja}
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-dark mt-8 w-full"
              >
                Open in maps
              </a>

              <hr className="my-9 bg-ivory/10" />

              <h2 className="eyebrow-on-dark">Direct</h2>
              <dl className="mt-5 space-y-3 font-sans text-sm">
                {[
                  { k: 'Tel', v: company.tel, href: `tel:${company.tel.replace(/-/g, '')}` },
                  { k: 'Mobile', v: company.mobile, href: `tel:${company.mobile.replace(/-/g, '')}` },
                  { k: 'Fax', v: company.fax },
                  { k: 'Mail', v: company.email, href: `mailto:${company.email}` },
                ].map((row) => (
                  <div key={row.k} className="flex gap-4">
                    <dt className="w-16 shrink-0 text-ivory/35">{row.k}</dt>
                    <dd>
                      {row.href ? (
                        <a href={row.href} className="link-rule text-ivory/80 hover:text-gold">
                          {row.v}
                        </a>
                      ) : (
                        <span className="text-ivory/80">{row.v}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <hr className="my-9 bg-ivory/10" />

              <h2 className="eyebrow-on-dark">Hours</h2>
              <dl className="mt-5 space-y-3 font-sans text-sm">
                {visit.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4">
                    <dt className="text-ivory/50">{h.days}</dt>
                    <dd className="text-ivory/80">{h.time}</dd>
                  </div>
                ))}
              </dl>

              <hr className="my-9 bg-ivory/10" />

              <h2 className="eyebrow-on-dark">Nearest stations</h2>
              <p className="mt-5 font-sans text-sm leading-relaxed text-ivory/55">
                {visit.transit}
              </p>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
