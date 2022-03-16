import {Plugin} from "obsidian";
import {InfoDumpType} from "./interfaces";
import {SettingTab} from "./settings/SettingTab";
import {BookSuggestModal} from "./modals/BookSuggestModal";
import {CalibreSettings, DEFAULT_SETTINGS} from "./settings/SettingData";
import {CalibreContentServer, CalibreSource} from "./queries";

export default class CalibrePlugin extends Plugin {
	settings: CalibreSettings;

	source: CalibreSource;
	getSource() : CalibreSource {
		if(!this.source) {
			this.source = new CalibreContentServer(this.settings.server);
		}
		return this.source;
	}

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SettingTab(this.app, this));

		this.addCommand({
			id: "paste-book",
			name: "Paste book info",
			editorCallback: async () => {
				new BookSuggestModal(this, Object.values(await this.getSource().allBooks()), InfoDumpType.PASTE).open();
			}
		});

		this.addCommand({
			id: "create-note",
			name: "Create book note",
			callback: async () => {
				new BookSuggestModal(this, Object.values(await this.getSource().allBooks()), InfoDumpType.CREATE).open();
			}
		});

		this.addCommand({
			id: "show-info",
			name: "Show book info",
			callback: async () => {
				new BookSuggestModal(this, Object.values(await this.getSource().allBooks()), InfoDumpType.SHOW).open();
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
	}
}
