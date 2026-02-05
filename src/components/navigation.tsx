const url = 'http://localhost:5173/'

function addProject() {
    window.location.href = url + 'new-project'
}

function exitAddProject() {
    window.location.href = url + 'projects'
}

function logoutAccount() {
    window.location.replace(url)
}

export {addProject, exitAddProject, logoutAccount}
