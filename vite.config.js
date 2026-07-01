import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:              resolve(__dirname, 'index.html'),
        'master-suite':    resolve(__dirname, 'rooms/master-suite/index.html'),
        'bedroom-two':     resolve(__dirname, 'rooms/bedroom-two/index.html'),
        'bedroom-three':   resolve(__dirname, 'rooms/bedroom-three/index.html'),
        'living-dining':   resolve(__dirname, 'rooms/living-dining/index.html'),
        kitchen:           resolve(__dirname, 'rooms/kitchen/index.html'),
        'outdoor-bathroom':resolve(__dirname, 'rooms/outdoor-bathroom/index.html'),
      },
    },
  },
});
