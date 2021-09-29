import '../lib/TutorialPanel.js';

const
    copyToClipboard = (code) => {
        const textArea = document.createElement('textarea');

        textArea.value        = code;
        textArea.style.height = textArea.style.width = 0;
        document.body.appendChild(textArea);

        textArea.select();
        try {
            document.execCommand('copy');
        }
        catch (e) {
        }
        textArea.remove();
    },
    loadScript = src => {
        return new Promise(resolve => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;

            document.head.appendChild(script);
        });
    };

(async() => {
    const
        params = new URLSearchParams(location.search),
        code   = params.get('c');

    if (code) {
        const codePanel = document.getElementById('codePanel');

        codePanel.style.display = 'flex';
        codePanel.dataset['initialCode'] = code;
    }
    else {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js');

        const
            wrap =     document.getElementById('wrap'),
            codeWrap   = document.getElementById('code-input'),
            editor     = ace.edit('code-input'),
            urlInput   = document.getElementById('url'),
            codeEl     = codeWrap.querySelector('.ace_content'),
            copyButton = document.getElementById('copyToClipboard');

        wrap.style.display = 'flex';

        editor.setTheme('ace/theme/monokai');
        editor.session.setMode('ace/mode/javascript');

        editor.focus();

        codeWrap.addEventListener('keyup', () => {
            urlInput.value = `${location.href.split('?')[0]}?c=${encodeURIComponent(codeEl.innerText)}`;
        });

        urlInput.addEventListener('click', () => copyToClipboard(urlInput.value));
        copyButton.addEventListener('click', () => copyToClipboard(urlInput.value));
    }
})();
