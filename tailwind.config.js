/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semânticas - usar preferencialmente
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
        'danger': 'var(--color-danger)',
        'success': 'var(--color-success)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'background-primary': 'var(--color-background-primary)',
        'background-secondary': 'var(--color-background-secondary)',
        'border': 'var(--color-border)',
        'chart-income': 'var(--color-chart-income)',
        'chart-expense': 'var(--color-chart-expense)',
        // Primitivas - usar quando semântica não disponível
        'gray': {
          0: 'var(--gray-0)',
          50: 'var(--gray-50)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          900: 'var(--gray-900)',
        },
      },
      spacing: {
        // Primitivas
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        // Semânticas
        'container-padding': 'var(--spacing-container-padding)',
        'card-gap': 'var(--spacing-card-gap)',
        'item-gap': 'var(--spacing-item-gap)',
        'input-padding': 'var(--spacing-input-padding)',
      },
      borderRadius: {
        'card': 'var(--border-radius-card)',
        'button': 'var(--border-radius-button)',
        'input': 'var(--border-radius-input)',
        'avatar': 'var(--border-radius-avatar)',
        'sm': 'var(--border-radius-sm)',
        'md': 'var(--border-radius-md)',
        'lg': 'var(--border-radius-lg)',
        'full': 'var(--border-radius-full)',
      },
      fontSize: {
        'heading-lg': 'var(--font-size-heading-lg)',
        'heading-md': 'var(--font-size-heading-md)',
        'body-lg': 'var(--font-size-body-lg)',
        'body-md': 'var(--font-size-body-md)',
        'body-sm': 'var(--font-size-body-sm)',
      },
      screens: {
        'md': '768px',   // Tablet
        'lg': '1280px',  // Desktop
        'xl': '1920px',  // Wide / 4K
      },
    },
  },
  plugins: [],
}
