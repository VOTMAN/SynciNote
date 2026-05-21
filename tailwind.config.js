
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    //...
  },
  plugins: [
    // add the following lines
    require('tailwindcss/plugin')(({ matchUtilities }) => {
      matchUtilities({
        'x': (value) => ({
          [`@apply ${value.replaceAll(',', ' ')}`]: {}
        })
      })
    })
  ]
}
