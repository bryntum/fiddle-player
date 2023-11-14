import './lib/TutorialPanel.js';

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
    loadScript      = src => {
        return new Promise(resolve => {
            const script  = document.createElement('script');
            script.src    = src;
            script.onload = resolve;

            document.head.appendChild(script);
        });
    };

(async () => {
    const
        params = new URLSearchParams(location.search),
        code   = params.get('c');

    // Show logo
    Array.from(document.querySelectorAll('.slogan'))[Math.round(Math.random() * 6)].style.display = 'block';

    if (code) {
        const codePanel = document.getElementById('codePanel');

        codePanel.style.display          = 'flex';
        codePanel.dataset['initialCode'] = code;
    }
    else {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.13/ace.js');

        const
            wrap        = document.getElementById('wrap'),
            codeWrap    = document.getElementById('code-input'),
            editor      = ace.edit('code-input'),
            urlInput    = document.getElementById('url'),
            previewLink = document.getElementById('previewLink'),
            codeEl      = codeWrap.querySelector('.ace_content'),
            copyButton  = document.getElementById('copyToClipboard');

        wrap.style.display = 'flex';
        // editor.renderer.setPadding(10);
        // editor.renderer.setScrollMargin(10);
        editor.setTheme('ace/theme/monokai');
        editor.session.setMode('ace/mode/javascript');

        editor.focus();

        codeWrap.addEventListener('keyup', () => {
            const link     = `${location.href.split('?')[0]}?c=${encodeURIComponent(codeEl.innerText)}`;
            urlInput.value = previewLink.href = link;
        });

        urlInput.addEventListener('click', () => copyToClipboard(urlInput.value));
        copyButton.addEventListener('click', () => copyToClipboard(urlInput.value));
    }
})();
