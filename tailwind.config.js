/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "mtb-red": "#EA3323",
        "mtb-green": "#50C67F",
      },
      textColor: {
        customgrey: "#969696",
      },
      minHeight: {
        custom: "500px",
      },
      backgroundColor: {
        mantap: "#422727",
        cuk: "#f5f5f5",
      },
    },
  },
  plugins: [],
};
