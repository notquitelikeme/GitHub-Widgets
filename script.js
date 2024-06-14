document.addEventListener("DOMContentLoaded", function() {
    async function fetchGitHubData(username) {
        if (!username) {
            const profileWidget = document.getElementById('profile-widget');
            const errorMessage = document.getElementById('error-message');
            
            if (profileWidget) profileWidget.style.display = 'none';
            if (errorMessage) errorMessage.textContent = '';
            return;
        }

        try {
            const [profileResponse, reposResponse] = await Promise.all([
                fetch(`https://api.github.com/users/${username}`),
                fetch(`https://api.github.com/users/${username}/repos`)
            ]);

            const profileWidget = document.getElementById('profile-widget');
            const errorMessage = document.getElementById('error-message');

            if (!profileResponse.ok) {
                if (profileResponse.status === 404) {
                    if (profileWidget) profileWidget.style.display = 'none';
                    if (errorMessage) errorMessage.textContent = 'User not found';
                } else {
                    throw new Error('Error fetching profile data');
                }
            } else {
                if (errorMessage) errorMessage.textContent = '';
                const profileData = await profileResponse.json();
                const repos = await reposResponse.json();

                if (profileWidget) profileWidget.style.display = 'block';
                
                document.getElementById('avatar').src = profileData.avatar_url;
                document.getElementById('name').textContent = profileData.name || profileData.login;
                document.getElementById('username').textContent = `${profileData.login}`;
                document.getElementById('followers').innerHTML = `<i class="fa-solid fa-users"></i> ${profileData.followers} Followers ▪ Following ${profileData.following}`;
                document.getElementById('repos').innerHTML = `<i class="fa-solid fa-book-bookmark"></i> ${profileData.public_repos} Repositories`;
                document.getElementById('profile-link').href = profileData.html_url;

                const createdAt = new Date(profileData.created_at);
                const now = new Date();
                let years = now.getFullYear() - createdAt.getFullYear();
                let months = now.getMonth() - createdAt.getMonth();
                if (months < 0) {
                    years -= 1;
                    months += 12;
                }

                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = createdAt.toLocaleDateString(undefined, options);

                const accountAge = `${years} years, ${months} months`;
                document.getElementById('account-age').innerHTML = `<i class="fa-solid fa-calendar-days"></i> User Since ${formattedDate} ▪ (${accountAge})`;

                // const repoList = document.getElementById('repo-list');
                // repoList.innerHTML = ''; // Clear previous repo list
                // repos.forEach(repo => {
                //     const listItem = document.createElement('li');
                //     const repoLink = document.createElement('a');
                //     repoLink.href = repo.html_url;
                //     repoLink.textContent = repo.name;
                //     repoLink.target = '_blank';
                //     listItem.appendChild(repoLink);
                //     repoList.appendChild(listItem);
                // });

                // Fetch GitHub contributions in the last year
                // getContributions(username, token);
            }
        } catch (error) {
            console.error('Error fetching GitHub data:', error);
            const profileWidget = document.getElementById('profile-widget');
            const errorMessage = document.getElementById('error-message');
            if (profileWidget) profileWidget.style.display = 'none';
            if (errorMessage) errorMessage.textContent = 'Error generating widget';
        }
    }

    function initialize() {
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('username');
        if (username) {
            fetchGitHubData(username);
        }
    }

    initialize();
});
