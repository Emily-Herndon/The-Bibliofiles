const btn = document.querySelector('#editTagsButton')
btn.addEventListener('click', (event) => {
    let checkedTags = document.querySelectorAll('input[name="title"]:checked')
    let wantedTags = []
    checkedTags.forEach((checkbox) => {
        wantedTags.push(checkbox.value)
    })
})
console.log(`The tags wanted on this book are ${wantedTags} 🔖🔖🔖🔖🔖🔖🔖🔖`)