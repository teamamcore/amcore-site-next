(function () {
    if (!document.querySelector('section.invite')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const style = document.createElement('style');
    style.textContent = [
        '.type-slot { display: grid; }',
        'h1 .type-slot, h2 .type-slot, h3 .type-slot, p .type-slot, li .type-slot { display: grid; width: 100%; }',
        '.type-full, .type-live { grid-area: 1 / 1; display: block; }',
        'h1 .type-full, h1 .type-live, h2 .type-full, h2 .type-live, h3 .type-full, h3 .type-live, p .type-full, p .type-live, li .type-full, li .type-live { display: block; }',
        '.type-full { visibility: hidden; }'
    ].join('');
    document.head.appendChild(style);

    const selector = 'h1, h2, h3, p, li';
    const blocks = [...document.querySelectorAll(selector)].filter((el) => {
        if (el.closest('header, footer, .hp')) return false;
        if (el.classList.contains('count')) return false;
        if (el.querySelector(selector)) return false;
        return (el.innerText || '').trim().length > 0;
    });
    if (!blocks.length) return;

    const sections = [...document.querySelectorAll('section')];
    const snap = getComputedStyle(document.documentElement).scrollSnapType.includes('mandatory');
    const end = document.querySelector('section.close .book') || document.querySelector('button.send');
    let stopped = false;

    blocks.forEach((el) => {
        const label = el.innerText.trim();
        if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', label);
        const full = document.createElement('span');
        full.className = 'type-full';
        full.setAttribute('aria-hidden', 'true');
        while (el.firstChild) full.appendChild(el.firstChild);
        const live = full.cloneNode(true);
        live.className = 'type-live';
        live.setAttribute('aria-hidden', 'true');
        [...live.querySelectorAll('*'), live].forEach((node) => {
            [...node.childNodes].forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) child.textContent = '';
            });
        });
        const slot = document.createElement('span');
        slot.className = 'type-slot';
        slot.append(full, live);
        el.appendChild(slot);
        el._live = live;
        el.dataset.typed = 'wait';
    });

    const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

    const textNodes = (root) => {
        const nodes = [];
        const walk = (node) => {
            node.childNodes.forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) nodes.push(child);
                else if (child.nodeType === Node.ELEMENT_NODE) walk(child);
            });
        };
        walk(root);
        return nodes;
    };

    const speedFor = (count) => (count > 160 ? 11 : count > 70 ? 18 : 34);

    async function typeBlock(el) {
        if (el.dataset.typed === 'done') return;
        if (el._job) return el._job;
        el.dataset.typed = 'active';
        el._job = (async () => {
            const fullNodes = textNodes(el.querySelector('.type-full'));
            const liveNodes = textNodes(el._live);
            const count = fullNodes.reduce((sum, node) => sum + node.textContent.length, 0);
            const speed = speedFor(count);
            for (let i = 0; i < fullNodes.length; i += 1) {
                const source = fullNodes[i].textContent;
                const target = liveNodes[i];
                if (!source.trim()) {
                    target.textContent = source;
                    continue;
                }
                for (let c = 0; c < source.length; c += 1) {
                    target.textContent += source[c];
                    await wait(speed);
                }
            }
            el.dataset.typed = 'done';
        })();
        return el._job;
    }

    const inView = (el) => {
        const box = el.getBoundingClientRect();
        return box.top < window.innerHeight * 0.86 && box.bottom > 72;
    };

    const endIsOnScreen = () => {
        if (!end) return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
        const box = end.getBoundingClientRect();
        return box.top < window.innerHeight * 0.8 && box.bottom > 72;
    };

    const stop = () => { stopped = true; };
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('keydown', (event) => {
        if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(event.key)) stop();
    });

    const pendingIn = (section) => blocks.filter((el) => el.closest('section') === section && el.dataset.typed !== 'done' && (snap || inView(el)));

    async function typeReady() {
        const visible = blocks.filter((el) => el.dataset.typed !== 'done' && inView(el));
        for (const el of visible) await typeBlock(el);
    }

    async function playSnap() {
        for (const section of sections) {
            if (stopped) return;
            if (section !== sections[0]) {
                section.scrollIntoView();
                await wait(80);
            }
            for (const el of pendingIn(section)) await typeBlock(el);
            await wait(1400);
        }
    }

    async function playDocument() {
        while (!stopped) {
            const pending = blocks.filter((el) => el.dataset.typed !== 'done' && inView(el));
            if (pending.length) {
                for (const el of pending) await typeBlock(el);
                await wait(420);
                continue;
            }
            if (endIsOnScreen() || window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) break;
            const before = window.scrollY;
            window.scrollBy({ top: Math.round(window.innerHeight * 0.55), behavior: 'smooth' });
            await wait(1100);
            if (Math.abs(window.scrollY - before) < 4) break;
        }
        if (!stopped) await typeReady();
    }

    const seen = new IntersectionObserver((entries) => {
        if (!stopped) return;
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            pendingIn(entry.target).forEach((el) => { typeBlock(el); });
        });
    }, { threshold: 0.5 });
    sections.forEach((section) => seen.observe(section));

    if (snap) playSnap();
    else playDocument();
})();
