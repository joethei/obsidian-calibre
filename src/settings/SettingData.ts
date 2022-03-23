export interface CalibreSettings{
	server: string,
	library: string,
	template: string,
	saveLocation: string,
	saveLocationFolder: string,
	askForFilename: boolean,
}

export const DEFAULT_SETTINGS: CalibreSettings = {
	server: "http://localhost:8080",
	library: "",
	template: "---\n" +
		"cover: {{cover}}\n" +
		"authors: {% for author in authors %}\n" +
		"- {{author}}{% endfor %}\n" +
		"---\n" +
		"\n" +
		"![cover|250]({{cover}})\n" +
		"\n" +
		"# {{title}}\n" +
		"\n" +
		"---\n" +
		"{{comments}}\n" +
		"\n" +
		"\n" +
		"## Highlights\n" +
		"{% for highlight in highlights %} -{{highlight.highlighted_text}}{% endfor %}",
	saveLocation: "default",
	saveLocationFolder: "",
	askForFilename: true,
};
