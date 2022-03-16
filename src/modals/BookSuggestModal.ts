import {htmlToMarkdown, MarkdownRenderer, SuggestModal} from "obsidian";
import CalibrePlugin from "../main";
import {Book, InfoDumpType} from "../interfaces";
import {createNote, pasteToNote} from "../templateProcessing";
import {BookInfoModal} from "./BookInfoModal";

export class BookSuggestModal extends SuggestModal<Book> {

	plugin: CalibrePlugin;
	books: Book[];
	type: InfoDumpType;

	constructor(plugin: CalibrePlugin, books: Book[], type: InfoDumpType) {
		super(plugin.app);
		this.plugin = plugin;
		this.books = books;
		this.type = type;
		this.limit = 10;
	}

	getSuggestions(query: string): Book[] {
		return this.books.filter(book => {
			return book.title.toLowerCase().includes(query.toLowerCase())
				|| book.authors.join().toLowerCase().includes(query.toLowerCase());
		}).sort((a, b) => {
			return a.title.localeCompare(b.title);
		});
	}

	async onChooseSuggestion(item: Book, _: MouseEvent | KeyboardEvent): Promise<void> {
		if(this.type === InfoDumpType.PASTE) {
			await pasteToNote(this.plugin, item);
		}
		if(this.type === InfoDumpType.CREATE) {
			await createNote(this.plugin, item);
		}
		if(this.type === InfoDumpType.SHOW) {
			new BookInfoModal(this.plugin, item).open();
		}
	}

	async renderSuggestion(value: Book, el: HTMLElement): Promise<void> {
		const wrapper = el.createDiv({cls: ["calibre-suggest-wrapper"]});
		const text = wrapper.createDiv({cls: ["calibre-suggest-text"]});
		text.createEl("strong",{ text: value.title, cls: ["calibre-suggest-title"]});
		text.createEl("small", { text: value.authors.join(", "), cls: ["calibre-suggest-authors"]});
		if(value.comments) {
			const comments = text.createEl("div", {cls: ["calibre-suggest-comments"]});
			await MarkdownRenderer.renderMarkdown(htmlToMarkdown(value.comments), comments, "", this.plugin);
		}
		const img = wrapper.createDiv({cls: ["calibre-suggest-img"]});
		img.createEl("img", {attr: {src: value.cover, alt: "Cover"}, cls: ["calibre-suggest-cover"]});
	}

}
