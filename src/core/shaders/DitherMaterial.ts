import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float ditherScale;
  varying vec2 vUv;
  
  float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }
  
  void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    float dither = rand(vUv * ditherScale);
    float output = step(dither, gray);
    gl_FragColor = vec4(vec3(output), 1.0);
  }
`;

export class DitherMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        tDiffuse: { value: null },
        ditherScale: { value: 1.0 }
      },
      vertexShader,
      fragmentShader
    });
  }

  setTexture(texture: THREE.Texture) {
    this.uniforms.tDiffuse.value = texture;
  }

  setDitherScale(scale: number) {
    this.uniforms.ditherScale.value = scale;
  }
}