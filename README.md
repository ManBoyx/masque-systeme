**Français** · [English](#english)

# Masque Système

Extension Chromium (Manifest V3) qui **réduit et falsifie** les informations sur l'ordinateur que les sites web peuvent lire pour vous pister (« fingerprinting »).

## Ce qu'elle fait
- **Navigateur et système :** `userAgent`, `platform`, `vendor`, langue, nombre de cœurs, mémoire, points tactiles, Do Not Track, `webdriver`, plugins, types MIME, connexion réseau, batterie, indices client (`userAgentData`).
- **Écran et fenêtre :** tailles de fenêtre, `devicePixelRatio`, position de la fenêtre.
- **Fuseau horaire :** `Intl.DateTimeFormat` et `getTimezoneOffset`.
- **Canvas et audio :** bruit léger sur les lectures de pixels (`getImageData`) et sur les données audio (`AudioBuffer`, `AnalyserNode`).
- **Périphériques :** `enumerateDevices`.
- **En-têtes réseau :** `User-Agent` et `Accept-Language` réécrits, indices client `sec-ch-ua-*` supprimés ou normalisés.
- **WebRTC :** la fuite d'adresse IP est limitée (`disable_non_proxied_udp`).

Le profil présenté est celui d'un Chrome 130 sous Windows en `en-US`.

## Installation
1. Ouvrez `chrome://extensions` et activez le **Mode développeur**.
2. **Charger l'extension non empaquetée**, puis choisissez ce dossier.

## Limites
Falsifier ses informations peut rendre une empreinte **plus rare**, donc plus identifiable, et certains sites peuvent mal s'afficher (langue, mises en page, vidéo). Ce n'est pas un outil d'anonymat : l'adresse IP, les cookies et le comportement restent visibles. Les valeurs sont fixées dans `inject.js` et `background.js`.

## Licence
[MIT](LICENSE).

---

# English

# Masque Système ("System Mask")

A Chromium (Manifest V3) extension that **reduces and spoofs** the information about your computer that websites can read to track you ("fingerprinting").

## What it does
- **Browser and system:** `userAgent`, `platform`, `vendor`, language, core count, memory, touch points, Do Not Track, `webdriver`, plugins, MIME types, network connection, battery, client hints (`userAgentData`).
- **Screen and window:** window sizes, `devicePixelRatio`, window position.
- **Time zone:** `Intl.DateTimeFormat` and `getTimezoneOffset`.
- **Canvas and audio:** slight noise on pixel reads (`getImageData`) and on audio data (`AudioBuffer`, `AnalyserNode`).
- **Devices:** `enumerateDevices`.
- **Network headers:** `User-Agent` and `Accept-Language` rewritten, `sec-ch-ua-*` client hints removed or normalized.
- **WebRTC:** IP address leakage is limited (`disable_non_proxied_udp`).

The profile presented is that of Chrome 130 on Windows in `en-US`.

## Installation
1. Open `chrome://extensions` and turn on **Developer mode**.
2. **Load unpacked**, then choose this folder.

## Limitations
Spoofing your information can make a fingerprint **rarer**, hence more identifiable, and some sites may display incorrectly (language, layouts, video). This is not an anonymity tool: your IP address, cookies and behavior remain visible. The values are set in `inject.js` and `background.js`.

## License
[MIT](LICENSE).
