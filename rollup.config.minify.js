import { terser } from 'rollup-plugin-terser'

export default [{
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