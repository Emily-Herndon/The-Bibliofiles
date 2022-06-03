// DARK MODE TOGGLE

let darkMode = localStorage.getItem("darkMode")
const darkModeSwitch = document.querySelector('#dark-mode')
const enableDarkMode = () => {
  // add dark mode to body
  document.body.classList.add('dark')
  // update dark mode in localStorage
  localStorage.setItem("darkMode", "enabled")
  // have the dark mode toggle position persistant
  document.getElementById("dark-mode").checked = true
}
const disableDarkMode = () => {
  // removes dark mode from body
  document.body.classList.remove('dark')
  // update dark mode in localStorage
  localStorage.setItem("darkMode", null)
  // have the dark mode toggle position persistant
  document.getElementById("dark-mode").checked = false
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
