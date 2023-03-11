const baseURL = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

const form = document.querySelector('.search-form')
const searchBar = document.querySelector('.search-bar')
const result = document.querySelector('.result')
const footer = document.querySelector('footer')

form.addEventListener('submit', (e) => {
  e.preventDefault()

  // paste clipboard text
  if (!searchBar.value) {
    navigator.clipboard
      .readText()
      .then((clipText) => (searchBar.value = clipText))
    return
  }

  let search = searchBar.value
  init(`${baseURL}${search}`)
})

const fetchData = async (url) => {
  result.innerHTML = `<h3>searching...</h3>`
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    result.innerHTML = '<h2 class="error">sorry there was an error</h2>'
  }
}

const displayData = (data) => {
  if (data && data[0]) {
    const { word, phonetic, phonetics, meanings, license, sourceUrls } = data[0]
    const { audio } = phonetics[1]
    result.innerHTML = `
    <div class="word">
      <h2>${word}</h2>
      <span>${phonetic}</span>
      <button class="audio-btn"><i class="fa fa-volume-up"></i></button>
      <audio src=${audio}></audio>
    </div>
    <div class="meanings">
    ${meanings
      .map(({ partOfSpeech, definitions, synonyms, antonyms }) => {
        return `
          <article>
            <h3>${partOfSpeech}</h3>
            <ol>
            ${definitions
              .map(({ definition, example }) => {
                return `
                <li>${definition}</li>
                ${example ? `<p class="example" >${example}</p>` : ''}
                `
              })
              .join('')}
            </ol>
              ${
                synonyms[0]
                  ? `<h4>
              <em>Synonyms</em>
            </h4>
            
            <p class="words">${synonyms
              .map((word) => {
                return `<span>"${word}"</span>`
              })
              .join('')} </p>
            `
                  : ''
              }
          ${
            antonyms[0]
              ? `
             <h4>
              <em>Antonyms</em>
            </h4>
             <p class="words">${antonyms
               .map((word) => {
                 return `<span>"${word}"</span>`
               })
               .join('')} </p> 
            `
              : ''
          }     
          </article>`
      })
      .join('')}
      </div>
  `
    // play audio
    const audioBtn = result.querySelector('.audio-btn')
    const pronunciation = result.querySelector('audio')

    audioBtn.addEventListener('click', () => {
      pronunciation.play()
    })

    // footer
    const { name } = license
    footer.innerHTML = `<p>This text is extracted from <a href=${sourceUrls[0]}>Wiktionary</a> under the license ${name} </p>`
  } else if (data) {
    const { message, resolution } = data
    result.innerHTML = `
      <h3 class="error">${message}</h3>
      <h4 class="error">${resolution}</h4>
    `
  }
}

const init = async (url) => {
  const data = await fetchData(url)
  displayData(data)
}
