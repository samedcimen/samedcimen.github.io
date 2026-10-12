// React render döngüsünün dışında, her karede okunan paylaşılan durum.
// Lenis yazar, WebGL sahnesi useFrame içinde okur.
import type Lenis from "lenis";

export const scrollState = {
  /** Etkin yumuşak kaydırma örneği (azaltılmış harekette null). */
  lenis: null as Lenis | null,
  /** 0 → 3 arası; hangi parçacık şeklinde olduğumuzu belirtir. */
  morph: 0,
  /** Lenis'ten gelen anlık kaydırma hızı. */
  velocity: 0,
  /** Ekran koordinatlarında fare (-1..1). */
  mouseX: 9,
  mouseY: 9,
  /** İletişimdeki imza boşluğunun ekran merkezine göre dikey konumu (-1..1). */
  signatureY: 0,
  /** Yükleme ekranı bitti mi? Sahnenin "doğuşunu" tetikler. */
  revealed: false,
};

export const sectionIds = ["hero", "hakkimda", "yetenekler", "iletisim"];
