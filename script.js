// Theme toggle functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.updateToggleIcon();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    updateToggleIcon() {
        this.themeToggle.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }
}

// Goodreads integration
class GoodreadsIntegration {
    constructor() {
        this.booksGrid = document.getElementById('booksGrid');
        this.booksReadElement = document.getElementById('booksRead');
        
        // Load configuration from external file or use defaults
        this.config = this.loadConfiguration();
        this.init();
    }

    loadConfiguration() {
        // Try to load from external config file, fallback to defaults
        try {
            // This would work if you include the config file in your HTML
            if (typeof GOODREADS_CONFIG !== 'undefined') {
                return this.parseConfig(GOODREADS_CONFIG);
            }
        } catch (error) {
            console.log('Using default configuration');
        }
        
        // Default configuration
        return {
            integrationMethod: 'rss',
            rssFeedUrl: 'https://www.goodreads.com/review/list_rss/119679333',
            apiEndpoint: '/api/goodreads',
            maxBooks: 8,
            showRatings: true
        };
    }

    parseConfig(config) {
        const method = config.integrationMethod;
        
        return {
            integrationMethod: method,
            rssFeedUrl: config.rss?.feedUrl || '',
            apiEndpoint: config.api?.endpoint || '/api/goodreads',
            maxBooks: config.display?.maxBooks || 8,
            showRatings: config.display?.showRatings || true,
            enableManualInterface: config.manual?.enableInterface || false
        };
    }

    init() {
        // Try different integration methods based on configuration
        switch (this.config.integrationMethod) {
            case 'rss':
                if (this.config.rssFeedUrl && this.config.rssFeedUrl.includes('119679333')) {
                    this.loadFromRSS();
                } else {
                    console.log('RSS feed URL not configured. Using mock data.');
                    this.loadMockBooks();
                }
                break;
            case 'api':
                this.loadFromAPI();
                break;
            case 'manual':
                this.loadManualBooks();
                break;
            default:
                this.loadMockBooks();
        }
        this.updateReadingStats();
    }

    // RSS Feed Integration (Recommended - No backend required)
    async loadFromRSS() {
        try {
            // Use a CORS proxy to fetch the RSS feed
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const rssUrl = encodeURIComponent(this.config.rssFeedUrl);
            const response = await fetch(proxyUrl + rssUrl);
            
            if (!response.ok) {
                throw new Error('Failed to fetch RSS feed');
            }
            
            const xmlText = await response.text();
            const books = this.parseRSSFeed(xmlText);
            this.displayBooks(books);
        } catch (error) {
            console.error('RSS feed error:', error);
            this.loadMockBooks(); // Fallback to mock data
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
            
            // Extract book information from the RSS item
            const book = this.extractBookFromRSSItem(title, description, link);
            if (book) {
                books.push(book);
            }
        });

        return books.slice(0, 8); // Limit to 8 books
    }

    extractBookFromRSSItem(title, description, link) {
        // Parse the title to extract book name and author
        // Goodreads RSS format: "Book Title by Author Name"
        const byIndex = title.indexOf(' by ');
        if (byIndex === -1) return null;

        const bookTitle = title.substring(0, byIndex).trim();
        const author = title.substring(byIndex + 4).trim();
        
        // Extract cover image from description if available
        const coverMatch = description.match(/<img[^>]+src="([^"]+)"/);
        const cover = coverMatch ? coverMatch[1] : this.getDefaultCover();

        return {
            title: bookTitle,
            author: author,
            cover: cover,
            link: link,
            rating: 0 // RSS doesn't include ratings
        };
    }

    // API Integration (Requires backend service)
    async loadFromAPI() {
        try {
            const response = await fetch(this.config.apiEndpoint);
            if (!response.ok) {
                throw new Error('API request failed');
            }
            const books = await response.json();
            this.displayBooks(books);
        } catch (error) {
            console.error('API error:', error);
            this.loadMockBooks(); // Fallback to mock data
        }
    }

    // Manual book management
    loadManualBooks() {
        const manualBooks = JSON.parse(localStorage.getItem('manualBooks') || '[]');
        if (manualBooks.length > 0) {
            this.displayBooks(manualBooks);
        } else {
            this.loadMockBooks();
        }
    }

    // Add manual book management interface
    addManualBook(book) {
        const manualBooks = JSON.parse(localStorage.getItem('manualBooks') || '[]');
        manualBooks.push(book);
        localStorage.setItem('manualBooks', JSON.stringify(manualBooks));
        this.displayBooks(manualBooks);
    }

    loadMockBooks() {
        const mockBooks = [
            {
                title: "The Lean Startup",
                author: "Eric Ries",
                cover: "https://images-na.ssl-images-amazon.com/images/I/81-QB7nDh4L.jpg",
                rating: 4
            },
            {
                title: "Atomic Habits",
                author: "James Clear",
                cover: "https://images-na.ssl-images-amazon.com/images/I/51Tlm0GZ3mL.jpg",
                rating: 5
            },
            {
                title: "Sapiens",
                author: "Yuval Noah Harari",
                cover: "https://images-na.ssl-images-amazon.com/images/I/41+5MECznWL.jpg",
                rating: 5
            },
            {
                title: "The Pragmatic Programmer",
                author: "David Thomas",
                cover: "https://images-na.ssl-images-amazon.com/images/I/51W1sBPO7tL.jpg",
                rating: 4
            }
        ];

        this.displayBooks(mockBooks);
    }

    displayBooks(books) {
        this.booksGrid.innerHTML = '';
        
        if (books.length === 0) {
            this.booksGrid.innerHTML = '<div class="book-placeholder"><p>No books found. Check your Goodreads configuration.</p></div>';
            return;
        }
        
        books.forEach(book => {
            const bookElement = this.createBookElement(book);
            this.booksGrid.appendChild(bookElement);
        });
    }

    getDefaultCover() {
        // Return a default book cover SVG
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgODAgMTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI0MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Qm9vazwvdGV4dD48L3N2Zz4=';
    }

    createBookElement(book) {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-item';
        
        bookDiv.innerHTML = `
            <img src="${book.cover}" alt="${book.title}" class="book-cover" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgODAgMTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI0MCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Qm9vazwvdGV4dD48L3N2Zz4='">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
        `;
        
        return bookDiv;
    }

    updateReadingStats() {
        // Mock reading stats
        const booksRead = 12;
        this.booksReadElement.textContent = booksRead;
    }

    // Method to integrate with real Goodreads API
    async fetchFromGoodreads() {
        try {
            // This would require a backend service due to CORS restrictions
            // You could set up a simple Node.js/Express server to proxy Goodreads API calls
            const response = await fetch('/api/goodreads/currently-reading');
            const books = await response.json();
            this.displayBooks(books);
        } catch (error) {
            console.error('Error fetching from Goodreads:', error);
            this.loadMockBooks(); // Fallback to mock data
        }
    }
}

// Smooth scrolling for navigation
class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Essay management
class EssayManager {
    constructor() {
        this.essays = [
            {
                title: "The Future of Human-Computer Interaction",
                excerpt: "Exploring how AI and natural language processing are reshaping the way we interact with computers, from voice assistants to brain-computer interfaces.",
                date: "December 2024",
                url: "#"
            },
            {
                title: "Building Distributed Systems That Scale",
                excerpt: "Lessons learned from architecting systems that handle millions of requests while maintaining reliability and performance.",
                date: "November 2024",
                url: "#"
            },
            {
                title: "The Philosophy of Code",
                excerpt: "What programming teaches us about thinking, problem-solving, and the nature of knowledge in the digital age.",
                date: "October 2024",
                url: "#"
            }
        ];
    }

    loadEssays() {
        const essaysList = document.querySelector('.essays-list');
        essaysList.innerHTML = '';

        this.essays.forEach(essay => {
            const essayElement = this.createEssayElement(essay);
            essaysList.appendChild(essayElement);
        });
    }

    createEssayElement(essay) {
        const article = document.createElement('article');
        article.className = 'essay-item';
        
        article.innerHTML = `
            <h3 class="essay-title">
                <a href="${essay.url}" class="essay-link">${essay.title}</a>
            </h3>
            <p class="essay-excerpt">${essay.excerpt}</p>
            <time class="essay-date">${essay.date}</time>
        `;
        
        return article;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new ThemeManager();
    new GoodreadsIntegration();
    new NavigationManager();
    new EssayManager();
    
    // Add some interactive features
    addScrollEffects();
    addTypingEffect();
});

// Scroll effects for better UX
function addScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Typing effect for the name
function addTypingEffect() {
    const nameElement = document.querySelector('.name');
    const originalText = nameElement.textContent;
    nameElement.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            nameElement.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
}

// Utility function to format dates
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        GoodreadsIntegration,
        NavigationManager,
        EssayManager
    };
}
