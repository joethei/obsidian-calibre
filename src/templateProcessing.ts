import {Book, FILE_NAME_REGEX} from "./interfaces";
import CalibrePlugin from "./main";
import * as nunjucks from 'nunjucks';
import {MarkdownView, normalizePath, Notice, TextComponent} from "obsidian";
import {TextInputPrompt} from "./modals/TextInputPrompt";
import t from "./l10n/locale";

export function pasteToNote(plugin: CalibrePlugin, book: Book) : Promise<void> {
	const file = plugin.app.workspace.getActiveFile();
	if (file === null) {
		new Notice("no file active");
		return;
	}

	const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
	if (view) {
		const appliedTemplate = applyTemplate(book, plugin.settings.template);

		const editor = view.editor;

		editor.replaceRange(appliedTemplate, editor.getCursor());

		new Notice("pasted to note");
	}
}

export async function createNote(plugin: CalibrePlugin, book: Book) : Promise<void> {
	const appliedTemplate = applyTemplate(book, plugin.settings.template);
	const activeFile = plugin.app.workspace.getActiveFile();
	let dir = plugin.app.fileManager.getNewFileParent(activeFile ? activeFile.path : "").path;

	if (plugin.settings.saveLocation === "custom") {
		dir = plugin.settings.saveLocationFolder;
	}

	//make sure there are no slashes in the title.
	const filename = book.title.replace(/[\/\\:]/g, ' ');

	if (plugin.settings.askForFilename) {
		const inputPrompt = new TextInputPrompt(plugin.app, t("specify_name"), t("cannot_contain") + " * \" \\ / < > : | ?", filename, filename);
		await inputPrompt
			.openAndGetValue(async (text: TextComponent) => {
				const value = text.getValue();
				if (value.match(FILE_NAME_REGEX)) {
					inputPrompt.setValidationError(text, t("invalid_filename"));
					return;
				}
				const filePath = normalizePath([dir, `${value}.md`].join('/'));

				//is there a file with that name already?
				if (plugin.app.metadataCache.getFirstLinkpathDest(filePath, '')) {
					inputPrompt.setValidationError(text, t("note_exists"));
					return;
				}
				inputPrompt.close();
				await createNewFile(plugin, filePath, appliedTemplate);
			});
	} else {
		const replacedTitle = filename.replace(FILE_NAME_REGEX, '');
		const filePath = normalizePath([dir, `${replacedTitle}.md`].join('/'));
		await createNewFile(plugin, filePath, appliedTemplate);
	}

}

async function createNewFile(plugin: CalibrePlugin, path: string, content: string) {
	const file = await plugin.app.vault.create(path, content);

	await plugin.app.workspace.activeLeaf.openFile(file, {
		state: { mode: 'edit' },
	});

	new Notice("Created note");
}

function applyTemplate(book: Book, template: string) : string {
	nunjucks.configure({
		autoescape: false
	});
	try {
		return nunjucks.renderString(template, book);
	} catch (e: any) {
		console.error(e);
		new Notice("Error while processing template, please check the console for more information", 1000);
		new Notice(e.message, 1000);
	}

}
