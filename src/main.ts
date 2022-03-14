import {Plugin} from "obsidian";
import {CalibreSettings, DEFAULT_SETTINGS, InfoDumpType} from "./interfaces";
import {SettingTab} from "./SettingTab";
import {BookSuggestModal} from "./modals/BookSuggestModal";
import {getBooks} from "./queries";

export default class CalibrePlugin extends Plugin {
  settings: CalibreSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SettingTab(this.app, this));

	this.addCommand({
		id: "paste-book",
		name: "Paste book info",
		editorCallback: async () => {
			new BookSuggestModal(this, Object.values(await getBooks(this.settings)), InfoDumpType.PASTE).open();
		}
	});

	  this.addCommand({
		  id: "create-note",
		  name: "Create book note",
		  callback: async () => {
			  new BookSuggestModal(this, Object.values(await getBooks(this.settings)), InfoDumpType.CREATE).open();
		  }
	  });

  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
