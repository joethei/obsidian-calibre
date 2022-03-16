export interface CalibreSettings{
	server: string,
	template: string,
	saveLocation: string,
	saveLocationFolder: string,
	askForFilename: boolean,
}

export const DEFAULT_SETTINGS: CalibreSettings = {
	server: "http://localhost:8080",
	template: "# {{title}}\n" +
		"\n" +
		"by:\n" +
		"{{authors}}\n" +
		"\n" +
		"---\n" +
		"{{comments}}\n" +
		"\n" +
		"---\n" +
		"\n" +
		"{{highlights}}",
	saveLocation: "default",
	saveLocationFolder: "",
	askForFilename: true,
};
