document.addEventListener('DOMContentLoaded', function () {
    const username = 'notquitelikeme'; // Replace with the GitHub username

    // Fetch GitHub profile data
    fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('avatar').src = data.avatar_url;
            document.getElementById('name').textContent = data.name || data.login;
            document.getElementById('username').textContent = data.username || data.login;
            document.getElementById('followers').innerHTML = `<i class="fa-solid fa-users"></i> ${data.followers} Followers ▪ Following ${data.following}`;
            document.getElementById('repos').innerHTML = `<i class="fa-solid fa-book-bookmark"></i>  ${data.public_repos} Repositories`;
            document.getElementById('profile-link').href = data.html_url;
        });

    // Fetch GitHub repositories
    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(repos => {
            const repoList = document.getElementById('repo-list');
            repos.forEach(repo => {
                const listItem = document.createElement('li');
                const repoLink = document.createElement('a');
                repoLink.href = repo.html_url;
                repoLink.textContent = repo.name;
                repoLink.target = '_blank';
                listItem.appendChild(repoLink);
                repoList.appendChild(listItem);
            });
        });
});
