async function fetchGitHubData() {
    const username = document.getElementById('username-input').value;

    if (!username) {
        document.getElementById('profile-widget').style.display = 'none';
        document.getElementById('error-message').textContent = '';
        return;
    }

    try {
        const [profileResponse, reposResponse] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`),
            fetch(`https://api.github.com/users/${username}/repos`)
        ]);

        if (!profileResponse.ok) {
            if (profileResponse.status === 404) {
                document.getElementById('profile-widget').style.display = 'none';
                document.getElementById('error-message').textContent = 'User not found';
            } else {
                throw new Error('Error fetching profile data');
            }
        } else {
            document.getElementById('error-message').textContent = '';
            const profileData = await profileResponse.json();
            const repos = await reposResponse.json();

            document.getElementById('profile-widget').style.display = 'block';
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
            getContributions(username, token);
        }
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        document.getElementById('profile-widget').style.display = 'none';
        document.getElementById('error-message').textContent = 'Error generating widget';
    }
}

async function getContributions(username, token) {
    const query = `
        query {
            user(login: "${username}") {
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();

        if (data.errors) {
            console.error('Error fetching data:', data.errors);
            document.getElementById('contributions-count').innerHTML = '';
            return;
        }

        const contributionsCount = data.data.user.contributionsCollection.contributionCalendar.totalContributions;
        document.getElementById('contributions-count').innerHTML = `<i class="fa-solid fa-calendar-days"></i> Contributions in the last year: ${contributionsCount}`;
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('contributions-count').innerHTML = '';
    }
}
