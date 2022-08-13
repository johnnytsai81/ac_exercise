const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const user = JSON.parse(localStorage.getItem('favoriteUser')) //收藏清單

const USER_PER_PAGE = 12
const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')

// 建立使用者清單
function renderUserList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `<div class="col-6 col-md-4 col-lg-3" >
          
          <div class="card">
            <div class="card-header">
              <img src="${item.avatar}" alt="">
            </div>
            <div class="card-body">
              <h3 class="name">${item.name} ${item.surname}</h3 >
              
            </div>
            <a class='card-link' data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#user-modal"></a>
            <div class="star-icon" data-id="${item.id}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 117.1"><path class='star-body' d="M64.17,6.24,78.69,40.17l36.86,3.29a3,3,0,0,1,2.71,3.19,2.92,2.92,0,0,1-1,2h0L89.33,73,97.56,109a3,3,0,0,1-2.22,3.53h0a3,3,0,0,1-2.27-.43L61.38,93.24l-31.74,19a3,3,0,0,1-4-1v0a2.88,2.88,0,0,1-.35-2.2h0L33.48,73,5.62,48.65a3,3,0,0,1-.3-4.17,3,3,0,0,1,2.12-.93l36.72-3.29,14.53-34a3,3,0,0,1,5.48,0Z" fill="var(--star-color)" stroke="#ffd401" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/></svg></div>
          </div>
        </div > `
  })
  dataPanel.innerHTML = rawHTML
}

function showUserModal(id) {
  const modalImage = document.querySelector('#user-modal-image')
  const modalName = document.querySelector('#user-modal-name')
  const modalGender = document.querySelector('#user-modal-gender')
  const modalAge = document.querySelector('#user-modal-age')
  const modalEmail = document.querySelector('#user-modal-email')
  const modalBirth = document.querySelector('#user-modal-birth')
  modalImage.innerHTML = ''
  modalName.innerHTML = ''
  modalGender.innerHTML = ''
  modalAge.innerHTML = ''
  modalBirth.innerHTML = ''
  modalEmail.innerHTML = ''
  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data
      modalImage.innerHTML = `<img src="${data.avatar}" alt="">`
      modalName.innerHTML = data.name
      modalGender.innerHTML = 'Gender:' + data.gender
      modalAge.innerHTML = 'Age:' + data.age
      modalBirth.innerHTML = 'Birth:' + data.birthday
      modalEmail.innerHTML = 'Email:' + data.email
    })
    .catch((err) => console.log(err))
}

// 點擊卡片
dataPanel.addEventListener('click', function onPanelClicked(event) {
  console.log(event.target)
  if (event.target.matches('.card-link')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.star-icon')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

// 顯示分頁
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USER_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// 製作分頁
function getUserByPage(page) {
  const data = filteredUser.length ? filteredUser : user
  const startIndex = (page - 1) * USER_PER_PAGE
  return data.slice(startIndex, startIndex + USER_PER_PAGE)
}

// 切換分頁
paginator.addEventListener('click', function onPaginatorClicked(event) {
  // 防止按到a以外的物件
  if (event.target.tagName !== 'A') return

  // 抓取data-page的值並轉為數字
  const page = Number(event.target.dataset.page)
  renderUserList(getUserByPage(page))
})

// 移除最愛
function removeFromFavorite(id) {
  if (!user) return

  const movieIndex = user.findIndex((user) => user.id === id)
  if (movieIndex === -1) return

  user.splice(movieIndex, 1)
  localStorage.setItem('favoriteUser', JSON.stringify(user))
  renderUserList(user)
}

renderUserList(user)