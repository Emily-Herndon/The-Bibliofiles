// DARK MODE TOGGLE

let darkMode = localStorage.getItem("darkMode")

// change individual navbar items to overwrite bootstrap styling
const darkModeSwitch = document.querySelector('#dark-mode')
const navBar = document.getElementById('navbar')
const navBarBrand = document.getElementById('navBarBrand')
const navBarLogout = document.getElementById('navBarLogout')
const navBarProfile = document.getElementById('navBarProfile')
const search = document.getElementById('search')
const navBarSearch = document.getElementById('navBarSearch')
const navBarSignup = document.getElementById('navBarSignup')
const navBarLogin = document.getElementById('navBarLogin')
// const modal = document.getElementById('editTagsModal')
// const editTagsButton = document.getElementById('edit-tags-button')

// what happens when dm is enabled
const enableDarkMode = () => {
  navBarBrand.style.color = "#ffc300";
  navBarLogout.style.color = "#ffc300";
  navBarProfile.style.color = "#ffc300";
  search.style.color = "#ffc300";
  search.style.backgroundColor = "#003566";
  navBarSearch.style.color = "#ffc300";
  navBarSignup.style.color = "#ffc300";
  navBarLogin.style.color = "#ffc300";
  // modal.style.backgroundColor = "#001d3d";
  navBar.style.backgroundColor = "#003566"
  // editTagsButton.style.color = "#ffc300";
  // add dark mode to body
  document.body.classList.add('dark')
  // update dark mode in localStorage
  localStorage.setItem("darkMode", "enabled")
  // have the dark mode toggle position persistant
  document.getElementById("dark-mode").checked = true
}

// what happens when dm is disabled
const disableDarkMode = () => {
  navBarBrand.style.color = "rgba(0, 0, 0, 0.9)";
  navBarLogout.style.color = "rgba(0, 0, 0, 0.9)";
  navBarProfile.style.color = "rgba(0, 0, 0, 0.9)";
  search.style.color = "rgba(0, 0, 0, 0.9)";
  search.style.backgroundColor = "white";
  navBarSearch.style.color = "rgba(0, 0, 0, 0.9)";
  navBarSignup.style.color = "rgba(0, 0, 0, 0.9)";
  navBarLogin.style.color = "rgba(0, 0, 0, 0.9)";
  navBar.style.backgroundColor = "rgb(246, 247, 249)"
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

// what happens when the dm switch is clicked
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
