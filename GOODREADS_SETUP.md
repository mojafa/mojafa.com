# Goodreads Integration Setup Guide

This guide will help you connect your portfolio website to your Goodreads account to automatically display your currently reading books.

## 🚀 Quick Start (RSS Method - Recommended)

### Step 1: Find Your Goodreads User ID

1. Go to your [Goodreads profile page](https://www.goodreads.com/user/show/me)
2. Look at the URL: `https://www.goodreads.com/user/show/12345678-your-name`
3. Copy the number (e.g., `12345678`) - this is your User ID

### Step 2: Configure Your Portfolio

1. Open `goodreads-config.js`
2. Update the configuration:

```javascript
const GOODREADS_CONFIG = {
    integrationMethod: 'rss', // Use RSS method
    
    rss: {
        // Replace YOUR_USER_ID with your actual Goodreads User ID
        feedUrl: 'https://www.goodreads.com/review/list_rss/12345678',
    },
    
    display: {
        maxBooks: 8,
        showRatings: true,
    }
};
```

### Step 3: Test Your Setup

1. Open your portfolio website
2. Check the "Currently Reading" section
3. Your books should now appear automatically!

## 📚 RSS Feed Options

You can use different RSS feeds for different book lists:

### Currently Reading
```javascript
feedUrl: 'https://www.goodreads.com/review/list_rss/119679333?shelf=currently-reading'
```

### Read This Year
```javascript
feedUrl: 'https://www.goodreads.com/review/list_rss/119679333?shelf=read&per_page=20'
```

### Want to Read
```javascript
feedUrl: 'https://www.goodreads.com/review/list_rss/119679333?shelf=to-read'
```

### All Books
```javascript
feedUrl: 'https://www.goodreads.com/review/list_rss/119679333'
```

## 🔧 Advanced Setup (API Method)

If you want more control and features, you can set up a backend API:

### Step 1: Create a Backend Service

1. Use the example in `backend-example.js`
2. Deploy to services like:
   - [Vercel](https://vercel.com)
   - [Netlify Functions](https://netlify.com)
   - [Railway](https://railway.app)
   - [Heroku](https://heroku.com)

### Step 2: Update Configuration

```javascript
const GOODREADS_CONFIG = {
    integrationMethod: 'api',
    
    api: {
        endpoint: 'https://your-backend.vercel.app/api/goodreads',
    }
};
```

### Step 3: Environment Variables

Set these in your backend service:

```
GOODREADS_API_KEY=your_api_key_here
GOODREADS_USER_ID=your_user_id_here
```

## 📝 Manual Method

If you prefer to manage books manually:

### Step 1: Enable Manual Mode

```javascript
const GOODREADS_CONFIG = {
    integrationMethod: 'manual',
    
    manual: {
        enableInterface: true,
    }
};
```

### Step 2: Add Books Manually

You can add books through the browser console:

```javascript
// Add a book manually
const goodreads = new GoodreadsIntegration();
goodreads.addManualBook({
    title: "The Lean Startup",
    author: "Eric Ries",
    cover: "https://example.com/cover.jpg",
    rating: 5
});
```

## 🎨 Customization Options

### Display Settings

```javascript
display: {
    maxBooks: 8,           // Maximum books to show
    showRatings: true,     // Show star ratings
    showProgress: true,    // Show reading progress
    showDates: true,       // Show read dates
}
```

### Styling

You can customize the book display in `styles.css`:

```css
.book-item {
    /* Your custom styles */
    border-radius: 8px;
    transition: transform 0.2s ease;
}

.book-item:hover {
    transform: translateY(-2px);
}
```

## 🐛 Troubleshooting

### Books Not Loading?

1. **Check your User ID**: Make sure it's correct in the RSS URL
2. **Check RSS Feed**: Visit your RSS URL directly in browser
3. **Check Console**: Look for errors in browser developer tools
4. **CORS Issues**: The RSS method uses a CORS proxy, which should work automatically

### Common Issues

**"RSS feed URL not configured"**
- Make sure you've updated the `feedUrl` in `goodreads-config.js`
- Replace `YOUR_USER_ID` with your actual Goodreads User ID

**"No books found"**
- Check if you have books in your Goodreads shelf
- Try a different shelf (currently-reading, read, to-read)

**"CORS error"**
- This is handled automatically by the CORS proxy
- If issues persist, try the API method instead

## 🔄 Updating Books

### RSS Method
- Books update automatically when you change your Goodreads shelves
- No manual intervention needed

### API Method
- Books update when your backend fetches new data
- You can set up automatic updates with cron jobs

### Manual Method
- You need to add/remove books manually
- Books are stored in your browser's localStorage

## 📱 Mobile Considerations

The integration works on all devices, but consider:

- Book covers might be smaller on mobile
- Touch interactions for book details
- Responsive grid layout

## 🚀 Deployment

### GitHub Pages
1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. Your site will be available at `username.github.io/repository-name`

### Netlify
1. Connect your GitHub repository
2. Deploy automatically on every push
3. Custom domain support

### Vercel
1. Import your GitHub repository
2. Deploy with zero configuration
3. Automatic HTTPS and CDN

## 📊 Analytics

You can track book interactions:

```javascript
// Track book clicks
document.addEventListener('click', (e) => {
    if (e.target.closest('.book-item')) {
        // Track book interaction
        console.log('Book clicked:', e.target.closest('.book-item').dataset.bookTitle);
    }
});
```

## 🔒 Privacy

- RSS feeds are public by default
- No personal data is stored
- Books are displayed as they appear on your public Goodreads profile

## 🆘 Support

If you need help:

1. Check the browser console for errors
2. Verify your Goodreads User ID
3. Test the RSS feed URL directly
4. Try the manual method as a fallback

## 🎯 Next Steps

Once your Goodreads integration is working:

1. Customize the styling to match your brand
2. Add more book shelves (read, to-read, etc.)
3. Implement book search and filtering
4. Add reading statistics and goals
5. Connect with other services (Last.fm, Letterboxd, etc.)

Happy reading! 📚
