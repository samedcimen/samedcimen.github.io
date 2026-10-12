// Parçacıkların dönüştüğü şekiller. Hepsi aynı sayıda nokta üretir ki
// shader içinde birinden diğerine yumuşakça geçilebilsin.

function rand(seed: { s: number }) {
  // mulberry32: her yüklemede aynı görüntü için deterministik
  let t = (seed.s += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function sphere(count: number, radius = 2.1) {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const seed = { s: 1 };
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    // Yüzeyin hemen altında ince bir kabuk: daha hacimli görünür
    const shell = radius * (0.92 + rand(seed) * 0.08) * (rand(seed) < 0.06 ? 0.55 + rand(seed) * 0.3 : 1);
    out[i * 3] = Math.cos(theta) * r * shell;
    out[i * 3 + 1] = y * shell;
    out[i * 3 + 2] = Math.sin(theta) * r * shell;
  }
  return out;
}

export function galaxy(count: number, radius = 3.4) {
  const out = new Float32Array(count * 3);
  const seed = { s: 2 };
  const branches = 4;
  for (let i = 0; i < count; i++) {
    const r = Math.pow(rand(seed), 1.6) * radius;
    const branch = ((i % branches) / branches) * Math.PI * 2;
    const spin = r * 1.15;
    const spread = 0.35 * (1 - r / radius) + 0.08;
    const rx = Math.pow(rand(seed), 3) * (rand(seed) < 0.5 ? 1 : -1) * spread * 2.2;
    const ry = Math.pow(rand(seed), 3) * (rand(seed) < 0.5 ? 1 : -1) * spread * 0.9;
    const rz = Math.pow(rand(seed), 3) * (rand(seed) < 0.5 ? 1 : -1) * spread * 2.2;
    out[i * 3] = Math.cos(branch + spin) * r + rx;
    out[i * 3 + 1] = ry;
    out[i * 3 + 2] = Math.sin(branch + spin) * r + rz;
  }
  return out;
}

export function torusKnot(count: number, scale = 1.25, p = 2, q = 3) {
  const out = new Float32Array(count * 3);
  const seed = { s: 3 };
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const r = 1.2 + 0.5 * Math.cos(q * t);
    const cx = r * Math.cos(p * t);
    const cy = r * Math.sin(p * t);
    const cz = 0.5 * Math.sin(q * t);
    // Tüp etrafında rastgele saçılma
    const a = rand(seed) * Math.PI * 2;
    const tube = 0.22 * Math.sqrt(rand(seed));
    out[i * 3] = (cx + Math.cos(a) * tube) * scale;
    out[i * 3 + 1] = (cy + Math.sin(a) * tube) * scale;
    out[i * 3 + 2] = (cz + Math.cos(a + 1.3) * tube) * scale;
  }
  return out;
}

/** Bir metni 2D tuvale çizip dolu piksellerden nokta örnekler. */
export function text(count: number, label = "SÇ", width = 5.6) {
  const out = new Float32Array(count * 3);
  const seed = { s: 4 };
  const W = 512;
  const H = 256;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return sphere(count);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 210px "Arial Black", Arial, sans-serif`;
  ctx.fillText(label, W / 2, H / 2 + 8);
  const data = ctx.getImageData(0, 0, W, H).data;
  const filled: number[] = [];
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      if (data[(y * W + x) * 4 + 3] > 128) filled.push(x, y);
    }
  }
  if (filled.length === 0) return sphere(count);
  const k = width / W;
  for (let i = 0; i < count; i++) {
    const j = Math.floor(rand(seed) * (filled.length / 2)) * 2;
    out[i * 3] = (filled[j] - W / 2 + rand(seed)) * k;
    out[i * 3 + 1] = -(filled[j + 1] - H / 2 + rand(seed)) * k;
    out[i * 3 + 2] = (rand(seed) - 0.5) * 0.35;
  }
  return out;
}

export function randoms(count: number) {
  const out = new Float32Array(count);
  const seed = { s: 5 };
  for (let i = 0; i < count; i++) out[i] = rand(seed);
  return out;
}

/** Uzak arka plan yıldızları için geniş bir kabuk. */
export function stars(count: number) {
  const out = new Float32Array(count * 3);
  const seed = { s: 6 };
  for (let i = 0; i < count; i++) {
    const r = 14 + rand(seed) * 26;
    const th = rand(seed) * Math.PI * 2;
    const ph = Math.acos(2 * rand(seed) - 1);
    out[i * 3] = r * Math.sin(ph) * Math.cos(th);
    out[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    out[i * 3 + 2] = r * Math.cos(ph);
  }
  return out;
}
