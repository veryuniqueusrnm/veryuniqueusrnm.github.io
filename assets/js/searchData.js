$(document).ready(function() {
  // Search data with URLs
  const searchData = [
    {
      id: 1,
      title: "About me",
      content: "Just a small biography.",
      url: "/about",
      openInNewTab: false
    },
    {
      id: 2,
      title: "Projects",
      content: "List of the things I've done and will do.",
      url: "/projects",
      openInNewTab: false
    } //add comma if needed
  ];

  const lastSearchQueries = {
    desktop: '',
    mobile: ''
  };

  function performSearch(query, resultsContainer, type) {
    const $resultsContainer = $(resultsContainer);
    if (!query) {
      $resultsContainer.removeClass('active').empty();
      lastSearchQueries[type] = '';
      return;
    }
    
    lastSearchQueries[type] = query;
    const lowerQuery = query.toLowerCase();
    const results = searchData.filter(item => {
      return (
        item.title.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery)
      );
    });
    
    displayResults(results, $resultsContainer);
  }
  
  function displayResults(results, $resultsContainer) {
    $resultsContainer.empty();
    
    if (results.length === 0) {
      $resultsContainer.html('<p>No results found.</p>').addClass('active');
      return;
    }
    
    let html = '<ul>';
    $.each(results, function(index, item) {
      const targetAttr = item.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      html += `
        <li>
          <a href="${item.url}" class="search-result-link"${targetAttr}>
            <h3>${item.title}</h3>
            <p>${item.content}</p>
          </a>
        </li>
      `;
    });
    html += '</ul>';
    
    $resultsContainer.html(html).addClass('active');
  }

  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }

  const $desktopSearchInput = $('.search .field.keyword input');
  const $desktopResultsContainer = $('.search .results');
  
  if ($desktopSearchInput.length && $desktopResultsContainer.length) {
    $desktopSearchInput.on('input', debounce(function() {
      performSearch($(this).val().trim(), $desktopResultsContainer.get(0), 'desktop');
    }, 300));
    
    // Show results when focusing back on input
    $desktopSearchInput.on('focus', function() {
      if (lastSearchQueries.desktop) {
        performSearch(lastSearchQueries.desktop, $desktopResultsContainer.get(0), 'desktop');
      }
    });
    
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.search').length) {
        $desktopResultsContainer.removeClass('active');
      }
    });
  }

  const $mobileSearchInput = $('.search-mobile #q_mobile');
  const $mobileResultsContainer = $('.search-mobile .results');
  const $mobileSearchForm = $('#head_search_form');
  
  if ($mobileSearchInput.length && $mobileResultsContainer.length && $mobileSearchForm.length) {
    $mobileSearchForm.on('submit', function(e) {
      e.preventDefault();
      performSearch($mobileSearchInput.val().trim(), $mobileResultsContainer.get(0), 'mobile');
      return false;
    });
    
    $mobileSearchInput.on('input', debounce(function() {
      performSearch($(this).val().trim(), $mobileResultsContainer.get(0), 'mobile');
    }, 300));
    
    // Show results when focusing back on input
    $mobileSearchInput.on('focus', function() {
      if (lastSearchQueries.mobile) {
        performSearch(lastSearchQueries.mobile, $mobileResultsContainer.get(0), 'mobile');
      }
    });
    
    $mobileSearchInput.on('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch($(this).val().trim(), $mobileResultsContainer.get(0), 'mobile');
        return false;
      }
    });
    
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.search-mobile').length) {
        $mobileResultsContainer.removeClass('active');
      }
    });
  }
});
