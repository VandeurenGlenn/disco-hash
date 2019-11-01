import { terser } from 'rollup-plugin-terser'

export default [{
  input: 'src/hash.js',
  output: {
    format: 'cjs',
    file: './hash.js'
  }
}, {
  input: 'browser.js',
  output: {
    format: 'iife',
    name: 'DiscoHash',
    file: './browser.js'
  },
  plugins: [
    terser()
  ]
}]