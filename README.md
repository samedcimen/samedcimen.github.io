# samedcimen.github.io

Samed Çimen'in kişisel sitesi. Three.js parçacık evreni: kaydırdıkça küre → galaksi → düğüm → "SÇ" imzasına dönüşür.

**Teknoloji:** Next.js 16 (statik export) · React 19 · Three.js / React Three Fiber · Motion · Lenis · Tailwind CSS 4

## Geliştirme

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # statik çıktı: out/
```

## Düzenleme

- Metinler, yetenekler ve bağlantılar: `lib/data.ts`
- Parçacık şekilleri: `lib/shapes.ts`, shader ve sahne: `components/Scene.tsx`

## Yayın

`main` dalına her push'ta `.github/workflows/deploy.yml` siteyi GitHub Pages'e yayınlar.
Depo ayarlarında **Settings → Pages → Source: GitHub Actions** seçili olmalıdır.
