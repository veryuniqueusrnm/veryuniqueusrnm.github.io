$(document).ready(function() {
  // Configuration - UPDATE THESE TO MATCH YOUR PAGE STRUCTURE
  const config = {
    contentSelectors: 'main, article, .content, .post', // Elements containing searchable content
    headerSelectors: 'h1, h2, h3, h4, .title, .heading', // Elements to use as titles
    minContentLength: 30, // Minimum characters to index
    maxContentLength: 300 // Maximum characters to store
  };

  // Build search index from visible page content
  function buildSearchIndex() {
    const searchData = [];
    let idCounter = 1;

    // Helper to clean text
    const cleanText = (text) => {
      return text ? text.replace(/\s+/g, ' ').trim() : '';
    };

    // Index content sections
    $(config.contentSelectors).each(function() {
      const $section = $(this);
      let title = 'Page Content';
      
      // Find the first heading to use as title
      $(config.headerSelectors).first().each(function() {
        title = cleanText($(this).text()) || title;
      });

      const content = cleanText($section.text());
      
      if (content.length >= config.minContentLength) {
        searchData.push({
          id: idCounter++,
          title: title,
          content: content.substring(0, config.maxContentLength),
          url: window.location.pathname,
          openInNewTab: false
        });
      }
    });

    console.log('Search index built with', searchData.length, 'items'); // Debug log
    return searchData;
  }

  // Search application
  const searchApp = {
    data: [],
    lastQuery: '',
    
    init: function() {
      this.data = buildSearchIndex();
      this.setupEventHandlers();
    },
    
    setupEventHandlers: function() {
      // Desktop search
      $('.search input[type="text"]').on('input', this.debounce(function() {
        searchApp.performSearch($(this).val().trim());
      }, 300));
      
      // Mobile search
      $('.search-mobile input[type="text"]').on('input', this.debounce(function() {
        searchApp.performSearch($(this).val().trim());
      }, 300));
      
      // Prevent form submission
      $('form').on('submit', function(e) {
        e.preventDefault();
      });
    },
    
    performSearch: function(query) {
      if (!query) {
        $('.results').removeClass('active').empty();
        return;
      }
      
      this.lastQuery = query;
      const lowerQuery = query.toLowerCase();
      const results = this.data.filter(item => {
        return item.title.toLowerCase().includes(lowerQuery) || 
               item.content.toLowerCase().includes(lowerQuery);
      });
      
      this.displayResults(results);
    },
    
    displayResults: function(results) {
      const $resultsContainer = $('.results').empty();
      
      if (!results.length) {
        $resultsContainer.html(
          '<div class="search-message">Found no matching content. Try different keywords.</div>'
        ).addClass('active');
        return;
      }
      
      let html = '<div class="search-results">';
      results.forEach(item => {
        html += `
          <div class="search-result">
            <a href="${item.url}" class="search-link">
              <h3>${item.title}</h3>
              <p>${this.highlight(item.content.substring(0, 150), this.lastQuery)}...</p>
            </a>
          </div>
        `;
      });
      html += '</div>';
      
      $resultsContainer.html(html).addClass('active');
    },
    
    highlight: function(text, query) {
      if (!query) return text;
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    },
    
    debounce: function(func, wait) {
      let timeout;
      return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(context, args);
        }, wait);
      };
    }
  };

  // Initialize
  searchApp.init();
});