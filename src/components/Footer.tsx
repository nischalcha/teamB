import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} Flash Sports Academy. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/flash_sports10/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 transition-colors hover:text-emerald-600 dark:text-zinc-400"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/flashsportsnepal/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 transition-colors hover:text-emerald-600 dark:text-zinc-400"
          >
            Facebook
          </a>
        </div>
      </Container>
    </footer>
  );
}
