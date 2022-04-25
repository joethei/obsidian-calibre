# Calibre Importer
Plugin for [Obsidian](https://obsidian.md)

![GitHub package.json version](https://shields.joethei.xyz/github/package-json/v/joethei/obsidian-calibre)
![Maintenance](https://shields.joethei.xyz:/maintenance/yes/2022)
![min app version](https://shields.joethei.xyz/github/manifest-json/minAppVersion/joethei/obsidian-calibre?label=lowest%20supported%20app%20version)
[![libera manifesto](https://shields.joethei.xyz/badge/libera-manifesto-lightgrey.svg)](https://liberamanifesto.com)
---

> ⚠️ This plugin is stil in early development, no guarantees on anything.

> This plugin is not related to the other [Calibre plugin](https://github.com/caronchen/obsidian-calibre-plugin)

Extract data from your [Calibre](https://calibre-ebook.com/) library,
Read only.

Read books from your Calibre library directly in Obsidian.

This plugin requires the use of the [Calibre content server](https://manual.calibre-ebook.com/server.html?highlight=apache)

Using _calibre-web_ is not supported.

![Demo](https://i.joethei.space/Obsidian_aj6b0EURTP.mp4)

## Search

You can make full use of the Search syntax Calibre offers, see the
[Documentation](https://manual.calibre-ebook.com/gui.html#the-search-interface) for more information.

# Templates

You have full access to
[Nunjucks](https://mozilla.github.io/nunjucks/templating.html)

You can find the possible variables [here](https://github.com/joethei/obsidian-calibre/blob/master/src/sources/CalibreSourceTypes.ts)(better documentation will follow).

There are also some custom filters added:
- `strip`: removes any spaces

The plugin already provides a few of predefined sample templates
for you to customize.

## Annotations

Calibre does not expose annotation data by default.
You need to enable this in the calibre settings.

Open a random book with the calibre viewer, then follow these screenshots:

![](https://i.joethei.space/calibre_BvvEHQ9coF.png)
![](https://i.joethei.space/calibre-parallel_Yh9VxFRBCR.png)
![](https://i.joethei.space/calibre-parallel_65rfGmCxJr.png)
![](https://i.joethei.space/calibre-parallel_GSdVyCDkqD.png)

Enable the <kbd>Keep a copy of annotations/bookmarks in the e-book file</kbd> option.
If you don't have user accounts configured in calibre put a `*` in the following field.
Put in the username otherwise.


# Contributing
![GitHub Workflow Status](https://shields.joethei.xyz:/github/workflow/status/joethei/obsidian-calibre/CI)
![GitHub](https://shields.joethei.xyz/github/license/joethei/obsidian-calibre)
![TeamCity Coverage](https://shields.joethei.xyz:/teamcity/coverage/Obsidian_Plugins_Calibre?server=https%3A%2F%2Fteamcity.joethei.xyz)

---

If you want to contribute your own template you can do so by creating a Pull Request on `src/templating/predefinedTemplates.json`
