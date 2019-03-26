var client = algoliasearch('DE0L5FA9MW', '543d639c423234a15c3face0e0778793');
var index = client.initIndex('posts');

var searchParams = new URLSearchParams(window.location.search);
var query = searchParams.get("q");
var page = 0;

if (searchParams.has("page")) {
  page = searchParams.get("page") - 1;
}
if (page < 0) {
  page = 0;
  searchParams.set("page", page);
}

index.search(
  {
    query: query,
    hitsPerPage: 12,
    page: page
  },
  function searchDone(err, content) {
    if (err) throw err;
    if (content.nbPages > 1 && content.page < content.nbPages - 1) {
      searchParams.set('page', content.page + 2)
      $('.next-page').show();
      $('.next-page').attr('href', '/search/?' + searchParams.toString())
    }

    if (content.page > 0) {
      searchParams.set('page', content.page);
      $('.prev-page').show();
      $('.prev-page').attr('href', '/search/?' + searchParams.toString())
    }

    let dom = "";
    content.hits.forEach(function(post) {
      dom += `
        <div class="col-md-4">
          <a href="${post.relpermalink}" title="" class="blog-post">
              <div class="blog-image" style="background-image: url('${post.thumbnail}'); background-size:cover;">
              </div>
              <p class="title">${post.title}</p>
              <p class="meta">${post.readingtime}&nbsp;min to read <span class="author">by <strong>${post.author}</strong></span></p>
          </a>
      </div>
      `;
    })
    $('.algolia-search-list').html(dom);
  }
);

$(document).ready(function() {
  var searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('q')) {
    $('.search-input').val(searchParams.get("q"));
  }
});
