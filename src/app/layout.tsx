import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-wf-site="69272aa5c1734eeb3d97e49c" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/vendor/bluesquarex.css" />
        <link rel="stylesheet" href="/concept.css" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
