module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        headerHover: "#7ea1be",
        textColor: "#6b7280",
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translate(10%, 30%)", opacity: 0 },
          "100%": { transform: "translate(0, 0)", opacity: 1 },
        },
      },
      animation: {
        "slide-in": "slide-in 0.5s ease-in-out",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: [
      {
        mytheme: {
          primary: "#FFC107", // Turuncu
          secondary: "#ff3333", // Light Red
          accent: "#ffcccc", // Very Light Red
          neutral: "#f3f4f6", // Açık Gri
          "base-100": "#ffffff", // Beyaz
          info: "#ff6666", // Medium Light Red
          success: "#ff3333", // Medium Red
          warning: "#ffcccb", // Very Light Red
          error: "#ff0000", // Red
          headerHover: "#7ea1be",
          textColor: "#6b7280",
        },
      },
      "light",
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
};
