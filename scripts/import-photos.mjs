/**
 * Marka fotoğraflarını ve logoyu siteye hazırlar.
 * Kaynaklar: assets/photos/*.webp  →  Çıktılar: public/images/** ve src/app/icon.png
 *
 * Kullanım: npm run photos            (hepsi)
 *           npm run photos -- logos  (yalnızca logo/ikon/OG: products|hero|sections|instagram|logos)
 * Not: `_kolaj-referans.webp` yalnızca referanstır (üzerinde yazı/fiyat var), siteye alınmaz.
 */
import sharp from "sharp";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

const PHOTOS = path.resolve("assets/photos");
const OUT = path.resolve("public/images");
const SLUGS = ["avokado", "mango", "muz", "carkifelek", "limon", "ejderha-meyvesi", "papaya"];
const HERO_BG = { r: 241, g: 234, b: 219 }; // #F1EADB (hero bölümü zemini)

const out = async (file) => {
  const abs = path.join(OUT, file);
  await mkdir(path.dirname(abs), { recursive: true });
  return abs;
};
const photo = (slug) => path.join(PHOTOS, `${slug}.webp`);

/* ---------------------------------------------------------------- ürün kapakları */
async function products() {
  for (const slug of SLUGS) {
    // Kartlar 4:5 gösterir; kare/başka oranlı kaynaklar ortadan 4:5'e kırpılır (4:5 kaynaklarda değişiklik olmaz)
    await sharp(photo(slug))
      .resize(1122, 1402, { fit: "cover", position: "centre" })
      .webp({ quality: 84, effort: 5 })
      .toFile(await out(`products/${slug}/${slug}-cover.webp`));
    // Eski illüstrasyon detay görseli artık kullanılmıyor
    await rm(path.join(OUT, `products/${slug}/${slug}-detay.webp`), { force: true });
    console.log("✓ ürün", slug);
  }
}

/* ---------------------------------------------------------------- yardımcılar */
const roundedMask = (w, h, r) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}" fill="#fff"/></svg>`);

async function tile(slug, w, h, radius, position = "attention") {
  const img = await sharp(photo(slug)).resize(w, h, { fit: "cover", position }).toBuffer();
  return sharp(img).composite([{ input: roundedMask(w, h, radius), blend: "dest-in" }]).png().toBuffer();
}

async function shadowFor(w, h, radius, blur = 18, opacity = 0.22, dy = 10) {
  const pad = blur * 3;
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w + pad * 2}" height="${h + pad * 2}"><rect x="${pad}" y="${pad + dy}" width="${w}" height="${h}" rx="${radius}" fill="#3a2a18" fill-opacity="${opacity}"/></svg>`,
  );
  return { input: await sharp(svg).blur(blur).png().toBuffer(), pad };
}

/** Sütunlu, kaydırmalı fotoğraf kolajı */
async function mosaic({ width, height, columns, colW, tileH, gap, x0, radius, filename, quality = 84 }) {
  const layers = [];
  for (const col of columns) {
    let y = col.y;
    const x = x0 + col.i * (colW + gap);
    for (const slug of col.slugs) {
      const t = await tile(slug, colW, tileH, radius);
      const sh = await shadowFor(colW, tileH, radius);
      layers.push({ input: sh.input, left: Math.round(x - sh.pad), top: Math.round(y - sh.pad) });
      layers.push({ input: t, left: Math.round(x), top: Math.round(y) });
      y += tileH + gap;
    }
  }
  // Tuvale sığmayan (negatif) konumlar için önce büyük tuval, sonra kırp
  const pad = 400;
  const big = await sharp({ create: { width: width + pad * 2, height: height + pad * 2, channels: 3, background: HERO_BG } })
    .composite(layers.map((l) => ({ ...l, left: l.left + pad, top: l.top + pad })))
    .png()
    .toBuffer();
  await sharp(big)
    .extract({ left: pad, top: pad, width, height })
    .webp({ quality, effort: 5 })
    .toFile(await out(filename));
  console.log("✓", filename);
}

/* ---------------------------------------------------------------- hero */
async function hero() {
  // Masaüstü: sağa yaslı, sol kenar zemine karışır (CSS maskesi). 1600x1100
  await mosaic({
    width: 1600,
    height: 1100,
    x0: 420,
    colW: 360,
    tileH: 450,
    gap: 20,
    radius: 26,
    columns: [
      { i: 0, y: 150, slugs: ["avokado", "limon"] },
      { i: 1, y: 30, slugs: ["ejderha-meyvesi", "mango"] },
      { i: 2, y: 190, slugs: ["carkifelek", "muz"] },
    ],
    filename: "hero/hero-desktop.webp",
    quality: 86,
  });
  // Mobil: 1000x900, iki geniş sütun
  await mosaic({
    width: 1000,
    height: 900,
    x0: 30,
    colW: 465,
    tileH: 581,
    gap: 18,
    radius: 30,
    columns: [
      { i: 0, y: -110, slugs: ["avokado", "ejderha-meyvesi"] },
      { i: 1, y: -330, slugs: ["mango", "muz", "carkifelek"] },
    ],
    filename: "hero/hero-mobile.webp",
    quality: 86,
  });
}

/* ---------------------------------------------------------------- bölüm görselleri (4:3) */
async function sections() {
  // Eviniz için: iki fotoğraf yan yana
  const w = 1200;
  const h = 900;
  const a = await sharp(photo("avokado")).resize(596, h, { fit: "cover", position: "attention" }).toBuffer();
  const b = await sharp(photo("mango")).resize(596, h, { fit: "cover", position: "attention" }).toBuffer();
  await sharp({ create: { width: w, height: h, channels: 3, background: { r: 245, g: 240, b: 229 } } })
    .composite([{ input: a, left: 0, top: 0 }, { input: b, left: 604, top: 0 }])
    .webp({ quality: 84 })
    .toFile(await out("hero/bireysel-kullanim.webp"));
  // İşletmeniz için: üç fotoğraf
  const three = ["carkifelek", "muz", "limon"];
  const tw = 392;
  const layers = [];
  for (let i = 0; i < 3; i++) {
    layers.push({ input: await sharp(photo(three[i])).resize(tw, h, { fit: "cover", position: "attention" }).toBuffer(), left: i * (tw + 12), top: 0 });
  }
  await sharp({ create: { width: w, height: h, channels: 3, background: { r: 245, g: 240, b: 229 } } })
    .composite(layers)
    .webp({ quality: 84 })
    .toFile(await out("hero/toptan-satis.webp"));
  console.log("✓ bölüm görselleri");
}

/* ---------------------------------------------------------------- Instagram */
async function instagram() {
  const order = ["avokado", "ejderha-meyvesi", "mango", "carkifelek", "limon", "muz"];
  for (let i = 0; i < order.length; i++) {
    await sharp(photo(order[i]))
      .resize(1080, 1080, { fit: "cover", position: "attention" })
      .webp({ quality: 82 })
      .toFile(await out(`hero/instagram-${i + 1}.webp`));
  }
  console.log("✓ instagram");
}

/* ---------------------------------------------------------------- logo */
/** Açık zeminli logodan "renk → alfa" ile şeffaf sürüm çıkarır (koyu ön plan varsayımı). */
async function transparentLogo() {
  const { data, info } = await sharp(path.join(PHOTOS, "logo.webp")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const bg = [254, 251, 241];
  const buf = Buffer.from(data);
  for (let i = 0; i < buf.length; i += 4) {
    let a = 0;
    for (let c = 0; c < 3; c++) a = Math.max(a, (bg[c] - buf[i + c]) / bg[c]);
    if (a < 0.05) {
      buf[i + 3] = 0;
      continue;
    }
    a = Math.min(1, a * 1.02);
    for (let c = 0; c < 3; c++) buf[i + c] = Math.max(0, Math.min(255, Math.round((buf[i + c] - bg[c] * (1 - a)) / a)));
    buf[i + 3] = Math.round(a * 255);
  }
  return { buf, width: info.width, height: info.height };
}

const png = (raw, w, h) => sharp(raw, { raw: { width: w, height: h, channels: 4 } }).png();

async function crop(src, region) {
  return sharp(src).extract(region).png().toBuffer();
}

async function tint(pngBuf, { r, g, b }) {
  const { data, info } = await sharp(pngBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
  return png(data, info.width, info.height).toBuffer();
}

async function logos() {
  const { buf, width, height } = await transparentLogo();
  const full = await png(buf, width, height).toBuffer();

  // Bölgeler (1254x1254 kaynak): amblem üstte, yazı ve sloganı altta

  // Amblem kutusuna taşan yazı piksellerini ve tersini temizle
  const erase = async (img, box, keep) => {
    const { data, info } = await sharp(img).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const inside = x >= box.left && x < box.left + box.width && y >= box.top && y < box.top + box.height;
        if (keep ? !inside : inside) data[(y * info.width + x) * 4 + 3] = 0;
      }
    }
    return png(data, info.width, info.height).toBuffer();
  };
  const markOnly = await erase(full, { left: 470, top: 0, width: 420, height: 738 }, true); // yalnızca amblem bölgesi
  const wordOnly = await erase(full, { left: 470, top: 0, width: 420, height: 738 }, false); // amblem bölgesi hariç her şey

  const trim = (b) => sharp(b).trim({ threshold: 1 }).png().toBuffer();
  const mark = await trim(await crop(markOnly, { left: 440, top: 190, width: 480, height: 560 }));
  const wordNoTag = await trim(await crop(wordOnly, { left: 150, top: 690, width: 960, height: 262 }));

  const wM = await sharp(wordNoTag).metadata();

  // Yatay kilitlenme: amblem + yazı
  const markH = Math.round(wM.height * 1.35);
  const markScaled = await sharp(mark).resize({ height: markH }).png().toBuffer();
  const mmS = await sharp(markScaled).metadata();
  const gap = Math.round(wM.height * 0.22);
  const H = Math.max(markH, wM.height);
  const W = mmS.width + gap + wM.width;
  const lockup = await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: markScaled, left: 0, top: Math.round((H - markH) / 2) },
      { input: wordNoTag, left: mmS.width + gap, top: Math.round((H - wM.height) / 2) + Math.round(H * 0.03) },
    ])
    .png()
    .toBuffer();

  const cream = { r: 245, g: 240, b: 229 };
  const saveWebp = async (buf, file, height) => {
    await sharp(buf).resize({ height }).webp({ quality: 92, alphaQuality: 100, effort: 5 }).toFile(await out(file));
    console.log("✓", file);
  };
  await saveWebp(lockup, "branding/logo-horizontal.webp", 160);
  await saveWebp(await tint(lockup, cream), "branding/logo-horizontal-light.webp", 160);

  // Dikey (slogan dahil): amblem + yazı + slogan
  const stacked = await sharp(full).extract({ left: 150, top: 200, width: 950, height: 830 }).png().toBuffer();
  const stackedTrim = await trim(stacked);
  await saveWebp(stackedTrim, "branding/logo-stacked.webp", 700);
  await saveWebp(await tint(stackedTrim, cream), "branding/logo-stacked-light.webp", 700);

  // Favicon / apple-touch: krem zemin üzerinde amblem
  const mk = async (size, file, bgc) => {
    const inner = await sharp(mark).resize({ height: Math.round(size * 0.66) }).png().toBuffer();
    const im = await sharp(inner).metadata();
    await sharp({ create: { width: size, height: size, channels: 4, background: bgc } })
      .composite([{ input: inner, left: Math.round((size - im.width) / 2), top: Math.round((size - im.height) / 2) }])
      .png()
      .toFile(path.resolve(file));
    console.log("✓", file);
  };
  await mk(512, "src/app/icon.png", { r: 250, g: 249, b: 245, alpha: 1 });
  await mk(180, "src/app/apple-icon.png", { r: 250, g: 249, b: 245, alpha: 1 });
  await rm(path.resolve("src/app/icon.svg"), { force: true });

  // Paylaşım görseli (Open Graph) 1200x630: solda logo, sağda fotoğraflar
  const ogW = 1200;
  const ogH = 630;
  const photoW = 235;
  const cols = ["ejderha-meyvesi", "mango", "avokado"];
  const layers = [];
  for (let i = 0; i < cols.length; i++) {
    layers.push({
      input: await sharp(photo(cols[i])).resize(photoW, ogH, { fit: "cover", position: "attention" }).toBuffer(),
      left: ogW - (cols.length - i) * (photoW + 6) + 6,
      top: 0,
    });
  }
  const logoForOg = await sharp(stackedTrim).resize({ height: 430 }).png().toBuffer();
  const lo = await sharp(logoForOg).metadata();
  await sharp({ create: { width: ogW, height: ogH, channels: 3, background: { r: 250, g: 249, b: 245 } } })
    .composite([...layers, { input: logoForOg, left: Math.round((ogW - cols.length * (photoW + 6) - lo.width) / 2), top: Math.round((ogH - lo.height) / 2) }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(await out("branding/og-default.jpg"));
  console.log("✓ branding/og-default.jpg");
}

/* ---------------------------------------------------------------- eski dosyaları temizle */
async function cleanup() {
  for (const f of ["avokado-sert-ham", "avokado-olgunlasmaya-yakin", "avokado-tuketime-hazir"]) {
    await rm(path.join(OUT, `hero/${f}.webp`), { force: true });
  }
}

const only = process.argv[2];
const steps = { products, hero, sections, instagram, logos, cleanup };
for (const [name, fn] of Object.entries(steps)) {
  if (!only || only === name) await fn();
}
