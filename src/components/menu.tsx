function dropdownMenu() {
    const menu = document.getElementById('dropdown-menu')
    menu!.classList.toggle('show'); 
}

function graphMenu() {
    const menu = document.getElementById('graph-prompt-box')
    menu!.classList.toggle('show'); 
}

export {dropdownMenu, graphMenu}
