# samedcimen.github.io

Samed Çimen'in kişisel sitesi: neo-brütalist tasarımlı, tek sayfalık portfolyo.

**Teknoloji:** Next.js 16 (statik export) · React 19 · Tailwind CSS 4 · Space Grotesk

## Geliştirme

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # statik çıktı: out/
```

## Düzenleme

- Metinler, istatistikler, ürünler, yetenekler ve iletişim bağlantıları: `lib/data.ts`
- Sayfa: `app/page.tsx`
- Görseller (profil fotoğrafı, ürün ekran görüntüleri): `public/img/`

## Yayın

`main` dalına her push'ta `.github/workflows/deploy.yml` siteyi GitHub Pages'e yayınlar.
