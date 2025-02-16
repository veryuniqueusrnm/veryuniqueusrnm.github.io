// Debugging stuff
$(document).ready(function () {
    if (typeof jQuery !== 'undefined') {
        console.log("jQuery is loaded.");
        console.log("jQuery version:", jQuery.fn.jquery);
        if (jQuery.noConflict) {
            console.log("jQuery is in noConflict mode.");
        }
    } else {
        console.log("jQuery is not loaded.");
    }
});

//Jquery Include HTML
$(document).ready(function () {
    function includeHTML() {
        $('[include-html]').each(function () {
            var $this = $(this);
            var file = $this.attr('include-html');
            if (file) {
                $.ajax({
                    url: file,
                    method: 'GET',
                    success: function (data) {
                        $this.html(data);
                        console.log('Successfully included:', file);
                    },
                    error: function () {
                        console.error('Failed to include:', file);
                        $this.html('<div class="fallback">Content could not be loaded, using fallback. Please check the console for more information.</div>');
                    },
                    complete: function () {
                        $this.removeAttr('include-html');
                        includeHTML();
                    }
                });
            }
        });
    }

    includeHTML();
});

$('<style>').prop('type', 'text/css').html(`
    .fallback {
        padding: 20px;
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        border-radius: 5px;
        text-align: center;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        margin: 10px 0;
    }
`).appendTo('head');

$(document).ready(async function () {
    const accountButton = $('.nav-btn.account');
    const overlay = $('.overlay');
    const closeButton = $('.close-btn');
    const loginPopup = $('.login-popup');

    const auth0Client = await createAuth0Client({
        domain: 'dev-z438nuxdqetp1wld.eu.auth0.com',
        client_id: 'hmazRwxDb4pAbdbjgQAwu8xwcTufV6Ev',
        cacheLocation: 'localstorage',
        useRefreshTokens: true
    });

    // Handle Auth0 redirect callback
    if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
        await auth0Client.handleRedirectCallback();
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    accountButton.on('click', function () {
        overlay.toggle();
    });

    function addCloseButtonListener() {
        $('.close-btn').on('click', function () {
            overlay.hide();
        });
    }

    try {
        // Attempt silent authentication
        const token = await auth0Client.getTokenSilently();
        if (token) {
            await handleAuthenticatedUser();
            return;
        }
    } catch (error) {
        console.warn("Silent authentication failed:", error);
    }

    // If silent authentication fails, show login prompt
    showLoginPrompt();

    async function handleAuthenticatedUser() {
        const user = await auth0Client.getUser();

        const cookies = document.cookie.split('; ');
        let lastSignInDate = null;
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split('=');
            if (cookie[0] === 'lastSignIn') {
                lastSignInDate = cookie[1];
                break;
            }
        }

        // If no previous sign-in date is found, set the current date as the first sign-in date
        if (!lastSignInDate) {
            lastSignInDate = new Date().toLocaleDateString();
            document.cookie = `lastSignIn=${lastSignInDate}; path=/; max-age=${60 * 60 * 24 * 365}`;
        }

        loginPopup.html(`
            <span class="close-btn"><i class="fa-solid fa-x"></i></span>
            <p style="margin-top: 0px !important;">Welcome, ${user.name}</p>
            <img src="${user.picture}" alt="Profile Picture" class="profile-img" draggable="false"/>
            <div class="userDetails">
                <p>Email: <span class="email-blurred">${user.email}</span></p>
                <p>Last sign in: ${lastSignInDate}</p>
            </div>
            <button class="auth0-logout-btn">Sign out</button>
        `);
        addCloseButtonListener();

        $('.auth0-logout-btn').on('click', function () {
            auth0Client.logout({
                returnTo: window.location.origin
            });
        });
    }

    function showLoginPrompt() {
        loginPopup.html(`
            <span class="close-btn"><i class="fa-solid fa-x"></i></span>
            <p style="margin-top: 0px !important;">Sign in</p>
            <button class="auth0-login-btn" id="google-login">Sign in with Google*</button>
            <p class="footnote" style="color: #000;">*You'll be redirected to Google's sign-in page, where you can securely enter your credentials. But if you signed in before you'll be redirected to Google then back automatically.</p>
            <a style="color: #000; text-decoration: none; font-size: 60%;" href="https://www.okta.com/privacy-policy/" target="_blank">Click here to learn more about how Auth0 manages your data. <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        `);
        addCloseButtonListener();

        $('#google-login').on('click', async function () {
            await auth0Client.loginWithRedirect({
                redirect_uri: window.location.origin,
                connection: 'google-oauth2'
            });
        });
    }
});

// jQuery menu (mobile)
$(document).ready(function () {
    $('.hamburger').click(function () {
        $(this).toggleClass('active');
        $('.dropdown').slideToggle(300);
    });

    $('.dropdown a').not('.menu-button-mobile').click(function () {
        $('.dropdown').slideUp(300);
        $('.hamburger').removeClass('active');
    });

    $('.menu-button-mobile').click(function (e) {
        e.preventDefault();
        $(this).next('.submenu').slideToggle(300);
        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
    });
});

// Jquery menu (desktop)
$(document).ready(function () {
    $(".menu-container").hover(function () {
        $(this).find(".menu").stop(true, true).fadeIn(300);
        $(this).find(".menu-button i").css("transform", "rotate(180deg)");
    }, function () {
        $(this).find(".menu").stop(true, true).fadeOut(300);
        $(this).find(".menu-button i").css("transform", "rotate(0deg)");
    });
});

// Function to handle screen width changes
$(document).ready(function () {
    function checkScreenWidth() {
        console.log("CheckScreenWidth");
    }

    checkScreenWidth();

    $(window).on('resize', checkScreenWidth);
});

// Script to display device details
$(document).ready(function () {
    function getBrowserAndDeviceDetails() {
        var userAgent = navigator.userAgent;
        var browserName, deviceType;

        if (userAgent.indexOf("Firefox") > -1) {
            browserName = "Mozilla Firefox";
        } else if (userAgent.indexOf("SamsungBrowser") > -1) {
            browserName = "Samsung Internet";
        } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
            browserName = "Opera";
        } else if (userAgent.indexOf("Trident") > -1) {
            browserName = "Microsoft Internet Explorer";
        } else if (userAgent.indexOf("Edge") > -1) {
            browserName = "Microsoft Edge";
        } else if (userAgent.indexOf("Chrome") > -1) {
            browserName = "Google Chrome";
        } else if (userAgent.indexOf("Safari") > -1) {
            browserName = "Apple Safari";
        } else {
            browserName = "Unknown Browser";
        }

        if (/Mobi|Android/i.test(userAgent)) {
            deviceType = "Mobile";
        } else if (/Tablet|iPad/i.test(userAgent)) {
            deviceType = "Tablet";
        } else {
            deviceType = "Desktop";
        }

        return `You are using ${browserName} on a ${deviceType} device.`;
    }

    $("#browserDetails").text(getBrowserAndDeviceDetails());
});

// Get commit info
$(document).ready(function () {
    const username = "veryuniqueusrnm";
    const repo = "veryuniqueusrnm.github.io";
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/commits`;

    $.getJSON(apiUrl, function (data) {
        if (!data || data.length === 0) return;

        const latestCommit = data[0];
        const commitId = latestCommit.sha.substring(0, 7);
        const commitDate = new Date(latestCommit.commit.author.date).toLocaleDateString();
        const commitMessage = latestCommit.commit.message;
        const commitUrl = latestCommit.html_url;

        $("#commit-info").html(
            `Latest commit: <strong><a href="${commitUrl}" target="_blank">${commitId} <i class="fa-solid fa-arrow-up-right-from-square"></i></a></strong> | ${commitDate} - ${commitMessage}. | Brought to you by GitHub.`
        );
    }).fail(function () {
        console.error("Failed to fetch commit data.");
    });
});