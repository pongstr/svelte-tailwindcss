/* eslint-disable @typescript-eslint/no-var-requires */
import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import sveltePreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'
import css from 'rollup-plugin-css-only'
import replace from '@rollup/plugin-replace'
import path from 'path'

const production = !process.env.ROLLUP_WATCH

function serve() {
  let server

  function toExit() {
    if (server) server.kill(0)
  }

  return {
    writeBundle() {
      if (server) return
      server = require('child_process').spawn(
        'npm',
        ['run', 'start', '--', '--dev'],
        {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        },
      )

      process.on('SIGTERM', toExit)
      process.on('exit', toExit)
    },
  }
}

export default {
  input: 'src/main.ts',
  context: 'this',
  output: {
    sourcemap: !production ?? 'cjs',
    format: 'es',
    name: 'app',
    dir: 'public/app/main',
    entryFileNames: '[name].js',
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),

    svelte({
      preprocess: sveltePreprocess({
        sourceMap: !production,
        postcss: {
          plugins: [
            require('postcss-nested')(),
            require('tailwindcss')(),
            require('autoprefixer')(),
          ],
        },

        sass: {
          sync: true,
          implementation: require('sass'),
          indentedSyntax: true,
          includePaths: [path.join(process.cwd(), 'src/assets/css')],
        },
      }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),

    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'styles.css' }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),

    commonjs(),

    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),

    alias({
      resolve: ['.js', '.ts', '.d.ts', '.svelte'],
      entries: [{ find: '@', replacement: path.join(process.cwd(), 'src') }],
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}
