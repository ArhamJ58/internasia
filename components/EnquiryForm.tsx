'use client';

import { useState } from 'react';
import { company } from '@/lib/content';

const INTERESTS = [
  'Bespoke commission',
  'Bridal',
  'Loose stones',
  'Restoration',
  'Something else',
] as const;

/**
 * The site is static, so this composes a pre-filled message and hands it to
 * the visitor's mail client. To collect enquiries server-side instead, swap
 * the submit handler for a POST to your form endpoint — see README.
 */
export default function EnquiryForm() {
  const [interest, setInterest] = useState<string>(INTERESTS[0]);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '');
    const phone = String(data.get('phone') ?? '');
    const message = String(data.get('message') ?? '');

    const body = [
      `Name: ${name}`,
      phone && `Phone: ${phone}`,
      `Interest: ${interest}`,
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n');

    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
      `Enquiry — ${interest}`,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  }

  const field =
    'w-full border-0 border-b border-ivory-300 bg-transparent px-0 py-3.5 font-sans text-base ' +
    'text-onyx transition-colors duration-500 placeholder:text-muted/50 focus:border-gold focus:outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-9">
      <div className="grid gap-9 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="eyebrow">
            Name
          </label>
          <input id="name" name="name" required autoComplete="name" className={`${field} mt-3`} />
        </div>
        <div>
          <label htmlFor="phone" className="eyebrow">
            Phone <span className="normal-case tracking-normal text-muted">(optional)</span>
          </label>
          <input id="phone" name="phone" autoComplete="tel" className={`${field} mt-3`} />
        </div>
      </div>

      <fieldset>
        <legend className="eyebrow">Interest</legend>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {INTERESTS.map((opt) => {
            const active = interest === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setInterest(opt)}
                aria-pressed={active}
                className={`border px-5 py-2.5 font-sans text-[0.68rem] uppercase tracking-wide2 transition-all duration-500 ease-silk ${
                  active
                    ? 'border-gold bg-gold text-onyx'
                    : 'border-ivory-300 text-muted hover:border-gold/60 hover:text-gold-deep'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className="eyebrow">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Tell us about the stone, the occasion, or the piece you have in mind."
          className={`${field} mt-3 resize-none`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button type="submit" className="btn-solid">
          Send enquiry
        </button>
        <p aria-live="polite" className="font-sans text-xs text-muted">
          {sent
            ? 'Your mail application should now be open with the message ready to send.'
            : `This opens your mail application addressed to ${company.email}.`}
        </p>
      </div>
    </form>
  );
}
