type RGB = { r: number; g: number; b: number };

export type FluidEngineOptions = {
  colors: RGB[];
  dyeScale: number;
  splatForce: number;
  splatRadius: number;
  simResolution: number;
  dyeResolution: number;
  pressureIterations: number;
  ambient: boolean;
  maxPixelRatio: number;
  pointerRoot?: HTMLElement | null;
};

type FBO = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
};

type DoubleFBO = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
};

type Pointer = {
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  moved: boolean;
  color: RGB;
};

type UniformMap = Record<string, WebGLUniformLocation | null>;

const MAX_DT = 0.016666;

export type FluidEngine = {
  play: () => void;
  pause: () => void;
  resize: () => void;
  dispose: () => void;
};

export function startFluidEngine(
  canvas: HTMLCanvasElement,
  options: FluidEngineOptions,
): FluidEngine | null {
  const params: WebGLContextAttributes = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
    premultipliedAlpha: true,
  };

  const gl2 = canvas.getContext("webgl2", params);
  const isWebGL2 = Boolean(gl2);
  const gl =
    gl2 ??
    (canvas.getContext("webgl", params) ||
      canvas.getContext("experimental-webgl", params));

  if (!gl || !("drawingBufferWidth" in gl)) return null;

  const context = gl as WebGLRenderingContext;
  const loseContext = context.getExtension("WEBGL_lose_context");
  if (context.isContextLost()) {
    loseContext?.restoreContext();
    return null;
  }

  let halfFloat: OES_texture_half_float | null = null;
  let supportLinearFiltering: unknown = null;

  if (isWebGL2) {
    context.getExtension("EXT_color_buffer_float");
    supportLinearFiltering = context.getExtension("OES_texture_float_linear");
  } else {
    halfFloat = context.getExtension("OES_texture_half_float");
    supportLinearFiltering = context.getExtension("OES_texture_half_float_linear");
  }

  context.clearColor(0, 0, 0, 0);

  const webgl2 = context as WebGL2RenderingContext;
  const halfFloatTexType = isWebGL2 ? webgl2.HALF_FLOAT : halfFloat?.HALF_FLOAT_OES;

  let formatRGBA = halfFloatTexType
    ? getSupportedFormat(
        context,
        isWebGL2 ? webgl2.RGBA16F : context.RGBA,
        context.RGBA,
        halfFloatTexType,
      )
    : null;
  let formatRG = halfFloatTexType
    ? getSupportedFormat(
        context,
        isWebGL2 ? webgl2.RG16F : context.RGBA,
        isWebGL2 ? webgl2.RG : context.RGBA,
        halfFloatTexType,
      )
    : null;
  let formatR = halfFloatTexType
    ? getSupportedFormat(
        context,
        isWebGL2 ? webgl2.R16F : context.RGBA,
        isWebGL2 ? webgl2.RED : context.RGBA,
        halfFloatTexType,
      )
    : null;

  let texType = halfFloatTexType ?? context.UNSIGNED_BYTE;
  if (!formatRGBA || !formatRG || !formatR) {
    formatRGBA = { internalFormat: context.RGBA, format: context.RGBA };
    formatRG = { internalFormat: context.RGBA, format: context.RGBA };
    formatR = { internalFormat: context.RGBA, format: context.RGBA };
    texType = context.UNSIGNED_BYTE;
    supportLinearFiltering = null;
  }

  if (options.colors.length === 0) return null;

  const rgbaFormat = formatRGBA;
  const rgFormat = formatRG;
  const rFormat = formatR;
  const floatType = texType;
  const seedColor = options.colors[0]!;

  const config = {
    SIM_RESOLUTION: options.simResolution,
    DYE_RESOLUTION: supportLinearFiltering ? options.dyeResolution : 256,
    DENSITY_DISSIPATION: 1.6,
    VELOCITY_DISSIPATION: 1.6,
    PRESSURE: 0.08,
    PRESSURE_ITERATIONS: options.pressureIterations,
    CURL: 4,
    SPLAT_RADIUS: options.splatRadius,
    SPLAT_FORCE: options.splatForce,
    SHADING: Boolean(supportLinearFiltering),
  };

  const pointer: Pointer = {
    texcoordX: 0.5,
    texcoordY: 0.5,
    prevTexcoordX: 0.5,
    prevTexcoordY: 0.5,
    deltaX: 0,
    deltaY: 0,
    moved: false,
    color: scaleColor(seedColor, options.dyeScale),
  };

  let colorIndex = 0;
  const programs: WebGLProgram[] = [];
  const shaders: WebGLShader[] = [];
  const textures: WebGLTexture[] = [];
  const framebuffers: WebGLFramebuffer[] = [];

  function compileShader(type: number, source: string, keywords?: string[] | null) {
    let src = source;
    if (keywords?.length) {
      src = `${keywords.map((k) => `#define ${k}\n`).join("")}${source}`;
    }
    const shader = context.createShader(type);
    if (!shader) throw new Error("Unable to create shader");
    context.shaderSource(shader, src);
    context.compileShader(shader);
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
      const log = context.getShaderInfoLog(shader);
      context.deleteShader(shader);
      throw new Error(log || "Shader compile failed");
    }
    shaders.push(shader);
    return shader;
  }

  function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = context.createProgram();
    if (!program) throw new Error("Unable to create program");
    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);
    context.linkProgram(program);
    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      const log = context.getProgramInfoLog(program);
      throw new Error(log || "Program link failed");
    }
    programs.push(program);
    return program;
  }

  function getUniforms(program: WebGLProgram): UniformMap {
    const uniforms: UniformMap = {};
    const count = context.getProgramParameter(program, context.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i += 1) {
      const info = context.getActiveUniform(program, i);
      if (!info) continue;
      uniforms[info.name] = context.getUniformLocation(program, info.name);
    }
    return uniforms;
  }

  class Program {
    uniforms: UniformMap;
    program: WebGLProgram;

    constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      this.program = createProgram(vertexShader, fragmentShader);
      this.uniforms = getUniforms(this.program);
    }

    bind() {
      context.useProgram(this.program);
    }
  }

  class Material {
    vertexShader: WebGLShader;
    fragmentShaderSource: string;
    programs = new Map<number, WebGLProgram>();
    activeProgram: WebGLProgram | null = null;
    uniforms: UniformMap = {};

    constructor(vertexShader: WebGLShader, fragmentShaderSource: string) {
      this.vertexShader = vertexShader;
      this.fragmentShaderSource = fragmentShaderSource;
    }

    setKeywords(keywords: string[]) {
      let hash = 0;
      for (const keyword of keywords) hash += hashCode(keyword);
      let program = this.programs.get(hash);
      if (!program) {
        const fragmentShader = compileShader(
          context.FRAGMENT_SHADER,
          this.fragmentShaderSource,
          keywords,
        );
        program = createProgram(this.vertexShader, fragmentShader);
        this.programs.set(hash, program);
      }
      if (program === this.activeProgram) return;
      this.uniforms = getUniforms(program);
      this.activeProgram = program;
    }

    bind() {
      if (this.activeProgram) context.useProgram(this.activeProgram);
    }
  }

  const baseVertexShader = compileShader(
    context.VERTEX_SHADER,
    `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `,
  );

  const copyShader = compileShader(
    context.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        gl_FragColor = texture2D(uTexture, vUv);
      }
    `,
  );

  const clearShader = compileShader(
    context.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `,
  );

  const splatShader = compileShader(
    context.FRAGMENT_SHADER,
    `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `,
  );

  const advectionShader = compileShader(
    context.FRAGMENT_SHADER,
    `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
        #ifdef MANUAL_FILTERING
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
        #else
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
        #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }
    `,
    supportLinearFiltering ? null : ["MANUAL_FILTERING"],
  );

  const divergenceShader = compileShader(
    context.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `,
  );

  const curlShader = compileShader(
    context.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `,
  );

  const vorticityShader = compileShader(
    context.FRAGMENT_SHADER,
    `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `,
  );

  const pressureShader = compileShader(
    context.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `,
  );

  const gradientSubtractShader = compileShader(
    context.FRAGMENT_SHADER,
    `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `,
  );

  const displayShaderSource = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform vec2 texelSize;
    void main () {
      vec3 c = texture2D(uTexture, vUv).rgb;
      #ifdef SHADING
      vec3 lc = texture2D(uTexture, vL).rgb;
      vec3 rc = texture2D(uTexture, vR).rgb;
      vec3 tc = texture2D(uTexture, vT).rgb;
      vec3 bc = texture2D(uTexture, vB).rgb;
      float dx = length(rc) - length(lc);
      float dy = length(tc) - length(bc);
      vec3 n = normalize(vec3(dx, dy, length(texelSize)));
      vec3 l = vec3(0.0, 0.0, 1.0);
      float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
      c *= diffuse;
      #endif
      float a = max(c.r, max(c.g, c.b));
      gl_FragColor = vec4(c, a);
    }
  `;

  const blitBuffer = context.createBuffer();
  const blitIndex = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, blitBuffer);
  context.bufferData(
    context.ARRAY_BUFFER,
    new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
    context.STATIC_DRAW,
  );
  context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, blitIndex);
  context.bufferData(
    context.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 0, 2, 3]),
    context.STATIC_DRAW,
  );
  context.vertexAttribPointer(0, 2, context.FLOAT, false, 0, 0);
  context.enableVertexAttribArray(0);

  function blit(target: FBO | null, clear = false) {
    if (!target) {
      context.viewport(0, 0, context.drawingBufferWidth, context.drawingBufferHeight);
      context.bindFramebuffer(context.FRAMEBUFFER, null);
    } else {
      context.viewport(0, 0, target.width, target.height);
      context.bindFramebuffer(context.FRAMEBUFFER, target.fbo);
    }
    if (clear) {
      context.clearColor(0, 0, 0, 0);
      context.clear(context.COLOR_BUFFER_BIT);
    }
    context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0);
  }

  const copyProgram = new Program(baseVertexShader, copyShader);
  const clearProgram = new Program(baseVertexShader, clearShader);
  const splatProgram = new Program(baseVertexShader, splatShader);
  const advectionProgram = new Program(baseVertexShader, advectionShader);
  const divergenceProgram = new Program(baseVertexShader, divergenceShader);
  const curlProgram = new Program(baseVertexShader, curlShader);
  const vorticityProgram = new Program(baseVertexShader, vorticityShader);
  const pressureProgram = new Program(baseVertexShader, pressureShader);
  const gradientSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
  const displayMaterial = new Material(baseVertexShader, displayShaderSource);

  let dye: DoubleFBO | undefined;
  let velocity: DoubleFBO | undefined;
  let divergence: FBO | undefined;
  let curl: FBO | undefined;
  let pressure: DoubleFBO | undefined;

  function createFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    filter: number,
  ): FBO {
    context.activeTexture(context.TEXTURE0);
    const texture = context.createTexture();
    const fbo = context.createFramebuffer();
    if (!texture || !fbo) throw new Error("Unable to allocate FBO");
    textures.push(texture);
    framebuffers.push(fbo);

    context.bindTexture(context.TEXTURE_2D, texture);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, filter);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, filter);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
    context.texImage2D(context.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
    context.bindFramebuffer(context.FRAMEBUFFER, fbo);
    context.framebufferTexture2D(
      context.FRAMEBUFFER,
      context.COLOR_ATTACHMENT0,
      context.TEXTURE_2D,
      texture,
      0,
    );
    context.viewport(0, 0, w, h);
    context.clear(context.COLOR_BUFFER_BIT);

    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      attach(id: number) {
        context.activeTexture(context.TEXTURE0 + id);
        context.bindTexture(context.TEXTURE_2D, texture);
        return id;
      },
    };
  }

  function createDoubleFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    filter: number,
  ): DoubleFBO {
    let fbo1 = createFBO(w, h, internalFormat, format, type, filter);
    let fbo2 = createFBO(w, h, internalFormat, format, type, filter);
    return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      get read() {
        return fbo1;
      },
      set read(value) {
        fbo1 = value;
      },
      get write() {
        return fbo2;
      },
      set write(value) {
        fbo2 = value;
      },
      swap() {
        const temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      },
    };
  }

  function resizeFBO(
    target: FBO,
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    filter: number,
  ) {
    const next = createFBO(w, h, internalFormat, format, type, filter);
    copyProgram.bind();
    context.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
    blit(next);
    return next;
  }

  function initFramebuffers() {
    const simRes = getResolution(config.SIM_RESOLUTION);
    const dyeRes = getResolution(config.DYE_RESOLUTION);
    const texType = floatType;
    const filtering = supportLinearFiltering ? context.LINEAR : context.NEAREST;
    context.disable(context.BLEND);

    if (!dye) {
      dye = createDoubleFBO(
        dyeRes.width,
        dyeRes.height,
        rgbaFormat.internalFormat,
        rgbaFormat.format,
        texType,
        filtering,
      );
    } else if (dye.width !== dyeRes.width || dye.height !== dyeRes.height) {
      dye.read = resizeFBO(
        dye.read,
        dyeRes.width,
        dyeRes.height,
        rgbaFormat.internalFormat,
        rgbaFormat.format,
        texType,
        filtering,
      );
      dye.write = createFBO(
        dyeRes.width,
        dyeRes.height,
        rgbaFormat.internalFormat,
        rgbaFormat.format,
        texType,
        filtering,
      );
      dye.width = dyeRes.width;
      dye.height = dyeRes.height;
      dye.texelSizeX = 1 / dyeRes.width;
      dye.texelSizeY = 1 / dyeRes.height;
    }

    if (!velocity) {
      velocity = createDoubleFBO(
        simRes.width,
        simRes.height,
        rgFormat.internalFormat,
        rgFormat.format,
        texType,
        filtering,
      );
    } else if (velocity.width !== simRes.width || velocity.height !== simRes.height) {
      velocity.read = resizeFBO(
        velocity.read,
        simRes.width,
        simRes.height,
        rgFormat.internalFormat,
        rgFormat.format,
        texType,
        filtering,
      );
      velocity.write = createFBO(
        simRes.width,
        simRes.height,
        rgFormat.internalFormat,
        rgFormat.format,
        texType,
        filtering,
      );
      velocity.width = simRes.width;
      velocity.height = simRes.height;
      velocity.texelSizeX = 1 / simRes.width;
      velocity.texelSizeY = 1 / simRes.height;
    }

    divergence = createFBO(
      simRes.width,
      simRes.height,
      rFormat.internalFormat,
      rFormat.format,
      texType,
      context.NEAREST,
    );
    curl = createFBO(
      simRes.width,
      simRes.height,
      rFormat.internalFormat,
      rFormat.format,
      texType,
      context.NEAREST,
    );
    pressure = createDoubleFBO(
      simRes.width,
      simRes.height,
      rFormat.internalFormat,
      rFormat.format,
      texType,
      context.NEAREST,
    );
  }

  function getResolution(resolution: number) {
    let aspectRatio = context.drawingBufferWidth / context.drawingBufferHeight;
    if (aspectRatio < 1) aspectRatio = 1 / aspectRatio;
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspectRatio);
    if (context.drawingBufferWidth > context.drawingBufferHeight) {
      return { width: max, height: min };
    }
    return { width: min, height: max };
  }

  function scaleByPixelRatio(input: number) {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, options.maxPixelRatio);
    return Math.floor(input * pixelRatio);
  }

  function resizeCanvas() {
    const width = Math.max(1, scaleByPixelRatio(canvas.clientWidth));
    const height = Math.max(1, scaleByPixelRatio(canvas.clientHeight));
    if (canvas.width === width && canvas.height === height) return false;
    canvas.width = width;
    canvas.height = height;
    return true;
  }

  function nextColor() {
    const source = options.colors[colorIndex % options.colors.length] ?? seedColor;
    colorIndex += 1;
    return scaleColor(source, options.dyeScale);
  }

  function splat(x: number, y: number, dx: number, dy: number, color: RGB) {
    if (!velocity || !dye) return;
    splatProgram.bind();
    context.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
    context.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
    context.uniform2f(splatProgram.uniforms.point, x, y);
    context.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
    context.uniform1f(
      splatProgram.uniforms.radius,
      correctRadius(config.SPLAT_RADIUS / 100),
    );
    blit(velocity.write);
    velocity.swap();

    context.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
    context.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
    blit(dye.write);
    dye.swap();
  }

  function correctRadius(radius: number) {
    const aspectRatio = canvas.width / canvas.height;
    return aspectRatio > 1 ? radius * aspectRatio : radius;
  }

  function correctDeltaX(delta: number) {
    const aspectRatio = canvas.width / canvas.height;
    return aspectRatio < 1 ? delta * aspectRatio : delta;
  }

  function correctDeltaY(delta: number) {
    const aspectRatio = canvas.width / canvas.height;
    return aspectRatio > 1 ? delta / aspectRatio : delta;
  }

  function pointerFromEvent(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.texcoordX = x / canvas.width;
    pointer.texcoordY = 1 - y / canvas.height;
    pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
    pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
    pointer.moved =
      Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    pointer.color = nextColor();
  }

  function step(dt: number) {
    if (!velocity || !dye || !curl || !divergence || !pressure) return;
    context.disable(context.BLEND);

    curlProgram.bind();
    context.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    context.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(curl);

    vorticityProgram.bind();
    context.uniform2f(
      vorticityProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    context.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
    context.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
    context.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
    context.uniform1f(vorticityProgram.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    divergenceProgram.bind();
    context.uniform2f(
      divergenceProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    context.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergence);

    clearProgram.bind();
    context.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
    context.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
    blit(pressure.write);
    pressure.swap();

    pressureProgram.bind();
    context.uniform2f(
      pressureProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    context.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i += 1) {
      context.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    gradientSubtractProgram.bind();
    context.uniform2f(
      gradientSubtractProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    context.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
    context.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    advectionProgram.bind();
    context.uniform2f(
      advectionProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    if (!supportLinearFiltering) {
      context.uniform2f(
        advectionProgram.uniforms.dyeTexelSize,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
    }
    const velocityId = velocity.read.attach(0);
    context.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
    context.uniform1i(advectionProgram.uniforms.uSource, velocityId);
    context.uniform1f(advectionProgram.uniforms.dt, dt);
    context.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
    blit(velocity.write);
    velocity.swap();

    if (!supportLinearFiltering) {
      context.uniform2f(
        advectionProgram.uniforms.dyeTexelSize,
        dye.texelSizeX,
        dye.texelSizeY,
      );
    }
    context.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
    context.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
    context.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
    blit(dye.write);
    dye.swap();
  }

  function render() {
    if (!dye) return;
    context.blendFunc(context.ONE, context.ONE_MINUS_SRC_ALPHA);
    context.enable(context.BLEND);
    displayMaterial.bind();
    if (config.SHADING) {
      context.uniform2f(
        displayMaterial.uniforms.texelSize,
        1 / context.drawingBufferWidth,
        1 / context.drawingBufferHeight,
      );
    }
    context.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
    blit(null);
  }

  displayMaterial.setKeywords(config.SHADING ? ["SHADING"] : []);
  resizeCanvas();
  initFramebuffers();

  let running = false;
  let raf = 0;
  let lastUpdateTime = performance.now();
  let ambientTimer = 0;

  function updateFrame(now: number) {
    if (!running) return;
    const dt = Math.min((now - lastUpdateTime) / 1000, MAX_DT);
    lastUpdateTime = now;

    if (pointer.moved) {
      pointer.moved = false;
      splat(
        pointer.texcoordX,
        pointer.texcoordY,
        pointer.deltaX * config.SPLAT_FORCE,
        pointer.deltaY * config.SPLAT_FORCE,
        pointer.color,
      );
    }

    if (options.ambient) {
      ambientTimer += dt;
      if (ambientTimer > 1.35) {
        ambientTimer = 0;
        splat(
          0.28 + Math.random() * 0.44,
          0.32 + Math.random() * 0.36,
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 80,
          nextColor(),
        );
      }
    }

    step(dt);
    render();
    raf = requestAnimationFrame(updateFrame);
  }

  function play() {
    if (running) return;
    running = true;
    lastUpdateTime = performance.now();
    raf = requestAnimationFrame(updateFrame);
  }

  function pause() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const pointerRoot = options.pointerRoot ?? canvas.parentElement;

  const onPointerMove = (event: PointerEvent) => {
    if (options.ambient) return;
    if (event.pointerType === "touch") return;
    pointerFromEvent(event);
  };

  if (!options.ambient) {
    pointerRoot?.addEventListener("pointermove", onPointerMove, { passive: true });
  }

  splat(0.42, 0.58, 120, 40, nextColor());
  splat(0.62, 0.4, -90, -30, nextColor());

  return {
    play,
    pause,
    resize() {
      if (resizeCanvas()) initFramebuffers();
    },
    dispose() {
      pause();
      pointerRoot?.removeEventListener("pointermove", onPointerMove);
      context.bindFramebuffer(context.FRAMEBUFFER, null);
      for (const fbo of framebuffers) context.deleteFramebuffer(fbo);
      for (const texture of textures) context.deleteTexture(texture);
      for (const program of programs) context.deleteProgram(program);
      for (const shader of shaders) context.deleteShader(shader);
      if (blitBuffer) context.deleteBuffer(blitBuffer);
      if (blitIndex) context.deleteBuffer(blitIndex);
    },
  };
}

function getSupportedFormat(
  gl: WebGLRenderingContext,
  internalFormat: number,
  format: number,
  type: number,
): { internalFormat: number; format: number } | null {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    const gl2 = gl as WebGL2RenderingContext;
    if (internalFormat === gl2.R16F) {
      return getSupportedFormat(gl, gl2.RG16F, gl2.RG, type);
    }
    if (internalFormat === gl2.RG16F) {
      return getSupportedFormat(gl, gl2.RGBA16F, gl.RGBA, type);
    }
    return null;
  }
  return { internalFormat, format };
}

function supportRenderTextureFormat(
  gl: WebGLRenderingContext,
  internalFormat: number,
  format: number,
  type: number,
) {
  const texture = gl.createTexture();
  const fbo = gl.createFramebuffer();
  if (!texture || !fbo) return false;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  gl.deleteFramebuffer(fbo);
  gl.deleteTexture(texture);
  return ok;
}

function scaleColor(color: RGB, amount: number): RGB {
  return { r: color.r * amount, g: color.g * amount, b: color.b * amount };
}

function hashCode(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
