const langArea = document.getElementById('lang-area');
const containerLang = document.getElementById('container-lang');
const languageToggle = document.getElementById('language-toggle');
const closeIcon = document.getElementById('close-icon');

function handleClickOutside(event) {
    if (!langArea.contains(event.target) && event.target != langArea) {
        containerLang.style.display = 'none';
    }
}
languageToggle.addEventListener('click', function (event) {
    event.stopPropagation();
    containerLang.style.display = containerLang.style.display === 'block' ? 'none' : 'block';
});

closeIcon.addEventListener('click', function (event) {
    event.stopPropagation();
    containerLang.style.display = 'none';
});
document.addEventListener('click', handleClickOutside);