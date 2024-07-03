const searchField = document.querySelector("#search")
const cardTmpl = document.querySelector('#card')
const field = document.querySelector('.output-field')
const autocomplete = document.querySelector('#autocomplete')

const debounce = (fn, debounceTime) => {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, debounceTime)
  }
};

const addCard = (item) => {
  const card = cardTmpl.content.cloneNode(true)
  card.querySelector('.card-name').textContent = `Name: ${item.name}`
  card.querySelector('.card-owner').textContent = `Owner: ${item.owner.login}`
  card.querySelector('.card-stars').textContent = `Stars: ${item.stargazers_count}`
  card.querySelector('.card-button').addEventListener('click', (evt) => {
    evt.target.parentNode.remove()
  })
  field.append(card)
  searchField.value = ''
  autocomplete.innerHTML = ''
}

const getRepos = async (request) => {
    return await fetch(`https://api.github.com/search/repositories?q=${request}`, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    }
  })
      .then(response => {
        if (response.ok) {
          response.json().then(repos => {
            autocomplete.innerHTML = ''
            const items = repos.items.slice(0, 5)
            if (items.length === 0) {
              autocomplete.innerHTML = '<p class="no-results">No results...</p>'
            } else {
              items.forEach(item => {
                const choice = document.createElement('p')
                choice.className = 'choice'
                choice.textContent = `${item.name}`
                choice.addEventListener('click', () => addCard(item))
                autocomplete.append(choice)
              })
            }
          })
        } else {
          autocomplete.innerHTML = '<p class="no-results">Try again...</p>'
        }
      })
}

const debounceGetRepos = debounce(getRepos, 1000);

searchField.addEventListener('input', () => {
  if (searchField.value[0] === ' ') {
    return
  }
  debounceGetRepos(searchField.value.trim())
})