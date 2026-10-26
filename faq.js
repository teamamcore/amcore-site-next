(function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const questions = [...document.querySelectorAll('.faq .ask')];
    if (!questions.length) return;

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

    async function typeAnswer(answer) {
        const nodes = textNodes(answer);
        const saved = nodes.map((node) => node.textContent);
        const count = saved.reduce((sum, text) => sum + text.trim().length, 0);
        const speed = speedFor(count);
        nodes.forEach((node) => { node.textContent = ''; });
        answer.hidden = false;
        for (let i = 0; i < nodes.length; i += 1) {
            const source = saved[i];
            const target = nodes[i];
            if (!source.trim()) {
                target.textContent = source;
                continue;
            }
            for (let c = 0; c < source.length; c += 1) {
                target.textContent += source[c];
                await wait(speed);
            }
        }
    }

    questions.forEach((button) => {
        const answer = document.getElementById(button.getAttribute('aria-controls'));
        if (!answer) return;
        button.addEventListener('click', () => {
            if (answer.dataset.typed === 'done') {
                const show = answer.hidden;
                answer.hidden = !show;
                button.setAttribute('aria-expanded', show ? 'true' : 'false');
                return;
            }
            if (answer.dataset.open === 'yes') return;
            answer.dataset.open = 'yes';
            button.setAttribute('aria-expanded', 'true');
            if (reduce) {
                answer.hidden = false;
                answer.dataset.typed = 'done';
                return;
            }
            typeAnswer(answer).then(() => { answer.dataset.typed = 'done'; });
        });
    });
})();
