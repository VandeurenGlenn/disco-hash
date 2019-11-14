import { terser } from 'rollup-plugin-terser'

export default [{
  input: 'src/hash.js',
  output: {
    format: 'cjs',
    file: './browser.js'
  }
}, {
  input: 'src/hash.js',
  output: {
    format: 'cjs',
    file: './hash.js'
  }
}]