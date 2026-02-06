// tailwind.config.ts
import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";
const config: Config = {
    // ... other config
    theme: {
        extend: {
            // ReactBits components often need these specific keyframes
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [tailwindAnimate], // <--- Add this line
};

export default config;