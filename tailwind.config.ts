import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        editor: {
          bg: "hsl(var(--editor-bg))",
          activeLine: "hsl(var(--editor-active-line))",
          selection: "hsl(var(--editor-selection))",
        },
        sidebar: {
          bg: "hsl(var(--sidebar-bg))",
          hover: "hsl(var(--sidebar-hover))",
          active: "hsl(var(--sidebar-active))",
        },
        titlebar: {
          bg: "hsl(var(--titlebar-bg))",
        },
        activitybar: {
          bg: "hsl(var(--activitybar-bg))",
          active: "hsl(var(--activitybar-active))",
        },
        panel: {
          bg: "hsl(var(--panel-bg))",
          border: "hsl(var(--panel-border))",
        },
        tab: {
          bg: "hsl(var(--tab-bg))",
          active: "hsl(var(--tab-active-bg))",
          hover: "hsl(var(--tab-hover))",
          border: "hsl(var(--tab-border))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          muted: "hsl(var(--text-muted))",
        },
        statusbar: {
          bg: "hsl(var(--statusbar-bg))",
          text: "hsl(var(--statusbar-text))",
        },
        input: {
          bg: "hsl(var(--input-bg))",
          border: "hsl(var(--input-border))",
          focus: "hsl(var(--input-focus))",
        },
        scrollbar: {
          thumb: "hsl(var(--scrollbar-thumb))",
          hover: "hsl(var(--scrollbar-hover))",
        },
        syntax: {
          keyword: "hsl(var(--syntax-keyword))",
          string: "hsl(var(--syntax-string))",
          number: "hsl(var(--syntax-number))",
          comment: "hsl(var(--syntax-comment))",
          function: "hsl(var(--syntax-function))",
          variable: "hsl(var(--syntax-variable))",
        },
      },
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
