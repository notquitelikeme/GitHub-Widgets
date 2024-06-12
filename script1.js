async function fetchRepoData(owner, repo) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch repo data: ${response.statusText}`);
    }
    return await response.json();
}

async function fetchRepoReadme(owner, repo) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
    if (!response.ok) {
        return "No README found";
    }
    const data = await response.json();
    return atob(data.content);
}

async function fetchRepoLanguages(owner, repo) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
    if (!response.ok) {
        throw new Error(`Failed to fetch repo languages: ${response.statusText}`);
    }
    return await response.json();
}

function generatePlaceholderImage(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '100px Kanit';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    return canvas.toDataURL();
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function calculateLanguagePercentages(languages) {
    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    return Object.entries(languages).map(([language, bytes]) => ({
        language,
        percentage: ((bytes / totalBytes) * 100).toFixed(1)
    }));
}

function createLanguageBar(languages) {
    const languageBar = document.getElementById('language-bar');
    languageBar.innerHTML = '';

    const colorMapping = {
        'JavaScript': '#f1e05a',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Python': '#3572A5',
        'Java': '#b07219',
        'Kotlin': '#b74ce4',
        'C++': '#f34b7d',
        'Ruby': '#701516',
        'Shell': '#89e051',
        'TypeScript': '#2b7489',
        'Hack': '#f0f0f0',
        'Other': '#c1c1c1'
    };

    languages.forEach(lang => {
        const langDiv = document.createElement('div');
        langDiv.style.width = `${lang.percentage}%`;
        langDiv.style.backgroundColor = colorMapping[lang.language] || colorMapping['Other'];
        langDiv.title = `${lang.language}: ${lang.percentage}%`;
        languageBar.appendChild(langDiv);
    });

    return colorMapping;
}

function createLanguageList(languages, colorMapping) {
    const languageListContainer = document.getElementById('repo-languages');
    languageListContainer.innerHTML = '';  // Clear previous list

    const languageList = document.createElement('ul');
    languageList.className = 'language-list';

    languages.forEach(lang => {
        const listItem = document.createElement('li');
        const colorBox = document.createElement('div');
        colorBox.className = 'language-color';
        colorBox.style.backgroundColor = colorMapping[lang.language] || colorMapping['Other'];
        const text = document.createElement('span');
        text.innerText = `${lang.language}: ${lang.percentage}%`;
        listItem.appendChild(colorBox);
        listItem.appendChild(text);
        languageList.appendChild(listItem);
    });

    languageListContainer.appendChild(languageList);
}

async function displayRepoWidget(owner, repo) {
    try {
        const repoData = await fetchRepoData(owner, repo);
        const repoReadme = await fetchRepoReadme(owner, repo);
        const repoLanguages = await fetchRepoLanguages(owner, repo);

        const languagePercentages = calculateLanguagePercentages(repoLanguages);

        document.getElementById('repo-name').innerText = repoData.name;
        document.getElementById('repo-owner').innerHTML = `<i class="fa-solid fa-person-circle-check"></i> Repository Owner: ${repoData.owner.login}`;
        document.getElementById('repo-watch').innerText = `${repoData.watchers_count} Watching`;
        document.getElementById('repo-stars').innerText = `${repoData.stargazers_count} Stars`;
        document.getElementById('repo-forks').innerText = `${repoData.forks_count} Forks`;
        document.getElementById('repo-created').innerHTML = `<i class="fa-regular fa-square-plus"></i> Created on ${formatDate(repoData.created_at)}`;
        document.getElementById('repo-updated').innerHTML = `<i class="fa-solid fa-wrench"></i> Last updated on ${formatDate(repoData.updated_at)}`;
        document.getElementById('repo-readme').innerText = repoReadme;
        document.getElementById('repo-link').href = repoData.html_url;

        const colorMapping = createLanguageBar(languagePercentages);
        createLanguageList(languagePercentages, colorMapping);

        const img = new Image();
        img.src = repoData.open_graph_image_url || generatePlaceholderImage(repoData.name);
        img.onload = () => {
            document.getElementById('repo-image').src = img.src;
        };

        // Show the repository widget
        document.getElementById('repo-widget').style.display = 'block';
    } catch (error) {
        document.getElementById('error-message1').innerText = `Error fetching repository data: ${error.message}`;
        console.error('Error fetching repository data:', error);
        
        // Hide the repository widget if there was an error
        document.getElementById('repo-widget').style.display = 'none';
    }
}

function fetchGitHubData1() {
    const input = document.getElementById('repo-input').value.trim();
    const [owner, repo] = input.split('/');
    if (owner && repo) {
        displayRepoWidget(owner, repo);
    } else {
        document.getElementById('error-message1').innerText = 'Invalid input. Please use the format "Username/Repo-name".';
        
        // Hide the repository widget if the input is invalid
        document.getElementById('repo-widget').style.display = 'none';
    }
}

// Hide the repository widget when the input is cleared
document.getElementById('repo-input').addEventListener('input', () => {
    const input = document.getElementById('repo-input').value.trim();
    if (input === '') {
        document.getElementById('repo-widget').style.display = 'none';
        document.getElementById('error-message1').innerText = '';
    }
});
