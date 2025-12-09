const targetElement = document.body; 

const nav = document.createElement('nav');
nav.classList.add('main-nav'); 

const links = [
    ["index.html", "Hem"],
    ["produkter.html", "Produkter"],
    ["kundvagn.html", "Kundvagn"],
    ["betalning.html", "Betalning"],
    ["policy.html", "policy"],
    ["om-oss.html", "om oss"],
    ["kontakt.html", "kontakt"]
];

links.forEach(linkData => {
    const a = document.createElement('a');
    a.href = linkData[0]; 
    a.textContent = linkData[1]; 
    nav.appendChild(a); 
});

targetElement.prepend(nav);