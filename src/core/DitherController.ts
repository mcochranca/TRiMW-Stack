import * as THREE from 'three';

export class DitherController {
  private texture: THREE.Texture | null = null;
  private material: THREE.ShaderMaterial | null = null;

  constructor() {
    this.initShader();
  }

  private initShader() {
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        gl_FragColor = vec4(vec3(gray), 1.0);
      }
    `;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null }
      },
      vertexShader,
      fragmentShader
    });
  }

  public getMaterial(): THREE.ShaderMaterial | null {
    return this.material;
  }

  public setTexture(texture: THREE.Texture) {
    this.texture = texture;
    if (this.material) {
      this.material.uniforms.tDiffuse.value = texture;
    }
  }
}