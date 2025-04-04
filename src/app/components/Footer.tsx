"use client";

import Link from "next/link";
import { DIcons } from "dicons";

const navigation = {
    categories: [
        {
            id: "footer",
            name: "Footer",
            sections: [
                {
                    id: "main",
                    name: "Main",
                    items: [
                        { name: "About", href: "/about" },
                        { name: "How It Works", href: "/how-it-works" },
                    ],
                },
                {
                    id: "features",
                    name: "Features",
                    items: [
                        { name: "Use Cases", href: "/use-cases" },
                        { name: "FAQ", href: "/faq" },
                    ],
                },
                {
                    id: "legal",
                    name: "Legal",
                    items: [
                        { name: "Privacy Policy", href: "/privacy-policy" },
                        { name: "Terms of Service", href: "/terms-of-service" },
                    ],
                }
            ],
        },
    ],
};

const Underline = `hover:-translate-y-1 border border-dotted rounded-xl p-2.5 transition-transform `;

export function Footer() {
  return (
    <footer className="border-ali/20 :px-4 mx-auto w-full border-b border-t px-2 bg-purple-950/10 dark:bg-purple-800/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="relative mx-auto grid  max-w-7xl items-center justify-center gap-6 p-10 pb-0 md:flex ">
        <Link href="/">
          <p className="flex items-center justify-center rounded-full  ">
            <DIcons.Designali className="w-8 text-red-600" />
          </p>
        </Link>
        <p className="text-xl tracking-tighter font-geist bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 text-center">
          MedBlock – Decentralized Medical Record Storage & Verification
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="border-b border-dotted"> </div>
        <div className="py-10">
          {navigation.categories.map((category) => (
            <div
              key={category.name}
              className="grid grid-cols-3 flex-row justify-evenly gap-6 leading-6 md:flex"
            >
              {category.sections.map((section) => (
                <div key={section.name}>
                  <ul
                    role="list"
                    aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                    className="flex flex-col space-y-2"
                  >
                    {section.items.map((item) => (
                      <li key={item.name} className="flow-root">
                        <Link
                          href={item.href}
                          className="hover:text-muted/55 hover:dark:text-whitept-0.5 text-lg leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:leading-[1.875rem] text-balance bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-orange-500 bg-clip-text text-transparent md:text-xs"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="border-b border-dotted"> </div>
      </div>

      <div className="flex flex-wrap justify-center gap-y-6">
        <div className="flex flex-wrap items-center justify-center gap-6 gap-y-4 px-6">
          <Link
            aria-label="Logo"
            href="mailto:contact@mohammedrayan9064.in"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIcons.Mail strokeWidth={1.5} className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Logo"
            href="https://x.com/rayan9064"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIcons.X className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Logo"
            href="/"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIcons.Instagram className="h-5 w-5" />
          </Link>
          {/* <Link
            aria-label="Logo"
            href="/"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIcons.Threads className="h-5 w-5" />
          </Link> */}
          <Link
            aria-label="Logo"
            href="https://wa.link/94bzy5"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIcons.WhatsApp className="h-5 w-5" />
          </Link>
          {/* <Link
            aria-label="Logo"
            href="/"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIcons.Behance className="h-5 w-5" />
          </Link> */}
          {/* <Link
            aria-label="Logo"
            href="/"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIcons.Facebook className="h-5 w-5" />
          </Link> */}
          <Link
            aria-label="Logo"
            href="https://www.linkedin.com/in/rayan9064/"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIcons.LinkedIn className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Logo"
            href="/"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <DIcons.YouTube className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="mx-auto mb-10 mt-10 flex flex-col justify-between text-center text-xs md:max-w-7xl">
        <div className="flex flex-row items-center justify-center gap-1 text-slate-600 dark:text-slate-400">
          <span> © </span>
          <span>{new Date().getFullYear()}</span>
          <span>Made with</span>
          <DIcons.Heart className="text-red-600 mx-1 h-4 w-4 animate-pulse" />
          <span> by </span>
          <span className="hover:text-ali dark:hover:text-ali cursor-pointer text-black dark:text-white">
            <Link
              aria-label="Logo"
              className="font-bold"
              href="/"
              target="_blank"
            >
              Mohammed Rayan A {""}
            </Link>
          </span>
          -
          <span className="text-xsm hover:bg-purple-300 tracking-tighter font-geist bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 text-center">
            <Link aria-label="Logo" className="" href="https:www.github.com/rayan9064">
              rayan9064
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
