import Link from 'next/link';
import { IoIosFlash } from 'react-icons/io';
import {
  IoCallOutline,
  IoChevronForward,
  IoLocationOutline,
  IoLogoFacebook,
  IoLogoInstagram,
  IoMailOutline,
} from 'react-icons/io5';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white text-black">
      <Container className="py-12 sm:py-16">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-black/10 bg-black/5 px-6 py-8 text-center sm:px-10 sm:py-10">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 left-4 font-heading text-[180px] leading-none text-primary/20"
          >
            &ldquo;
          </span>
          <h1 className="font-heading text-3xl uppercase tracking-tight text-black sm:text-5xl">
            Join Flash Sports Tennis Class
          </h1>
          <p className="mx-auto mt-5 max-w-3xl border-l-4 border-primary pl-4 text-left text-base italic leading-relaxed text-black/70 sm:text-lg">
            &ldquo;Flash sports offer members and guests the opportunity to training and
            playing on our well-maintained Tennis court Indoor badminton court and
            fitness.&rdquo;
          </p>
        </div>
      </Container>
      
      <div className="w-full border-b border-black/10">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4286.002153655387!2d85.3244507!3d27.723058299999998!2m3!1f0!2f0!3f0!2m3!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb193353fae6c3%3A0xfbdfe270244004e7!2sFlash%20Sports%20Academy!5e1!3m2!1sen!2snp!4v1771918704562!5m2!1sen!2snp"
          className="h-72 w-full md:h-96"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Flash Sports Academy location map"
        />
      </div>

      <Container className="grid gap-8 py-12 md:grid-cols-3 md:gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <IoIosFlash className="h-7 w-7 text-primary" />
            <p className="font-heading text-xl uppercase tracking-tight text-black">
              Flash Sports Academy
            </p>
          </div>
          <h3 className="font-heading text-xl uppercase text-primary">About</h3>
          <p className="text-base leading-relaxed text-black/70">
            Flash Sports Academy is Nepal&apos;s premier tennis training academy,
            helping players of all levels grow through structured coaching and
            modern court facilities.
          </p>
          <p className="flex items-center gap-2 text-base text-black/70">
            <IoLocationOutline className="h-5 w-5 shrink-0 text-black/60" />
            Baluwatar &amp; Budhanilkantha, Kathmandu
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase text-primary">Quick Links</h3>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 text-base text-black/70 transition-colors hover:text-primary">
              <IoChevronForward className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/availability"
              className="flex items-center gap-2 text-base text-black/70 transition-colors hover:text-primary"
            >
              <IoChevronForward className="h-4 w-4" />
              Availability
            </Link>
            <Link
              href="/players"
              className="flex items-center gap-2 text-base text-black/70 transition-colors hover:text-primary"
            >
              <IoChevronForward className="h-4 w-4" />
              Players
            </Link>
            <Link href="/login" className="flex items-center gap-2 text-base text-black/70 transition-colors hover:text-primary">
              <IoChevronForward className="h-4 w-4" />
              Login
            </Link>
          </nav>
        </div>

        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase text-primary">Connect</h3>
          <div className="flex flex-col gap-2">
            <a
              href="tel:9851117476"
              className="flex items-center gap-2 text-base text-black/70 transition-colors hover:text-primary"
            >
              <IoCallOutline className="h-5 w-5" />
              985-1117476
            </a>
            <a
              href="mailto:flashsports03@gmail.com"
              className="flex items-center gap-2 text-base text-black/70 transition-colors hover:text-primary"
            >
              <IoMailOutline className="h-5 w-5" />
              flashsports03@gmail.com
            </a>
            <a
              href="https://www.instagram.com/flash_sports10/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-base text-black/70 transition-colors hover:text-primary"
            >
              <IoLogoInstagram className="h-5 w-5" />
              Instagram
            </a>
            <a
              href="https://www.facebook.com/flashsportsnepal/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-base text-black/70 transition-colors hover:text-primary"
            >
              <IoLogoFacebook className="h-5 w-5" />
              Facebook
            </a>
          </div>
        </div>
      </Container>

      <Container className="border-t border-black/10 py-5">
        <p className="text-center text-base text-black/50">
          &copy; {new Date().getFullYear()} Flash Sports Academy. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
