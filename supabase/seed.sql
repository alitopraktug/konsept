-- Konsept — başlangıç ürünleri. Tekrar çalıştırmak güvenlidir (slug çakışırsa atlar;
-- sonradan admin panelinden değiştirdiğiniz fiyat/stok EZİLMEZ).
-- src/lib/seed-products.ts ile birebir aynı içeriktedir.

insert into public.products
  (name, slug, short_description, description, price, unit, stock_status, cover_image, images, featured, active, display_order, ripeness_enabled)
values
  ('Avokado', 'avokado',
   'Kremamsı dokusu ve kendine özgü tadıyla kahvaltıdan salataya birçok tarifte kullanılabilir.',
   E'Kremamsı dokusu ve kendine özgü tadıyla kahvaltıdan salataya birçok tarifte kullanılabilir.\nSipariş verirken tüketmek istediğiniz zamana göre olgunluk seçebilirsiniz: sert/ham, olgunlaşmaya yakın veya tüketime hazır.',
   350, 'kg', 'in_stock', '/images/products/avokado/avokado-cover.webp', '{}', true, true, 10, true),

  ('Mango', 'mango',
   'Yoğun aroması ve tatlı yapısıyla taze tüketim, tatlı ve içecekler için tercih edilen tropikal meyve.',
   E'Yoğun aroması ve tatlı yapısıyla taze tüketim, tatlı ve içecekler için tercih edilen tropikal meyve.\nDilimlenerek taze tüketilebilir; smoothie, tatlı ve meyve tabaklarında kullanılabilir.',
   350, 'kg', 'in_stock', '/images/products/mango/mango-cover.webp', '{}', true, true, 20, false),

  ('Muz', 'muz',
   'Günlük tüketim, tatlı ve içecekler için pratik ve sevilen bir seçenek.',
   E'Günlük tüketim, tatlı ve içecekler için pratik ve sevilen bir seçenek.\nKahvaltıda, atıştırmalık olarak, smoothie ve tatlılarda kullanılabilir.',
   100, 'kg', 'in_stock', '/images/products/muz/muz-cover.webp', '{}', false, true, 30, false),

  ('Mistik / Çarkıfelek', 'carkifelek',
   'Aromatik ve hafif ekşi-tatlı yapısıyla içeceklerde, tatlılarda ve sunumlarda öne çıkan egzotik meyve.',
   E'Aromatik ve hafif ekşi-tatlı yapısıyla içeceklerde, tatlılarda ve sunumlarda öne çıkan egzotik meyve.\nİçindeki çekirdekli pulpu içeceklerde, tatlılarda, soslarda ve sunumlarda kullanılabilir.',
   350, 'kg', 'in_stock', '/images/products/carkifelek/carkifelek-cover.webp', '{}', true, true, 40, false),

  ('Limon', 'limon',
   'Mutfakta, içeceklerde ve günlük kullanımda tercih edilen taze limon.',
   E'Mutfakta, içeceklerde ve günlük kullanımda tercih edilen taze limon.\nSalata, yemek, içecek ve sunumlarda kullanılabilir.',
   120, 'kg', 'in_stock', '/images/products/limon/limon-cover.webp', '{}', false, true, 50, false),

  ('Papaya', 'papaya',
   'Yumuşak dokusu ve tatlı aromasıyla taze tüketim, smoothie ve meyve tabakları için uygun tropikal meyve.',
   E'Yumuşak dokusu ve tatlı aromasıyla taze tüketim, smoothie ve meyve tabakları için uygun tropikal meyve.\nİkiye bölünüp çekirdekleri alınarak kaşıkla tüketilebilir.',
   350, 'kg', 'in_stock', null, '{}', false, true, 60, false),

  ('Ejderha Meyvesi', 'ejderha-meyvesi',
   'Dikkat çekici görünümü ve hafif aromasıyla taze tüketim ve sunumlarda öne çıkan egzotik meyve.',
   E'Dikkat çekici görünümü ve hafif aromasıyla taze tüketim ve sunumlarda öne çıkan egzotik meyve.\nOrtadan kesilip kaşıkla tüketilebilir; meyve tabaklarında, smoothie bowl ve sunumlarda kullanılabilir.',
   320, 'kg', 'in_stock', '/images/products/ejderha-meyvesi/ejderha-meyvesi-cover.webp', '{}', true, true, 70, false)
on conflict (slug) do nothing;
