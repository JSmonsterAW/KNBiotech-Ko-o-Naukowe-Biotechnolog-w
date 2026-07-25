"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initialiseMobileMenu();
    initialiseBackToTopButton();
    initialiseImageFallbacks();
    initialiseActiveNavigation();
    initialiseDynamicNavigation();
    initialiseProjectLibrary();
    initialiseCitationButtons();
    initialiseLinkedProject();
    /*initialiseMembershipForm();*/
});


/* =========================
   MOBILE MENU
========================= */

function initialiseMobileMenu() {
    const menuButton = document.querySelector("#menu-button");
    const navLinks = document.querySelector("#nav-links");

    if (!menuButton || !navLinks) {
        return;
    }

    menuButton.addEventListener("click", () => {
        const menuIsOpen = navLinks.classList.toggle("open");

        menuButton.classList.toggle("open", menuIsOpen);

        menuButton.setAttribute(
            "aria-expanded",
            String(menuIsOpen)
        );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuButton.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", (event) => {
        const clickedOutside =
            !navLinks.contains(event.target) &&
            !menuButton.contains(event.target);

        if (clickedOutside) {
            navLinks.classList.remove("open");
            menuButton.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
        }
    });
}


/* =========================
   BACK TO TOP
========================= */

function initialiseBackToTopButton() {
    const button = document.querySelector("#back-to-top");

    if (!button) {
        return;
    }

    window.addEventListener("scroll", () => {
        button.classList.toggle(
            "visible",
            window.scrollY > 450
        );
    });

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* =========================
   IMAGE FALLBACKS
========================= */

function initialiseImageFallbacks() {
    const images = document.querySelectorAll(
        ".hero-image-card img, .activity-image img, .gallery-item img"
    );

    images.forEach((image) => {
        image.addEventListener("load", () => {
            image.style.display = "block";
        });

        image.addEventListener("error", () => {
            image.style.display = "none";
        });
    });
}


/* ==========================================

   ACTIVE NAVIGATION LINK

========================================== */

function initialiseActiveNavigation() {

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const navigationLinks =
        document.querySelectorAll(".nav-links a");

    navigationLinks.forEach((link) => {
        const page =
            link.getAttribute("href");

        if (page === currentPage) {
            link.classList.add("active");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initialiseActiveNavigation();
});



/* ==========================================
   DYNAMIC ISLAND NAVIGATION
========================================== */

function initialiseDynamicNavigation() {
    const header = document.querySelector("#site-header");

    if (!header) {
        return;
    }

    function updateNavigation() {
        const hasScrolled = window.scrollY > 60;

        header.classList.toggle("is-scrolled", hasScrolled);
    }

    updateNavigation();

    window.addEventListener("scroll", updateNavigation, {
        passive: true
    });
}






/* ==========================================
   PROJECT LIBRARY
========================================== */

function initialiseProjectLibrary() {
    const projects = document.querySelectorAll(".research-project");
    const searchInput = document.querySelector("#project-search");
    const filterButtons = document.querySelectorAll(".project-filter");
    const emptyMessage = document.querySelector("#project-empty-message");

    if (!projects.length) {
        return;
    }

    projects.forEach((project) => {
        const expandButton = project.querySelector(
            ".project-expand-button"
        );

        if (!expandButton) {
            return;
        }

        expandButton.addEventListener("click", () => {
            const isExpanded =
                project.classList.toggle("is-expanded");

            updateProjectButton(
                expandButton,
                isExpanded
            );
        });
    });

    let activeFilter = "all";

    function filterProjects() {
        const searchValue = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        let visibleCount = 0;

        projects.forEach((project) => {
            const categories =
                (project.dataset.category || "").split(" ");

            const searchableContent = [
                project.dataset.search || "",
                project.textContent
            ]
                .join(" ")
                .toLowerCase();

            const matchesFilter =
                activeFilter === "all" ||
                categories.includes(activeFilter);

            const matchesSearch =
                !searchValue ||
                searchableContent.includes(searchValue);

            const shouldDisplay =
                matchesFilter && matchesSearch;

            project.hidden = !shouldDisplay;

            if (shouldDisplay) {
                visibleCount += 1;
            }
        });

        if (emptyMessage) {
            emptyMessage.hidden = visibleCount > 0;
        }
    }

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            filterProjects
        );
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");
            activeFilter = button.dataset.filter || "all";

            filterProjects();
        });
    });
}


function updateProjectButton(button, isExpanded) {
    button.setAttribute(
        "aria-expanded",
        String(isExpanded)
    );

    const label = button.querySelector(
        ".project-expand-label"
    );

    if (label) {
        label.textContent = isExpanded
            ? "Ukryj szczegóły projektu"
            : "Poznaj projekt";
    }

    const icon = button.querySelector(
        ".project-expand-icon"
    );

    if (icon) {
        icon.textContent = isExpanded ? "↑" : "↓";
    }
}


/* ==========================================
   OPEN LINKED PROJECT
========================================== */

function initialiseLinkedProject() {
    const projectId = window.location.hash;

    if (!projectId) {
        return;
    }

    const project = document.querySelector(projectId);

    if (
        !project ||
        !project.classList.contains("research-project")
    ) {
        return;
    }

    project.classList.add("is-expanded");

    const expandButton = project.querySelector(
        ".project-expand-button"
    );

    if (expandButton) {
        updateProjectButton(
            expandButton,
            true
        );
    }

    window.setTimeout(() => {
        const header = document.querySelector(
            ".site-header"
        );

        const headerHeight =
            header?.getBoundingClientRect().height || 100;

        const projectPosition =
            project.getBoundingClientRect().top +
            window.scrollY -
            headerHeight -
            25;

        window.scrollTo({
            top: projectPosition,
            behavior: "smooth"
        });
    }, 250);
}











/* ==========================================
   MEMBERSHIP APPLICATION FORM
========================================== */

/*function initialiseMembershipForm() {
    const form = document.querySelector("#membership-form");
    const status = document.querySelector("#form-status");

    if (!form) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();

            showMembershipFormStatus(
                status,
                "Uzupełnij wszystkie wymagane pola formularza.",
                "error"
            );

            return;
        }

        const formData = new FormData(form);

        const selectedInterests = Array.from(
            form.querySelectorAll(
                'input[name="interests"]:checked'
            )
        ).map((checkbox) => checkbox.value);

        const fullName =
            formData.get("fullName")?.trim() || "";

        const email =
            formData.get("email")?.trim() || "";

        const phone =
            formData.get("phone")?.trim() || "Nie podano";

        const faculty =
            formData.get("faculty")?.trim() || "";

        const studyProgramme =
            formData.get("studyProgramme")?.trim() || "";

        const studyYear =
            formData.get("studyYear") || "Nie podano";

        const studyLevel =
            formData.get("studyLevel") || "Nie podano";

        const experience =
            formData.get("experience")?.trim() ||
            "Nie podano";

        const motivation =
            formData.get("motivation")?.trim() || "";

        const availability =
            formData.get("availability")?.trim() ||
            "Nie podano";

        const subject =
            `Zgłoszenie do KNBiotech – ${fullName}`;

        const body = `
Dzień dobry,

chciałabym/chciałbym zgłosić chęć dołączenia do Koła Naukowego Biotechnologów KNBiotech.

DANE KANDYDATA

Imię i nazwisko:
${fullName}

Adres e-mail:
${email}

Numer telefonu:
${phone}

Wydział:
${faculty}

Kierunek studiów:
${studyProgramme}

Rok studiów:
${studyYear}

Poziom studiów:
${studyLevel}

OBSZARY ZAINTERESOWAŃ

${selectedInterests.length
    ? selectedInterests.join(", ")
    : "Nie wskazano"}

DOTYCHCZASOWE DOŚWIADCZENIE

${experience}

CO CHCIAŁABYM/CHCIAŁBYM ROBIĆ W KNBIOTECH?

${motivation}

PRZYBLIŻONA DOSTĘPNOŚĆ

${availability}

Wyrażam zgodę na wykorzystanie powyższych informacji w celu kontaktu dotyczącego członkostwa w KNBiotech.

Pozdrawiam,
${fullName}
        `.trim();

        const recipients = [
            "s226911@sggw.edu.pl",
            "s220956@sggw.edu.pl"
        ].join(",");

        const mailtoUrl =
            `mailto:${recipients}` +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;

        showMembershipFormStatus(
            status,
            "Wiadomość została przygotowana. Otwieranie aplikacji pocztowej…",
            "success"
        );

        window.location.href = mailtoUrl;
    });

    form.addEventListener("reset", () => {
        if (status) {
            status.className = "form-status form-field-full";
            status.textContent = "";
        }
    });
}*/


function showMembershipFormStatus(
    statusElement,
    message,
    type
) {
    if (!statusElement) {
        return;
    }

    statusElement.textContent = message;

    statusElement.className =
        `form-status form-field-full is-${type}`;
}





document.addEventListener("DOMContentLoaded", function () {
    const membershipForm =
        document.getElementById("membership-form");

    if (!membershipForm) {
        console.error(
            'Nie znaleziono formularza z id="membership-form".'
        );

        return;
    }

    membershipForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!membershipForm.checkValidity()) {
            membershipForm.reportValidity();
            return;
        }

        const fullName =
            document.getElementById("full-name")?.value.trim() || "";

        const email =
            document.getElementById("email")?.value.trim() || "";

        const phone =
            document.getElementById("phone")?.value.trim() ||
            "Nie podano";

        const faculty =
            document.getElementById("faculty")?.value.trim() || "";

        const studyProgramme =
            document.getElementById("study-programme")?.value.trim() || "";

        const studyYear =
            document.getElementById("study-year")?.value ||
            "Nie podano";

        const studyLevel =
            document.getElementById("study-level")?.value ||
            "Nie podano";

        const experience =
            document.getElementById("experience")?.value.trim() ||
            "Nie podano";

        const motivation =
            document.getElementById("motivation")?.value.trim() || "";

        const availability =
            document.getElementById("availability")?.value.trim() ||
            "Nie podano";

        const selectedInterests = Array.from(
            membershipForm.querySelectorAll(
                'input[name="interests"]:checked'
            )
        ).map(function (checkbox) {
            return checkbox.value;
        });

        const subject =
            `Zgłoszenie do KNBiotech – ${fullName}`;

        const message = [
            "Dzień dobry,",
            "",
            "chciałabym/chciałbym zgłosić chęć dołączenia do KNBiotech.",
            "",
            "DANE KANDYDATA",
            "",
            `Imię i nazwisko: ${fullName}`,
            `Adres e-mail: ${email}`,
            `Numer telefonu: ${phone}`,
            `Wydział: ${faculty}`,
            `Kierunek studiów: ${studyProgramme}`,
            `Rok studiów: ${studyYear}`,
            `Poziom studiów: ${studyLevel}`,
            "",
            "OBSZARY ZAINTERESOWAŃ",
            "",
            selectedInterests.length
                ? selectedInterests.join(", ")
                : "Nie wskazano",
            "",
            "DOTYCHCZASOWE DOŚWIADCZENIE",
            "",
            experience,
            "",
            "CO CHCIAŁABYM/CHCIAŁBYM ROBIĆ W KNBIOTECH?",
            "",
            motivation,
            "",
            "PRZYBLIŻONA DOSTĘPNOŚĆ",
            "",
            availability,
            "",
            "Pozdrawiam,",
            fullName
        ].join("\n");

        /*
         * Pierwszy odbiorca jest wpisany w polu „Do”,
         * a drugi w polu „DW/CC”. Taki zapis jest
         * lepiej obsługiwany przez różne aplikacje pocztowe.
         */
        const mailtoLink =
            "mailto:s226911@sggw.edu.pl" +
            "?cc=" +
            encodeURIComponent("s220956@sggw.edu.pl") +
            "&subject=" +
            encodeURIComponent(subject) +
            "&body=" +
            encodeURIComponent(message);

        window.location.assign(mailtoLink);
    });
});