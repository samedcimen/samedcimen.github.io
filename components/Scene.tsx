"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll-state";
import { galaxy, randoms, sphere, stars, text, torusKnot } from "@/lib/shapes";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uBirth;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uVelocity;
  uniform vec2 uMouse;
  uniform float uAspect;

  attribute vec3 aP1;
  attribute vec3 aP2;
  attribute vec3 aP3;
  attribute float aRand;

  varying float vRand;
  varying float vGlow;
  varying float vDepth;

  // Ashima Arts simplex noise
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
    vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  float stage(float m, float k){
    // Her parçacık biraz gecikmeli yola çıkar: dalga hissi
    float t = clamp((m - k) * 1.6 - aRand * 0.6, 0., 1.);
    return t * t * (3. - 2. * t);
  }

  void main(){
    float s1 = stage(uMorph, 0.);
    float s2 = stage(uMorph, 1.);
    float s3 = stage(uMorph, 2.);

    vec3 p = mix(position, aP1, s1);
    p = mix(p, aP2, s2);
    p = mix(p, aP3, s3);

    // Geçiş anında parçacıklar dağılır, sonra yerine oturur
    float transit = sin(s1 * 3.14159) + sin(s2 * 3.14159) + sin(s3 * 3.14159);
    float n = snoise(p * 0.55 + uTime * 0.12 + aRand);
    float flow = 0.06 + transit * 0.55 + abs(uVelocity) * 0.04;
    p += vec3(
      snoise(p * 0.4 + vec3(uTime * 0.1, 0., 0.)),
      snoise(p * 0.4 + vec3(0., uTime * 0.1, 7.)),
      snoise(p * 0.4 + vec3(13., 0., uTime * 0.1))
    ) * flow;

    // Doğuş: uzaydan merkeze akın
    float b = clamp(uBirth * 1.4 - aRand * 0.4, 0., 1.);
    b = 1. - pow(1. - b, 3.);
    p *= mix(6. + aRand * 10., 1., b);

    vec4 mv = modelViewMatrix * vec4(p, 1.);
    vec4 clip = projectionMatrix * mv;

    // Fare ekranda parçacıkları iter
    vec2 ndc = clip.xy / clip.w;
    vec2 d = (ndc - uMouse) * vec2(uAspect, 1.);
    float dist = length(d);
    float force = smoothstep(0.38, 0., dist);
    mv.xy += normalize(d + 1e-5) * force * 0.55 * (0.6 + aRand);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.35 + pow(aRand, 3.) * 1.6) * (1. + force * 1.5);
    gl_PointSize = size * uPixelRatio / -mv.z;

    vRand = aRand;
    vGlow = force + transit * 0.3 + n * 0.15;
    vDepth = smoothstep(9., 3., -mv.z);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uOpacity;
  varying float vRand;
  varying float vGlow;
  varying float vDepth;

  void main(){
    float d = length(gl_PointCoord - .5);
    if (d > .5) discard;
    float core = smoothstep(.5, .0, d);
    core = pow(core, 2.2);
    // Yarısı köz turuncusu, yarısı buz mavisi; arada ince bir geçiş
    // Boyut aRand'dan türüyor; renk için ondan bağımsız bir değer kullan
    float hue = fract(vRand * 13.73);
    vec3 col = mix(uColorA * 1.25, uColorB, smoothstep(.45, .55, hue));
    col = mix(col, uColorC, clamp(vGlow, 0., 1.) * .8);
    float a = core * (.35 + vDepth * .65) * uOpacity;
    gl_FragColor = vec4(col * (1. + vGlow * .6), a);
  }
`;

type Props = { count: number; mobile: boolean };

// Her şekil için grup konumu/saydamlığı: [hero, hakkımda, yetenekler, iletişim]
const POS_X_DESKTOP = [1.75, 0, 0, 0];
const OPACITY = [1, 0.7, 0.5, 1];
const TILT_X = [0.15, 1.05, 0.35, 0];
const SPIN = [1, 1, 1, 0];

function pick(arr: number[], m: number) {
  const i = Math.min(Math.floor(m), arr.length - 2);
  const t = THREE.MathUtils.smootherstep(m - i, 0, 1);
  return THREE.MathUtils.lerp(arr[i], arr[i + 1], t);
}

function Particles({ count, mobile }: Props) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const spin = useRef(0);
  const smooth = useRef({ morph: 0, mx: 0, my: 0, vel: 0, birth: 0 });
  const { size, viewport } = useThree();

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(sphere(count), 3));
    g.setAttribute("aP1", new THREE.BufferAttribute(galaxy(count), 3));
    g.setAttribute("aP2", new THREE.BufferAttribute(torusKnot(count), 3));
    g.setAttribute("aP3", new THREE.BufferAttribute(text(count, "SÇ", mobile ? 3.6 : 5.6), 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(randoms(count), 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 50);
    return g;
  }, [count, mobile]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uBirth: { value: 0 },
      uSize: { value: mobile ? 34 : 42 },
      uPixelRatio: { value: 1 },
      uVelocity: { value: 0 },
      uMouse: { value: new THREE.Vector2(9, 9) },
      uAspect: { value: 1 },
      uOpacity: { value: 1 },
      uColorA: { value: new THREE.Color("#ff6a2b") },
      uColorB: { value: new THREE.Color("#8fb8ff") },
      uColorC: { value: new THREE.Color("#fff3e0") },
    }),
    [mobile],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = smooth.current;
    const k = 1 - Math.exp(-dt * 4);
    s.morph += (scrollState.morph - s.morph) * k;
    s.mx += (scrollState.mouseX - s.mx) * (1 - Math.exp(-dt * 6));
    s.my += (scrollState.mouseY - s.my) * (1 - Math.exp(-dt * 6));
    s.vel += (scrollState.velocity - s.vel) * k;
    if (scrollState.revealed) s.birth = Math.min(1, s.birth + dt * 0.55);

    const u = material.current!.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uMorph.value = s.morph;
    u.uBirth.value = s.birth;
    u.uVelocity.value = s.vel;
    u.uMouse.value.set(s.mx, s.my);
    u.uAspect.value = size.width / size.height;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    u.uOpacity.value = pick(OPACITY, s.morph);

    const g = group.current!;
    spin.current += dt * (0.12 + Math.abs(s.vel) * 0.004);
    const spinW = pick(SPIN, s.morph);
    g.rotation.y = spin.current * spinW + s.mx * 0.25;
    g.rotation.x = pick(TILT_X, s.morph) - s.my * 0.15;
    const xs = mobile ? 0 : pick(POS_X_DESKTOP, s.morph) * Math.min(1, viewport.width / 11);
    // İmza, iletişimdeki boşluğun ekrandaki yerine oturur
    const sigY = (scrollState.signatureY * viewport.height) / 2;
    g.position.set(xs, sigY * THREE.MathUtils.smoothstep(s.morph, 2, 3), 0);
    const scale = mobile ? 0.72 : 1;
    g.scale.setScalar(scale);
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/** Uzak arka plan yıldızları: derinlik hissi için yavaşça döner. */
function Stars({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(stars(count), 3));
    return g;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.008;
    ref.current.rotation.x = scrollState.morph * 0.25;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color="#c9d6ff" size={0.06} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

export default function Scene({ mobile }: { mobile: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      dpr={[1, mobile ? 1.5 : 2]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Particles count={mobile ? 9000 : 24000} mobile={mobile} />
      <Stars count={mobile ? 600 : 1500} />
    </Canvas>
  );
}
