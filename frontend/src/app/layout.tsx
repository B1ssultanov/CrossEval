import { ClientLayout } from "@/components/layouts/client-layout";
// import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import CookieBanner from "@/components/cookie/cookie-banner";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <title>CrossEval</title>
        <meta name="description" content="The best way to evaluate" />

        {/* Yandex.Metrika Counter */}
        {/* <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(99760576, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
            `,
          }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/99760576"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript> */}
        {/* End Yandex.Metrika Counter */}
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}

// import { ClientLayout } from "@/components/layouts/client-layout";
// import type { Metadata } from "next";
// import "./globals.css";
// import { Toaster } from "@/components/ui/toaster";
// import CookieBanner from "@/components/cookie/cookie-banner";

// export const metadata: Metadata = {
//   title: "CrossEval",
//   description: "The best way to evaluate",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html lang="en">

//       <body>
//           <ClientLayout>{children}</ClientLayout>
//           <Toaster />
//           <CookieBanner />
//       </body>
//     </html>
//   );
// }
