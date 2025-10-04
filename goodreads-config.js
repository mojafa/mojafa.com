// Goodreads Integration Configuration
// Update these settings to connect your portfolio to Goodreads

const GOODREADS_CONFIG = {
    // Choose your integration method:
    // 1. RSS Feed (Recommended - No backend required)
    // 2. API (Requires backend service)
    // 3. Manual (You manage books manually)
    
    integrationMethod: 'rss', // Options: 'rss', 'api', 'manual'
    
    // RSS Feed Configuration (Method 1 - Recommended)
    rss: {
        // Your Goodreads RSS feed URL (configured with your actual User ID)
        feedUrl: 'https://www.goodreads.com/review/list_rss/119679333',
        
        // Alternative RSS feeds you can use:
        // Currently Reading: https://www.goodreads.com/review/list_rss/119679333?shelf=currently-reading
        // Read This Year: https://www.goodreads.com/review/list_rss/119679333?shelf=read&per_page=20
        // Want to Read: https://www.goodreads.com/review/list_rss/119679333?shelf=to-read
    },
    
    // API Configuration (Method 2 - Requires backend)
    api: {
        // Your backend API endpoint that fetches from Goodreads API
        endpoint: '/api/goodreads',
        
        // Goodreads API credentials (store these securely on your backend)
        apiKey: 'YOUR_GOODREADS_API_KEY',
        userId: '119679333', // Your actual Goodreads User ID
    },
    
    // Manual Configuration (Method 3 - You manage books)
    manual: {
        // Books will be stored in localStorage
        // You can add/remove books through the interface
        enableInterface: true, // Show add/remove book buttons
    },
    
    // Display Settings
    display: {
        maxBooks: 8,           // Maximum number of books to show
        showRatings: true,     // Show star ratings
        showProgress: true,    // Show reading progress
        showDates: true,       // Show read dates
    }
};

// How to find your Goodreads User ID:
// 1. Go to your Goodreads profile page
// 2. Look at the URL: https://www.goodreads.com/user/show/12345678-your-name
// 3. The number (12345678) is your user ID

// Example configurations:

// RSS Feed Example:
// feedUrl: 'https://www.goodreads.com/review/list_rss/12345678'

// Currently Reading RSS:
// feedUrl: 'https://www.goodreads.com/review/list_rss/12345678?shelf=currently-reading'

// Read This Year RSS:
// feedUrl: 'https://www.goodreads.com/review/list_rss/12345678?shelf=read&per_page=20'

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GOODREADS_CONFIG;
}
