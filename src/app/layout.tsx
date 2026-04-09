import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Game Hub",
  description: "Your personal game library",
};

function Header() {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <span className="text-xl font-bold text-white tracking-widest uppercase">
        Game Hub
      </span>
      <nav className="flex items-center gap-3">
        <Show when="signed-out">
          <SignInButton>
            <button className="px-4 py-2 rounded-md bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500 hover:text-cyan-400 transition-colors text-sm font-medium cursor-pointer">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="px-4 py-2 rounded-md bg-cyan-700 text-white border border-cyan-600 hover:bg-cyan-600 hover:border-cyan-500 transition-colors text-sm font-medium cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </nav>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-zinc-950 text-slate-100">
          <Header />
          <main className="flex-1">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
