/* =========================================================
   Site content — edit THIS file to change what the menu shows.
   No logic lives here.
   ========================================================= */

const AVATAR = "https://avatars.githubusercontent.com/u/64603358?v=4";

/* thin PS3-style line-art icons */
const ICON = {
    person: `<svg viewBox="0 0 64 64" fill="none" stroke="#eaf4ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="22" r="12"/><path d="M12 54c2-12 12-18 20-18s18 6 20 18"/></svg>`,
    friends: `<svg viewBox="0 0 64 64" fill="none" stroke="#eaf4ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="9"/><circle cx="45" cy="27" r="7"/><path d="M8 52c2-9 9-13 16-13s14 4 16 13"/><path d="M42 40c7 0 12 4 14 12"/></svg>`,
    music: `<svg viewBox="0 0 64 64" fill="none" stroke="#eaf4ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M26 44V16l24-6v28"/><circle cx="20" cy="46" r="6"/><circle cx="44" cy="42" r="6"/></svg>`,
    facebook: `<svg viewBox="0 0 64 64" fill="none" stroke="#eaf4ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M38 18h-4c-4 0-6 2-6 6v6h-6v8h6v18h8V38h6l2-8h-8v-4c0-1 .5-2 2-2h4z"/></svg>`,
    telegram: `<svg viewBox="0 0 64 64" fill="none" stroke="#eaf4ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M52 14 8 31l13 5 4 14 7-9 12 9 8-36z"/><path d="M21 36l24-16-18 20"/></svg>`,
    email: `<svg viewBox="0 0 64 64" fill="none" stroke="#eaf4ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="16" width="48" height="32" rx="3"/><path d="M10 19l22 16 22-16"/></svg>`,
    github: `<svg viewBox="0 0 64 64" fill="none" stroke="#eaf4ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M32 8c-13 0-24 11-24 24 0 11 7 20 17 23 1 .2 1.7-.5 1.7-1.2v-4.6c-7 1.5-8.5-3-8.5-3-1-3-2.8-3.8-2.8-3.8-2.3-1.6.2-1.5.2-1.5 2.5.2 3.9 2.6 3.9 2.6 2.3 3.9 6 2.8 7.4 2.1.2-1.7.9-2.8 1.6-3.4-5.6-.6-11.5-2.8-11.5-12.5 0-2.8 1-5 2.6-6.8-.3-.7-1.1-3.2.2-6.7 0 0 2.1-.7 7 2.6 2-.6 4.2-.9 6.3-.9s4.3.3 6.3.9c4.8-3.3 7-2.6 7-2.6 1.3 3.5.5 6 .2 6.7 1.6 1.8 2.6 4 2.6 6.8 0 9.7-5.9 11.9-11.5 12.5.9.8 1.7 2.3 1.7 4.7v7c0 .7.7 1.4 1.7 1.2 10-3.3 17-12.5 17-23C56 19 45 8 32 8z"/></svg>`,
    play: `<svg viewBox="0 0 64 64" fill="none" stroke="#eaf4ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><path d="M27 23l16 9-16 9z" fill="#eaf4ff"/></svg>`
};

/* XMB menu — categories (X axis) & items (Y axis) */
const CATEGORIES = [
    {
        id: "profile",
        label: "個人檔案",
        iconImg: AVATAR,
        items: [
            { iconImg: AVATAR, title: "PT Chen", motto: true }
        ]
    },
    {
        id: "friends",
        label: "聯絡方式 Friends",
        icon: ICON.friends,
        items: [
            { icon: ICON.github,   title: "GitHub",   sub: "github.com/ptchen314",  link: "https://github.com/ptchen314" },
            { icon: ICON.facebook, title: "Facebook", sub: "PT Chen",               link: "https://www.facebook.com/profile.php?id=100070927291796" },
            { icon: ICON.telegram, title: "Telegram", sub: "@Chen_pt",              link: "https://t.me/Chen_pt" },
            { icon: ICON.email,    title: "Email",    sub: "hello@ptchen.tw",       link: "mailto:hello@ptchen.tw" }
        ]
    },
    {
        id: "music",
        label: "音樂 Music",
        icon: ICON.music,
        items: [
            { icon: ICON.play, title: "聽聽看我喜歡的音樂吧!", sub: "YouTube", link: "https://youtu.be/fDsdUoRRXTE" },
            { icon: ICON.play, title: "最近愛歌!", sub: "YouTube", link: "https://youtu.be/4g-xa8fPKLw" }
        ]
    }
];

/* rotating profile mottos */
const MOTTOS = [
    "To be or not to be",
    "在程式的海洋裡面不停溺水",
    "Monday make me broken.",
    "我想睡覺"
];
