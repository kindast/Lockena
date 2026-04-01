module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "bg-red-100",
    "bg-red-200",
    "bg-red-600",
    "bg-indigo-100",
    "bg-indigo-200",
    "text-indigo-600",
    "bg-indigo-600",
    "bg-indigo-700",
    "text-red-600",
    "hover:bg-red-200",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Nunito SemiBold", "sans-serif"],
        body: ["Nunito Regular", "sans-serif"],
      },
    },
  },
};
