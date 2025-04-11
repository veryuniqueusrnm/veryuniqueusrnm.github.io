$(document).ready(function() {
  // Configuration
  const config = {
    // Elements to include in search (adjust based on your page structure)
    contentSelectors: 'main, article, .content-area, .post-content',
    
    // Elements to exclude from search
    excludeSelectors: 'header, footer, nav, aside, .no-search, script, style',
    
    // Headers to use as titles (h1-h3)
    headerSelectors: 'h1, h2, h3',
    
    // Minimum content length to index (characters)
    minContentLength: 50,
    
    // Maximum content to store (characters)
    maxContentLength: 500,
    
    // Should we index links?
    indexLinks: true,
    
    // Only index links with these href patterns
    allowedLinkPatterns: [/^\/[^\/]/, /^#[^\/]/]  // Matches internal links and anchors
  };

  // Build search index from current page content
  function buildSearchIndex() {
    const searchData = [];
    let idCounter = 1;

    // Helper function to clean text
    const cleanText = (text) => {
      return text.replace(/\s+/g, ' ').trim();
    };

    // Index content sections
    $(config.contentSelectors).not(config.excludeSelectors).each(function() {
      const $section = $(this).clone();
      
      // Remove excluded elements from the clone
      $section.find(config.excludeSelectors).remove();
      
      // Get section title from headers
      let title = 'Untitled Section';
      const $firstHeader = $section.find(config.headerSelectors).first();
      if ($firstHeader.length) {
        title = cleanText($firstHeader.text());
        $firstHeader.remove(); // Remove header from content
      }
      
      // Get clean content
      let content = cleanText($section.text());
      
      if (content.length >= config.minContentLength) {
        searchData.push({
          id: idCounter++,
          title: title,
          content: content.substring(0, config.maxContentLength),
          url: window.location.pathname + window.location.search,
          sectionId: $section.attr('id') || null,
          openInNewTab: false,
          type: 'content'
        });
      }
    });

    // Index links if enabled
    if (config.indexLinks) {
      $('a').not(config.excludeSelectors).each(function() {
        const $link = $(this);
        const href = $link.attr('href');
        
        // Check if link should be indexed
        const shouldIndex = config.allowedLinkPatterns.some(pattern => 
          href && pattern.test(href)
        );
        
        if (shouldIndex) {
          const linkText = cleanText($link.text());
          const parentText = cleanText($link.parent().text());
          
          if (linkText.length > 3) {
            searchData.push({
              id: idCounter++,
              title: linkText,
              content: parentText.substring(0, config.maxContentLength),
              url: href,
              openInNewTab: $link.attr('target') === '_blank',
              type: 'link'
            });
          }
        }
      });
    }

    return searchData;
  }

  // Search functionality
  const searchApp = {
    data: [],
    lastSearchQueries: { desktop: '', mobile: '' },
    
    init: function() {
      this.data = buildSearchIndex();
      this.initDesktopSearch();
      this.initMobileSearch();
    },
    
    performSearch: function(query, $resultsContainer, type) {
      if (!query) {
        $resultsContainer.removeClass('active').empty();
        this.lastSearchQueries[type] = '';
        return;
      }
      
      this.lastSearchQueries[type] = query;
      const lowerQuery = query.toLowerCase();
      
      const results = this.data.filter(item => {
        return (
          item.title.toLowerCase().includes(lowerQuery) ||
          item.content.toLowerCase().includes(lowerQuery)
        );
      });
      
      this.displayResults(results, $resultsContainer);
    },
    
    displayResults: function(results, $resultsContainer) {
      $resultsContainer.empty();
      
      if (results.length === 0) {
        $resultsContainer.html('<p class="no-results">No results found. Try different keywords.</p>')
          .addClass('active');
        return;
      }
      
      let html = '<ul class="search-results-list">';
      results.forEach(item => {
        const targetAttr = item.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
        const url = item.url.startsWith('#') ? window.location.pathname + item.url : item.url;
        
        html += `
          <li class="search-result-item" data-type="${item.type}">
            <a href="${url}" class="search-result-link"${targetAttr}>
              <h3 class="result-title">${item.title}</h3>
              ${item.content ? `<p class="result-snippet">${item.content.substring(0, 150)}...</p>` : ''}
            </a>
          </li>
        `;
      });
      html += '</ul>';
      
      $resultsContainer.html(html).addClass('active');
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
    },
    
    initDesktopSearch: function() {
      const $desktopSearchInput = $('.search .field.keyword input');
      const $desktopResultsContainer = $('.search .results');
      
      if ($desktopSearchInput.length && $desktopResultsContainer.length) {
        $desktopSearchInput.on('input', this.debounce(function() {
          searchApp.performSearch(
            $(this).val().trim(), 
            $desktopResultsContainer, 
            'desktop'
          );
        }, 300));
        
        $desktopSearchInput.on('focus', function() {
          if (searchApp.lastSearchQueries.desktop) {
            searchApp.performSearch(
              searchApp.lastSearchQueries.desktop, 
              $desktopResultsContainer, 
              'desktop'
            );
          }
        });
        
        $(document).on('click', function(e) {
          if (!$(e.target).closest('.search').length) {
            $desktopResultsContainer.removeClass('active');
          }
        });
      }
    },
    
    initMobileSearch: function() {
      const $mobileSearchInput = $('.search-mobile #q_mobile');
      const $mobileResultsContainer = $('.search-mobile .results');
      const $mobileSearchForm = $('#head_search_form');
      
      if ($mobileSearchInput.length && $mobileResultsContainer.length && $mobileSearchForm.length) {
        $mobileSearchForm.on('submit', function(e) {
          e.preventDefault();
          searchApp.performSearch(
            $mobileSearchInput.val().trim(), 
            $mobileResultsContainer, 
            'mobile'
          );
          return false;
        });
        
        $mobileSearchInput.on('input', this.debounce(function() {
          searchApp.performSearch(
            $(this).val().trim(), 
            $mobileResultsContainer, 
            'mobile'
          );
        }, 300));
        
        $mobileSearchInput.on('focus', function() {
          if (searchApp.lastSearchQueries.mobile) {
            searchApp.performSearch(
              searchApp.lastSearchQueries.mobile, 
              $mobileResultsContainer, 
              'mobile'
            );
          }
        });
        
        $mobileSearchInput.on('keydown', function(e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            searchApp.performSearch(
              $(this).val().trim(), 
              $mobileResultsContainer, 
              'mobile'
            );
            return false;
          }
        });
        
        $(document).on('click', function(e) {
          if (!$(e.target).closest('.search-mobile').length) {
            $mobileResultsContainer.removeClass('active');
          }
        });
      }
    }
  };

  // Initialize the search application
  searchApp.init();
});