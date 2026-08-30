import React, { useRef, useEffect, useState } from 'react';

interface LightStreaksProps {
  colorBg?: string;
  colorGlow?: string;
  colorCore?: string;
  speed?: number;
  intensity?: number;
  thickness?: number;
  thicknessSpeed?: number;
  streamCount?: number;
  direction?: 'down' | 'up';
  style?: React.CSSProperties;
}

function parseColor(color: string): [number, number, number] {
  if (!color) return [1, 1, 1];
  const hexMatch = color.match(/^#([0-9a-fA-F]+)$/);
  if (hexMatch) {
    let h = hexMatch[1];
    if (h.length === 3 || h.length === 4) {
      h = h.split('').map(c => c + c).join('');
    }
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255
    ];
  }
  const rgbMatch = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
  if (rgbMatch) return [+rgbMatch[1] / 255, +rgbMatch[2] / 255, +rgbMatch[3] / 255];
  
  // Basic HSL parser fallback
  const hslMatch = color.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/);
  if (hslMatch) {
    const h = +hslMatch[1] / 360, s = +hslMatch[2] / 100, l = +hslMatch[3] / 100;
    if (s === 0) return [l, l, l];
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p2 = 2 * l - q;
    const hue = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    return [hue(p2, q, h + 1/3), hue(p2, q, h), hue(p2, q, h - 1/3)];
  }
  return [1, 1, 1];
}

const VS = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

const FS = `
    precision highp float;

    uniform vec2  u_resolution;
    uniform float u_time;

    uniform vec3  u_colorBg;
    uniform vec3  u_colorGlow;
    uniform vec3  u_colorCore;

    uniform float u_speed;
    uniform float u_intensity;
    uniform float u_thickness;
    uniform float u_thickSpeed;
    uniform float u_count;
    uniform float u_dir;        

    float hash11(float p) {
        p = fract(p * 0.1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
    }

    float noise11(float p) {
        float i = floor(p);
        float f = fract(p);
        float u = f * f * (3.0 - 2.0 * f);
        return mix(hash11(i), hash11(i + 1.0), u);
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p  = uv * 2.0 - 1.0;

        float time      = u_time * u_speed;
        float glowAcc   = 0.0;   
        float coreAcc   = 0.0;   
        float n         = u_count;

        for (float i = 0.0; i < 60.0; i++) {
            if (i >= n) break;

            float h1 = hash11(i * 12.34);
            float h2 = hash11(i * 56.78);
            float h3 = hash11(i * 90.12);

            float posX = (h1 * 2.0 - 1.0) * 0.9;
            posX = sign(posX) * pow(abs(posX), 1.3);
            float d = abs(p.x - posX);

            float spd    = mix(0.8, 3.5, h3);
            float yOff   = u_dir * time * spd + h1 * 100.0;
            float lenFac = mix(1.0, 2.5, h2);
            float vFade  = noise11(uv.y * lenFac - yOff);
            vFade        = smoothstep(0.3, 0.9, vFade);

            float pulse  = sin(u_time * u_thickSpeed + h2 * 6.2831) * 0.5 + 0.5;
            float minW   = 0.001;
            float maxW   = u_thickness * mix(0.5, 1.5, h3);
            float curW   = mix(minW, maxW, pulse);

            float core   = exp(-d * 250.0 / (curW * 80.0));
            float glow   = exp(-d *  25.0 / (curW * 50.0)) * 0.8;

            float alpha  = vFade * u_intensity;
            float weight = mix(0.4, 1.5, h1);

            coreAcc += core * alpha * weight;
            glowAcc += glow * alpha * weight;
        }

        float maskX = smoothstep(1.0, 0.15, abs(p.x));
        float maskY = smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.85, uv.y);
        float mask  = maskX * maskY;
        coreAcc *= mask;
        glowAcc *= mask;

        float glowAlpha = clamp(glowAcc, 0.0, 1.0) * 0.65;
        float coreAlpha = clamp(coreAcc, 0.0, 1.0) * 0.85;

        vec3 color = mix(u_colorGlow, u_colorCore, coreAlpha);
        float finalAlpha = max(glowAlpha, coreAlpha) * mask;

        float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453) * 0.012;
        color += grain - 0.006;

        gl_FragColor = vec4(clamp(color, 0.0, 1.0), finalAlpha);
    }
\`;

export const LightStreaks: React.FC<LightStreaksProps> = ({
  colorBg = '#0A0A12',
  colorGlow = '#3366FF',
  colorCore = '#FFFFFF',
  speed = 3,
  intensity = 4,
  thickness = 4,
  thicknessSpeed = 3,
  streamCount = 5,
  direction = 'down',
  style
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uRef = useRef({ colorBg, colorGlow, colorCore, speed, intensity, thickness, thicknessSpeed, streamCount, direction });

  useEffect(() => {
    uRef.current = { colorBg, colorGlow, colorCore, speed, intensity, thickness, thicknessSpeed, streamCount, direction };
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setIsVisible(e.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
    if (!gl) {
      console.error('LightStreaks: WebGL not supported');
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('LightStreaks shader compile error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VS);
    const fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('LightStreaks link error:', gl.getProgramInfoLog(prog));
      return;
    }

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const L = {
      resolution: gl.getUniformLocation(prog, 'u_resolution'),
      time: gl.getUniformLocation(prog, 'u_time'),
      colorBg: gl.getUniformLocation(prog, 'u_colorBg'),
      colorGlow: gl.getUniformLocation(prog, 'u_colorGlow'),
      colorCore: gl.getUniformLocation(prog, 'u_colorCore'),
      speed: gl.getUniformLocation(prog, 'u_speed'),
      intensity: gl.getUniformLocation(prog, 'u_intensity'),
      thickness: gl.getUniformLocation(prog, 'u_thickness'),
      thickSpeed: gl.getUniformLocation(prog, 'u_thickSpeed'),
      count: gl.getUniformLocation(prog, 'u_count'),
      dir: gl.getUniformLocation(prog, 'u_dir')
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const t0 = performance.now();
    let raf = -1;

    const render = (now: number) => {
      if (!canvas) return;
      const u = uRef.current;
      const pw = Math.round(canvas.clientWidth * dpr);
      const ph = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
        gl.viewport(0, 0, pw, ph);
      }

      const sSpeed = 0.1 + u.speed * 0.49;
      const sIntense = 0.2 + u.intensity * 0.33;
      const tNorm = u.thickness / 10;
      const sThick = 0.001 + tNorm * tNorm * 0.049;
      const sThickSpd = 0.1 + u.thicknessSpeed * 0.99;
      const sCount = 10 + u.streamCount * 5;
      const sDir = u.direction === 'up' ? -1 : 1;

      const [br, bg2, bb] = parseColor(u.colorBg);
      const [gr, gg, gb] = parseColor(u.colorGlow);
      const [cr, cg, cb] = parseColor(u.colorCore);

      gl.uniform2f(L.resolution, canvas.width, canvas.height);
      gl.uniform1f(L.time, (now - t0) / 1000);
      gl.uniform3f(L.colorBg, br, bg2, bb);
      gl.uniform3f(L.colorGlow, gr, gg, gb);
      gl.uniform3f(L.colorCore, cr, cg, cb);
      gl.uniform1f(L.speed, sSpeed);
      gl.uniform1f(L.intensity, sIntense);
      gl.uniform1f(L.thickness, sThick);
      gl.uniform1f(L.thickSpeed, sThickSpd);
      gl.uniform1f(L.count, sCount);
      gl.uniform1f(L.dir, sDir);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };

    if (isVisible) {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [isVisible]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden', backgroundColor: colorBg, ...style }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
