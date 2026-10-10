# Paslen Application

## Vibe catalogue

The catalogue lives at `/vibes/` and is built from Markdown files in `_vibes/`.
To add a vibe, create `_vibes/<slug>.md` (page URL becomes `/vibes/<slug>/`):

    ---
    title: Forest night
    order: 2                                  # position in the catalogue
    image: /assets/vibes/forest-night.svg     # preview picture (svg/png/webp)
    playlist: https://music.yandex.ru/users/paslen/playlists/1002
    description: Optional line under the title
    ---

    ```json
    {
      "name": "Forest night",
      "colors": { "background": "#293f3c", "accent": "#9cc97a" }
    }
    ```

The music service badge (Spotify / Яндекс Музыка / Deezer / Apple Music / YouTube Music)
is detected from the playlist URL. The JSON format is documented at `/vibes/schema/`
([_includes/vibe-schema.md](_includes/vibe-schema.md)); `/vibes/schema.txt` and the HTML
page use that same source. The formal draft 2020-12 JSON Schema is at `/vibes/schema.json`
([vibes/schema.json](vibes/schema.json)), mirrored from
`paslen-kmp/documentation/dial-skin.schema.json`. Keep it synchronized with the app codec.

The "Copy & open in Paslen" button copies the JSON to the clipboard and opens the paste
screen; the base deeplink is set in `_config.yml`. No JSON is put into the URL.
