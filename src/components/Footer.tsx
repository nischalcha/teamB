import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-black">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <p className="text-sm text-white/50">
          &copy; {new Date().getFullYear()} Flash Sports Academy. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/flash_sports10/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/50 transition-colors hover:text-primary"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/flashsportsnepal/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/50 transition-colors hover:text-primary"
          >
            Facebook
          </a>
        </div>
      </Container>
    </footer>
  );
}
