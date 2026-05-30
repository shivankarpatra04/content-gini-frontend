import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Resolve the Tailwind config relative to this file so it works no matter
// which directory Vite is launched from (build runs from ./frontend, some
// preview tooling launches from the repo root).
const configPath = resolve(dirname(fileURLToPath(import.meta.url)), 'tailwind.config.js');

export default {
    plugins: {
        tailwindcss: { config: configPath },
        autoprefixer: {},
    },
}
