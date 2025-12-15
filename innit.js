document.addEventListener('DOMContentLoaded', () => {

    const head = document.head;

    const metaCharset = document.createElement('meta');
    metaCharset.setAttribute('charset', 'UTF-8');
    head.prepend(metaCharset);

    const metaViewport = document.createElement('meta');
    metaViewport.setAttribute('name', 'viewport');
    metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    head.appendChild(metaViewport);

    const metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', 'ELEGANZA: Din webbshop för mode, stil och accessoarer. Handla kläder, smycken och mer för att öka din självkänsla.');
    head.appendChild(metaDescription);

    const title = document.createElement('title');
    title.textContent = "ELEGANZA";
    const existingTitle = head.querySelector('title');
    if (existingTitle) {
        existingTitle.textContent = title.textContent;
    } else {
        head.appendChild(title);
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'styles.css';
    head.appendChild(link);

    const nav = document.createElement('nav');
    nav.classList.add('main-nav');

    const linkContainer = document.createElement('div');
    linkContainer.classList.add('nav-links');

    const links = [
        ["index.html", "Hem"],
        ["produkter.html", "Produkter"],
        ["betalning.html", "Betalning"],
        ["policy.html", "Policy"],
        ["om-oss.html", "Om oss"],
        ["kontakt.html", "Kontakt"]
    ];

    links.forEach(linkData => {
        const a = document.createElement('a');
        a.href = linkData[0];
        a.textContent = linkData[1];
        linkContainer.appendChild(a);
    });

    nav.appendChild(linkContainer);

    const navActionsRight = document.createElement('div');
    navActionsRight.classList.add('navigation-bar', 'nav-actions-right');

    const cartIcon = document.createElement('a');
    cartIcon.href = 'kundvagn.html';
    cartIcon.classList.add('action-icon', 'large-cart');
    cartIcon.setAttribute('aria-label', 'Kundvagn/Kasse');
    cartIcon.textContent = '🛒';

    navActionsRight.appendChild(cartIcon);

    nav.appendChild(navActionsRight);

    if (document.body) {
        document.body.prepend(nav);
    }

    const footerData = {
        heading: "Kontakt",
        contactPerson: "Mohannad Zkhoul",
        email: "eleganzaforconfidence@gmail.com",
        phone: "073123409",
        message: "Hör av dig vid önskemål eller frågor!"
    };

    const footer = document.createElement('footer');
    footer.classList.add('footer');

    const h3 = document.createElement('h3');
    h3.textContent = footerData.heading;
    footer.appendChild(h3);
    footer.appendChild(document.createElement('br'));
    footer.appendChild(document.createElement('br'));
    footer.appendChild(document.createElement('br'));

    const p1 = document.createElement('p');
    p1.textContent = `Kontaktperson: ${footerData.contactPerson}`;
    footer.appendChild(p1);
    footer.appendChild(document.createElement('br'));
    footer.appendChild(document.createElement('br'));
    footer.appendChild(document.createElement('br'));

    const aEmail = document.createElement('a');
    aEmail.href = `mailto:${footerData.email}`;
    aEmail.textContent = `Mejl: ${footerData.email}`;
    footer.appendChild(aEmail);

    footer.appendChild(document.createElement('br'));
    footer.appendChild(document.createElement('br'));
    footer.appendChild(document.createElement('br'));


    const aPhone = document.createElement('a');
    aPhone.href = "tel:" + footerData.phone;
    aPhone.textContent = `Telefon: ${footerData.phone}`;
    footer.appendChild(aPhone);
    footer.appendChild(document.createElement('br'));
    footer.appendChild(document.createElement('br'));
    footer.appendChild(document.createElement('br'));

    const p2 = document.createElement('p');
    p2.textContent = footerData.message;
    footer.appendChild(p2);

    if (document.body) {
        document.body.appendChild(footer);
    }
});