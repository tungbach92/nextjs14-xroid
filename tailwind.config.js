/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}", "@src/pages/**/*.{js,ts,jsx,tsx}", "@src/components/**/*.{js,ts,jsx,tsx}", "@src/common/**/*.{js,ts,jsx,tsx}", './app/**/*.{js,ts,jsx,tsx,mdx}'],
  safelist: [
    "modal",
    {
      pattern:
        /bg|text|fill|-(CLFF1717|CLFF5C00|CLFF9900|CLE1CB02|CL7EE100|CL00E14D|CL00E1E1|CL1790FF)|CL0029FF|CL7000FF|CLBE0072|CLBE0022|CL690003|CL634100|CL0E6300|CL002863|CL3D0063|CL292929|CL5C5C5C|CL939393/,
    },
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        "8": "repeat(8, minmax(0, 1fr))",
      },
      screens: {
        mobile: "30rem",
        tablet: "50rem",
        laptop: "64rem",
        desktop: "95rem",
        l_desktop: "102rem",
      },
      fontFamily: {
        "[font-name]": ['"[Your font name]"', "sans-serif"],
      },
      colors: {
        darkBlue: "#1890ff",
        lightBlue: "#3AD1FF",
        "light-gray": "#D9D9D9",
        "light-brown": "#FFF6E9",
        "shade-blue": "#1976D2",
        lightGray: "#f6f7fb",
        lightGray1: "#7A7A7A",
        lightGray2: "#d0d0d0",
        lightGreen: "#4CAF50",
        lightGreenHover: "#018632",
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/line-clamp"), require("tailwind-scrollbar-hide")],
  corePlugins: {
    preflight: false,
  },
};
