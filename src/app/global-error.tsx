"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="tr">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#FAF9F5", color: "#1C241F", margin: 0 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
          <h1 style={{ color: "#173F35" }}>Bir sorun oluştu.</h1>
          <p>Lütfen sayfayı yenileyerek tekrar deneyin.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              padding: "12px 24px",
              borderRadius: 999,
              border: 0,
              background: "#173F35",
              color: "#F5F0E5",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sayfayı Yenile
          </button>
        </div>
      </body>
    </html>
  );
}
