import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

export default {
    input: 'src/index.js',
    inlineDynamicImports: true,
    output: [{
        inlineDynamicImports: true,
        dir: 'dist',
        entryFileNames: '[name].js',
        format: 'umd',
        name: 'RedbagRain',
    }],
    plugins: [
        babel({
            exclude: "node_modules/**"
        }),
        typescript(),
        terser(),
    ],
}
