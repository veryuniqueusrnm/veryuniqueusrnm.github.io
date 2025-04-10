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

  // Search function
  function performSearch(query, resultsContainer) {
    const $resultsContainer = $(resultsContainer); // Convert to jQuery object
    if (!query) {
      $resultsContainer.removeClass('active').empty();
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const results = searchData.filter(item => {
      return (
        item.title.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery)
      );
    });
    
    displayResults(results, $resultsContainer);
  }
  
  // Display results
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

  // Debounce function
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

  // Desktop search
  const $desktopSearchInput = $('.search .field.keyword input');
  const $desktopResultsContainer = $('.search .results');
  
  if ($desktopSearchInput.length && $desktopResultsContainer.length) {
    $desktopSearchInput.on('input', debounce(function() {
      performSearch($(this).val().trim(), $desktopResultsContainer.get(0));
    }, 300));
    
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.search').length) {
        $desktopResultsContainer.removeClass('active');
      }
    });
  }

  // Mobile search
  const $mobileSearchInput = $('.search-mobile #q_mobile');
  const $mobileResultsContainer = $('.search-mobile .results');
  const $mobileSearchForm = $('#head_search_form');
  
  if ($mobileSearchInput.length && $mobileResultsContainer.length && $mobileSearchForm.length) {
    $mobileSearchForm.on('submit', function(e) {
      e.preventDefault();
      performSearch($mobileSearchInput.val().trim(), $mobileResultsContainer.get(0));
      return false;
    });
    
    $mobileSearchInput.on('input', debounce(function() {
      performSearch($(this).val().trim(), $mobileResultsContainer.get(0));
    }, 300));
    
    $mobileSearchInput.on('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch($(this).val().trim(), $mobileResultsContainer.get(0));
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
