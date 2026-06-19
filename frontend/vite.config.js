import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Single HTML entry (index.html). The project used to also build app.html as
// a second entry, but it was byte-for-byte the same page (same <div id="root">,
// same script src="/src/main.jsx") — just a duplicate. Worse, both entries were
// pinned to the same static output filename (assets/app.js), so whichever one
// Rollup emitted second silently overwrote the other's bundle. Consolidating to
// one entry removes the duplication and the collision risk; default Vite output
// naming (hashed [name] filenames) is used instead of the hard-coded names.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
