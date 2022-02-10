hljs.initHighlightingOnLoad();

const HC_SETTINGS = {
  css: {
    activeClass: 'is-active',
    hiddenClass: 'is-hidden',
  },
};

$(() => {
  SearchResultsFilters.init();

  const $topbar = $('[data-topbar]');
  const $heroUnit = $('[data-hero-unit]');
  const $topSearchBar = $('.topbar__search-bar');
  const $topSearchBarQuery = $topSearchBar.find('#query');
  const $topSearchBarBtn = $('.topbar__btn-search');

  if (LotusUtils.isHomePage()) {
    $topbar.addClass('topbar--large');
    $heroUnit.removeClass(HC_SETTINGS.css.hiddenClass);
    $('[data-footer-submit-ticket]').removeClass(HC_SETTINGS.css.hiddenClass);
  } else {
    $topbar.addClass('topbar--small');
  }

  $topbar.removeClass(HC_SETTINGS.css.hiddenClass);
  $(window).trigger('resize');

  $('[data-toggle-menu]').click(function () {
    $(this).toggleClass(HC_SETTINGS.css.activeClass);
    $('[data-menu]').toggle();
  });

  // Social share popups
  $('.share a').click(function (e) {
    e.preventDefault();
    window.open(this.href, '', 'height = 500, width = 500');
  });

  // Toggle the share dropdown in communities
  $('.share-label').on('click', function (e) {
    e.stopPropagation();
    const isSelected = this.getAttribute('aria-selected') === 'true';
    this.setAttribute('aria-selected', !isSelected);
    $('.share-label').not(this).attr('aria-selected', 'false');
  });

  $(document).on('click', () => {
    $('.share-label').attr('aria-selected', 'false');
  });

  function search() {
    window.location.search = $.param({
      query: $('#quick-search').val(),
      status: $('#request-status-select').val(),
      organization_id: $('#request-organization-select').val(),
    });
  }

  // Submit search on select change
  $('#request-status-select, #request-organization-select').on('change', () => {
    search();
  });

  // Submit search on input enter
  $('#quick-search').on('keypress', (e) => {
    if (e.which === 13) {
      search();
    }
  });

  $('.image-with-lightbox').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: 'mfp-with-zoom', // class to remove default margin from left and right side
    image: {
      verticalFit: true,
    },
    zoom: {
      enabled: true,
      duration: 300, // don't foget to change the duration also in CSS
    },
  });

  $('.image-with-video-icon').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
  });

  $('.accordion__item-title').on('click', function () {
    const $title = $(this);
    $title.toggleClass('accordion__item-title--active');
    $title.parents('.accordion__item').find('.accordion__item-content').slideToggle();
  });

  $('.tabs-link').click(function (e) {
    e.preventDefault();
    const $link = $(this);
    const tabIndex = $link.index();
    const $tab = $link.parents('.tabs').find('.tab').eq(tabIndex);
    $link.addClass(HC_SETTINGS.css.activeClass).siblings().removeClass(HC_SETTINGS.css.activeClass);
    $tab
      .removeClass(HC_SETTINGS.css.hiddenClass)
      .siblings('.tab')
      .addClass(HC_SETTINGS.css.hiddenClass);
  });

  $topSearchBarBtn.click(function () {
    $(this).addClass(HC_SETTINGS.css.hiddenClass);
    $topSearchBar.removeClass(HC_SETTINGS.css.hiddenClass);
    $topSearchBarQuery.focus();
  });

  $(document).mouseup((e) => {
    if (!$topSearchBarQuery.is(e.target)) {
      $topSearchBar.addClass(HC_SETTINGS.css.hiddenClass);
      $topSearchBarBtn.removeClass(HC_SETTINGS.css.hiddenClass);
    }
  });

  // Fix animated icons
  $('.fa-spin').empty();

  $('img.custom-block__image').each(function () {
    const $img = $(this);
    const imgID = $img.attr('id');
    const imgClass = $img.attr('class');
    const imgURL = `${$img.attr('src')}?reset`;

    $.get(
      imgURL,
      (data) => {
        // Get the SVG tag, ignore the rest
        let $svg = $(data).find('svg');

        // Add replaced image's ID to the new SVG
        if (typeof imgID !== 'undefined') {
          $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== 'undefined') {
          $svg = $svg.attr('class', `${imgClass} replaced-svg`);
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Replace image with new SVG
        $img.replaceWith($svg);
      },
      'xml',
    );
  });

  // Limit category tree articles
  $('[data-articles-limit]').each((i, el) => {
    $(el)
      .find('li')
      .each((articleIndex, article) => {
        if (articleIndex > 4) {
          $(article).addClass(HC_SETTINGS.css.hiddenClass);
        }
      });
  });
});
