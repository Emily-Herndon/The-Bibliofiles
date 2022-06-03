// const btn = document.querySelector('#editTagsButton')
// btn.addEventListener('click', (event) => {
//     let checkedTags = document.querySelectorAll('input[name="title"]:checked')
//     let wantedTags = []
//     checkedTags.forEach((checkbox) => {
//         wantedTags.push(checkbox.value)
//     })
// })
// console.log(`The tags wanted on this book are ${wantedTags} 🔖🔖🔖🔖🔖🔖🔖🔖`)


// DARK MODE TOGGLE

let darkMode = localStorage.getItem("darkMode")
const darkModeSwitch = document.querySelector('#dark-mode')
const enableDarkMode = () => {
  // add dark mode to body
  document.body.classList.add('dark')
  // update dark mode in localStorage
  localStorage.setItem("darkMode", "enabled")
}
const disableDarkMode = () => {
  // removes dark mode from body
  document.body.classList.remove('dark')
  // update dark mode in localStorage
  localStorage.setItem("darkMode", null)
}
if(darkMode === "enabled"){
  enableDarkMode()
}

darkModeSwitch.addEventListener('click', ()=>{
  darkMode = localStorage.getItem("darkMode")
  if(darkMode !== "enabled"){
    enableDarkMode()
    console.log(`Dark mode enabled ${darkMode} 🌑🌑🌑🌑🌑🌑`)
  } else {
    disableDarkMode()
    console.log(`Dark mode disabled ${darkMode} ☀️☀️☀️☀️☀️☀️☀️☀️`)
  }
})
