// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Core colors
                primary: '#111827',
                secondary: '#6B7280',
                background: '#F9FAFB',
                accent: '#3B82F6',

                // Semantic colors
                success: '#10B981',
                warning: '#F59E0B',
                danger: '#EF4444',

                // Product categories
                phone: '#8B5CF6',
                laptop: '#059669',
                accessory: '#F97316',

                // Gray variations (for depth)
                gray: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                }
            },
            backgroundColor: {
                'page': '#F9FAFB',        // Page background
                'card': '#FFFFFF',        // Card background
                'sidebar': '#1F2937',     // Dark sidebar
            }
        },
    },
    plugins: [],
}
export default config