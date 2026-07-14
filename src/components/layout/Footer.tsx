"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Don't render public footer on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full border-t border-neutral-200 bg-[#F4F2EF] mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex flex-col gap-1 md:order-1">
          <p className="text-sm text-neutral-600">
            &copy; {new Date().getFullYear()} DEMA UIN Antasari. All rights
            reserved.
          </p>
          <p className="text-xs text-neutral-400 font-medium">
            Kabinet Laskar Purnama Antasari
          </p>
        </div>
        <div className="mt-4 flex justify-center space-x-6 md:order-2 md:mt-0">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-brand-accent transition-colors text-sm font-medium"
          >
            Instagram
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-brand-accent transition-colors text-sm font-medium"
          >
            YouTube
          </a>
        </div>
      </div>
    </footer>
  );
}
