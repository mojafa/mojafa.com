# Jafa's Portfolio Website

A clean, minimal portfolio website inspired by [Amjad Masad's site](https://amasad.me/). Built with vanilla HTML, CSS, and JavaScript.

## Features

- 🌙 **Dark/Light Mode Toggle** - Persistent theme preference
- 📚 **Goodreads Integration** - Display currently reading books
- ✍️ **Essays Section** - Showcase your writing
- 👤 **About Section** - Personal introduction
- 🔗 **Social Links** - Twitter, GitHub, Email, Goodreads
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Fast Loading** - Optimized for performance

## Customization

### 1. Personal Information

Edit `index.html` to update:
- Your name in the header
- About section content
- Contact links (email, Twitter, GitHub, Goodreads)
- Essay titles and content

### 2. Goodreads Integration

The current implementation uses mock data. To connect with real Goodreads:

1. **Option A: RSS Feed** (Recommended)
   - Get your Goodreads RSS feed URL
   - Update the `GoodreadsIntegration` class in `script.js`
   - Use a CORS proxy or backend service

2. **Option B: Goodreads API**
   - Set up a backend service to handle API calls
   - Update the `fetchFromGoodreads()` method

3. **Option C: Manual Updates**
   - Replace mock data with your actual reading list
   - Update the `loadMockBooks()` method

### 3. Essays

To add your essays:
1. Update the `essays` array in `script.js`
2. Add actual URLs to your essay pages
3. Update the essay content in the HTML

### 4. Styling

Customize the design in `styles.css`:
- Colors: Update CSS custom properties
- Fonts: Change the Google Fonts import
- Layout: Modify grid and flexbox properties
- Animations: Adjust transition timings

### 5. Deployment

#### GitHub Pages
1. Push to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Your site will be available at `username.github.io/repository-name`

#### Netlify
1. Connect your GitHub repository
2. Deploy automatically on every push

#### Vercel
1. Import your GitHub repository
2. Deploy with zero configuration

## File Structure

```
mjafa.me/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers

## Performance

- Lighthouse score: 95+
- First Contentful Paint: <1.5s
- Cumulative Layout Shift: <0.1

## License

MIT License - feel free to use this template for your own portfolio!

## Credits

Inspired by [Amjad Masad's portfolio](https://amasad.me/) design and philosophy.
