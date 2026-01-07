module.exports = {
	content: [
		'./src/**/*.{js,ts,jsx,tsx}',
		'./index.html',
	],
    theme: {
		extend: {
			colors: {
				'neutral': 'var(--neutral)',
				'neutral-contrast': 'var(--neutral-contrast)',
				'neutral-accent': 'var(--neutral-accent)',
				'primary': 'var(--primary)',
				'secondary': 'var(--secondary)',
				'tertiary': 'var(--tertiary)'
			}
		}
	}, 
}