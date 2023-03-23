import { Config } from 'tailwindcss'

export default <Config> {
  content: [
    'app.vue'
    // Add all files that contain Tailwind classes
    // e.g. './modules/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}