// Wait until DOM is ready
$(function () {
    // Smooth scroll to rooms section when "View rooms" button is clicked
    $("#viewRoomsBtn").on("click", function () {
        const target = $("#rooms");
        if (target.length) {
            $("html, body").animate(
                {
                    scrollTop: target.offset().top - 70, // offset for navbar
                },
                600
            );
        }
    });

    // Simple quick booking price estimate
    $("#quickBooking").on("submit", function (event) {
        event.preventDefault();

        const checkInVal = $("#checkIn").val();
        const checkOutVal = $("#checkOut").val();
        const guests = parseInt($("#guests").val(), 10);

        const resultEl = $("#bookingResult");

        if (!checkInVal || !checkOutVal || !guests) {
            resultEl
                .text("Please fill in all booking details.")
                .removeClass("text-success")
                .addClass("text-warning");
            return;
        }

        const checkIn = new Date(checkInVal);
        const checkOut = new Date(checkOutVal);

        if (checkOut <= checkIn) {
            resultEl
                .text("Check-out date must be after check-in date.")
                .removeClass("text-success")
                .addClass("text-danger");
            return;
        }

        const msPerDay = 1000 * 60 * 60 * 24;
        const nights = Math.round((checkOut - checkIn) / msPerDay);

        // simple flat rate example
        const pricePerNight = 150;
        const total = nights * pricePerNight;

        resultEl
            .text(
                `Great choice! ${nights} night(s) for ${guests} guest(s) will be approximately €${total.toFixed(
                    2
                )}.`
            )
            .removeClass("text-warning text-danger")
            .addClass("text-success");
    });

    // Optional: show a greeting based on time of day
    const now = new Date();
    const hour = now.getHours();
    const greeting =
        hour < 12
            ? "Good morning"
            : hour < 18
                ? "Good afternoon"
                : "Good evening";

    // You could inject this somewhere if you want, e.g. console for now:
    console.log(`${greeting}, welcome to Azure Bay Hotel!`);
    // ---------------- ROOMS PAGE LOGIC ----------------
    if ($("#roomsFilterForm").length) {
        const $rooms = $(".room-item");
        const $typeFilter = $("#roomTypeFilter");
        const $priceFilter = $("#priceFilter");
        const $countInfo = $("#roomsCountInfo");

        function applyRoomFilters() {
            const typeVal = $typeFilter.val(); // all, sea, city, family
            const maxPrice = parseInt($priceFilter.val(), 10); // 0 = no limit
            let visibleCount = 0;

            $rooms.each(function () {
                const $room = $(this);
                const roomType = $room.data("type"); // from data-type
                const roomPrice = parseInt($room.data("price"), 10);

                let show = true;

                if (typeVal !== "all" && roomType !== typeVal) {
                    show = false;
                }

                if (maxPrice > 0 && roomPrice > maxPrice) {
                    show = false;
                }

                if (show) {
                    $room.stop(true, true).fadeIn(150);
                    visibleCount++;
                } else {
                    $room.stop(true, true).fadeOut(150);
                }
            });

            if (visibleCount === $rooms.length) {
                $countInfo.text("Showing all rooms");
            } else if (visibleCount === 0) {
                $countInfo.text("No rooms match your filters.");
            } else {
                $countInfo.text(`Showing ${visibleCount} room(s)`);
            }
        }

        // When filters change, apply filter
        $typeFilter.on("change", applyRoomFilters);
        $priceFilter.on("change", applyRoomFilters);

        // Reset button
        $("#resetFilters").on("click", function () {
            $typeFilter.val("all");
            $priceFilter.val("0");
            applyRoomFilters();
        });

        // Toggle extra details open/close
        $(".toggle-details").on("click", function () {
            const $extra = $(this).closest(".card-body").find(".room-extra");
            $extra.stop(true, true).slideToggle(180);
        });

        // Run once on page load
        applyRoomFilters();
    }
    // ---------------- ROOM DETAIL PAGE LOGIC ----------------
    if ($("#roomDetailBooking").length) {
        const pricePerNight = parseFloat($("#roomDetailBooking").data("room-price")); // deluxe sea view base price
        const roomName = $("#roomDetailBooking").data("room-name") || "this room";

        $("#roomDetailBooking").on("submit", function (event) {
            event.preventDefault();

            const checkInVal = $("#rdCheckIn").val();
            const checkOutVal = $("#rdCheckOut").val();
            const guests = parseInt($("#rdGuests").val(), 10);
            const $result = $("#rdResult");

            if (!checkInVal || !checkOutVal || !guests) {
                $result
                    .text("Please fill in all booking details.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            const checkIn = new Date(checkInVal);
            const checkOut = new Date(checkOutVal);

            if (checkOut <= checkIn) {
                $result
                    .text("Check-out date must be after check-in date.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            const msPerDay = 1000 * 60 * 60 * 24;
            const nights = Math.round((checkOut - checkIn) / msPerDay);

            // Add-ons (one-off cost per stay)
            let addOns = 0;
            if ($("#addonBreakfast").is(":checked")) {
                addOns += parseFloat($("#addonBreakfast").val());
            }
            if ($("#addonSpa").is(":checked")) {
                addOns += parseFloat($("#addonSpa").val());
            }

            const baseTotal = nights * pricePerNight;
            const total = baseTotal + addOns;

            $result
                .text(
                    `Estimated price for ${nights} night(s) for ${guests} guest(s): ` +
                    `€${total.toFixed(2)} (incl. selected add-ons).`
                )
                .removeClass("text-danger")
                .addClass("text-success");
        });

        // Simple thumbnail gallery: clicking a thumb swaps the main image
        $(".room-thumb").on("click", function () {
            const newSrc = $(this).attr("src");
            const newAlt = $(this).attr("alt") || "Room photo";
            $("#roomMainImg").attr("src", newSrc).attr("alt", newAlt);
        });
    }
    // ---------------- LOGIN PAGE LOGIC ----------------
    if ($("#loginForm").length) {
        $("#loginForm").on("submit", function (event) {
            event.preventDefault();

            const email = $("#loginEmail").val().trim();
            const password = $("#loginPassword").val().trim();
            const $feedback = $("#loginFeedback");

            // basic validation
            if (!email || !password) {
                $feedback
                    .text("Please enter both your email address and password.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            // very simple email pattern just for demo – not production-level
            const emailPattern = /\S+@\S+\.\S+/;
            if (!emailPattern.test(email)) {
                $feedback
                    .text("Please enter a valid email address.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            if (password.length < 6) {
                $feedback
                    .text("Password should be at least 6 characters long.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            // Demo "success" message (no real authentication)
            $feedback
                .text("Login successful (demo only – no real account).")
                .removeClass("text-danger")
                .addClass("text-success");
        });

        $("#forgotPasswordLink").on("click", function (event) {
            event.preventDefault(); // Stop the link from navigating
            
            const email = $("#loginEmail").val().trim();
            const $feedback = $("#resetFeedback");
            
            // Basic validation - check if email field is empty
            if (!email) {
                $feedback
                    .text("Please enter your email address in the field above first.")
                    .removeClass("text-success")
                    .addClass("text-warning");
                return;
            }

            const emailPattern = /\S+@\S+\.\S+/;
            if (!emailPattern.test(email)) {
                $feedback
                    .text("Please enter a valid email address.")
                    .removeClass("text-success")
                    .addClass("text-warning");
                return;
            }

            $feedback
                .text(`A password reset link has been sent to ${email}. Please check your inbox.`)
                .removeClass("text-warning text-danger")
                .addClass("text-success");
            
            // Optional: Focus back on email field
            $("#loginEmail").focus();
        });
    }
    // ---------------- SIGN UP PAGE LOGIC ----------------
    if ($("#signupForm").length) {
        $("#signupForm").on("submit", function (event) {
            event.preventDefault();

            const name = $("#signupName").val().trim();
            const email = $("#signupEmail").val().trim();
            const password = $("#signupPassword").val();
            const password2 = $("#signupPassword2").val();
            const termsChecked = $("#signupTerms").is(":checked");
            const $feedback = $("#signupFeedback");

            // basic required field checks
            if (!name || !email || !password || !password2) {
                $feedback
                    .text("Please fill in all fields.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            // simple email pattern (demo only)
            const emailPattern = /\S+@\S+\.\S+/;
            if (!emailPattern.test(email)) {
                $feedback
                    .text("Please enter a valid email address.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            if (password.length < 6) {
                $feedback
                    .text("Password must be at least 6 characters long.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            if (password !== password2) {
                $feedback
                    .text("Passwords do not match.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            if (!termsChecked) {
                $feedback
                    .text("You must agree to the terms and conditions.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            // Demo "success"
            $feedback
                .text("Account created successfully (demo only – not saved).")
                .removeClass("text-danger")
                .addClass("text-success");

            // Optional: clear password fields after "success"
            $("#signupPassword, #signupPassword2").val("");
        });
    }
    // ---------------- CONTACT PAGE LOGIC ----------------
    if ($("#contactForm").length) {
        $("#contactForm").on("submit", function (event) {
            event.preventDefault();

            const name = $("#contactName").val().trim();
            const email = $("#contactEmail").val().trim();
            const reason = $("#contactReason").val();
            const message = $("#contactMessage").val().trim();
            const copyRequested = $("#contactCopy").is(":checked");
            const $feedback = $("#contactFeedback");

            if (!name || !email || !reason || !message) {
                $feedback
                    .text("Please fill in all required fields.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            const emailPattern = /\S+@\S+\.\S+/;
            if (!emailPattern.test(email)) {
                $feedback
                    .text("Please enter a valid email address.")
                    .removeClass("text-success")
                    .addClass("text-danger");
                return;
            }

            // Build a simple summary message
            let confirmText = `Thank you, ${name}. Your message has been sent.`;
            if (copyRequested) {
                confirmText += " A copy will be sent to your email (demo only).";
            }

            $feedback
                .text(confirmText)
                .removeClass("text-danger")
                .addClass("text-success");

            // Optionally clear the form (except name/email if you prefer)
            $("#contactMessage").val("");
        });
    }
  // ---------------- GALLERY PAGE LOGIC ----------------
  if ($("#galleryGrid").length) {
    const $items = $("#galleryGrid .gallery-item");
    const $buttons = $(".gallery-filters .btn");
    const $info = $("#galleryInfo");

    function updateInfo(visibleCount) {
      if (visibleCount === $items.length) {
        $info.text("Showing all photos");
      } else if (visibleCount === 0) {
        $info.text("No photos match this filter.");
      } else {
        $info.text(`Showing ${visibleCount} photo(s)`);
      }
    }

    function applyGalleryFilter(filter) {
      let visibleCount = 0;

      $items.each(function () {
        const $item = $(this);
        const category = $item.data("category");

        const show = filter === "all" || category === filter;

        if (show) {
          $item.stop(true, true).fadeIn(150);
          visibleCount++;
        } else {
          $item.stop(true, true).fadeOut(150);
        }
      });

      updateInfo(visibleCount);
    }

    // Filter buttons
    $buttons.on("click", function () {
      const filter = $(this).data("filter");

      $buttons.removeClass("active");
      $(this).addClass("active");

      applyGalleryFilter(filter);
    });

    // Lightbox / modal
    $(".gallery-img").on("click", function () {
      const src = $(this).attr("src");
      const alt = $(this).attr("alt") || "Gallery image";
      const caption = $(this).data("caption") || alt;

      $("#modalImage").attr("src", src).attr("alt", alt);
      $("#modalCaption").text(caption);

      const modalEl = document.getElementById("imageModal");
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    });

    // Initial state: show all
    applyGalleryFilter("all");
  }
  // ---------------- BLOG / NEWS PAGE LOGIC ----------------
  if ($("#blogList").length) {
    const $posts = $("#blogList .blog-item");
    const $category = $("#blogCategory");
    const $search = $("#blogSearch");
    const $count = $("#blogCount");

    function normalise(str) {
      return (str || "").toString().toLowerCase();
    }

    function applyBlogFilters() {
      const selectedCategory = $category.val(); // all, offers, events, news
      const searchTerm = normalise($search.val());
      let visibleCount = 0;

      $posts.each(function () {
        const $post = $(this);
        const postCategory = $post.data("category"); // from data-category
        const title = normalise($post.data("title"));
        const bodyText = normalise($post.find(".card-text").text());

        let matchesCategory =
          selectedCategory === "all" || postCategory === selectedCategory;

        let matchesSearch =
          !searchTerm ||
          title.includes(searchTerm) ||
          bodyText.includes(searchTerm);

        const show = matchesCategory && matchesSearch;

        if (show) {
          $post.stop(true, true).fadeIn(150);
          visibleCount++;
        } else {
          $post.stop(true, true).fadeOut(150);
        }
      });

      if (visibleCount === $posts.length) {
        $count.text("Showing all posts");
      } else if (visibleCount === 0) {
        $count.text("No posts match your filters.");
      } else {
        $count.text(`Showing ${visibleCount} post(s)`);
      }
    }

    // Filter when category changes
    $category.on("change", applyBlogFilters);

    // Filter when typing in search (debounced a tiny bit)
    let searchTimeout = null;
    $search.on("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(applyBlogFilters, 150);
    });

    // Initial state
    applyBlogFilters();
  }
  // ---------------- SINGLE BLOG POST PAGE LOGIC ----------------
  if ($("#blogArticle").length) {
    const $article = $("#blogArticle");
    const $reading = $("#readingTime");

    const text = $article.text();
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200)); // ~200 wpm

    if ($reading.length) {
      $reading.text(`Approx. ${minutes} min read`);
    }
  }

  // Reviews Page JavaScript

$(document).ready(function() {
    // Sample reviews data
    const reviewsData = [
        {
            id: 1,
            name: "Sarah Johnson",
            initial: "S",
            rating: 5,
            date: "2025-03-15",
            roomType: "Deluxe Sea View",
            title: "Absolutely stunning views and exceptional service",
            text: "Our stay at Azure Bay Hotel was nothing short of magical. The room was spacious, clean, and had a breathtaking view of the ocean. The staff went above and beyond to make our anniversary special with champagne and chocolates. The breakfast buffet had a great variety and the rooftop pool was the perfect place to unwind. We will definitely be back!",
            verified: true
        },
        {
            id: 2,
            name: "Michael Chen",
            initial: "M",
            rating: 4,
            date: "2025-03-10",
            roomType: "Standard Room",
            title: "Great value for money",
            text: "The hotel offers excellent value. The room was clean and comfortable, though a bit smaller than expected. The location is perfect - just a short walk to the beach and local restaurants. The staff were friendly and helpful. The only minor issue was slow Wi-Fi in the evenings. Overall, a very pleasant stay.",
            verified: true
        },
        {
            id: 3,
            name: "Emma Williams",
            initial: "E",
            rating: 5,
            date: "2025-03-05",
            roomType: "Family Suite",
            title: "Perfect family getaway",
            text: "We traveled with our two children (ages 5 and 8) and the family suite was perfect for us. The kids loved the bunk beds and the separate living area gave us space to relax after they went to sleep. The children's menu at the restaurant was great, and the staff were so accommodating. The pool was a hit with the whole family!",
            verified: true
        },
        {
            id: 4,
            name: "Robert O'Sullivan",
            initial: "R",
            rating: 3,
            date: "2025-02-28",
            roomType: "Deluxe Sea View",
            title: "Good but could be better",
            text: "The location and views are undoubtedly excellent. However, our room had some maintenance issues - a leaking tap and the air conditioning wasn't working properly. The staff addressed these issues when we reported them, but it took a while. Breakfast was good but the dining area was quite crowded.",
            verified: false
        },
        {
            id: 5,
            name: "Jessica Lee",
            initial: "J",
            rating: 5,
            date: "2025-02-20",
            roomType: "Executive Suite",
            title: "Exceeded all expectations",
            text: "From the moment we arrived, we felt pampered. The executive suite was luxurious with a stunning ocean view balcony. The spa treatments were divine, and the concierge helped us book last-minute tickets to a local show. Special mention to Maria at the front desk who remembered our names throughout our stay. Perfection!",
            verified: true
        },
        {
            id: 6,
            name: "Thomas Brown",
            initial: "T",
            rating: 4,
            date: "2025-02-15",
            roomType: "Standard Room",
            title: "Very comfortable business stay",
            text: "I stayed for 3 nights on a business trip. The room was clean and quiet, perfect for working. The business center had good facilities and the Wi-Fi was reliable. Location was convenient for my meetings. Room service was prompt and the food quality was good. Would recommend for business travelers.",
            verified: true
        },
        {
            id: 7,
            name: "Olivia Martinez",
            initial: "O",
            rating: 5,
            date: "2025-02-10",
            roomType: "Presidential Suite",
            title: "A dream honeymoon destination",
            text: "We chose Azure Bay for our honeymoon and it was the perfect choice. The presidential suite was incredible with a private jacuzzi overlooking the ocean. Every detail was thought of - rose petals on the bed, champagne on arrival. The private dinner on the beach arranged by the hotel was unforgettable. Worth every penny.",
            verified: true
        },
        {
            id: 8,
            name: "David Wilson",
            initial: "D",
            rating: 2,
            date: "2025-02-05",
            roomType: "Standard Room",
            title: "Disappointing experience",
            text: "Unfortunately, our stay didn't meet expectations. The room wasn't ready at check-in and we had to wait 2 hours. The promised sea view was partially obstructed by construction next door. The bed was uncomfortable and the shower had low water pressure. Staff were apologetic but didn't offer compensation.",
            verified: true
        }
    ];

    // Initialize variables
    let displayedReviews = 4;
    let currentFilter = 'all';
    
    // Generate star rating HTML
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 === rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }
    
    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    // Generate review card HTML
    function generateReviewCard(review) {
        return `
            <div class="col-lg-6 mb-4 review-item" data-rating="${review.rating}" data-room="${review.roomType}">
                <article class="card review-card h-100">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-avatar">${review.initial}</div>
                            <div class="reviewer-details flex-grow-1">
                                <h4 class="mb-0">${review.name}</h4>
                                <div class="review-date">${formatDate(review.date)}</div>
                                <div class="room-badge">${review.roomType}</div>
                            </div>
                            <div class="review-rating">
                                ${generateStars(review.rating)}
                            </div>
                        </div>
                    </div>
                    <div class="review-body">
                        <h3 class="review-title h5">${review.title}</h3>
                        <p class="review-text">${review.text}</p>
                        ${review.verified ? 
                            '<div class="review-verified"><i class="fas fa-check-circle"></i>Verified Stay</div>' : 
                            ''}
                    </div>
                </article>
            </div>
        `;
    }
    
    // Display reviews
    function displayReviews(filter = 'all', count = displayedReviews) {
        const container = $('#reviewsContainer');
        container.empty();
        
        let filteredReviews = reviewsData;
        
        // Apply filter
        if (filter !== 'all' && filter !== 'room') {
            filteredReviews = reviewsData.filter(review => review.rating === parseInt(filter));
        }
        
        // Display reviews up to count
        const reviewsToShow = filteredReviews.slice(0, count);
        
        if (reviewsToShow.length === 0) {
            container.html(`
                <div class="col-12 text-center py-5">
                    <i class="fas fa-comment-slash fa-3x text-muted mb-3"></i>
                    <h3>No reviews found</h3>
                    <p>Try a different filter or be the first to review!</p>
                </div>
            `);
        } else {
            reviewsToShow.forEach(review => {
                container.append(generateReviewCard(review));
            });
        }
        
        // Update load more button visibility
        if (count >= filteredReviews.length) {
            $('#loadMoreReviews').hide();
        } else {
            $('#loadMoreReviews').show();
        }
    }
    
    // Filter button click handler
    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        currentFilter = $(this).data('filter');
        displayedReviews = 4;
        displayReviews(currentFilter, displayedReviews);
    });
    
    // Load more reviews button
    $('#loadMoreReviews').click(function() {
        const $btn = $(this);
        const $spinner = $btn.find('.fa-spinner');
        
        // Show loading spinner
        $spinner.removeClass('d-none');
        $btn.prop('disabled', true);
        
        // Simulate loading delay
        setTimeout(() => {
            displayedReviews += 4;
            displayReviews(currentFilter, displayedReviews);
            
            // Hide spinner and re-enable button
            $spinner.addClass('d-none');
            $btn.prop('disabled', false);
            
            // Scroll to new reviews
            $('html, body').animate({
                scrollTop: $('#reviewsContainer').offset().top - 100
            }, 500);
        }, 800);
    });
    
    // Star rating input
    $('.rating-stars-input i').click(function() {
        const rating = $(this).data('rating');
        $('#userRating').val(rating);
        
        // Update star display
        $('.rating-stars-input i').removeClass('active');
        $('.rating-stars-input i').each(function(index) {
            if (index < rating) {
                $(this).addClass('active').removeClass('far').addClass('fas');
            } else {
                $(this).removeClass('active').removeClass('fas').addClass('far');
            }
        });
        
        // Update rating text
        const ratingTexts = {
            1: "Poor",
            2: "Fair",
            3: "Good",
            4: "Very Good",
            5: "Excellent"
        };
        $('#ratingText').text(ratingTexts[rating]);
    });
    
    // Review form submission
    $('#newReviewForm').submit(function(e) {
        e.preventDefault();
        
        // Get form values
        const name = $('#reviewerName').val();
        const email = $('#reviewerEmail').val();
        const roomType = $('#roomType').val();
        const rating = parseInt($('#userRating').val());
        const title = $('#reviewTitle').val();
        const text = $('#reviewText').val();
        
        // Validate form
        if (!name || !email || !title || !text) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Create new review object
        const newReview = {
            id: reviewsData.length + 1,
            name: name,
            initial: name.charAt(0).toUpperCase(),
            rating: rating,
            date: new Date().toISOString().split('T')[0],
            roomType: roomType,
            title: title,
            text: text,
            verified: false
        };
        
        // Add to beginning of reviews array
        reviewsData.unshift(newReview);
        
        // Reset form
        $('#newReviewForm')[0].reset();
        $('.rating-stars-input i').removeClass('active');
        $('.rating-stars-input i').removeClass('fas').addClass('far');
        $('#userRating').val(5);
        $('#ratingText').text('Excellent');
        
        // Show success message
        const successMsg = `
            <div class="alert alert-success alert-dismissible fade show mt-4" role="alert">
                <i class="fas fa-check-circle me-2"></i>
                <strong>Thank you for your review!</strong> It has been submitted and will appear after moderation.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        $('#newReviewForm').before(successMsg);
        
        // Refresh reviews display
        displayedReviews = 4;
        displayReviews(currentFilter, displayedReviews);
        
        // Scroll to top of reviews
        $('html, body').animate({
            scrollTop: $('.reviews-list').offset().top - 100
        }, 500);
    });
    
    // Initialize reviews display
    displayReviews();
});
});
