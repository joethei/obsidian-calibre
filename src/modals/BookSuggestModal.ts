import {debounce, Debouncer, htmlToMarkdown, MarkdownRenderer, SuggestModal} from "obsidian";
import CalibrePlugin from "../main";
import {Book} from "../interfaces";
import {createNote, pasteToNote} from "../templateProcessing";
import {BookInfoModal} from "./BookInfoModal";

export class BookSuggestModal extends SuggestModal<Book> {
	private readonly plugin: CalibrePlugin;

	private results: Book[] = [];
	private query: string;

	private readonly debouncedSearch: Debouncer<[query: string]>;

	constructor(plugin: CalibrePlugin) {
		super(plugin.app);
		this.plugin = plugin;
		this.limit = 25;
		this.debouncedSearch = debounce(this.updateSearchResults, 500);

		this.setPlaceholder("Please search here");

		this.setInstructions([
			{
				command: "Enter",
				purpose: "Show information about Book"
			},
			{
				command: "Shift+Enter",
				purpose: "Create note"
			}
		]);
	}

	async updateSearchResults(query: string) {
		if(query !== this.query) {
			this.query = query;
			this.results = await this.plugin.getSource().search(query);
			//@ts-ignore
			this.updateSuggestions();
		}
	}


	async getSuggestions(query: string): Promise<Book[]> {
		this.debouncedSearch(query);
		return this.results;
	}

	async onChooseSuggestion(item: Book, event: MouseEvent | KeyboardEvent): Promise<void> {
		if(event.getModifierState("Shift")) {
			await createNote(this.plugin, item);
			return;
		}
		if(event.getModifierState("Alt")) {
			await pasteToNote(this.plugin, item);
			return;
		}
		new BookInfoModal(this.plugin, item).open();

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
