import {BaseModal} from "../modals/BaseModal";
import CalibrePlugin from "../main";
import {ButtonComponent, MarkdownPreviewView} from "obsidian";
import {Book} from "../sources/CalibreSourceTypes";
import {PredefinedTemplate} from "./PredefinedTemplate";
import {applyTemplate} from "./templateProcessing";

export class PredefinedTemplatesSelector extends BaseModal {

	private readonly plugin: CalibrePlugin;
	private book: Book;

	template: string;
	saved: boolean;

	private resolve: (template: PredefinedTemplate) => void;


	constructor(plugin: CalibrePlugin, book: Book) {
		super(plugin.app);
		this.book = book;
		this.plugin = plugin;
		this.template = plugin.settings.template;
	}

	async display(): Promise<void> {
		this.modalEl.addClass("calibre-template-selector");
		const {contentEl} = this;
		contentEl.empty();

		const predefinedTemplates: PredefinedTemplate[] = require('./predefinedTemplates.json');
		for (const predefinedTemplate of predefinedTemplates) {
			const wrapper = contentEl.createDiv({cls: "calibre-predefined-template-wrapper"});
			wrapper.createEl("h3", {text: predefinedTemplate.name});
			if(predefinedTemplate.creator) {
				wrapper.createEl("p", {text: "by " + predefinedTemplate.creator});
			}
			const div = wrapper.createDiv({cls: "calibre-predefined-template"});

			const appliedTemplate = await applyTemplate(this.plugin, this.book, predefinedTemplate.content);
			await MarkdownPreviewView.renderMarkdown(appliedTemplate, div, "", this.plugin);

			new ButtonComponent(div)
				.setCta()
				.setButtonText("Choose")
				.onClick(async () => {
					this.resolve(predefinedTemplate);
					this.close();
				})
		}


	}

	async onClose(): Promise<void> {
		const {contentEl} = this;
		contentEl.empty();
	}

	async onOpen(): Promise<void> {
		await this.display();
	}

	async openAndGetValue(resolve: (template: PredefinedTemplate) => void): Promise<void> {
		this.resolve = resolve;
		await this.open();
	}

}
