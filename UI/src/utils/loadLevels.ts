

function loadLevels() {
    const levels = document.getElementById('level-section')
    for (let i = 1; i <= 50; i++) {
    const levelElement = document.createElement('p');
    levelElement.className = 'level';
    levelElement.textContent = `Level ${i}`;
    levelElement.addEventListener('click', () => {
        window.location.href = `/levels/${i}`;
    });
    levels!.appendChild(levelElement);
    }
}

export default loadLevels;