import {App, debounce, DropdownComponent, PluginSettingTab, SearchComponent, Setting} from "obsidian";
import CalibrePlugin from "../main";
import {FolderSuggest} from "../FolderSuggestor";
import t from "../l10n/locale";
import {DEFAULT_SETTINGS} from "./SettingData";

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
				if(libraries === null) {
					dropdown.setDisabled(true);
					return;
				}
				for (const libraryKey in libraries.library_map) {
					const library = libraries.library_map[libraryKey];
					dropdown.addOption(libraryKey, library);
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
			.addTextArea(text => {
				text
					.setValue(this.plugin.settings.template)
					.setPlaceholder(DEFAULT_SETTINGS.template)
					.onChange(async (value) => {
						this.plugin.settings.template = value;
						await this.plugin.saveSettings();
					});
				text.inputEl.setAttr("rows", 15);
				text.inputEl.setAttr("cols", 50);
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
