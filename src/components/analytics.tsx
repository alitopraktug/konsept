import Script from "next/script";

/**
 * GA4 / GTM / Meta Pixel yükleyicisi. ID tanımlı değilse HİÇBİR script yüklenmez.
 * ID'ler biçim kontrolünden geçer (script içine yalnızca doğrulanmış değer yazılır).
 */
const GA = /^G-[A-Z0-9]{6,15}$/;
const GTM = /^GTM-[A-Z0-9]{4,10}$/;
const PIXEL = /^\d{8,20}$/;

function pick(value: string | undefined, re: RegExp): string | null {
  const v = value?.trim();
  return v && re.test(v) ? v : null;
}

export function Analytics() {
  const gaId = pick(process.env.NEXT_PUBLIC_GA_ID, GA);
  const gtmId = pick(process.env.NEXT_PUBLIC_GTM_ID, GTM);
  const pixelId = pick(process.env.NEXT_PUBLIC_META_PIXEL_ID, PIXEL);

  if (!gaId && !gtmId && !pixelId) return null;

  return (
    <>
      {gtmId ? (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=document.getElementsByTagName('script')[0],j=document.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id=${gtmId}';f.parentNode.insertBefore(j,f);`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      ) : gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      ) : null}
      {pixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}
    </>
  );
}
