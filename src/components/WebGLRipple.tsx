import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const finalFragmentShader = `
uniform sampler2D u_texture;
uniform sampler2D u_displacement;
uniform float u_image_aspect;
uniform float u_plane_aspect;
varying vec2 vUv;

void main() {
  vec2 ratio = vec2(
    min((u_plane_aspect / u_image_aspect), 1.0),
    min((u_image_aspect / u_plane_aspect), 1.0)
  );
  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
  vec4 displacement = texture2D(u_displacement, uv);
  vec2 newUv = uv - (displacement.xy * 0.02);
  gl_FragColor = texture2D(u_texture, newUv);
}
`;

const advectionFragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uGridSize;
uniform float uDissipation;
varying vec2 vUv;

void main() {
  vec4 data = texture2D(uTexture, vUv);
  vec2 pos = vUv - data.rg * uGridSize * 0.7;
  vec4 texColor = texture2D(uTexture, pos);
  gl_FragColor = vec4(texColor.rg * uDissipation, 0.0, 0.0);
}
`;

const divergenceFragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uGridSize;
varying vec2 vUv;

void main() {
  vec4 texel = texture2D(uTexture, vUv);
  vec4 up = texture2D(uTexture, vUv + vec2(0.0, uGridSize.y));
  vec4 down = texture2D(uTexture, vUv - vec2(0.0, uGridSize.y));
  vec4 left = texture2D(uTexture, vUv - vec2(uGridSize.x, 0.0));
  vec4 right = texture2D(uTexture, vUv + vec2(uGridSize.x, 0.0));
  float divergence = ((right.r - left.r) + (up.g - down.g)) * 0.5;
  gl_FragColor = vec4(divergence, 0.0, 0.0, 0.0);
}
`;

const pressureFragmentShader = `
uniform sampler2D uTexture;
uniform sampler2D uDivergence;
uniform vec2 uGridSize;
varying vec2 vUv;

void main() {
  float left = texture2D(uTexture, vUv - vec2(uGridSize.x, 0.0)).r;
  float right = texture2D(uTexture, vUv + vec2(uGridSize.x, 0.0)).r;
  float up = texture2D(uTexture, vUv + vec2(0.0, uGridSize.y)).r;
  float down = texture2D(uTexture, vUv - vec2(0.0, uGridSize.y)).r;
  float divergence = texture2D(uDivergence, vUv).r;
  float pressure = (left + right + up + down + divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 0.0);
}
`;

const velocityFragmentShader = `
uniform sampler2D uTexture;
uniform sampler2D uPressure;
uniform vec2 uGridSize;
varying vec2 vUv;

void main() {
  vec2 vel = texture2D(uTexture, vUv).rg;
  float left = texture2D(uPressure, vUv - vec2(uGridSize.x, 0.0)).r;
  float right = texture2D(uPressure, vUv + vec2(uGridSize.x, 0.0)).r;
  float up = texture2D(uPressure, vUv + vec2(0.0, uGridSize.y)).r;
  float down = texture2D(uPressure, vUv - vec2(0.0, uGridSize.y)).r;
  vel.x -= (right - left) * 0.5;
  vel.y -= (up - down) * 0.5;
  gl_FragColor = vec4(vel, 0.0, 0.0);
}
`;

const injectFragmentShader = `
uniform vec2 uPoint;
uniform vec2 uVelocity;
varying vec2 vUv;

void main() {
  float dist = distance(vUv, uPoint);
  float strength = smoothstep(0.05, 0.0, dist);
  vec2 vel = uVelocity * strength;
  gl_FragColor = vec4(vel, 0.0, 0.0);
}
`;

interface WebGLRippleProps {
  imageUrl: string;
  className?: string;
}

export function WebGLRipple({ imageUrl, className = '' }: WebGLRippleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5, prevX: 0.5, prevY: 0.5, vx: 0, vy: 0 });
  const fluidRef = useRef({
    readFluid: null as THREE.WebGLRenderTarget | null,
    writeFluid: null as THREE.WebGLRenderTarget | null,
    readDivergence: null as THREE.WebGLRenderTarget | null,
    writeDivergence: null as THREE.WebGLRenderTarget | null,
    readPressure: null as THREE.WebGLRenderTarget | null,
    writePressure: null as THREE.WebGLRenderTarget | null,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.offsetWidth || 800;
    const height = container.offsetHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const texSize = 256;
    const fluidTargets = {
      readFluid: new THREE.WebGLRenderTarget(texSize, texSize, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat }),
      writeFluid: new THREE.WebGLRenderTarget(texSize, texSize, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat }),
      readDivergence: new THREE.WebGLRenderTarget(texSize, texSize, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat }),
      writeDivergence: new THREE.WebGLRenderTarget(texSize, texSize, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat }),
      readPressure: new THREE.WebGLRenderTarget(texSize, texSize, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat }),
      writePressure: new THREE.WebGLRenderTarget(texSize, texSize, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat }),
    };
    fluidRef.current = fluidTargets;

    const geometry = new THREE.PlaneGeometry(2, 2);

    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const imgAspect = texture.image.naturalWidth / texture.image.naturalHeight;
      const planeAspect = width / height;

      const finalMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: finalFragmentShader,
        uniforms: {
          u_texture: { value: texture },
          u_displacement: { value: fluidTargets.readFluid.texture },
          u_image_aspect: { value: imgAspect },
          u_plane_aspect: { value: planeAspect },
        },
      });

      const finalMesh = new THREE.Mesh(geometry, finalMaterial);
      scene.add(finalMesh);

      const fluidScene = new THREE.Scene();
      const fluidCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const advectionMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: advectionFragmentShader,
        uniforms: {
          uTexture: { value: fluidTargets.readFluid.texture },
          uGridSize: { value: new THREE.Vector2(1 / texSize, 1 / texSize) },
          uDissipation: { value: 0.98 },
        },
      });

      const divergenceMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: divergenceFragmentShader,
        uniforms: {
          uTexture: { value: fluidTargets.readFluid.texture },
          uGridSize: { value: new THREE.Vector2(1 / texSize, 1 / texSize) },
        },
      });

      const pressureMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: pressureFragmentShader,
        uniforms: {
          uTexture: { value: fluidTargets.readPressure.texture },
          uDivergence: { value: fluidTargets.readDivergence.texture },
          uGridSize: { value: new THREE.Vector2(1 / texSize, 1 / texSize) },
        },
      });

      const velocityMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: velocityFragmentShader,
        uniforms: {
          uTexture: { value: fluidTargets.readFluid.texture },
          uPressure: { value: fluidTargets.readPressure.texture },
          uGridSize: { value: new THREE.Vector2(1 / texSize, 1 / texSize) },
        },
      });

      const injectMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: injectFragmentShader,
        uniforms: {
          uPoint: { value: new THREE.Vector2(0.5, 0.5) },
          uVelocity: { value: new THREE.Vector2(0, 0) },
        },
      });

      const fluidMesh = new THREE.Mesh(geometry, advectionMaterial);
      fluidScene.add(fluidMesh);

      const swap = (a: 'readFluid' | 'writeFluid' | 'readDivergence' | 'writeDivergence' | 'readPressure' | 'writePressure', b: 'readFluid' | 'writeFluid' | 'readDivergence' | 'writeDivergence' | 'readPressure' | 'writePressure') => {
        const temp = fluidTargets[a];
        fluidTargets[a] = fluidTargets[b];
        fluidTargets[b] = temp;
      };

      const animate = () => {
        frameRef.current = requestAnimationFrame(animate);

        const mouse = mouseRef.current;
        const mouseInfluence = Math.min(30, Math.abs(mouse.vx) + Math.abs(mouse.vy));
        const velScale = mouseInfluence * 0.001 * 0.5;

        if (mouseInfluence > 0.5) {
          injectMaterial.uniforms.uPoint.value.set(mouse.x, 1 - mouse.y);
          injectMaterial.uniforms.uVelocity.value.set(mouse.vx * velScale, -mouse.vy * velScale);
          fluidMesh.material = injectMaterial;
          renderer.setRenderTarget(fluidTargets.writeFluid);
          renderer.render(fluidScene, fluidCamera);
          swap('readFluid', 'writeFluid');
        }

        advectionMaterial.uniforms.uTexture.value = fluidTargets.readFluid.texture;
        fluidMesh.material = advectionMaterial;
        renderer.setRenderTarget(fluidTargets.writeFluid);
        renderer.render(fluidScene, fluidCamera);
        swap('readFluid', 'writeFluid');

        divergenceMaterial.uniforms.uTexture.value = fluidTargets.readFluid.texture;
        fluidMesh.material = divergenceMaterial;
        renderer.setRenderTarget(fluidTargets.writeDivergence);
        renderer.render(fluidScene, fluidCamera);
        swap('readDivergence', 'writeDivergence');

        for (let i = 0; i < 4; i++) {
          pressureMaterial.uniforms.uTexture.value = fluidTargets.readPressure.texture;
          pressureMaterial.uniforms.uDivergence.value = fluidTargets.readDivergence.texture;
          fluidMesh.material = pressureMaterial;
          renderer.setRenderTarget(fluidTargets.writePressure);
          renderer.render(fluidScene, fluidCamera);
          swap('readPressure', 'writePressure');
        }

        velocityMaterial.uniforms.uTexture.value = fluidTargets.readFluid.texture;
        velocityMaterial.uniforms.uPressure.value = fluidTargets.readPressure.texture;
        fluidMesh.material = velocityMaterial;
        renderer.setRenderTarget(fluidTargets.writeFluid);
        renderer.render(fluidScene, fluidCamera);
        swap('readFluid', 'writeFluid');

        finalMaterial.uniforms.u_displacement.value = fluidTargets.readFluid.texture;
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);

        mouse.vx *= 0.9;
        mouse.vy *= 0.9;
      };

      animate();
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current.vx = (x - mouseRef.current.x) * 100;
      mouseRef.current.vy = (y - mouseRef.current.y) * 100;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
    };

    container.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      const w = container.offsetWidth || 800;
      const h = container.offsetHeight || 500;
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      Object.values(fluidTargets).forEach((t) => t?.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageUrl]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', overflow: 'hidden', cursor: 'pointer' }}
    />
  );
}
