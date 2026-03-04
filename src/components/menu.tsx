function dropdownMenu() {
    const menu = document.getElementById('dropdown-menu')
    menu!.classList.toggle('show'); 
}

function graphBox() {
    const menu = document.getElementById('graph-box')
    menu!.classList.toggle('flex'); 
}

export {dropdownMenu, graphBox}
