export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>© 2025 Subscrybe. Privacy-first by design.</div>

        <div className="flex gap-4">
          <a href="/privacy-policy" className="hover:text-cardano-blue">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-cardano-blue">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
