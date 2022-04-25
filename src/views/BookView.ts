import {ItemView, Platform, WorkspaceLeaf} from "obsidian";
import {Book} from "../sources/CalibreSourceTypes";
import CalibrePlugin, {VIEW_ID} from "../main";

export class BookView extends ItemView {

	private book: Book;
	private plugin: CalibrePlugin;
	private format: string;

	constructor(leaf: WorkspaceLeaf, plugin: CalibrePlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	setEphemeralState(state: { book: Book, format: string }) {
		this.book = state.book;
		this.format = state.format;

		this.contentEl.empty();

		if(Platform.isDesktop) {
			const webview = document.createElement("webview");
			webview.setAttribute("class", "calibre-frame");
			webview.setAttribute('allowpopups', '');
			webview.setAttribute("src", this.book.formats[this.format]);

			this.contentEl.appendChild(webview);

			return;
		}

		this.contentEl.createEl("iframe", {
			cls: "calibre-frame", attr: {
				src: this.book.formats[this.format],
				sandbox: "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation",
				allow: "encrypted-media; fullscreen; oversized-images; picture-in-picture; sync-xhr; geolocation;"
			}
		});
	}


	getIcon(): string {
		return "library";
	}

	getDisplayText(): string {
		return "Calibre Book";
	}

	getViewType(): string {
		return VIEW_ID;
	}

}
