const url = 'http://localhost:5173/'

function addProject(teacher_id: string) {
    window.location.href = url + 'new-project/' + teacher_id
}

function exitAddProject() {
    window.location.href = url + 'projects'
}

function logoutAccount() {
    window.location.replace(url)
}

function projectPage(teacher_id: string) {
    window.location.href = url + 'projects/' + teacher_id
}

export {addProject, projectPage, logoutAccount}
