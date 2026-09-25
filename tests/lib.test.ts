import assert from "node:assert/strict";
import { test } from "node:test";
import { slugify } from "../src/lib/format.ts";
import { detectImageType } from "../src/lib/image-type.ts";
import { site } from "../src/lib/site.ts";
import { productSchema, isAllowedImageRef } from "../src/lib/validation.ts";
import {
  buildOrderMessage,
  buildStockInquiryMessage,
  ripenessMessageLabel,
  whatsappUrl,
} from "../src/lib/whatsapp.ts";

const decode = (url: string) => decodeURIComponent(new URL(url).searchParams.get("text") ?? "");

/* ---------------------------------------------------------------- WhatsApp */

test("WhatsApp: numara 905069055651, gösterim 0506 905 56 51, tel bağlantısı doğru", () => {
  assert.equal(site.whatsappNumber, "905069055651");
  assert.equal(site.phoneDisplay, "0506 905 56 51");
  assert.equal(site.phoneHref, "tel:+905069055651");
  assert.equal(site.whatsappHref, "https://wa.me/905069055651");
});

test("WhatsApp: avokado siparişi ürün, miktar ve olgunluğu birebir spesifikasyondaki biçimde içerir", () => {
  const url = whatsappUrl(
    buildOrderMessage({ productName: "Avokado", unit: "kg", quantity: 3, ripeness: "tuketime-hazir" }),
  );
  assert.ok(url.startsWith("https://wa.me/905069055651?text="));
  assert.equal(
    decode(url),
    [
      "Merhaba Konsept,",
      "Web siteniz üzerinden sipariş vermek istiyorum.",
      "Ürün: Avokado",
      "Miktar: 3 kg",
      "Olgunluk: Tüketime hazır",
      "Sipariş hakkında bilgi verebilir misiniz?",
    ].join("\n"),
  );
});

test("WhatsApp: Türkçe karakterler UTF-8 olarak yüzde-kodlanır", () => {
  const url = whatsappUrl("Çarkıfelek ğüşiöç İĞÜŞÖÇ");
  assert.ok(url.includes("%C3%87ark%C4%B1felek"), url);
  assert.equal(decode(url), "Çarkıfelek ğüşiöç İĞÜŞÖÇ");
});

test("WhatsApp: olgunluk yoksa satır eklenmez; miktar yoksa satır eklenmez", () => {
  const m = buildOrderMessage({ productName: "Mango", quantity: 2 });
  assert.ok(m.includes("Miktar: 2 kg"));
  assert.ok(!m.includes("Olgunluk"));
  const noQty = buildOrderMessage({ productName: "Mango" });
  assert.ok(!noQty.includes("Miktar"));
});

test("WhatsApp: olgunluk etiketleri", () => {
  assert.equal(ripenessMessageLabel("sert-ham"), "Sert / Ham");
  assert.equal(ripenessMessageLabel("olgunlasmaya-yakin"), "Olgunlaşmaya yakın");
  assert.equal(ripenessMessageLabel(null), null);
});

test("WhatsApp: stok bilgisi mesajı ürün adını içerir", () => {
  assert.ok(buildStockInquiryMessage("Papaya").includes("Papaya"));
});

/* -------------------------------------------------------------- Doğrulama */

const valid = {
  name: "Avokado",
  slug: "avokado",
  short_description: "Kısa",
  description: "Uzun",
  price: 350,
  unit: "kg",
  stock_status: "in_stock",
  cover_image: "/images/products/avokado/avokado-cover.webp",
  images: [],
  featured: true,
  active: true,
  display_order: 10,
  ripeness_enabled: true,
};

test("Doğrulama: geçerli ürün kabul edilir", () => {
  assert.equal(productSchema.safeParse(valid).success, true);
});

test("Doğrulama: negatif fiyat, NaN ve sayı olmayan fiyat reddedilir", () => {
  assert.equal(productSchema.safeParse({ ...valid, price: -1 }).success, false);
  assert.equal(productSchema.safeParse({ ...valid, price: Number.NaN }).success, false);
  assert.equal(productSchema.safeParse({ ...valid, price: "350" }).success, false);
  assert.equal(productSchema.safeParse({ ...valid, price: 0 }).success, true);
});

test("Doğrulama: boş ürün adı reddedilir", () => {
  assert.equal(productSchema.safeParse({ ...valid, name: "   " }).success, false);
});

test("Doğrulama: slug biçimi", () => {
  for (const bad of ["", "Ejderha Meyvesi", "a_b", "-a", "a-", "a--b", "../x", "ç"]) {
    assert.equal(productSchema.safeParse({ ...valid, slug: bad }).success, false, `slug: ${bad}`);
  }
  const ok = productSchema.safeParse({ ...valid, slug: "  Ejderha-Meyvesi " });
  assert.equal(ok.success, true);
  if (ok.success) assert.equal(ok.data.slug, "ejderha-meyvesi");
});

test("Doğrulama: geçersiz stok durumu / birim reddedilir", () => {
  assert.equal(productSchema.safeParse({ ...valid, stock_status: "bol" }).success, false);
  assert.equal(productSchema.safeParse({ ...valid, unit: "ton" }).success, false);
});

test("Doğrulama: görsel adresleri yalnızca kendi /images klasörü veya kendi Storage'ımız", () => {
  assert.equal(isAllowedImageRef("/images/products/mango/mango-cover.webp"), true);
  for (const bad of [
    "javascript:alert(1)",
    "https://evil.example/x.png",
    "//evil.example/x.png",
    "/images/../secret.png",
    "/images/x.svg",
    "data:image/png;base64,AAAA",
    "/baska/yol.png",
  ]) {
    assert.equal(isAllowedImageRef(bad), false, bad);
  }
  assert.equal(productSchema.safeParse({ ...valid, images: Array(9).fill("/images/a.png") }).success, false);
});

/* ------------------------------------------------------- Görsel / slug util */

test("Görsel tipi magic byte ile belirlenir (uzantıya/Content-Type'a güvenilmez)", () => {
  assert.equal(detectImageType(Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]))?.ext, "jpg");
  assert.equal(detectImageType(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))?.ext, "png");
  const webp = new TextEncoder().encode("RIFF\0\0\0\0WEBP");
  assert.equal(detectImageType(webp)?.ext, "webp");
  assert.equal(detectImageType(new TextEncoder().encode("<svg xmlns='http://www.w3.org/2000/svg'/>")), null);
  assert.equal(detectImageType(new TextEncoder().encode("<script>alert(1)</script>")), null);
  assert.equal(detectImageType(new Uint8Array()), null);
});

test("slugify: Türkçe karakterleri sadeleştirir", () => {
  assert.equal(slugify("Ejderha Meyvesi"), "ejderha-meyvesi");
  assert.equal(slugify("Mistik / Çarkıfelek"), "mistik-carkifelek");
  assert.equal(slugify("İncir"), "incir");
  assert.equal(slugify("Şeftali Özel"), "seftali-ozel");
  assert.equal(slugify("  --Ağaç Çilek!! "), "agac-cilek");
});
