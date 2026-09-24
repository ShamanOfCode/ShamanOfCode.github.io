/* =========================================================
   DEINE FOTOS — direkt von Unsplash (@eemg)
   ---------------------------------------------------------
   Die Bilder liegen NICHT auf diesem Server, sondern kommen
   vom Unsplash-CDN (images.unsplash.com). Kein Upload, kein
   Traffic, automatisch passende Größen pro Gerät.

   Stats: Jeder Aufruf zählt bei Unsplash als "View" – dafür
   ist der ixid-Parameter da. Ein "Download" zählt nur, wenn
   jemand auf unsplash.com herunterlädt; darum hat jedes Bild
   in der Lightbox einen "Auf Unsplash"-Link.

   Neues Foto hochgeladen? Unten in P eine Zeile ergänzen:
   ID aus unsplash.com/photos/<ID> und den photo-…-Teil aus
   der Bild-URL (Rechtsklick auf das Bild → Bildadresse).
   ========================================================= */

const UNSPLASH_USER = 'eemg';

/* Tracking-Token von Unsplash – ordnet Aufrufe deinem Profil
   zu. Bitte nicht entfernen. */
const IXID = 'M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzkwMjEwNjAxfA';

/* Baut eine Bild-URL in der gewünschten Breite.
   fit=max → Seitenverhältnis bleibt, nichts wird beschnitten. */
const url = (file, w, q) =>
  `https://images.unsplash.com/photo-${file}` +
  `?ixid=${IXID}&ixlib=rb-4.1.0&fm=jpg&fit=max&cs=tinysrgb&q=${q || 80}&w=${w}`;

/* [ id, datei, breite, höhe, farbe, titel, ort, jahr, kategorie, serie, alt ] */
const P = [
  ['kjBegY4B29w', '1740069687467-7f4533ebf423', 4000, 6000, '#0c260c', 'Tautropfen', 'Sirmione', 2025, 'natur', 'garda', 'Tautropfen'],
  ['FFEygPO95a4', '1740006425995-d3455358e1a7', 6000, 4000, '#a6c0f3', 'Erster Schnee', 'Seedorf', 2025, 'natur', 'alpen', 'A mountain covered in snow and surrounded by trees'],
  ['JICfyP8U0zo', '1723240301932-b27fd6e38d53', 4000, 6000, '#262626', 'Schmale Gasse', 'Venedig', 2024, 'street', 'venezia', 'A couple of people walking down a narrow alley way'],
  ['ezgmr-cgmIM', '1716768349006-a0f89479b7a5', 4000, 6000, '#597373', 'Palmenallee', 'Sirmione', 2024, 'street', 'garda', 'a cobblestone street with palm trees on both sides'],
  ['SRXfZyl9hPc', '1716497630163-778e673bbe5b', 6000, 4000, '#c0c0c0', 'Grat', 'Seedorf', 2024, 'natur', 'alpen', 'a black and white photo of a mountain'],
  ['lLFo3yYMPtU', '1716497590155-7a075061468c', 4000, 6000, '#c0c0c0', 'Felswand', 'Seedorf', 2024, 'natur', 'alpen', 'a black and white photo of a mountain'],
  ['KbYPJHW1Pik', '1716497563095-3ab0d79722b1', 4000, 6000, '#c0d9d9', 'Schneegipfel', 'Seedorf', 2024, 'natur', 'alpen', 'a large mountain with a snow covered top'],
  ['FweAxQ-4gEc', '1716497508388-00265410f77f', 4000, 6000, '#26260c', 'Blaue Stunde', 'Peschiera del Garda', 2024, 'natur', 'garda', 'Blaue Stunde'],
  ['DJLEA530I_4', '1716497441830-3f1e66d9909d', 6000, 3376, '#26260c', 'Bank am See', 'Peschiera del Garda', 2024, 'natur', 'garda', 'a bench sitting on the side of a lake at night'],
  ['BDCNCUr5dRE', '1716497408436-b76c0e21d74f', 4000, 6000, '#73a6d9', 'Rialto', 'Venedig', 2024, 'architektur', 'venezia', 'a boat is in the water next to buildings'],
  ['sItt0yforCI', '1716497338272-0d3f67193fbf', 6000, 4000, '#d9d9d9', 'Fassade', 'Venedig', 2024, 'architektur', 'venezia', 'a black and white photo of an old building'],
  ['V2Dn05w7i0o', '1716497314846-93c0a6d950b4', 4000, 6000, '#595959', 'Uhrturm', 'Venedig', 2024, 'architektur', 'venezia', 'a black and white photo of a building with a clock'],
  ['Zy1vALkhaoE', '1716497283395-4d7fbe5ac9f1', 4000, 6000, '#597373', 'Gegenlicht', 'Sirmione', 2024, 'natur', 'garda', 'a dock with a bird sitting on it at sunset'],
  ['5EEbbTJKumQ', '1716497228167-ff72166374a2', 6000, 4000, '#8c8c8c', 'Wolkenberg', 'Gardasee', 2024, 'natur', 'garda', 'a large mountain covered in clouds on top of a body of water'],
  ['EfmAf9pstW8', '1716497187432-abc7d6ab36f6', 6000, 4000, '#73738c', 'Weite', 'Gardasee', 2024, 'natur', 'garda', 'a body of water with mountains in the background'],
  ['oaABz_OWOpE', '1716497104724-afd6d1b4c05b', 4000, 6000, '#8c8ca6', 'Steg', 'Sirmione', 2024, 'natur', 'garda', 'a dock in the middle of a body of water'],
  ['lUF3RA7ZKnY', '1713051518111-5fd26162e07a', 4000, 6000, '#26260c', 'Wasserfall', 'Triberg', 2024, 'natur', 'wald', 'a small waterfall in the middle of a forest'],
  ['xQzEBPkx6vc', '1713051534391-b3e477e2eb88', 4000, 6000, '#262626', 'Moos', 'Triberg', 2024, 'natur', 'wald', 'a moss covered tree in the middle of a forest'],
  ['8RlNXLhWMNg', '1713051496669-e8ca782ace1b', 4000, 6000, '#26260c', 'Kaskade', 'Triberg', 2024, 'natur', 'wald', 'a small waterfall in the middle of a forest'],
  ['zdfTxWgqrhM', '1713051479748-1d503a6d012c', 4000, 6000, '#262626', 'Waldhaus', 'Triberg', 2024, 'natur', 'wald', 'a small building in the middle of a forest'],
  ['k3XNpZHVOQ4', '1713051464878-cdb5ff65382b', 6000, 4000, '#737373', 'Strömung', 'Triberg', 2024, 'natur', 'wald', 'Strömung'],
  ['gchqW-LEozg', '1713051437188-f6460e8d279c', 6000, 4000, '#26260c', 'Waldweg', 'Triberg', 2024, 'natur', 'wald', 'Waldweg'],
  ['YqlVgoGuDao', '1698701224376-ed8617d4596c', 8192, 6144, '#0c2626', 'Nachtfang', 'Malinska', 2023, 'natur', null, 'Nachtfang'],
  ['xdkgSrlSRlQ', '1698327238272-69a663b2d1c1', 4096, 3072, '#8ca6d9', 'Salzachtal', 'Golling', 2023, 'natur', 'alpen', 'a green field with mountains in the background'],
  ['FgLlHhlqR9c', '1697323781271-adbe75734e27', 6144, 8192, '#a6c0c0', 'Feldweg', 'Dreieich', 2023, 'natur', null, 'Feldweg'],
  ['3KeBY2AmhNk', '1696341964613-ef3d073b82af', 4096, 3072, '#408cc0', 'Ruinen', 'Ostia Antica', 2023, 'architektur', 'roma', 'the ruins of the ancient city of pompei'],
  ['ZiIJLfz22R8', '1696250016345-1b53249d7af5', 8192, 6144, '#73a6d9', 'Sommerhimmel', 'Ostia Antica', 2023, 'natur', 'roma', 'Sommerhimmel'],
  ['ZbWcjW1FDDM', '1695662040695-6d3c4c1ea523', 3264, 2448, '#268cd9', 'Forum Romanum', 'Rom', 2023, 'architektur', 'roma', 'Forum Romanum'],
  ['pTqGXh1SKgo', '1695130051183-7432e4c2784b', 6144, 8192, '#260c0c', 'Marmor', 'Ostia Antica', 2023, 'architektur', 'roma', 'Marmor'],
  ['SAkS65BBu0E', '1693859878415-91af16fc2f54', 4096, 3072, '#8c8c73', 'Fontana di Trevi', 'Rom', 2023, 'street', 'roma', 'Fontana di Trevi'],
];

/* Kategorien: 'natur' | 'architektur' | 'street' | 'sport'
   Sport-Fotos gibt es noch keine – einfach neue Zeilen in P mit
   'sport' als Kategorie ergänzen, der Filter ist schon da. */
window.PHOTOS = P.map(([id, file, w, h, color, title, place, year, category, series, alt]) => ({
  id, title, place, year, category, series, alt, color, w, h,
  src:  url(file, 1000),      // Galerie, Raster, Serien-Karten
  full: url(file, 2000, 85),  // Lightbox
  link: `https://unsplash.com/photos/${id}?utm_source=portfolio_eemg&utm_medium=referral`,
}));

/* Serien – die Anzahl wird automatisch aus PHOTOS gezählt */
const SERIES_DEF = [
  ['alpen', 'Alpenlicht', 'Schweiz & Österreich · 2024–25', 'KbYPJHW1Pik'],
  ['garda', 'Lago di Garda', 'Italien · 2024–25', 'Zy1vALkhaoE'],
  ['venezia', 'Venezia', 'Venedig · 2024', 'JICfyP8U0zo'],
  ['wald', 'Schwarzwald', 'Triberg · 2024', 'xQzEBPkx6vc'],
  ['roma', 'Roma Antica', 'Rom & Ostia · 2023', 'pTqGXh1SKgo'],
];

window.SERIES = SERIES_DEF.map(([key, title, sub, coverId]) => {
  const cover = window.PHOTOS.find((p) => p.id === coverId) || window.PHOTOS[0];
  return {
    key, title, sub,
    count: window.PHOTOS.filter((p) => p.series === key).length,
    src: cover.src, full: cover.full, link: cover.link, color: cover.color,
    w: cover.w, h: cover.h, alt: cover.alt,
  };
});

/* Bild für "Über mich" */
window.ABOUT_IMAGE = (window.PHOTOS.find((p) => p.id === 'ezgmr-cgmIM') || window.PHOTOS[0]).src;

/* Profil-Link (Kontakt / Footer) */
window.UNSPLASH_PROFILE =
  `https://unsplash.com/@${UNSPLASH_USER}?utm_source=portfolio_eemg&utm_medium=referral`;
