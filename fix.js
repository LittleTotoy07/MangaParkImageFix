(() => {
    const domains = [
        "mpfip.org", "mpizz.org", "mpmok.org", "mpqom.org",
        "mpqsc.org", "mprnm.org", "mpubn.org", "mpujj.org",
        "mpvim.org", "mpypl.org"
    ];

    const servers = Array.from({ length: 10 }, (_, i) => "s" + String(i + 1).padStart(2, "0"));

    function tryFix(img) {
        const original = img.dataset.originalSrc || img.src;
        img.dataset.originalSrc = original;

        const parts = original.split(".org");
        if (parts.length < 2) return;
        const path = parts[1];

        const attempts = [];

        domains.forEach(domain => {
            servers.forEach(server => {
                attempts.push(`https://${server}.${domain}${path}`);
            });
        });

        let index = 0;

        function attemptNext() {
            if (index >= attempts.length) return;

            const testUrl = attempts[index++];
            const tester = new Image();

            tester.onload = () => { img.src = testUrl; };
            tester.onerror = attemptNext;

            tester.src = testUrl;
        }

        attemptNext();
    }

    function fixAll() {
        document.querySelectorAll("img").forEach(img => {
            if (!img.dataset.fixing) {
                img.dataset.fixing = "true";

                img.addEventListener("error", () => tryFix(img));

                if (!img.complete || img.naturalWidth === 0) {
                    tryFix(img);
                }
            }
        });
    }

    fixAll();

    const observer = new MutationObserver(fixAll);
    observer.observe(document.body, { childList: true, subtree: true });
})();
