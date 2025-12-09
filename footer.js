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

const p1 = document.createElement('p');
p1.textContent = `Kontaktperson: ${footerData.contactPerson}`;
footer.appendChild(p1);

const aEmail = document.createElement('a');
aEmail.href = `mailto:${footerData.email}`;
aEmail.textContent = `Mejl: ${footerData.email}`;
footer.appendChild(aEmail);

footer.appendChild(document.createElement('br'));

const aPhone = document.createElement('a');
aPhone.href = "tel:" + footerData.phone;
aPhone.textContent = `Telefon: ${footerData.phone}`;
footer.appendChild(aPhone);

footer.appendChild(document.createElement('br'));
footer.appendChild(document.createElement('br'));

const p2 = document.createElement('p');
p2.textContent = footerData.message;
footer.appendChild(p2);
document.body.appendChild(footer);