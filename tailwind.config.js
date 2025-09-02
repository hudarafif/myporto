/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html'],
  theme: {
    container : {
      center: true,
      padding: '16px',
    },
    extend: {
     animation: {
    marquee: 'marquee 25s linear infinite',
    'marquee-reverse': 'marquee-reverse 25s linear infinite',
  },
  keyframes: {
    marquee: {
      '0%': { transform: 'translateX(0%)' },
      '100%': { transform: 'translateX(-50%)' },
    },
    'marquee-reverse': {
      '0%': { transform: 'translateX(-50%)' },
      '100%': { transform: 'translateX(0%)' },
    },
  },
      backgroundImage : {
        'parallax' : 'url("https://images.pexels.com/photos/176851/pexels-photo-176851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")'
      },
      colors : {
        primary: '#9333ea',
        dark: '#0f172a',
        secondary: '#64748b'
      },
      screens: {
        '2xl': '1320px',
      }
    },
  },
  plugins: [],
}

