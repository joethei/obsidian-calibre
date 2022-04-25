import {App, debounce, DropdownComponent, Notice, PluginSettingTab, SearchComponent, Setting} from "obsidian";
import CalibrePlugin from "../main";
import {FolderSuggest} from "../FolderSuggestor";
import t from "../l10n/locale";
import {DEFAULT_SETTINGS} from "./SettingData";
import {TemplateEditorModal} from "../templating/TemplateEditor";

export class SettingTab extends PluginSettingTab {
	plugin: CalibrePlugin;

	constructor(app: App, plugin: CalibrePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	debouncedSettingsSave = debounce(async () => {
		await this.plugin.saveSettings();
		this.display();
	}, 2000, true);

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		containerEl.createEl("h1", {text: "Calibre Importer"});

		new Setting(containerEl)
			.setName("Server")
			.addText(text => {
				text
					.setValue(this.plugin.settings.server)
					.setPlaceholder(DEFAULT_SETTINGS.server)
					.onChange(async (value) => {
						this.plugin.settings.server = value;
						this.debouncedSettingsSave();
					});
			});

		new Setting(containerEl)
			.setName("Library")
			.addDropdown(async dropdown => {
				const libraries = await this.plugin.getSource().libraryInfo();
				if (libraries === null) {
					dropdown.setDisabled(true);
					new Notice(t("server_offline"));
					return;
				}
				for (const library of libraries) {
					dropdown.addOption(library, library);
				}
				dropdown
					.setValue(this.plugin.settings.library)
					.onChange(async (value: string) => {
						this.plugin.settings.library = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Template")
			.addButton(async (button) => {
				button
					.setButtonText("Customize")
					.onClick(async () => {
						const modal = new TemplateEditorModal(this.plugin);
						modal.onClose = async() => {
							if(modal.saved) {
								this.plugin.settings.template = modal.template;
								await this.plugin.saveSettings();
							}
						}

						modal.open();
				});
			});

		new Setting(containerEl)
			.setName(t("file_location"))
			.setDesc(t("file_location_help"))
			.addDropdown(async (dropdown: DropdownComponent) => {
				dropdown
					.addOption("default", t("file_location_default"))
					.addOption("custom", t("file_location_custom"))
					.setValue(this.plugin.settings.saveLocation)
					.onChange(async (value: string) => {
						this.plugin.settings.saveLocation = value;
						await this.plugin.saveSettings();
						this.display();
					});
			});

		if (this.plugin.settings.saveLocation == "custom") {
			new Setting(containerEl)
				.setName(t("file_location_folder"))
				.setDesc(t("file_location_folder_help"))
				.addSearch(async (search: SearchComponent) => {
					new FolderSuggest(this.app, search.inputEl);
					search
						.setValue(this.plugin.settings.saveLocationFolder)
						.setPlaceholder(DEFAULT_SETTINGS.saveLocationFolder)
						.onChange(async (value: string) => {
							this.plugin.settings.saveLocationFolder = value;
							await this.plugin.saveSettings();
						});
				});
		}
	}
}
