// Example Node.js/Express backend for Goodreads API integration
// This is an example - you would need to set up a real backend service

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const xml2js = require('xml2js');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your frontend
app.use(cors({
    origin: ['http://localhost:3000', 'https://your-domain.com'],
    credentials: true
}));

app.use(express.json());

// Goodreads API configuration
const GOODREADS_CONFIG = {
    apiKey: process.env.GOODREADS_API_KEY || 'YOUR_API_KEY',
    userId: process.env.GOODREADS_USER_ID || '119679333', // Your actual Goodreads User ID
    baseUrl: 'https://www.goodreads.com'
};

// Parse Goodreads RSS feed
async function parseGoodreadsRSS(userId, shelf = 'currently-reading') {
    try {
        const rssUrl = `https://www.goodreads.com/review/list_rss/${userId}?shelf=${shelf}`;
        const response = await axios.get(rssUrl);
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);
        
        const books = result.rss.channel[0].item.map(item => ({
            title: item.title[0].split(' by ')[0],
            author: item.title[0].split(' by ')[1] || 'Unknown Author',
            cover: extractCoverFromDescription(item.description[0]),
            link: item.link[0],
            rating: extractRatingFromDescription(item.description[0]),
            dateAdded: item.pubDate[0]
        }));
        
        return books;
    } catch (error) {
        console.error('Error parsing Goodreads RSS:', error);
        throw error;
    }
}

// Extract book cover from description
function extractCoverFromDescription(description) {
    const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
    return imgMatch ? imgMatch[1] : null;
}

// Extract rating from description
function extractRatingFromDescription(description) {
    const ratingMatch = description.match(/rated it (\d+) out of 5/);
    return ratingMatch ? parseInt(ratingMatch[1]) : 0;
}

// API Routes
app.get('/api/goodreads/currently-reading', async (req, res) => {
    try {
        const books = await parseGoodreadsRSS(GOODREADS_CONFIG.userId, 'currently-reading');
        res.json(books.slice(0, 8)); // Limit to 8 books
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

app.get('/api/goodreads/read-this-year', async (req, res) => {
    try {
        const books = await parseGoodreadsRSS(GOODREADS_CONFIG.userId, 'read');
        res.json(books.slice(0, 8));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

app.get('/api/goodreads/to-read', async (req, res) => {
    try {
        const books = await parseGoodreadsRSS(GOODREADS_CONFIG.userId, 'to-read');
        res.json(books.slice(0, 8));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Goodreads API server running on port ${PORT}`);
});

// Example package.json dependencies:
/*
{
  "name": "goodreads-api-backend",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "axios": "^1.6.0",
    "xml2js": "^0.6.2"
  }
}
*/

// Example environment variables (.env file):
/*
GOODREADS_API_KEY=your_api_key_here
GOODREADS_USER_ID=your_user_id_here
PORT=3000
*/
