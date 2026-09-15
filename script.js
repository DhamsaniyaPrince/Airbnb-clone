(() => {
  'use strict';

  /* =========================================================
     Utilities
     ========================================================= */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const fmtUSD = (n) => '$' + n.toLocaleString('en-US');

  function trapFocus(container, e) {
    const focusable = $$('button:not([disabled]), [href], input, select, [tabindex]:not([tabindex="-1"])', container)
      .filter(el => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* =========================================================
     Toast
     ========================================================= */
  const toastEl = $('#toast');
  let toastTimer;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  /* =========================================================
     Header scroll state + compact search pill
     ========================================================= */
  const header = $('#siteHeader');
  const gallery = $('#gallery');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const threshold = gallery ? gallery.getBoundingClientRect().bottom : 120;
      header.classList.toggle('scrolled', threshold < 0);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* =========================================================
     Scroll reveal (IntersectionObserver, staggered)
     ========================================================= */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in-view'), i * 40);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* Animate rating bars once visible */
  const ratingBars = $('.rating-bars');
  if (ratingBars && 'IntersectionObserver' in window) {
    const barIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $$('.bar > div', ratingBars).forEach(bar => {
            bar.style.width = bar.dataset.target + '%';
          });
          barIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    barIO.observe(ratingBars);
  }

  /* Gallery skeleton -> loaded */
  $$('.gallery img').forEach(img => {
    const cell = img.closest('.skeleton');
    if (img.complete) cell && cell.classList.add('loaded');
    else img.addEventListener('load', () => cell && cell.classList.add('loaded'));
  });

  /* =========================================================
     Properties Catalog & Active Property State
     ========================================================= */
  const PROPERTIES = [
    {
      id: 'cliffside-cabin',
      title: 'Cliffside Cedar Cabin with private hot tub',
      cardLocation: 'Government Camp, Oregon',
      sub: 'Mount Hood Trailhead · 2 miles away',
      dates: 'Nov 14 – 18',
      location: 'Government Camp, Oregon',
      fullLocation: 'Government Camp, Oregon, United States',
      price: 284,
      rating: 4.97,
      reviews: 128,
      hostName: 'Maren',
      hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
      meta: '4 guests · 2 bedrooms · 2 beds · 1.5 baths',
      maxGuests: 4,
      cleaningFee: 90,
      serviceFee: 159,
      extraGuestFee: 25,
      shortDescription: 'Tucked into six wooded acres fifteen minutes from Mount Hood\'s Timberline Lodge, this cedar cabin was built by hand in 2019 and sleeps four across two bedrooms. Mornings start on the covered porch with coffee and mountain air; evenings end in the private hot tub under the trees. The cabin runs on high-speed fiber internet, so it suits a quiet work trip as easily as a weekend away. Inside you\'ll find a wood-burning stove, a fully equipped kitchen, and windows on three sides that keep the forest close all day long.',
      photos: [
        { src: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1600&q=80', label: 'exterior dusk', alt: 'Cedar cabin exterior at dusk surrounded by pine trees, warm light glowing from the windows' },
        { src: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80', label: 'living room', alt: 'Bright open-plan living room with a wood-burning stove and large windows' },
        { src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80', label: 'bedroom', alt: 'Bedroom with a queen bed and forest view' },
        { src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=80', label: 'deck hot tub', alt: 'Outdoor private hot tub on a wooden deck at night' },
        { src: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1600&q=80', label: 'rustic bath', alt: 'Rustic bathroom with a claw-foot tub and cedar accents' }
      ]
    },
    {
      id: 'timberline-chalet',
      title: 'Timberline Alpine Chalet with panoramic deck',
      cardLocation: 'Government Camp, Oregon',
      sub: '2 miles away · Ski-in / Ski-out access',
      dates: 'Nov 14 – 18',
      location: 'Government Camp, Oregon',
      fullLocation: 'Government Camp, Oregon, United States',
      price: 210,
      rating: 4.92,
      reviews: 94,
      hostName: 'Erik & Chloe',
      hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      meta: '6 guests · 3 bedrooms · 4 beds · 2 baths',
      maxGuests: 6,
      cleaningFee: 75,
      serviceFee: 118,
      extraGuestFee: 20,
      shortDescription: 'Perched on a quiet ridge overlooking Government Camp village, this two-story alpine chalet blends traditional timber craftsmanship with modern ski lodge comforts. Enjoy cathedral ceilings, radiant heated floors, a gourmet kitchen, and an expansive south-facing deck with unobstructed views of Mount Hood. Step straight onto the trails right behind the cabin.',
      photos: [
        { src: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1600&q=80', label: 'snowy chalet', alt: 'Timberline alpine chalet exterior with snow-covered roof and pine trees' },
        { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80', label: 'alpine great room', alt: 'Spacious alpine living room with floor-to-ceiling windows and fireplace' },
        { src: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1600&q=80', label: 'loft master bedroom', alt: 'Cozy loft bedroom with sloped timber ceilings and king bed' },
        { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&q=80', label: 'panoramic deck', alt: 'Sun-drenched outdoor deck overlooking snow-capped mountain peaks' },
        { src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=80', label: 'cedar hot tub', alt: 'Private cedar barrel hot tub steaming in the crisp mountain air' }
      ]
    },
    {
      id: 'rhododendron-riverfront',
      title: 'Rhododendron Riverfront Haven with cedar sauna',
      cardLocation: 'Rhododendron, Oregon',
      sub: '9 miles away · Direct river frontage',
      dates: 'Nov 14 – 18',
      location: 'Rhododendron, Oregon',
      fullLocation: 'Rhododendron, Oregon, United States',
      price: 189,
      rating: 4.85,
      reviews: 82,
      hostName: 'Sarah',
      hostAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
      meta: '4 guests · 2 bedrooms · 2 beds · 1 bath',
      maxGuests: 4,
      cleaningFee: 65,
      serviceFee: 105,
      extraGuestFee: 20,
      shortDescription: 'Set directly along the tumbling Zigzag River, this peaceful woodland sanctuary lets you fall asleep to the gentle rushing water. Featuring an authentic barrel cedar sauna, outdoor stone fire pit, and handcrafted cedar furnishings throughout, it sits just minutes from trailheads and village coffee shops.',
      photos: [
        { src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1600&q=80', label: 'river cabin', alt: 'Serene cabin right on the riverbank nestled into mossy pine woods' },
        { src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&q=80', label: 'river view lounge', alt: 'Cozy lounge with comfortable seating and wide river views' },
        { src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600&q=80', label: 'minimal wood bedroom', alt: 'Peaceful timber bedroom with soft natural morning light' },
        { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80', label: 'barrel cedar sauna', alt: 'Nordic barrel cedar sauna with glass door facing the forest' },
        { src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=80', label: 'wood deck tub', alt: 'Warm wooden outdoor tub overlooking the river rapids' }
      ]
    },
    {
      id: 'zigzag-aframe',
      title: 'Zigzag Modern A-Frame in the Pines',
      cardLocation: 'Zigzag, Oregon',
      sub: '13 miles away · Secluded forest creek',
      dates: 'Nov 14 – 18',
      location: 'Zigzag, Oregon',
      fullLocation: 'Zigzag, Oregon, United States',
      price: 245,
      rating: 4.98,
      reviews: 156,
      hostName: 'David & Lianne',
      hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
      meta: '5 guests · 2 bedrooms · 3 beds · 2 baths',
      maxGuests: 5,
      cleaningFee: 85,
      serviceFee: 137,
      extraGuestFee: 25,
      shortDescription: 'An architect-designed Scandinavian A-frame tucked beneath towering old-growth Douglas firs. Floor-to-ceiling triangular glass walls bring the lush Pacific Northwest forest directly into the living room. Includes a custom Danish wood stove, chef\'s kitchen, and a stargazing deck with sunken plunge tub.',
      photos: [
        { src: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&q=80', label: 'modern A-frame', alt: 'Striking black A-frame cabin glowing with warm interior lights in the forest' },
        { src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80', label: 'A-frame great room', alt: 'Triangular glass cathedral living room with minimalist Scandinavian decor' },
        { src: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1600&q=80', label: 'upper loft bedroom', alt: 'Loft bedroom tucked beneath the dramatic peaked roofline' },
        { src: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1600&q=80', label: 'stargazing deck', alt: 'Wrap-around cantilevered deck with forest and starlight views' },
        { src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=80', label: 'sunken cedar spa', alt: 'Sunken cedar soaking tub on the private cedar deck' }
      ]
    },
    {
      id: 'welches-resort-cabin',
      title: 'Welches Golf Resort Cabin with stone fireplace',
      cardLocation: 'Welches, Oregon',
      sub: '15 miles away · Mountain resort quiet',
      dates: 'Nov 14 – 18',
      location: 'Welches, Oregon',
      fullLocation: 'Welches, Oregon, United States',
      price: 176,
      rating: 4.79,
      reviews: 67,
      hostName: 'Brandon',
      hostAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
      meta: '4 guests · 2 bedrooms · 2 beds · 1 bath',
      maxGuests: 4,
      cleaningFee: 60,
      serviceFee: 98,
      extraGuestFee: 15,
      shortDescription: 'Located along the quiet forested perimeter of the Resort at The Mountain in Welches, this warm single-level cabin features a massive floor-to-ceiling river-rock fireplace, an open chef\'s kitchen, and a private back patio facing the fairway and forested hills beyond.',
      photos: [
        { src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80', label: 'resort woods', alt: 'Cozy resort cabin nestled among tall trees with sunny deck' },
        { src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80', label: 'stone fireplace', alt: 'Inviting living room centered around a grand river rock fireplace' },
        { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600&q=80', label: 'warm master bed', alt: 'Comfortable lodge bedroom with queen bed and crisp white linens' },
        { src: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1600&q=80', label: 'bright bath', alt: 'Bright modern bathroom with slate tile and wooden accents' },
        { src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80', label: 'second bedroom', alt: 'Quiet second guest bedroom with woodland window views' }
      ]
    },
    {
      id: 'brightwood-forest-lodge',
      title: 'Brightwood Luxury Forest Lodge & Spa',
      cardLocation: 'Brightwood, Oregon',
      sub: '18 miles away · Private 10-acre estate',
      dates: 'Nov 14 – 18',
      location: 'Brightwood, Oregon',
      fullLocation: 'Brightwood, Oregon, United States',
      price: 298,
      rating: 4.95,
      reviews: 142,
      hostName: 'Elena',
      hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      meta: '6 guests · 3 bedrooms · 4 beds · 2.5 baths',
      maxGuests: 6,
      cleaningFee: 110,
      serviceFee: 166,
      extraGuestFee: 30,
      shortDescription: 'A premier mountain lodge sprawling over ten private gated forest acres. Boasting high vaulted timber ceilings, professional dual-fuel Viking range, commercial espresso station, game lounge, and an outdoor 8-person cedar hot tub overlooking a private waterfall creek.',
      photos: [
        { src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80', label: 'grand lodge exterior', alt: 'Expansive timber-frame lodge surrounded by towering evergreens' },
        { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80', label: 'vaulted great hall', alt: 'Dramatic great hall with vaulted timber beams and custom leather seating' },
        { src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&q=80', label: 'executive master suite', alt: 'Luxury master suite with private fireplace and forest terrace' },
        { src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=80', label: 'waterfall hot tub', alt: 'Grand 8-person cedar hot tub overlooking the private forest waterfall' },
        { src: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1600&q=80', label: 'spa bathroom', alt: 'Spa en-suite bathroom with deep soaking tub and rain shower' }
      ]
    },
    {
      id: 'sandy-creekside-cottage',
      title: 'Sandy Creekside Cedar Cottage & Fire Pit',
      cardLocation: 'Sandy, Oregon',
      sub: '24 miles away · Foothills gateway',
      dates: 'Nov 14 – 18',
      location: 'Sandy, Oregon',
      fullLocation: 'Sandy, Oregon, United States',
      price: 162,
      rating: 4.88,
      reviews: 71,
      hostName: 'Marcus',
      hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
      meta: '4 guests · 2 bedrooms · 2 beds · 1 bath',
      maxGuests: 4,
      cleaningFee: 55,
      serviceFee: 90,
      extraGuestFee: 15,
      shortDescription: 'A charming cedar cottage nestled beside a babbling mountain creek at the threshold of Mount Hood National Forest. Perfectly suited for couples or small families seeking quick trail access, quiet evenings by the fire pit, and the convenience of Sandy\'s bakeries and shops.',
      photos: [
        { src: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1600&q=80', label: 'creekside cottage', alt: 'Charming creekside cedar cottage surrounded by lush moss and ferns' },
        { src: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80', label: 'sitting room', alt: 'Warm cottage sitting room with comfy armchairs and garden view' },
        { src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80', label: 'forest bedroom', alt: 'Tranquil bedroom with cotton quilt and birdsong outside the window' },
        { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&q=80', label: 'creekside patio', alt: 'Stone patio with Adirondack chairs beside the bubbling creek' },
        { src: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1600&q=80', label: 'cottage bath', alt: 'Fresh cottage bathroom with vintage pedestal sink and brass fixtures' }
      ]
    }
  ];

  let currentProperty = PROPERTIES[0];

  /* =========================================================
     Gallery lightbox
     ========================================================= */
  let photos = currentProperty.photos.map(p => ({ src: p.src, alt: p.alt }));

  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  const lightboxCounter = $('#lightboxCounter');
  const lightboxThumbs = $('#lightboxThumbs');
  const closeBtn = $('#lightboxClose');
  const prevBtn = $('#lightboxPrev');
  const nextBtn = $('#lightboxNext');
  let currentIndex = 0;
  let lastFocusedEl = null;

  function refreshLightboxThumbs() {
    if (!lightboxThumbs) return;
    lightboxThumbs.innerHTML = '';
    photos.forEach((p, i) => {
      const t = document.createElement('img');
      t.src = p.src.replace('w=1600', 'w=200');
      t.alt = '';
      t.dataset.index = i;
      t.addEventListener('click', () => { currentIndex = i; renderLightboxImage(); });
      lightboxThumbs.appendChild(t);
    });
  }
  refreshLightboxThumbs();

  function openLightbox(index) {
    currentIndex = index;
    lastFocusedEl = document.activeElement;
    renderLightboxImage();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    document.addEventListener('keydown', onLightboxKeydown);
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onLightboxKeydown);
    if (lastFocusedEl) lastFocusedEl.focus();
  }
  function renderLightboxImage() {
    const photo = photos[currentIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.alt;
    lightboxCounter.textContent = `${currentIndex + 1} / ${photos.length}`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === photos.length - 1;
    $$('img', lightboxThumbs).forEach((t, i) => t.classList.toggle('active', i === currentIndex));
  }
  function showPrev() { if (currentIndex > 0) { currentIndex--; renderLightboxImage(); } }
  function showNext() { if (currentIndex < photos.length - 1) { currentIndex++; renderLightboxImage(); } }

  function onLightboxKeydown(e) {
    if (e.key === 'Escape') { closeLightbox(); return; }
    if (e.key === 'ArrowLeft') { showPrev(); return; }
    if (e.key === 'ArrowRight') { showNext(); return; }
    if (e.key === 'Tab') trapFocus(lightbox, e);
  }

  $$('.gallery-main, .gallery-cell').forEach((btn, i) => btn.addEventListener('click', () => openLightbox(i)));
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  /* =========================================================
     Generic modal open/close helper (amenities / host / share)
     ========================================================= */
  function setupModal(overlayId, closeId, triggerEl) {
    const overlay = $(overlayId);
    const close = $(closeId);
    let lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      close.focus();
      document.addEventListener('keydown', onKey);
    }
    function shut() {
      overlay.hidden = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      if (lastFocus) lastFocus.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') shut();
      else if (e.key === 'Tab') trapFocus(overlay.querySelector('.modal'), e);
    }
    overlay.addEventListener('click', (e) => { if (e.target === overlay) shut(); });
    close.addEventListener('click', shut);
    if (triggerEl) triggerEl.addEventListener('click', open);
    return { open, shut };
  }

  setupModal('#amenitiesOverlay', '#amenitiesClose', $('#showAmenitiesBtn'));
  setupModal('#hostOverlay', '#hostClose', $('#hostAvatarBtn'));
  const shareModal = setupModal('#shareOverlay', '#shareClose', $('#shareBtn'));

  $('#copyLinkBtn').addEventListener('click', () => {
    showToast('Link copied to clipboard');
    shareModal.shut();
  });

  /* =========================================================
     Save / heart toggle
     ========================================================= */
  const saveBtn = $('#saveBtn');
  saveBtn.addEventListener('click', () => {
    const isSaved = saveBtn.getAttribute('aria-pressed') === 'true';
    saveBtn.setAttribute('aria-pressed', String(!isSaved));
    saveBtn.classList.toggle('saved', !isSaved);
    saveBtn.classList.remove('pop');
    void saveBtn.offsetWidth;
    saveBtn.classList.add('pop');
    $('.save-label', saveBtn).textContent = !isSaved ? 'Saved' : 'Save';
  });

  /* =========================================================
     Show more / less description
     ========================================================= */
  const showMoreBtn = $('#showMoreBtn');
  const descriptionText = $('#descriptionText');
  showMoreBtn.addEventListener('click', () => {
    const expanded = showMoreBtn.getAttribute('aria-expanded') === 'true';
    const baseText = currentProperty ? currentProperty.shortDescription : descriptionText.textContent.trim();
    const longText = baseText + ' The nearest grocery store is an eight-minute drive, and mountain trails and local village spots are only a short distance away.';
    descriptionText.textContent = expanded ? baseText : longText;
    showMoreBtn.setAttribute('aria-expanded', String(!expanded));
    $('span', showMoreBtn).textContent = expanded ? 'Show more' : 'Show less';
  });

  /* =========================================================
     Reviews carousel
     ========================================================= */
  const carousel = $('#reviewCarousel');
  const cards = $$('.review-card', carousel);
  const prevReviewBtn = $('#reviewPrev');
  const nextReviewBtn = $('#reviewNext');
  const dotsWrap = $('#reviewDots');
  const perPage = window.matchMedia('(max-width: 700px)').matches ? 1 : 2;
  const pageCount = Math.ceil(cards.length / perPage);

  for (let i = 0; i < pageCount; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to review page ${i + 1}`);
    dot.addEventListener('click', () => scrollToPage(i));
    dotsWrap.appendChild(dot);
  }
  function updateDots() {
    const page = Math.round(carousel.scrollLeft / carousel.clientWidth);
    $$('button', dotsWrap).forEach((d, i) => d.classList.toggle('active', i === page));
    prevReviewBtn.disabled = page === 0;
    nextReviewBtn.disabled = page >= pageCount - 1;
  }
  function scrollToPage(i) {
    carousel.scrollTo({ left: i * carousel.clientWidth, behavior: 'smooth' });
  }
  prevReviewBtn.addEventListener('click', () => {
    const page = Math.round(carousel.scrollLeft / carousel.clientWidth);
    scrollToPage(Math.max(0, page - 1));
  });
  nextReviewBtn.addEventListener('click', () => {
    const page = Math.round(carousel.scrollLeft / carousel.clientWidth);
    scrollToPage(Math.min(pageCount - 1, page + 1));
  });
  carousel.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateDots);
  }, { passive: true });
  updateDots();

  $('#jumpReviews').addEventListener('click', () => {
    $('#reviewsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* =========================================================
     Guests popover (stepper) with dynamic pricing
     ========================================================= */
  const guestBox = $('#guestBox');
  const guestPopover = $('#guestPopover');
  const guestValue = $('#guestValue');
  const counts = { adults: 2, children: 0, infants: 0 };

  function guestTotal() { return counts.adults + counts.children; }

  function refreshGuestUI() {
    $('#countAdults').textContent = counts.adults;
    $('#countChildren').textContent = counts.children;
    $('#countInfants').textContent = counts.infants;
    const total = guestTotal();
    let label = `${total} guest${total !== 1 ? 's' : ''}`;
    if (counts.infants) label += `, ${counts.infants} infant${counts.infants !== 1 ? 's' : ''}`;
    guestValue.textContent = label;
    pillGuests.textContent = label;
    updatePillLabel();

    const max = currentProperty ? currentProperty.maxGuests : 4;
    $$('.stepper-btn[data-dir="1"]', guestPopover).forEach(btn => {
      const key = btn.dataset.step;
      if (key === 'infants') btn.disabled = counts.infants >= 4;
      else btn.disabled = guestTotal() >= max;
    });
    $('.stepper-btn[data-step="adults"][data-dir="-1"]').disabled = counts.adults <= 1;
    $('.stepper-btn[data-step="children"][data-dir="-1"]').disabled = counts.children <= 0;
    $('.stepper-btn[data-step="infants"][data-dir="-1"]').disabled = counts.infants <= 0;
  }

  $$('.stepper-btn', guestPopover).forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.step;
      const dir = Number(btn.dataset.dir);
      const max = currentProperty ? currentProperty.maxGuests : 4;
      if (dir > 0) {
        if (key === 'infants' && counts.infants < 4) counts.infants++;
        else if (key !== 'infants' && guestTotal() < max) counts[key]++;
      } else {
        if (key === 'adults' && counts.adults > 1) counts.adults--;
        else if (key === 'children' && counts.children > 0) counts.children--;
        else if (key === 'infants' && counts.infants > 0) counts.infants--;
      }
      refreshGuestUI();
      syncPriceBreakdown();
    });
  });

  function closeAllPopovers(except) {
    [guestPopover, calPopover].forEach(p => {
      if (p !== except && !p.hidden) {
        p.hidden = true;
        const owner = p === guestPopover ? guestBox : (checkinBox.getAttribute('aria-expanded') === 'true' ? checkinBox : checkoutBox);
        owner.setAttribute('aria-expanded', 'false');
      }
    });
  }

  guestBox.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = guestPopover.hidden;
    closeAllPopovers();
    guestPopover.hidden = !willOpen;
    guestBox.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) $('.stepper-btn', guestPopover).focus();
  });
  $('#guestCloseBtn').addEventListener('click', () => {
    guestPopover.hidden = true;
    guestBox.setAttribute('aria-expanded', 'false');
    guestBox.focus();
  });
  guestPopover.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { guestPopover.hidden = true; guestBox.setAttribute('aria-expanded', 'false'); guestBox.focus(); }
    if (e.key === 'Tab') trapFocus(guestPopover, e);
  });

  /* =========================================================
     Date-range calendar popover
     ========================================================= */
  const checkinBox = $('#checkinBox');
  const checkoutBox = $('#checkoutBox');
  const checkinValue = $('#checkinValue');
  const checkoutValue = $('#checkoutValue');
  const calPopover = $('#calPopover');
  const calendarSubtitle = $('#calendarSubtitle');
  const inlineCalendarMount = $('#inlineCalendarMount');
  const nightsLabel = $('#nightsLabel');
  const nightsTotal = $('#nightsTotal');
  const grandTotal = $('#grandTotal');
  const pillDates = $('#pillDates');
  const pillGuests = $('#pillGuests');
  const searchPill = $('#searchPill');

  function updatePillLabel() {
    const loc = currentProperty ? currentProperty.cardLocation.split(',')[0].trim() : 'Government Camp';
    searchPill.setAttribute('aria-label', `Open search: ${loc}, ${pillDates.textContent}, ${pillGuests.textContent}`);
  }

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  let viewYear = 2026, viewMonth = 10; // November 2026 (0-indexed)
  let rangeStart = new Date(2026, 10, 14);
  let rangeEnd = new Date(2026, 10, 18);
  let pendingStart = null;

  function fmtShort(d) {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }
  function fmtLong(d) {
    return `${MONTH_NAMES[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}`;
  }
  function nightsBetween(a, b) {
    return Math.round((b - a) / 86400000);
  }

  /* Dynamic Price Calculation based on Property + Nights + Guest Count */
  function syncPriceBreakdown() {
    const n = (rangeStart && rangeEnd) ? Math.max(1, nightsBetween(rangeStart, rangeEnd)) : 4;
    const rate = currentProperty.price;
    const subtotal = rate * n;

    // Extra guest calculation: base rate covers 2 guests
    const totalGuests = guestTotal();
    const extraGuests = Math.max(0, totalGuests - 2);
    const extraFeeRate = currentProperty.extraGuestFee || 25;
    const extraGuestTotal = extraGuests * extraFeeRate * n;

    const cleaningFee = currentProperty.cleaningFee;
    const serviceFee = currentProperty.serviceFee;
    const totalAmount = subtotal + extraGuestTotal + cleaningFee + serviceFee;

    // Update DOM
    if (nightsLabel) nightsLabel.textContent = `$${rate} x ${n} night${n !== 1 ? 's' : ''}`;
    if (nightsTotal) nightsTotal.textContent = fmtUSD(subtotal);

    const cardPrice = $('#cardNightlyPrice');
    if (cardPrice) cardPrice.textContent = fmtUSD(rate);

    const mobilePrice = $('#mobilePrice');
    if (mobilePrice) mobilePrice.textContent = fmtUSD(rate);

    const extraRow = $('#extraGuestRow');
    const extraLabel = $('#extraGuestLabel');
    const extraTotalEl = $('#extraGuestTotal');
    if (extraRow && extraLabel && extraTotalEl) {
      if (extraGuests > 0) {
        extraRow.style.display = 'flex';
        extraLabel.textContent = `Extra guest fee ($${extraFeeRate} x ${extraGuests} guest${extraGuests > 1 ? 's' : ''} x ${n}n)`;
        extraTotalEl.textContent = fmtUSD(extraGuestTotal);
      } else {
        extraRow.style.display = 'none';
      }
    }

    const cleaningEl = $('#cleaningFeeTotal');
    if (cleaningEl) cleaningEl.textContent = fmtUSD(cleaningFee);

    const serviceEl = $('#serviceFeeTotal');
    if (serviceEl) serviceEl.textContent = fmtUSD(serviceFee);

    if (grandTotal) grandTotal.textContent = fmtUSD(totalAmount);

    // Subtle number flash animation
    [grandTotal, nightsTotal, cardPrice, extraTotalEl].forEach(el => {
      if (!el) return;
      el.classList.remove('price-flash');
      void el.offsetWidth;
      el.classList.add('price-flash');
    });
  }

  function buildCalendarHTML(year, month) {
    const first = new Date(year, month, 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date(2026, 8, 15);

    let cells = '';
    for (let i = 0; i < startDow; i++) cells += '<span></span>';
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const disabled = date < today;
      let cls = 'cal-day';
      if (rangeStart && date.getTime() === rangeStart.setHours(0,0,0,0)) cls += ' range-start';
      if (rangeEnd && date.getTime() === new Date(rangeEnd).setHours(0,0,0,0)) cls += ' range-end';
      if (rangeStart && rangeEnd && date > rangeStart && date < rangeEnd) cls += ' in-range';
      cells += `<button type="button" class="${cls}" data-day="${d}" ${disabled ? 'disabled' : ''} aria-label="${MONTH_NAMES[month]} ${d}, ${year}">${d}</button>`;
    }
    return `
      <div class="cal-month">
        <div class="cal-month-head">${MONTH_NAMES[month]} ${year}</div>
        <div class="cal-grid">
          <span class="dow">S</span><span class="dow">M</span><span class="dow">T</span><span class="dow">W</span><span class="dow">T</span><span class="dow">F</span><span class="dow">S</span>
          ${cells}
        </div>
      </div>`;
  }

  function renderCalendars(container) {
    container.innerHTML = buildCalendarHTML(viewYear, viewMonth);
    $$('.cal-day:not([disabled])', container).forEach(btn => {
      btn.addEventListener('click', () => {
        const day = Number(btn.dataset.day);
        const picked = new Date(viewYear, viewMonth, day);
        if (!pendingStart || (pendingStart && rangeEnd)) {
          rangeStart = picked; rangeEnd = null; pendingStart = picked;
        } else if (picked <= pendingStart) {
          rangeStart = picked; rangeEnd = null; pendingStart = picked;
        } else {
          rangeEnd = picked; pendingStart = null;
        }
        syncDateUI();
        renderCalendars(container);
        renderCalendars(inlineCalendarMount);
      });
    });
  }

  function syncDateUI() {
    if (rangeStart) {
      checkinValue.textContent = fmtShort(rangeStart);
    }
    if (rangeEnd) {
      checkoutValue.textContent = fmtShort(rangeEnd);
      const n = nightsBetween(rangeStart, rangeEnd);
      calendarSubtitle.textContent = `${fmtLong(rangeStart)} – ${fmtLong(rangeEnd)}`;
      const loc = currentProperty.cardLocation.split(',')[0].trim();
      $('.calendar-header h2').textContent = `${n} night${n !== 1 ? 's' : ''} in ${loc}`;

      const sameMonth = rangeStart.getMonth() === rangeEnd.getMonth();
      const startLabel = `${MONTH_NAMES[rangeStart.getMonth()].slice(0, 3)} ${rangeStart.getDate()}`;
      const endLabel = sameMonth ? `${rangeEnd.getDate()}` : `${MONTH_NAMES[rangeEnd.getMonth()].slice(0, 3)} ${rangeEnd.getDate()}`;
      pillDates.textContent = `${startLabel} – ${endLabel}`;
      const mobileDates = $('#mobileDates');
      if (mobileDates) mobileDates.textContent = `${startLabel} – ${endLabel}`;
    } else {
      checkoutValue.textContent = 'Add date';
      pillDates.textContent = 'Add dates';
    }
    syncPriceBreakdown();
    updatePillLabel();
  }

  renderCalendars(inlineCalendarMount);
  syncDateUI();

  function openCalPopover(anchor) {
    closeAllPopovers();
    calPopover.hidden = false;
    renderCalendars(calPopover);
    anchor.setAttribute('aria-expanded', 'true');
    calPopover.dataset.owner = anchor.id;
  }
  checkinBox.addEventListener('click', (e) => { e.stopPropagation(); pendingStart = null; openCalPopover(checkinBox); });
  checkoutBox.addEventListener('click', (e) => { e.stopPropagation(); openCalPopover(checkoutBox); });

  calPopover.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      calPopover.hidden = true;
      checkinBox.setAttribute('aria-expanded', 'false');
      checkoutBox.setAttribute('aria-expanded', 'false');
    }
    if (e.key === 'Tab') trapFocus(calPopover, e);
  });

  document.addEventListener('click', (e) => {
    if (!guestPopover.hidden && !guestPopover.contains(e.target) && e.target !== guestBox) {
      guestPopover.hidden = true; guestBox.setAttribute('aria-expanded', 'false');
    }
    if (!calPopover.hidden && !calPopover.contains(e.target) && e.target !== checkinBox && e.target !== checkoutBox) {
      calPopover.hidden = true;
      checkinBox.setAttribute('aria-expanded', 'false');
      checkoutBox.setAttribute('aria-expanded', 'false');
    }
  });

  /* =========================================================
     Property Selection & Homepage Synchronization
     ========================================================= */
  function selectProperty(propertyId, shouldScroll = false) {
    const prop = PROPERTIES.find(p => p.id === propertyId);
    if (!prop) return;
    currentProperty = prop;

    // 1. Homepage Header & Title
    const titleEl = $('#listingTitle');
    if (titleEl) titleEl.textContent = prop.title;
    const ratingEl = $('#listingRating');
    if (ratingEl) ratingEl.textContent = prop.rating;
    const reviewsEl = $('#listingReviews');
    if (reviewsEl) reviewsEl.textContent = `${prop.reviews} reviews`;
    const locEl = $('#listingLocation');
    if (locEl) locEl.textContent = prop.location;
    const tagEl = $('#propertyStatusTag');
    if (tagEl) {
      tagEl.innerHTML = `<span class="pulse-dot"></span> Currently viewing &amp; reserving: <strong>${prop.title.split('with')[0].split('in the')[0].trim()}</strong>`;
    }

    // 2. Photo Gallery on Homepage
    prop.photos.forEach((p, i) => {
      const img = $(`#galleryImg${i}`);
      if (img) {
        img.src = p.src.replace('w=1600', 'w=1200');
        img.alt = p.alt;
      }
    });

    // 3. Lightbox Photos & Thumbs
    photos = prop.photos.map(p => ({ src: p.src, alt: p.alt }));
    refreshLightboxThumbs();

    // 4. Host Profile & Property Specs
    const hostHead = $('#hostHeading');
    if (hostHead) hostHead.textContent = `Entire cabin hosted by ${prop.hostName}`;
    const hostMeta = $('#hostMeta');
    if (hostMeta) hostMeta.textContent = prop.meta;
    const hostAvatar = $('#hostAvatarImg');
    if (hostAvatar) hostAvatar.src = prop.hostAvatar;

    // 5. Narrative Description
    const desc = $('#descriptionText');
    if (desc) desc.textContent = prop.shortDescription;

    // 6. Clamp guest counts if capacity is smaller
    if (guestTotal() > prop.maxGuests) {
      counts.adults = Math.min(counts.adults, prop.maxGuests);
      counts.children = Math.max(0, prop.maxGuests - counts.adults);
    }
    const stepperNote = $('#stepperNote');
    if (stepperNote) {
      stepperNote.textContent = `Base price covers 2 guests. +$${prop.extraGuestFee}/night per additional guest. Max ${prop.maxGuests} guests.`;
    }
    refreshGuestUI();

    // 7. Calendar header location
    const n = (rangeStart && rangeEnd) ? nightsBetween(rangeStart, rangeEnd) : 4;
    const locName = prop.cardLocation.split(',')[0].trim();
    const calH2 = $('.calendar-header h2');
    if (calH2) calH2.textContent = `${n} night${n !== 1 ? 's' : ''} in ${locName}`;

    // 8. Reserve Card Rating & Review
    const cardRating = $('#cardRating');
    if (cardRating) cardRating.textContent = prop.rating;
    const cardReviews = $('#cardReviews');
    if (cardReviews) cardReviews.textContent = `${prop.reviews} reviews`;

    // 9. Synchronize Price Breakdown
    syncPriceBreakdown();
    updatePillLabel();

    // 10. Update Listings Grid UI
    renderListingsGrid();

    // 11. Toast
    showToast(`Selected "${prop.title}" · Reserve card updated`);

    // 12. Smooth scroll to gallery
    if (shouldScroll) {
      const target = $('#gallery') || $('#listingTitle');
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }

  /* =========================================================
     Reserve buttons
     ========================================================= */
  function wireReserve(btn) {
    btn.addEventListener('click', () => {
      const label = btn.querySelector('.btn-label') || btn;
      const original = label.textContent;
      label.textContent = 'Request sent ✓';
      btn.disabled = true;
      showToast(`Reservation request sent for "${currentProperty.title}" to ${currentProperty.hostName}`);
      setTimeout(() => { label.textContent = original; btn.disabled = false; }, 2400);
    });
  }
  wireReserve($('#reserveBtn'));
  wireReserve($('#mobileReserveBtn'));

  /* =========================================================
     Similar listings grid with Select Property option
     ========================================================= */
  const CHEVRON_LEFT = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M15.5 3.5 6 12l9.5 8.5 1.4-1.4L9 12l7.9-7.1z"/></svg>';
  const CHEVRON_RIGHT = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M8.5 3.5 18 12l-9.5 8.5-1.4-1.4L15 12 7.1 4.9z"/></svg>';
  const HEART_SVG = '<svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true"><path stroke-width="2" d="M16 28S3 20.1 3 11.6C3 7.4 6.4 4 10.6 4c2.4 0 4.6 1.2 5.9 3.1C17.8 5.2 20 4 22.4 4 26.6 4 30 7.4 30 11.6 30 20.1 16 28 16 28Z"/></svg>';
  const STAR_SVG = '<svg viewBox="0 0 32 32" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M15.1 1.58c.4-.76 1.4-.76 1.8 0l4.13 7.75 8.6 1.7c.85.17 1.19 1.2.6 1.83l-6.03 6.44 1.15 8.72c.11.86-.76 1.5-1.54 1.13L16 25.14l-7.81 3.99c-.78.4-1.65-.27-1.54-1.13l1.15-8.72-6.03-6.44c-.59-.63-.25-1.66.6-1.83l8.6-1.7 4.13-7.73Z"/></svg>';

  const listingsGrid = $('#listingsGrid');

  function renderListingsGrid() {
    if (!listingsGrid) return;
    const cardsHTML = PROPERTIES.map((listing) => {
      const isSelected = listing.id === currentProperty.id;
      const imgs = listing.photos.map(p => `<img src="${p.src.replace('w=1600', 'w=800')}" alt="${listing.title} — ${p.label}" loading="lazy">`).join('');
      const dots = listing.photos.map((_, i) => `<button type="button" aria-label="Photo ${i + 1} of ${listing.photos.length}" class="${i === 0 ? 'active' : ''}"></button>`).join('');
      const selectedBadge = isSelected ? `<div class="card-selected-badge"><span class="badge-dot"></span> Currently Selected</div>` : '';
      const buttonHTML = isSelected
        ? `<button type="button" class="select-property-btn is-selected" data-id="${listing.id}" disabled><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Currently Selected</button>`
        : `<button type="button" class="select-property-btn" data-id="${listing.id}">Select Property</button>`;

      return `
        <article class="listing-card ${isSelected ? 'is-selected' : ''}" data-id="${listing.id}" data-index="0">
          <div class="card-carousel">
            ${selectedBadge}
            <button type="button" class="heart-btn" aria-label="Save ${listing.title}" aria-pressed="false">${HEART_SVG}</button>
            <div class="card-carousel-track">${imgs}</div>
            <button type="button" class="card-nav prev" aria-label="Previous photo" disabled>${CHEVRON_LEFT}</button>
            <button type="button" class="card-nav next" aria-label="Next photo">${CHEVRON_RIGHT}</button>
            <div class="card-dots">${dots}</div>
          </div>
          <div class="card-info">
            <div class="card-info-top">
              <span class="card-location">${listing.cardLocation}</span>
              <span class="card-rating">${STAR_SVG} ${listing.rating}</span>
            </div>
            <div class="card-title-text">${listing.title}</div>
            <p class="card-sub">${listing.sub}</p>
            <p class="card-sub">${listing.meta.split('·')[0].trim()} · +$${listing.extraGuestFee}/extra guest</p>
            <p class="card-price"><strong>$${listing.price}</strong> night</p>
            ${buttonHTML}
          </div>
        </article>`;
    }).join('');
    listingsGrid.innerHTML = cardsHTML;

    const countBadge = $('#propertiesCountBadge');
    if (countBadge) countBadge.textContent = `${PROPERTIES.length} properties available`;
  }

  function setCardIndex(card, index) {
    const track = $('.card-carousel-track', card);
    if (!track) return;
    const count = track.children.length;
    const clamped = Math.max(0, Math.min(count - 1, index));
    track.style.transform = `translateX(-${clamped * 100}%)`;
    card.dataset.index = clamped;
    $$('.card-dots button', card).forEach((d, i) => d.classList.toggle('active', i === clamped));
    const prevBtn = $('.card-nav.prev', card);
    const nextBtn = $('.card-nav.next', card);
    if (prevBtn) prevBtn.disabled = clamped === 0;
    if (nextBtn) nextBtn.disabled = clamped === count - 1;
  }

  if (listingsGrid) {
    renderListingsGrid();

    listingsGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.listing-card');
      if (!card) return;
      const prev = e.target.closest('.card-nav.prev');
      const next = e.target.closest('.card-nav.next');
      const dot = e.target.closest('.card-dots button');
      const heart = e.target.closest('.heart-btn');
      const selectBtn = e.target.closest('.select-property-btn');

      if (prev) {
        setCardIndex(card, Number(card.dataset.index) - 1);
        return;
      }
      if (next) {
        setCardIndex(card, Number(card.dataset.index) + 1);
        return;
      }
      if (dot) {
        setCardIndex(card, Array.from(dot.parentElement.children).indexOf(dot));
        return;
      }
      if (heart) {
        const saved = heart.classList.toggle('saved');
        heart.setAttribute('aria-pressed', String(saved));
        heart.classList.remove('pop');
        void heart.offsetWidth;
        heart.classList.add('pop');
        return;
      }

      // If clicked on "Select Property" button or on card info
      const propId = card.dataset.id;
      if (propId && propId !== currentProperty.id) {
        selectProperty(propId, true);
      } else if (propId && propId === currentProperty.id) {
        showToast(`Already viewing "${currentProperty.title}"`);
        const top = $('#gallery').getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });

    listingsGrid.addEventListener('keydown', (e) => {
      const carousel = e.target.closest('.card-carousel');
      if (!carousel) return;
      const card = carousel.closest('.listing-card');
      if (e.key === 'ArrowLeft') { e.preventDefault(); setCardIndex(card, Number(card.dataset.index) - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setCardIndex(card, Number(card.dataset.index) + 1); }
    });
  }

  // Initialize selected property state and pricing
  selectProperty('cliffside-cabin', false);
})();
