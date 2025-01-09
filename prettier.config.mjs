/** @type {import('prettier').Config} */
const config = {
  plugins: [
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss", // MUST come last
  ],
};

export default config;
