import esbuild from "rollup-plugin-esbuild";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";

const config = [
  {
    plugins: [
      json(),
      typescript(),
      dts(),
      resolve(),
      commonjs(),
      esbuild({
        minify: false,
        sourceMap: false,
        target: "esnext",
      }),
    ],
    input: "src/index.ts",
    output: [
      {
        dir: "./dist",
        format: "esm",
        entryFileNames: () => "[name].es.js",
      },
    ],
  },
];
export default config;
