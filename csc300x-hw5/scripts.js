/*
Name: Sebastian Duarte
Assignment: Assignment: CSC300x HW 5
File Contents:  Script file for GitHub Gallery using github API
*/


document.addEventListener('DOMContentLoaded', function(){
    const button = document.getElementById('searchRepos');
    button.addEventListener('click', function (){
        const gitUser = document.getElementById('gitUser').value;
        getRepositories (gitUser);
    });

    function getRepositories (gitUser){
        const repoAPI = `https://api.github.com/users/${gitUser}/repos`;

        fetch(repoAPI)
            .then (response => {
                if (!response.ok) {
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then (data => {
                changeGallery(data, gitUser);
            })
            .catch (error => console.error('Could not get repos', error));
    }

    function changeGallery (repos, gitUser){
        const galleryElement = document.getElementById('gallery');
        galleryElement.innerHTML = '';

        repos.forEach(repo => {
            const repoElement = document.createElement('div');
            repoElement.classList.add ('repo');

            const flexElement = document.createElement('div');
            flexElement.classList.add ('flex-container');

            const imageElement = document.createElement('img');
            imageElement.src = 'images/github-mark.png';
            imageElement.alt = 'GitHub Logo';

            const gitLink = document.createElement('a');
            gitLink.href = repo.html_url;
            gitLink.textContent = repo.name;

            const descElement = document.createElement('p');
            descElement.classList.add('description');
            descElement.textContent = repo.description || 'N/A';

            const createdAtElement = document.createElement('p');
            createdAtElement.textContent = 'Created at: ' + 
                new Date(repo.created_at).toLocaleDateString();
            
            const updatedAtElement = document.createElement ('p');
            updatedAtElement.textContent = 'Updated at: '+ 
                new Date(repo.updated_at).toLocaleDateString();
            
            const commitsElement = document.createElement('p');
            const commitsAPI = `https://api.github.com/repos/${gitUser}/${repo.name}/commits`;
            fetch (commitsAPI)
                .then (response => {
                    if (!response.ok) {
                        throw new Error ('Response not ok');
                    }
                    return response.json();
                })
                .then (data => {
                    const numberOfCommits = data.length;
                    commitsElement.textContent = 'Number of Commits: ' +
                        numberOfCommits;
                })
                .catch (error => console.error('Could not get commits', error));
            if (!commitsElement.textContent){
                commitsElement.textContent = 'Number of Commits: N/A'
            }
            
            const languageElement = document.createElement('p');
            languageElement.textContent = 'Languages: ' +  (repo.language ? repo.language : 'N/A');

            const watchersElement = document.createElement ('p');
            watchersElement.textContent = 'Watchers: ' + repo.watchers_count;

            flexElement.appendChild(imageElement);
            flexElement.appendChild(gitLink);

            repoElement.appendChild(flexElement);
            repoElement.appendChild(descElement);
            repoElement.appendChild(createdAtElement);
            repoElement.appendChild(updatedAtElement);
            repoElement.appendChild(commitsElement);
            repoElement.appendChild(languageElement);
            repoElement.appendChild(watchersElement);

            galleryElement.appendChild(repoElement);
        });
    }


})