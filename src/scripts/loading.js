postLoading = () => {
    return new Promise(async (resolve) => {
        const app = document.querySelector('ion-app');
        if (app) {
            app.classList.remove('loading');
        }

        await initSreenshot();

        resolve();
    });
};

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
    });
}
