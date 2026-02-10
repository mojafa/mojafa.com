// Theme toggle functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        if (!this.themeToggle) return;
        
        this.currentTheme = localStorage.getItem('theme') || this.getSystemPreference();
        this.init();
    }

    getSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Goodreads integration
class GoodreadsIntegration {
    constructor() {
        this.booksGrid = document.getElementById('booksGrid');
        if (!this.booksGrid) return;
        
        this.config = this.loadConfiguration();
        this.init();
    }

    loadConfiguration() {
        try {
            if (typeof GOODREADS_CONFIG !== 'undefined') {
                return this.parseConfig(GOODREADS_CONFIG);
            }
        } catch (error) {
            console.log('Using default configuration');
        }
        
        return {
            integrationMethod: 'rss',
            rssFeedUrl: 'https://www.goodreads.com/review/list_rss/119679333',
            maxBooks: 6
        };
    }

    parseConfig(config) {
        return {
            integrationMethod: config.integrationMethod || 'rss',
            rssFeedUrl: config.rss?.feedUrl || '',
            maxBooks: config.display?.maxBooks || 6
        };
    }

    init() {
        if (this.config.rssFeedUrl && this.config.rssFeedUrl.includes('119679333')) {
            this.loadFromRSS();
        } else {
            this.loadMockBooks();
        }
    }

    async loadFromRSS() {
        try {
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const rssUrl = encodeURIComponent(this.config.rssFeedUrl);
            const response = await fetch(proxyUrl + rssUrl);
            
            if (!response.ok) throw new Error('Failed to fetch RSS feed');
            
            const xmlText = await response.text();
            const books = this.parseRSSFeed(xmlText);
            this.displayBooks(books);
        } catch (error) {
            console.error('RSS feed error:', error);
            this.loadMockBooks();
        }
    }

    parseRSSFeed(xmlText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        const books = [];

        items.forEach(item => {
            const title = item.querySelector('title')?.textContent || '';
            const description = item.querySelector('description')?.textContent || '';
            const link = item.querySelector('link')?.textContent || '';
            
            const book = this.extractBookFromRSSItem(title, description, link);
            if (book) books.push(book);
        });

        return books.slice(0, this.config.maxBooks);
    }

    extractBookFromRSSItem(title, description, link) {
        const byIndex = title.indexOf(' by ');
        if (byIndex === -1) return null;

        const bookTitle = title.substring(0, byIndex).trim();
        const author = title.substring(byIndex + 4).trim();
        
        const coverMatch = description.match(/<img[^>]+src="([^"]+)"/);
        const cover = coverMatch ? coverMatch[1] : this.getDefaultCover();

        return { title: bookTitle, author, cover, link };
    }

    loadMockBooks() {
        const mockBooks = [
            { title: "The Lean Startup", author: "Eric Ries", cover: "https://images-na.ssl-images-amazon.com/images/I/81-QB7nDh4L.jpg" },
            { title: "Atomic Habits", author: "James Clear", cover: "https://images-na.ssl-images-amazon.com/images/I/51Tlm0GZ3mL.jpg" },
            { title: "Sapiens", author: "Yuval Noah Harari", cover: "https://images-na.ssl-images-amazon.com/images/I/41+5MECznWL.jpg" },
            { title: "The Pragmatic Programmer", author: "David Thomas", cover: "https://images-na.ssl-images-amazon.com/images/I/51W1sBPO7tL.jpg" }
        ];
        this.displayBooks(mockBooks);
    }

    displayBooks(books) {
        if (!this.booksGrid) return;
        
        this.booksGrid.innerHTML = '';
        
        if (books.length === 0) {
            this.booksGrid.innerHTML = '<div class="book-placeholder">No books found.</div>';
            return;
        }
        
        books.forEach(book => {
            const bookElement = this.createBookElement(book);
            this.booksGrid.appendChild(bookElement);
        });
    }

    getDefaultCover() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgODAgMTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI0MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Qm9vazwvdGV4dD48L3N2Zz4=';
    }

    createBookElement(book) {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-item';
        
        const defaultCover = this.getDefaultCover();
        bookDiv.innerHTML = `
            <img src="${book.cover}" alt="${book.title}" class="book-cover" onerror="this.src='${defaultCover}'">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
        `;
        
        return bookDiv;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new GoodreadsIntegration();
});
