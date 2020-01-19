postLoading = () => {
    return new Promise(async (resolve) => {
        const app = document.querySelector('ion-app');
        if (app) {
            app.classList.remove('loading');
        }

        await initButtons();
        await initSreenshot();
        await initEmbedMode();

        resolve();
    });
};

function initButtons() {
    return new Promise((resolve) => {
        if (!document) {
            resolve();
            return;
        }

        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('play').addEventListener('click', playPause('play', true));
            document.getElementById('pause').addEventListener('click', playPause('pause', true));
            document.getElementById('previous').addEventListener('click', previousSlide);
            document.getElementById('next').addEventListener('click', nextSlide);
            document.getElementById('slidePicker').addEventListener('click', presentSlidePicker);
            document.getElementById('toggleFulScreen').addEventListener('click', toggleFullScreen);

            document.getElementById('actions').addEventListener('click', openMenu(event));
        }, {once: true});

        resolve();
    });
}

function initSreenshot() {
    return new Promise((resolve) => {
        if (!window || !window.location) {
            resolve();
            return;
        }

        const url = new URL(window.location.href);
        const screenshot = url && url.searchParams ? url.searchParams.has('screenshot') : false;

        if (screenshot) {
            const navigation = document.querySelector('#navigation');

            if (navigation) {
                navigation.style.display = 'none';
            }

            const deck = document.querySelector('deckgo-deck');
            if (deck) {
                deck.style.setProperty('--pager-display', 'none');

                const actions = deck.querySelector('[slot="actions"]');
                if (actions) {
                    actions.style.display = 'none';
                }
            }
        }

        resolve();
    });
}

function initEmbedMode() {
    return new Promise((resolve) => {
        initEmbedded();

        if (EMBEDDED) {
            const slidePicker = document.querySelector('#slidePicker');

            if (slidePicker) {
                slidePicker.style.display = 'none';
            }

            const deck = document.querySelector('deckgo-deck');
            if (deck) {
                deck.style.setProperty('--pager-display', 'none');
            }
        }

        resolve();
    });
}
