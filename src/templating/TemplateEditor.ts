import {BaseModal} from "../modals/BaseModal";
import CalibrePlugin from "../main";
import {MarkdownPreviewView, Setting} from "obsidian";
import {BookSuggestModal} from "../modals/BookSuggestModal";
import {applyTemplate} from "./templateProcessing";
import t from "../l10n/locale";
import {Book} from "../sources/CalibreSourceTypes";
import {PredefinedTemplatesSelector} from "./PredefinedTemplatesSelector";

export class TemplateEditorModal extends BaseModal {

	private readonly plugin: CalibrePlugin;
	private book: Book;
	private templatePreview: HTMLDivElement;

	template: string;
	saved: boolean;


	constructor(plugin: CalibrePlugin) {
		super(plugin.app);
		this.plugin = plugin;
		this.template = plugin.settings.template;
	}

	async showTemplatePreview(): Promise<void> {
		const processed = await applyTemplate(this.plugin, this.book, this.template, false);
		this.templatePreview.empty();
		if (processed.length === 0) {
			this.templatePreview.createEl("h2", {text: "Could not render template"});
			return;
		}

		await MarkdownPreviewView.renderMarkdown(processed, this.templatePreview, "", this.plugin);
	}

	async display(): Promise<void> {
		this.modalEl.addClass("calibre-template-editor");
		const {contentEl} = this;
		contentEl.empty();

		new Setting(contentEl)
			.setName("Select a Book for a preview of the final note")
			.setDesc(this.book ? "Currently selected: " + this.book.title : "No selection")
			.addButton(async (button) => {
				button
					.setButtonText("Choose Book")
					.onClick(async () => {
						const selection = new BookSuggestModal(this.plugin, true);
						await selection.openAndGetValue(async (book) => {
							this.book = book;
							await this.display();
							await this.showTemplatePreview();
						})
					});
			});

		new Setting(contentEl)
			.setName("Predefined Templates")
			.setDesc("Choose from a selection of predefined templates")
			.setDisabled(!this.book)
			.addButton(async (button) => {
				button
					.setDisabled(!this.book)
					.setButtonText("Choose predefined Template")
					.onClick(async () => {
							const selection = new PredefinedTemplatesSelector(this.plugin, this.book);
							await selection.openAndGetValue(async (template) => {
								this.template = template.content;
								await this.display();
								await this.showTemplatePreview();
							});
						}
					);
			});

		const templateEl = contentEl.createDiv({cls: "editor-section"});

		new Setting(templateEl)
			.addTextArea(async (textArea) => {
				textArea
					.setValue(this.template)
					.onChange(async (value) => {
						this.template = value;
						if (this.book) {
							await this.showTemplatePreview();
						}
					});
				textArea.inputEl.setAttr("rows", 100);
				textArea.inputEl.setAttr("cols", 60);
			});

		this.templatePreview = templateEl.createDiv({cls: "template-preview"});

		const footerEl = contentEl.createDiv();
		const footerButtons = new Setting(footerEl);
		footerButtons.addButton((b) => {
			b.setTooltip(t("save"))
				.setIcon("checkmark")
				.onClick(async () => {
					this.saved = true;
					this.close();
				});
			return b;
		});
		footerButtons.addExtraButton((b) => {
			b.setIcon("cross")
				.setTooltip(t("cancel"))
				.onClick(() => {
					this.saved = false;
					this.close();
				});
			return b;
		});
	}

	async onClose(): Promise<void> {
		const {contentEl} = this;
		contentEl.empty();
	}

	async onOpen(): Promise<void> {
		await this.display();
	}

}
