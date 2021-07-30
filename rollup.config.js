import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";

export default [
  {
    input: "src/index.js",
    output: {
      name: "VL",
      file: "dist/v-loading.cjs.js",
      format: "cjs",
      sourcemap: "inline"
    },
    plugins: [resolve(), commonjs()]
  },
  {
    input: "src/index.js",
    output: {
      name: "VL",
      file: "dist/v-loading.esm.js",
      format: "esm"
    },
    plugins: [resolve(), commonjs()]
  },
  {
    input: "src/index.js",
    output: {
      name: "VL",
      file: "dist/v-loading.umd.js",
      format: "umd"
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: "runtime",
        include: /src/,
        exclude: /node_modules/
      })
    ]
  }
];
