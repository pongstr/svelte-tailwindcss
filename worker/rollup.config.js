import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import builtins from 'rollup-plugin-node-builtins'
// import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
// import alias from '@rollup/plugin-alias'
// import * as pkg from './package.json'

const production = !process.env.ROLLUP_WATCH
const extensions = ['.js', '.ts', '.d.ts']

const app = path.join(__dirname, '../app/public/app/worker')

const plugins = [
  json(),
  builtins(),
  resolve({ extensions, browser: true }),
  commonjs(),
  typescript({ sourceMap: !production }),
]

export default [
  {
    input: 'src/main.ts',
    output: [
      {
        name: 'main',
        file: path.join(app, 'main.worker.js'),
        format: 'umd',
        sourcemap: !production,
      },
      {
        name: 'main',
        file: path.join(app, 'main.worker.min.js'),
        format: 'umd',
        sourcemap: !production,
        plugins: [production && terser()],
      },
    ],
    plugins: [...plugins],
  },
  {
    input: 'src/workspaces/index.ts',
    output: [
      {
        name: 'workspace',
        file: path.join(app, 'workspaces.js'),
        format: 'umd',
        sourcemap: !production,
      },
      {
        name: 'workspace',
        file: path.join(app, 'workspaces.min.js'),
        format: 'esm',
        sourcemap: !production,
        plugins: [production && terser()],
      },
    ],
    plugins: [...plugins],
  },
  {
    input: 'src/documents/index.ts',
    output: [
      {
        name: 'documents',
        file: path.join(app, 'documents.js'),
        format: 'umd',
        sourcemap: !production,
      },
      {
        name: 'documents',
        file: path.join(app, 'documents.min.js'),
        format: 'esm',
        sourcemap: !production,
        plugins: [production && terser()],
      },
    ],
    plugins: [...plugins],
  },
]
