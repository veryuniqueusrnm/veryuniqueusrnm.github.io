$(document).ready(function () {
    // Search data with URLs - now with openInNewTab flag
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

    function performSearch(query, resultsContainer) {
        if (!query) {
            resultsContainer.removeClass('active').empty();
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = searchData.filter(item => {
            return (
                item.title.toLowerCase().includes(lowerQuery) ||
                item.content.toLowerCase().includes(lowerQuery)
            );
        });

        displayResults(results, resultsContainer);
    }

    function displayResults(results, resultsContainer) {
        resultsContainer.empty();

        if (results.length === 0) {
            resultsContainer.html('<p>No results found.</p>').addClass('active');
            return;
        }

        let html = '<ul>';
        $.each(results, function (index, item) {
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

        resultsContainer.html(html).addClass('active');
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    const desktopSearchInput = document.querySelector('.search .field.keyword input');
    const desktopResultsContainer = document.querySelector('.search .results');

    if (desktopSearchInput && desktopResultsContainer) {
        desktopSearchInput.addEventListener('input', debounce(function () {
            performSearch(this.value.trim(), desktopResultsContainer);
        }, 300));

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.search')) {
                desktopResultsContainer.classList.remove('active');
            }
        });
    }

    const mobileSearchInput = document.querySelector('.search-mobile #q_mobile');
    const mobileResultsContainer = document.querySelector('.search-mobile .results');
    const mobileSearchForm = document.getElementById('head_search_form');

    if (mobileSearchInput && mobileResultsContainer && mobileSearchForm) {
        mobileSearchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            performSearch(mobileSearchInput.value.trim(), mobileResultsContainer);
            return false;
        });

        mobileSearchInput.addEventListener('input', debounce(function () {
            performSearch(this.value.trim(), mobileResultsContainer);
        }, 300));

        mobileSearchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value.trim(), mobileResultsContainer);
                return false;
            }
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.search-mobile')) {
                mobileResultsContainer.classList.remove('active');
            }
        });
    }
});
