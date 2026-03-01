import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500 text-white font-bold text-sm">
              B
            </div>
            <span className="font-semibold text-slate-700">BuildDash</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/buyer" className="hover:text-slate-700">Get Parts</Link>
            <Link href="/seller" className="hover:text-slate-700">Make Parts</Link>
          </div>
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} BuildDash. Your parts, made locally.
          </p>
        </div>
      </div>
    </footer>
  );
}
