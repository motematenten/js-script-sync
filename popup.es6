const nilError = (element) => {
    if (!element) {
        console.error(`${element} must not be nil`);
        return true;
    }
};

const execute = (script) => {
    eval(script);
};

document.addEventListener('DOMContentLoaded', function(){
    const syncButton = document.getElementById('js-sync-button');
    if (nilError(syncButton)) {
        return;
    }

    syncButton.addEventListener('click', () => {
        const urlString = document.getElementById('js-url-input').value;
        if (nilError(urlString)) {
            return;
        }

        const filename = document.getElementById('js-filename-input').value;
        if (nilError(filename)) {
            return;
        }

        const parsedUrl = new URL(urlString);

        if (parsedUrl.hostname !== 'gist.github.com') {
            console.error('this url is not gist');
            return;
        }

        const gistId = parsedUrl.pathname.split('/')[2];
        const apiUrl = `https://api.github.com/gists/${gistId}`;

        fetch(apiUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response);
                }
            })
            .then(json => {
                return json.files[filename].content;
            })
            .then(gistScript => {
                execute(gistScript);
            })
            .catch(error => {
                console.error(error)
            });
    });
});
