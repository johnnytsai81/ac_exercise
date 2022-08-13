const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = [] //電影總清單
let filteredMovies = [] //搜尋清單
let mode = 'card' // 預設為卡片模式

const MOVIES_PER_PAGE = 12
const movieModal = document.querySelector('#movie-modal')
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const filter = document.querySelector('.filter-top')
const filterCard = document.querySelector('.filter-top .card-mode')
const filterList = document.querySelector('.filter-top .list-mode')

// 載入電影列表（卡片模式）
function renderMovieCard(data) {
  let rawHTML = ''
  data.forEach((item) => {
    // title, image, id
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image
      }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button 
            class="btn btn-primary 
            btn-show-movie" 
            data-bs-toggle="modal" 
            data-bs-target="#movie-modal" 
            data-id="${item.id}"
          >
            More
          </button>
          <button 
            class="btn btn-info btn-add-favorite" 
            data-id="${item.id}"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}

// 載入電影列表(清單模式）
function renderMovieList(data){
  let listHTML = ''
  data.forEach((item) => {
    // title, image, id
    listHTML += `
        <li class="list-group-item d-flex align-items-center justify-content-between">
        <h5 class='mb-0'>${item.title}<h5>
        <div>
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </li>`
  })
  let rawHTML = '<ul class="list-group">'+ listHTML +'</ul>'
  dataPanel.innerHTML = rawHTML
}

// 載入分頁
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    if(page == 1){
      rawHTML += `<li class="page-item"><a class="page-link active" href="#" data-page="${page}">${page}</a></li>`
    }else{
      rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
    }
  }
  paginator.innerHTML = rawHTML
}

// 取的目前頁面的資料
function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE

  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

// 取得彈跳式視窗的資料
function showMovieModal(id) {
  // get elements
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  const modalId = document.getElementById('movie-modal').querySelector('.btn-add-favorite')
  modalTitle.innerHTML = ''
  modalImage.innerHTML = ''
  modalDate.innerHTML = ''
  modalDescription.innerHTML = ''
  modalId.dataset.id = ''
  // send request to show api
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results

    // insert data into modal ui
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
    modalId.dataset.id = id
  })
}

// 加入我的最愛並暫存
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// 監聽詳細頁及加入最愛的按鈕
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } 
  else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// 監聽跳出頁加入最愛的按鈕
movieModal.addEventListener('click', function onModalClicked(event) {
  if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// 監聽搜尋按鈕
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  if (mode === 'card'){
      renderMovieCard(getMoviesByPage(1))
  }else if (mode === 'list'){
      renderMovieList(getMoviesByPage(1))
  }
  renderPaginator(filteredMovies.length)
  
})

// 監聽顯示方式按鈕
filter.addEventListener('click', function onFilterClicked(event) {
  if (event.target.closest('.filter-top .card-mode')) {
    if(filterCard.classList.contains('active')){
      return
    }
    renderMovieCard(getMoviesByPage(1))
    document.getElementsByClassName('card-mode')[0].classList.add('active')
    document.getElementsByClassName('list-mode')[0].classList.remove('active')
    mode = 'card'
  }else if (event.target.closest('.filter-top .list-mode')) {
    if(filterList.classList.contains('active')){
      return
    }
    renderMovieList(getMoviesByPage(1))
    document.getElementsByClassName('list-mode')[0].classList.add('active')
    document.getElementsByClassName('card-mode')[0].classList.remove('active')
    mode = 'list'
  }
  
})

// 監聽分頁按鈕
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  document.getElementById("paginator").getElementsByClassName("active")[0].classList.remove('active')
  event.target.classList.add('active')
  if (mode === 'card'){
    renderMovieCard(getMoviesByPage(page))
  }else if (mode === 'list'){
    renderMovieList(getMoviesByPage(page))
  }
})

// 取得api資料
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieCard(getMoviesByPage(1))
  })
  .catch((err) => console.log(err))