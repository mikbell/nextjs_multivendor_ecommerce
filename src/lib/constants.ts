// Design system constants for consistent styling

// Spacing scale
export const SPACING = {
	xs: 2,
	sm: 4,
	md: 6,
	lg: 8,
	xl: 12,
	'2xl': 16,
	'3xl': 20,
	'4xl': 24,
} as const;

// Component sizes
export const SIZES = {
	icon: {
		sm: 'h-4 w-4',
		md: 'h-5 w-5',
		lg: 'h-6 w-6',
		xl: 'h-8 w-8',
	},
	button: {
		sm: 'h-8 px-3 text-xs',
		md: 'h-10 px-4 py-2',
		lg: 'h-11 px-8',
		icon: 'h-10 w-10',
	},
	input: {
		sm: 'h-8 px-2 text-sm',
		md: 'h-10 px-3',
		lg: 'h-12 px-4 text-lg',
	},
} as const;

// Layout constants
export const LAYOUT = {
	sidebar: {
		width: '240px',
		collapsedWidth: '64px',
	},
	header: {
		height: '64px',
	},
	container: {
		maxWidth: '1200px',
		padding: '1rem',
	},
} as const;

// Animation durations
export const ANIMATIONS = {
	fast: '150ms',
	normal: '200ms',
	slow: '300ms',
} as const;

// Z-index scale
export const Z_INDEX = {
	dropdown: 1000,
	sticky: 1020,
	fixed: 1030,
	modal: 1040,
	popover: 1050,
	tooltip: 1060,
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
	sm: '640px',
	md: '768px',
	lg: '1024px',
	xl: '1280px',
	'2xl': '1536px',
} as const;

// Common class combinations
export const COMMON_STYLES = {
	card: 'rounded-lg border bg-card text-card-foreground shadow-sm',
	button: {
		primary: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
		secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
		outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
		ghost: 'hover:bg-accent hover:text-accent-foreground',
		destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
	},
	input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
	form: {
		field: 'space-y-2',
		label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
		description: 'text-sm text-muted-foreground',
		error: 'text-sm font-medium text-destructive',
	},
} as const;

// Form validation constants
export const VALIDATION = {
	minPasswordLength: 8,
	maxTextLength: 5000,
	maxNameLength: 100,
	maxSlugLength: 120,
	minDescriptionLength: 10,
	maxImageSize: 5 * 1024 * 1024, // 5MB
	allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
} as const;

// API constants
export const API = {
	timeout: 30000, // 30 seconds
	retryAttempts: 3,
	retryDelay: 1000, // 1 second
} as const;