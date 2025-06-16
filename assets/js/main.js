document.addEventListener('DOMContentLoaded', ready, false);

// TODO: make it so that moon cannot be seen for a brief moment?

const THEME_PREF_STORAGE_KEY = 'theme-preference';
const HIDDEN_ELEMENT_CLASS = 'hidden-element'
const THEME_TO_ICON_CLASS = {
    'dark': 'feather-moon',
    'light': 'feather-sun'
};
const THEME_TO_ICON_TEXT_CLASS = {
    'dark': 'Dark mode',
    'light': 'Light mode'
};
let darkThemeCss = '';

const HEADING_TO_TOC_CLASS = {
    'H1': 'level-1',
    'H2': 'level-2',
    'H3': 'level-3',
    'H4': 'level-4'
}

function ready() {
    setThemeByUserPref();

    // TODO: move this code to its corresponding page
    if (document.querySelector('main#content > .container') !== null &&
        document.querySelector('main#content > .container').classList.contains('post')) {
        if (document.getElementById('TableOfContents') !== null) {
            createScrollSpy();
        } 
    }

    document.getElementById('hamburger-menu-toggle').addEventListener('click', () => {
        const hamburgerMenu = document.getElementsByClassName('nav-hamburger-list')[0]
        const hamburgerMenuToggleTarget = document.getElementById('hamburger-menu-toggle-target')
        if (hamburgerMenu.classList.contains('visibility-hidden')) {
            hamburgerMenu.classList.remove('visibility-hidden');
            hamburgerMenuToggleTarget.setAttribute('aria-checked', 'true');
        } else {
            hamburgerMenu.classList.add('visibility-hidden');
            hamburgerMenuToggleTarget.setAttribute('aria-checked', 'false');
        }
    })
}

window.addEventListener('scroll', () => {
    if (window.innerWidth <= 820) {
        // For smaller screen, show shadow earlier
        toggleHeaderShadow(50);
    } else {
        toggleHeaderShadow(100);
    }
});

function createScrollSpy() {
    var elements = document.querySelectorAll('#toc a');
    document.addEventListener('scroll', function() {
        elements.forEach(function(element) {
            const boundingRect = document.getElementById(element.getAttribute('href').substring(1)).getBoundingClientRect();
            if (boundingRect.top <= 55 && boundingRect.bottom >= 0) {
                elements.forEach(function(elem) {
                    elem.classList.remove('active');
                });
                element.classList.add('active');
            }
        });
    });
}

function toggleHeaderShadow(scrollY) {
    if (window.scrollY > scrollY) {
        document.querySelectorAll('.header').forEach(function(item) {
            item.classList.add('header-shadow')
        })
    } else {
        document.querySelectorAll('.header').forEach(function(item) {
            item.classList.remove('header-shadow')
        })
    }
}

function setThemeByUserPref() {
    darkThemeCss = document.getElementById('dark-theme');
    const savedTheme = localStorage.getItem(THEME_PREF_STORAGE_KEY) ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const darkThemeToggles = document.querySelectorAll('.dark-theme-toggle');
    setTheme(savedTheme, darkThemeToggles);
    darkThemeToggles.forEach(el => el.addEventListener('click', toggleTheme, { capture: true }))
}

function toggleTheme(event) {
    const isDark = event.currentTarget.querySelector('a svg.feather-sun').classList.contains(HIDDEN_ELEMENT_CLASS);
    setThemeAndStore(isDark ? 'light' : 'dark', event.currentTarget);
}

function setTheme(themeToSet, targets) {
    darkThemeCss.disabled = themeToSet === 'light';
    targets.forEach((target) => {
        displayOrHide(themeToSet, target.querySelectorAll('a .theme-toggle-icon'));
        target.querySelector('.dark-theme-toggle-screen-reader-target').textContent = [THEME_TO_ICON_TEXT_CLASS[themeToSet]];

    });
}

function displayOrHide(themeToSet, targets) {
    targets.forEach((target) => {
        if (target.classList.contains(THEME_TO_ICON_CLASS[themeToSet])) {
            target.classList.remove(HIDDEN_ELEMENT_CLASS);
        } else {
            target.classList.add(HIDDEN_ELEMENT_CLASS);
        }
    });
}

function setThemeAndStore(themeToSet, target) {
    setTheme(themeToSet, [target]);
    localStorage.setItem(THEME_PREF_STORAGE_KEY, themeToSet);
}
