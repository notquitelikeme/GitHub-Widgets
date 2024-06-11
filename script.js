document.addEventListener('DOMContentLoaded', () => {
    const username = 'Murash-ops'; // Replace with the GitHub username
    const token = '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'; // Replace with your personal access token

    // Fetch GitHub profile data and repositories
    Promise.all([
        fetch(`https://api.github.com/users/${username}`).then(res => res.json()),
        fetch(`https://api.github.com/users/${username}/repos`).then(res => res.json())
    ])
        .then(([profileData, repos]) => {
            document.getElementById('avatar').src = profileData.avatar_url;
            document.getElementById('name').textContent = profileData.name || profileData.login;
            document.getElementById('username').textContent = `@${profileData.login}`;
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

            // Format the creation date to "Day Month Year"
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = createdAt.toLocaleDateString(undefined, options);

            const accountAge = `${years} years, ${months} months`;
            document.getElementById('account-age').textContent = `User Since ${formattedDate} ▪ (${accountAge})`;


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

    // Fetch GitHub contributions in the last year
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
                return;
            }

            const contributionsCount = data.data.user.contributionsCollection.contributionCalendar.totalContributions;
            document.getElementById('contributions-count').innerHTML = `<i class="fa-solid fa-calendar-days"></i> Contributions in the last year: ${contributionsCount}`;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    getContributions(username, token);
});