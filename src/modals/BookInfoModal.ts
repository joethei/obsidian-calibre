import {
	htmlToMarkdown,
	MarkdownRenderer,

	Modal, setIcon,
} from "obsidian";
import {Book} from "../interfaces";
import CalibrePlugin from "../main";
import t from "../l10n/locale";

export class BookInfoModal extends Modal {
	plugin: CalibrePlugin;
	book: Book;

	constructor(plugin: CalibrePlugin, book: Book) {
		super(plugin.app);
		this.plugin = plugin;
		this.book = book;
	}


	async display(): Promise<void> {
		this.modalEl.addClass("calibre-modal");
		const {contentEl} = this;
		contentEl.empty();

		const topButtons = contentEl.createDiv('topButtons');

		contentEl.createEl("h1", {text: this.book.title});

		const wrapper = contentEl.createDiv({cls: "data-wrapper"});

		const img = wrapper.createDiv({cls: ["img"]});
		img.createEl("img", {attr: {src: this.book.cover, alt: "Cover"}, cls: ["cover"]});

		const metadata = wrapper.createDiv({cls: "metadata"});

		metadata.createEl("strong", {text: t("written_by")});
		metadata.createEl("span", {text: this.book.authors.join(" & ")});
		metadata.createEl("br");

		metadata.createEl("strong", {text: t("tags")});
		const tagEl = metadata.createSpan("tags");
		this.book.tags.forEach((tag) => {
			const tagA = tagEl.createEl("a");
			tagA.setText(tag);
			tagA.addClass("tag", "calibre-tag");
		});
		metadata.createEl("br");

		metadata.createEl("strong", {text: t("rating")});
		const rating = metadata.createSpan();
		for (let i = 0; i < this.book.rating; i++) {
			const span = rating.createSpan();
			setIcon(span, "star");
		}


		for (const key in this.book.user_metadata) {
			const element = this.book.user_metadata[key];
			const value = element["#value#"];
			const div = metadata.createEl("div");
			if(!value) {
				continue;
			}
			if(element.display.description !== "") {
				div.createEl("strong", {text: element.display.description + ": "});
			}else {
				div.createEl("strong", {text: element.name + ": "});
			}
			if(element.datatype === "bool") {
				if(!value) {
					const span = div.createSpan();
					setIcon(span, "cross");
				}else {
					const span = div.createSpan();
					setIcon(span, "checkmark");
				}
			}else {
				div.createEl("span", {text: value});
			}
		}

		this.contentEl.createEl("hr");

		if(this.book.comments) {
			const comments = contentEl.createEl("div", {cls: ["comments"]});
			await MarkdownRenderer.renderMarkdown(htmlToMarkdown(this.book.comments), comments, "", this.plugin);
		}


	}

	async onClose(): Promise<void> {
		const {contentEl} = this;
		contentEl.empty();
	}

	async onOpen(): Promise<void> {
		await this.display();
	}

}
