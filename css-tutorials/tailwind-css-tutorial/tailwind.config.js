module.exports = {
  darkmode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0fa9e6",
          light: "#3fbaeb",
          dark: "#0c87b8"
        },
      },
      fontFamily: {
        headline: "Poppins, sans-serif" // font-headline
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active']
    },
  },
  plugins: [ "cssnano" ],
}
