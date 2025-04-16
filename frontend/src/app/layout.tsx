import { ClientLayout } from "@/components/layouts/client-layout";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import CookieBanner from "@/components/cookie/cookie-banner";
import { ReactNode } from "react";



export default function RootLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <head>
        <title>CrossEval</title>
        <meta name="description" content="The best way to evaluate" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}
