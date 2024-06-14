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
        "JavaScript": "#f1e05a",
        "HTML": "#e34c26",
        "CSS": "#563d7c",
        "Python": "#3572A5",
        "Java": "#b07219",
        "Kotlin": "#A97BFF",
        "C++": "#f34b7d",
        "Ruby": "#701516",
        "Shell": "#89e051",
        "TypeScript": "#2b7489",
        "Hack": "#878787",
        "PHP": "#4F5D95",
        "Perl": "#0298c3",
        "R": "#198ce7",
        "Swift": "#ffac45",
        "Rust": "#dea584",
        "Go": "#00ADD8",
        "Scala": "#DC322F",
        "Haskell": "#5e5086",
        "C#": "#178600",
        "C": "#555555",
        "Dart": "#00B4AB",
        "Objective-C": "#438eff",
        "Vim script": "#199f4b",
        "Lua": "#000080",
        "MATLAB": "#e16737",
        "SQL": "#e38c00",
        "Pascal": "#E3F171",
        "Ada": "#02f88c",
        "Fortran": "#4d41b1",
        "Julia": "#a270ba",
        "COBOL": "#9e9700",
        "Assembly": "#6E4C13",
        "Racket": "#22228f",
        "Prolog": "#74283c",
        "Erlang": "#B83998",
        "Elixir": "#6e4a7e",
        "Tcl": "#e4cc98",
        "VBScript": "#15dcdc",
        "F#": "#b845fc",
        "Crystal": "#000100",
        "OCaml": "#3be133",
        "Groovy": "#e69f56",
        "D": "#ba595e",
        "Common Lisp": "#3fb68b",
        "Scheme": "#1e4aec",
        "Perl 6": "#0000fb",
        "Smalltalk": "#596706",
        "CoffeeScript": "#244776",
        "TeX": "#3D6117",
        "PureScript": "#1D222D",
        "VHDL": "#adb2cb",
        "Verilog": "#b2b7f8",
        "ABAP": "#E8274B",
        "ActionScript": "#882B0F",
        "Alloy": "#64C800",
        "SCSS": "#2ACCA8",
        "Arc": "#aa2afe",
        "AspectJ": "#a957b0",
        "V": "#6594b9",
        "Batchfile": "#C1F12E",
        "Bison": "#6A463F",
        "BlitzBasic": "#cd6400",
        "BlitzMax": "#cd6400",
        "Boo": "#d4bec1",
        "Brainfuck": "#2F2530",
        "Chapel": "#8dc63f",
        "Clojure": "#db5855",
        "CUDA": "#3A4E3A",
        "Cython": "#fedf5b",
        "Dylan": "#6c616e",
        "Eiffel": "#946d57",
        "Emacs Lisp": "#c065db",
        "Forth": "#341708",
        "GAMS": "#f49a22",
        "Gherkin": "#5B2063",
        "GLSL": "#5686a5",
        "GML": "#71b417",
        "Harbour": "#0e60e3",
        "Haxe": "#df7900",
        "IDL": "#a3522f",
        "Io": "#a9188d",
        "Isabelle": "#FEFE00",
        "J": "#9EEDD7",
        "Jasmin": "#d03600",
        "JavaScript+ERB": "#fff1c2",
        "Jinja": "#a52a22",
        "JSONiq": "#40d47e",
        "KRL": "#28431f",
        "LabVIEW": "#fede06",
        "Lasso": "#999999",
        "LiveScript": "#499886",
        "LLVM": "#185619",
        "Logos": "#6c616e",
        "Logtalk": "#295b9a",
        "LoomScript": "#ffaabb",
        "LSL": "#3d9970",
        "M": "#8b0029",
        "Mercury": "#ff2b2b",
        "Mirah": "#c7a938",
        "Modula-3": "#223388",
        "Monkey": "#e54b4a",
        "Moocode": "#c7a938",
        "MTML": "#b7e1f4",
        "NCL": "#28431f",
        "Nim": "#37775b",
        "Nit": "#009917",
        "Nu": "#c9df40",
        "NumPy": "#bdaa00",
        "Objective-J": "#ff0c5a",
        "OCaml": "#3be133",
        "Omgrofl": "#cabbff",
        "ooc": "#b0b77e",
        "OpenCL": "#ed2e2d",
        "OpenEdge ABL": "#5ce600",
        "Oz": "#fab738",
        "Parrot": "#f3ca0a",
        "Pawn": "#dbb284",
        "Pep8": "#c76f5b",
        "PigLatin": "#fcd7de",
        "Pike": "#005390",
        "PLpgSQL": "#dad8d8",
        "PogoScript": "#d80074",
        "Propeller Spin": "#7fa2a7",
        "Pure Data": "#91de79",
        "QML": "#44a51c",
        "Ragel in Ruby Host": "#9d5200",
        "RAML": "#77d9fb",
        "Rebol": "#358a5b",
        "Red": "#ee0000",
        "Ren'Py": "#ff7f7f",
        "Rouge": "#cc0088",
        "SaltStack": "#646464",
        "SAS": "#B34936",
        "Shen": "#120F14",
        "Slash": "#007eff",
        "Slim": "#ff8f77",
        "SourcePawn": "#5c7611",
        "SQF": "#3F3F3F",
        "Squirrel": "#800000",
        "Stan": "#b2011d",
        "Standard ML": "#dc566d",
        "SuperCollider": "#46390b",
        "Gnuplot": "#DAE1C2",
        "Turing": "#45f715",
        "Dockerfile": "#ab69a1",
        "Makefile": "#a54c4d",
        "Vala": "#fbe5cd",
        "Volt": "#1F1F1F",
        "Vue": "#2c3e50",
        "wisp": "#7582D1",
        "X10": "#4B6BEF",
        "xBase": "#403a40",
        "XC": "#99DA07",
        "XQuery": "#5232e7",
        "Smarty": "#118f9e",
        "Other": "#c1c1c1"
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

function fetchGitHubData1(owner, repo) {
    displayRepoWidget(owner, repo);
}

function getQueryParams() {
    const params = {};
    const queryString = window.location.search.slice(1);
    const pairs = queryString.split('&');

    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        params[key] = decodeURIComponent(value || '');
    });

    return params;
}

window.onload = function() {
    const params = getQueryParams();
    const owner = params.owner;
    const repo = params.repo;

    if (owner && repo) {
        fetchGitHubData1(owner, repo);
    }
};

// Hide the repository widget when the input is cleared
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('repo-input').addEventListener('input', () => {
        const input = document.getElementById('repo-input').value.trim();
        if (input === '') {
            document.getElementById('repo-widget').style.display = 'none';
            document.getElementById('error-message1').innerText = '';
        }
    })
});
