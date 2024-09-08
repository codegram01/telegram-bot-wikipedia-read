export function getToday() {
    const today = new Date();

    // Extract year, month, and day
    const YYYY = today.getFullYear();
    const MM = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero indexed
    const DD = String(today.getDate()).padStart(2, '0');

    return {
        YYYY,
        MM,
        DD
    }
}

export function parseLangContent(input) {
    const parts = input.split(' ');
    let lang, content;

    if (parts.length === 1) {
        lang = undefined;
        content = parts[0];
    } else if (parts.length > 1) {
        lang = parts[0];
        content = parts.slice(1).join(' ');
    } else {
        lang = undefined;
        content = '';
    }

    return { lang, content };
}