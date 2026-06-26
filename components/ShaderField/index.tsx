import { useEffect, useRef } from 'react'

const vertexShaderSource = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentShaderSource = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_light;

float hash(vec2 point) {
  return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
}

float facetLine(vec2 point, float angle, float scale, float width) {
  vec2 direction = vec2(cos(angle), sin(angle));
  float line = abs(fract(dot(point, direction) * scale) - 0.5);
  return smoothstep(width, 0.0, line);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 point = uv - 0.5;
  float time = u_time * 0.08;

  float planeA = facetLine(point + vec2(time, 0.0), 0.56, 5.0, 0.035);
  float planeB = facetLine(point - vec2(time * 0.7, 0.0), -0.82, 6.0, 0.028);
  float planeC = facetLine(point + vec2(0.0, time * 0.5), 1.34, 4.0, 0.025);
  float facets = planeA * 0.34 + planeB * 0.28 + planeC * 0.2;

  vec2 crystalGrid = uv * vec2(34.0, 8.0);
  vec2 crystalCell = floor(crystalGrid);
  vec2 crystalLocal = fract(crystalGrid) - 0.5;
  float sparkleSeed = hash(crystalCell);
  float sparkleShape = smoothstep(0.055, 0.0, length(crystalLocal));
  float sparkleTwinkle = 0.55 + 0.45 * sin(u_time * 1.4 + sparkleSeed * 8.0);
  float sparkles = sparkleShape * sparkleTwinkle * step(0.9, sparkleSeed);

  float veil = sin((uv.x * 2.6 + uv.y * 1.4 + time) * 6.28318) * 0.5 + 0.5;
  float prism = sin((uv.x * 9.0 - uv.y * 4.0 - time * 2.0) * 6.28318) * 0.5 + 0.5;

  vec3 darkBase = vec3(0.05, 0.09, 0.095);
  vec3 darkAqua = vec3(0.34, 0.58, 0.58);
  vec3 darkRose = vec3(0.74, 0.38, 0.38);

  vec3 lightBase = vec3(0.925, 0.975, 0.965);
  vec3 lightAqua = vec3(0.72, 0.91, 0.92);
  vec3 lightRose = vec3(0.98, 0.76, 0.72);
  vec3 lightPearl = vec3(0.99, 0.985, 0.94);

  vec3 base = mix(darkBase, lightBase, u_light);
  vec3 aqua = mix(darkAqua, lightAqua, u_light);
  vec3 rose = mix(darkRose, lightRose, u_light);
  vec3 pearl = mix(vec3(0.74, 0.9, 0.88), lightPearl, u_light);

  vec3 color = mix(base, aqua, veil * 0.55);
  color = mix(color, rose, prism * 0.18);
  color = mix(color, pearl, facets + sparkles * 0.9);
  color += vec3(0.06, 0.09, 0.08) * sparkles;
  color += vec3(0.018) * sin((uv.x + uv.y + time) * 80.0);

  gl_FragColor = vec4(color, 1.0);
}
`

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type)

  if (!shader) {
    return null
  }

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  )

  if (!vertexShader || !fragmentShader) {
    return null
  }

  const program = gl.createProgram()

  if (!program) {
    return null
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }

  return program
}

interface Props {
  tone?: 'dark' | 'light'
}

const ShaderField = ({ tone = 'dark' }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl')

    if (!canvas || !gl) {
      return undefined
    }

    const program = createProgram(gl)

    if (!program) {
      return undefined
    }

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    const timeLocation = gl.getUniformLocation(program, 'u_time')
    const lightLocation = gl.getUniformLocation(program, 'u_light')
    const positionBuffer = gl.createBuffer()
    const shouldReduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )

    let frame = 0
    const startedAt = performance.now()

    const render = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.floor(canvas.clientWidth * pixelRatio)
      const height = Math.floor(canvas.clientHeight * pixelRatio)

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      gl.viewport(0, 0, width, height)
      gl.useProgram(program)
      gl.enableVertexAttribArray(positionLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
      gl.uniform2f(resolutionLocation, width, height)
      gl.uniform1f(timeLocation, (performance.now() - startedAt) / 1000)
      gl.uniform1f(lightLocation, tone === 'light' ? 1 : 0)
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      if (!shouldReduceMotion) {
        frame = requestAnimationFrame(render)
      }
    }

    render()

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [tone])

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      aria-hidden="true"
    />
  )
}

export default ShaderField
