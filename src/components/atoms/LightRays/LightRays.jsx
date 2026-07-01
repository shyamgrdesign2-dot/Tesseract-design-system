"use client";

import * as React from "react";

/**
 * LightRays — a self-contained WebGL light-ray accent using the ReactBits
 * "LightRays" beam shader (its exact rayStrength math), ported to raw WebGL so
 * there is ZERO runtime dependency (no `ogl`/three). A fan of soft volumetric
 * beams streams from an origin corner and drifts over time; meant to be
 * screen-blended over a dark surface (the HeroBanner violet field).
 *
 * SSR-safe (all GL work runs in an effect), reduced-motion aware (freezes on a
 * still frame), and degrades gracefully: if the context can't be created it
 * renders nothing, so the host surface stands on its own.
 *
 * Colours are token-driven: pass any CSS colour (including `var(--tesseract-*)`)
 * and it is resolved to RGB in the component's themed context at mount.
 *
 * Props:
 *   color1, color2  CSS colour   beam tints (blended across the fan)
 *   origin          [x, y]       source in normalized coords (0 = top-left);
 *                                negative pushes it off-canvas for a wider fan
 *   direction       [dx, dy]     sweep direction, screen space (x right, y down)
 *   spread          number       angular spread (higher = wider/softer); def 1.1
 *   length          number       reach as a multiple of width; def 2.4
 *   fade            number       fade distance as a multiple of width; def 1.2
 *   noise           number       0..1 grain breakup; def 0.1
 *   distortion      number       beam wobble; def 0.05
 *   intensity       number       overall brightness; def 1.35
 *   speed           number       drift speed; def 1
 *   blur            number       CSS blur in px for a soft glow; def 5
 *   className, style
 */
const VERT = "attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }";

const FRAG = `
precision highp float;
uniform vec2  uResolution;
uniform float uTime;
uniform vec2  uRayPos;
uniform vec2  uRayDir;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform float uSpread;
uniform float uLength;
uniform float uFade;
uniform float uNoise;
uniform float uDistort;
uniform float uIntensity;
uniform float uSpeed;

float hash(vec2 st){ return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }

// ReactBits LightRays — rayStrength: soft, drifting volumetric beams radiating
// from a source toward a reference direction, with an angular spread + length
// and fade falloff.
float rayStrength(vec2 src, vec2 refDir, vec2 coord, float seedA, float seedB, float speed){
  vec2 s2c = coord - src;
  vec2 dirN = normalize(s2c);
  float cosA = dot(dirN, refDir);
  float dAng = cosA + uDistort * sin(uTime * 2.0 + length(s2c) * 0.01) * 0.2;
  float spread = pow(max(dAng, 0.0), 1.0 / max(uSpread, 0.001));

  float dist = length(s2c);
  float maxD = uResolution.x * uLength;
  float lenFall = clamp((maxD - dist) / maxD, 0.0, 1.0);
  // fade fully to 0 far from the source (ReactBits floors at 0.5, which floods a
  // short wide banner) so the dark field survives between/beyond the beams.
  float fadeFall = clamp((uResolution.x * uFade - dist) / (uResolution.x * uFade), 0.0, 1.0);

  // broad, smooth undulation (not thin streaks) — a soft body of light rather
  // than defined rays. Low seed frequency + higher DC keeps it a gentle wash.
  float base = clamp(
    (0.42 + 0.16 * sin(dAng * seedA + uTime * speed)) +
    (0.34 + 0.14 * cos(-dAng * seedB + uTime * speed)),
    0.0, 1.0);

  return base * lenFall * fadeFall * spread;
}

void main(){
  vec2 coord = gl_FragCoord.xy;

  // organic domain warp — displace the sampling point by a slow fbm field so the
  // light body ripples like a natural wave/cloud instead of a placed radial edge
  float ws = 0.0016;
  vec2 warp = vec2(
    fbm(coord * ws + uTime * 0.03),
    fbm(coord * ws + vec2(7.3, 2.1) - uTime * 0.025)
  ) - 0.5;
  vec2 wc = coord + warp * 260.0;

  float r1 = rayStrength(uRayPos, uRayDir, wc, 6.0, 4.2, 1.5 * uSpeed);
  float r2 = rayStrength(uRayPos, uRayDir, wc, 4.4, 3.1, 1.1 * uSpeed);
  float strength = r1 * 0.5 + r2 * 0.4;

  // a second slow fbm gently undulates the whole body (adds the wave feel)
  float wave = 0.55 + 0.6 * fbm(coord * 0.0012 + vec2(uTime * 0.04, -uTime * 0.03));
  strength *= wave;

  if (uNoise > 0.0){
    float n = hash(coord * 0.01 + uTime * 0.1);
    strength *= (1.0 - uNoise + uNoise * n);
  }

  // gentle contrast only — keep it a smooth body of light, not hard-edged streaks
  strength = pow(clamp(strength, 0.0, 1.0), 1.12);

  // blend the two tints across the fan
  float cmix = 0.5 + 0.5 * sin(dot(normalize(coord - uRayPos), uRayDir) * 3.0);
  vec3 col = mix(uColor1, uColor2, clamp(cmix, 0.0, 1.0));

  // alpha = 1: dark pixels are ~black and vanish under CSS 'screen' blend;
  // bright beams lighten the surface. No GL blending needed.
  gl_FragColor = vec4(col * strength * uIntensity, 1.0);
}
`;

function resolveRGB(cssColor, contextEl) {
  try {
    const probe = document.createElement("span");
    probe.style.cssText = "display:none;color:" + cssColor;
    (contextEl || document.body).appendChild(probe);
    const rgb = getComputedStyle(probe).color;
    probe.remove();
    const m = rgb.match(/[\d.]+/g);
    if (!m) return [1, 1, 1];
    return [(+m[0]) / 255, (+m[1]) / 255, (+m[2]) / 255];
  } catch {
    return [1, 1, 1];
  }
}

export function LightRays({
  color1 = "var(--tesseract-violet-200)",
  color2 = "var(--tesseract-blue-200)",
  origin = [-0.04, -0.04],
  direction = [1.0, 0.6],
  spread = 1.35,
  length = 2.1,
  fade = 1.15,
  noise = 0.08,
  distortion = 0.05,
  intensity = 0.36,
  speed = 0.35,
  blur = 16,
  className,
  style,
  ...rest
}) {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [ox, oy] = origin;
  const [dx, dy] = direction;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: true, alpha: true });
    if (!gl) return undefined; // no WebGL → render nothing; the surface stands alone

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return undefined;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (n) => gl.getUniformLocation(prog, n);
    gl.uniform3fv(u("uColor1"), resolveRGB(color1, wrap));
    gl.uniform3fv(u("uColor2"), resolveRGB(color2, wrap));
    gl.uniform1f(u("uSpread"), spread);
    gl.uniform1f(u("uLength"), length);
    gl.uniform1f(u("uFade"), fade);
    gl.uniform1f(u("uNoise"), noise);
    gl.uniform1f(u("uDistort"), distortion);
    gl.uniform1f(u("uIntensity"), intensity);
    gl.uniform1f(u("uSpeed"), speed);
    // sweep direction in GL space (y is up, so screen-down dy flips sign)
    const dlen = Math.hypot(dx, dy) || 1;
    gl.uniform2f(u("uRayDir"), dx / dlen, -dy / dlen);
    const uRes = u("uResolution");
    const uTime = u("uTime");
    const uRayPos = u("uRayPos");

    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = wrap.clientWidth || 1;
      const h = wrap.clientHeight || 1;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      // origin: normalized (0 = top-left) → gl_FragCoord px (y up from bottom)
      gl.uniform2f(uRayPos, ox * canvas.width, (1 - oy) * canvas.height);
    };
    resize();
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(resize) : null;
    ro?.observe(wrap);

    let raf = 0;
    const start = performance.now();
    const draw = (now) => {
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(draw);
    };
    if (reduce) {
      gl.uniform1f(uTime, 3.2);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro?.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color1, color2, ox, oy, dx, dy, spread, length, fade, noise, distortion, intensity, speed]);

  return (
    <div
      ref={wrapRef}
      className={className}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        mixBlendMode: "screen",
        filter: blur ? `blur(${blur}px)` : undefined,
        ...style,
      }}
      {...rest}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

LightRays.displayName = "LightRays";

export default LightRays;
