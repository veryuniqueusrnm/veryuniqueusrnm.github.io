// jQuery menu (mobile)
$(document).ready(function () {
    $('.hamburger').click(function () {
        $(this).toggleClass('active');
        $('.dropdown').slideToggle(300, function () {
            // If dropdown is hidden, close all submenus
            if ($('.dropdown').css('display') === 'none') {
                $('.submenu').slideUp(300);
                $('.menu-button-mobile i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
            }
        });
    });

    $('.dropdown a').not('.menu-button-mobile').click(function () {
        $('.dropdown').slideUp(300);
        $('.hamburger').removeClass('active');
    });

    $('.menu-button-mobile').click(function (e) {
        e.preventDefault();
        
        // Close any open submenu before opening the clicked one
        $('.submenu').not($(this).next('.submenu')).slideUp(300);
        $('.menu-button-mobile i').not($(this).find('i')).removeClass('fa-chevron-up').addClass('fa-chevron-down');
        
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
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        console.log(`Current Resolution: ${width}x${height}`);
    }

    checkScreenWidth();

    $(window).on('resize', checkScreenWidth);
});

// Get commit info
$(document).ready(function () {
    const username = "veryuniqueusrnm";
    const repo = "veryuniqueusrnm.github.io";
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/commits`;

    $.getJSON(apiUrl, function (data) {
        if (!data || data.length === 0) {
            $("#commit-info").html("Failed to load commit info.");
            return;
        }

        const latestCommit = data[0];
        const commitId = latestCommit.sha.substring(0, 7);
        const commitDate = new Date(latestCommit.commit.author.date).toLocaleDateString();
        const commitUrl = latestCommit.html_url;

        $("#commit-info").html(
            `Latest commit: <strong><a class="black" href="${commitUrl}" target="_blank">${commitId} <i class="fa-solid fa-arrow-up-right-from-square"></i></a></strong> | ${commitDate}`
        );
    }).fail(function () {
        console.error("Failed to fetch commit data.");
        $("#commit-info").html("Failed to load commit info.");
    });
});

// JavaScript countdown (W3Schools)
// Set the date we're counting down to
var countDownDate = new Date("Aug 19, 2025 12:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("counter").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("counter").innerHTML = "EXPIRED";
  }
}, 1000);