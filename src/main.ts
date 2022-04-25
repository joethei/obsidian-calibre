import {Plugin, WorkspaceLeaf} from "obsidian";
import {SettingTab} from "./settings/SettingTab";
import {BookSuggestModal} from "./modals/BookSuggestModal";
import {CalibreSettings, DEFAULT_SETTINGS} from "./settings/SettingData";
import CalibreContentServer from "./sources/CalibreContentServer";
import CalibreSource from "./sources/CalibreSource";
import {BookView} from "./views/BookView";

export const VIEW_ID = "calibre-importer";

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

		this.registerView(VIEW_ID, (leaf: WorkspaceLeaf) => new BookView(leaf, this));
	}

	onunload() {
		console.log("unloading Calibre importer plugin");
		this.app.workspace.detachLeavesOfType(VIEW_ID);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.source.setHostname(this.settings.server);
		this.source.setLibrary(this.settings.library);
	}


	async initLeaf(): Promise<void> {
		if (this.app.workspace.getLeavesOfType(VIEW_ID).length > 0) {
			return;
		}
		const leaf = this.app.workspace.getRightLeaf(false)
		await leaf.setViewState({
			type: VIEW_ID
		});
		this.app.workspace.revealLeaf(leaf);

	}
}
