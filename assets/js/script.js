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

// Auth0 stuff
$(document).ready(async function () {
    const accountButton = $('.nav-btn.account');
    const overlay = $('.overlay');
    const closeButton = $('.close-btn');
    const loginPopup = $('.login-popup');

    const auth0Client = await createAuth0Client({
        domain: 'dev-z438nuxdqetp1wld.eu.auth0.com',
        client_id: 'hmazRwxDb4pAbdbjgQAwu8xwcTufV6Ev'
    });

    // Handle Auth0 redirect callback
    if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
        await auth0Client.handleRedirectCallback();
        window.history.replaceState({}, document.title, window.location.pathname);  // Clean up URL after callback
    }

    accountButton.on('click', function () {
        overlay.toggle();
    });

    function addCloseButtonListener() {
        $('.close-btn').on('click', function () {
            overlay.hide();
        });
    }

    const isAuthenticated = await auth0Client.isAuthenticated();

    if (!isAuthenticated) {
        loginPopup.html(`
            <span class="close-btn"><i class="fa-solid fa-x"></i></span>
            <p style="margin-top: 0px !important;">Sign in</p>
            <p style="color: #721c24;">This feature is currently disabled!</p>
            <!--button class="auth0-login-btn" id="google-login">Sign in with Google*</button-->
            <p class="footnote" style="color: #000;">Good to know! By signing in you don't get any extra features. These are coming later this year.</p>
            <a style="color: #000; text-decoration: none; font-size: 50%;" href="https://www.okta.com/privacy-policy/" target="_blank">Click here to learn more about how Auth0 manages your data. <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
            <p class="footnote" style="color: #000;">*You'll be redirected to Google's sign-in page, where you can securely enter your credentials. But if you signed in before you'll be redirected to Google then back automatically.</p>
        `);
        addCloseButtonListener();

        $('#google-login').on('click', async function () {
            await auth0Client.loginWithRedirect({
                redirect_uri: window.location.origin,
                connection: 'google-oauth2'
            });
        });
    } else {
        const user = await auth0Client.getUser();

        const currentDate = new Date().toLocaleDateString();

        let authMethod = "Unknown";
        let displayName = user.name;

        if (user.identities && user.identities.length > 0) {
            authMethod = user.identities[0].provider;

            if (authMethod === 'google-oauth2') {
                displayName = user.name;
            }
        }

        // Set the current date in a cookie (Last sign-in date)
        document.cookie = `lastSignIn=${currentDate}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 1 year

        // Get the Last sign-in date from the cookie
        const cookies = document.cookie.split('; ');
        let lastSignInDate = "No previous sign-in date found.";

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split('=');
            if (cookie[0] === 'lastSignIn') {
                lastSignInDate = cookie[1];
                break;
            }
        }

        loginPopup.html(`
            <span class="close-btn"><i class="fa-solid fa-x"></i></span>
            <p style="margin-top: 0px !important;">Welcome, ${displayName}</p>
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
});

/**
 * cookies.js
 * ===================
 * Module to show an alert about the cookies the first time a user visits a website
 */
!function ($) {

    "use strict"; // jshint ;_;

    var cookieName = 'cookiebanner'
    var cookieExpiry = 3650 // in days. If 0 session cookie, if -1 show always the modal
    var timeoutModal = 20000  // timeout until the modal closes. If zero, don't close it

    var getCookie = function () {
        if (cookieExpiry === -1) {
            return false
        }

        var cookies = document.cookie.split('; ')
        var value = null

        $(cookies).each(function (key, el) {
            var cookie = el.split('=')
            if (cookie[0] === cookieName) {
                value = cookie[1]
            }
        })
        return value
    }

    var setCookie = function () {
        var expiryDate

        if (cookieExpiry === -1) {
            return
        }

        var cookie = cookieName + '=1'

        if (cookieExpiry > 0) {
            expiryDate = new Date()
            expiryDate.setTime(expiryDate.getTime() + (cookieExpiry * 24 * 60 * 60 * 1000))
            cookie += "; expires=" + expiryDate.toGMTString()
        }
        document.cookie = cookie
    }

    $.fn.cookiesmodal = function () {
        var timeout
        var modal = this

        if (!getCookie()) {
            setCookie()

            modal.fadeIn('fast')

            if (timeoutModal) {
                timeout = window.setTimeout(function () {
                    modal.fadeOut('fast')
                }, timeoutModal)
            }

            modal.find('[data-dismiss="modal"]').click(function (evt) {
                evt.preventDefault()
                modal.fadeOut('fast')
                window.clearTimeout(timeout)
            })
        }
    }
}(window.jQuery);

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

// Counter for the popup
$(document).ready(function() {
    function updateCounter() {
        let startDate = new Date("2023-10-29T00:00:00").getTime();
        let now = new Date().getTime();
        let timeDiff = now - startDate;

        let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        $("#counter").html(` ${days} days`);
    }

    updateCounter();
    setInterval(updateCounter, 1000);
});
