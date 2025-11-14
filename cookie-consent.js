
window.addEventListener('DOMContentLoaded', () => {
    if (typeof initCookieConsent === 'undefined') {
        console.error('Cookie consent library not loaded.');
        return;
    }

    const cookieConsent = window.initCookieConsent();

    cookieConsent.run({
        current_lang: 'en',
        autoclear_cookies: true,
        page_scripts: true,
        mode: 'opt-in',
        // delay: 500,

        onFirstAction: function(user_preferences, cookie){
            //
        },

        onAccept: function (cookie) {
            if(cookie.level.includes('analytics')){
                loadGAnalytics();
            }
        },

        onChange: function (cookie, changed_preferences) {
            if(cookie.level.includes('analytics')){
                loadGAnalytics();
            }
        },

        languages: {
            'en': {
                consent_modal: {
                    title: 'We use cookies',
                    description: 'This website uses cookies to ensure you get the best experience. By clicking "Accept," you agree to our use of cookies for analytics and personalized content. <button type="button" data-cc="c-settings" class="cc-link">Let me choose</button>',
                    primary_btn: {
                        text: 'Accept all',
                        role: 'accept_all'
                    },
                    secondary_btn: {
                        text: 'Reject all',
                        role: 'reject_all'
                    }
                },
                settings_modal: {
                    title: 'Cookie Preferences',
                    save_settings_btn: 'Save settings',
                    accept_all_btn: 'Accept all',
                    reject_all_btn: 'Reject all',
                    close_btn_label: 'Close',
                    cookie_table_headers: [
                        {col1: 'Name'},
                        {col2: 'Domain'},
                        {col3: 'Expiration'},
                        {col4: 'Description'}
                    ],
                    blocks: [
                        {
                            title: 'Cookie Usage',
                            description: 'We use cookies to enhance your browsing experience and analyze our traffic. You can choose which cookies to accept.'
                        }, {
                            title: 'Strictly Necessary Cookies',
                            description: 'These cookies are essential for the website to function and cannot be switched off in our systems.',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true
                            }
                        }, {
                            title: 'Performance and Analytics Cookies',
                            description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'Used by Google Analytics to distinguish users.',
                                    is_regex: true
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '24 hours',
                                    col4: 'Used by Google Analytics to distinguish users.',
                                }
                            ]
                        }
                    ]
                }
            }
        }
    });
});

function loadGAnalytics() {
    if (typeof gtag !== 'undefined') {
        return;
    }
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
    console.log('Google Analytics loaded');
}
