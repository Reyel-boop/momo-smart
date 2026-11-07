export default {
  plugins: {
    "@tailwindcss/postcss": {},
    // Old iPhones (Safari 12) ignore styles inside @layer, so flatten layers
    // into plain rules, then add the other old-Safari fallbacks.
    "@csstools/postcss-cascade-layers": {},
    "./postcss-old-safari.cjs": {},
  },
};
