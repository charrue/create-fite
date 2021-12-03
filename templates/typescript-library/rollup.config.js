import esbuild from "rollup-plugin-esbuild";
import dts from "rollup-plugin-dts";

const config = [
  {
    plugins: [
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
        format: "es",
        entryFileNames: () => "index.es.js",
      },
    ],
  },
  {
    plugins: [
      dts(),
    ],
    input: "src/index.ts",
    output: [
      {
        format: "es",
        file:"dist/index.d.ts",
      },
    ],
  },
];
export default config;
