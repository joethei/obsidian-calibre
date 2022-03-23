import {Plugin} from "obsidian";
import {SettingTab} from "./settings/SettingTab";
import {BookSuggestModal} from "./modals/BookSuggestModal";
import {CalibreSettings, DEFAULT_SETTINGS} from "./settings/SettingData";
import CalibreContentServer from "./sources/CalibreContentServer";
import CalibreSource from "./sources/CalibreSource";

export default class CalibrePlugin extends Plugin {
	settings: CalibreSettings;

	private source: CalibreSource;
	getSource() : CalibreSource {
		if(!this.source) {
			this.source = new CalibreContentServer(this.settings.server, this.settings.library);
		}
		return this.source;
	}

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SettingTab(this.app, this));

		this.addCommand({
			id: "show-info",
			name: "Show book info",
			callback: async () => {
				new BookSuggestModal(this).open();
			}
		});

	}

	onunload() {
		console.log("unloading Calibre importer plugin");
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.source.setHostname(this.settings.server);
		this.source.setLibrary(this.settings.library);
	}
}
