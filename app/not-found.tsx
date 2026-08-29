import Link from 'next/link';
import Monogram from '@/components/Monogram';

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-onyx">
      <div className="shell py-32 text-center">
        <Monogram className="mx-auto h-16 w-auto text-gold" title="" />
        <p className="eyebrow-on-dark mt-10">404</p>
        <h1 className="display mt-6 text-[clamp(2.4rem,7vw,4.5rem)] text-ivory">
          Nothing set here
        </h1>
        <p className="mx-auto mt-6 max-w-md font-sans text-base text-ivory/50">
          The page you were looking for has moved or never existed.
        </p>
        <Link href="/" className="btn bg-gold text-onyx hover:bg-ivory mt-12">
          Return home
        </Link>
      </div>
    </section>
  );
}
