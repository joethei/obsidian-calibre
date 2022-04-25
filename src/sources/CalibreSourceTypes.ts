export interface Book {
	id: number;
	title: string;
	authors: string[];
	tags: string[];
	cover: string;
	description?: string;
	publisher: string;
	series?: string;
	published: Date;
	last_modified: Date;
	languages: string[];
	rating: number;
	formats: Format;
	main_format: string;
	highlights: Highlight[];
	identifiers: Identifiers;
	custom: CustomMetadata[];
}

export interface Format {
	[key: string]: string;
}

export interface CustomMetadata {
	name: string;
	label: string;
	datatype: string;
	description: string;
	value: string;
}

export interface BookManifest {
	chapter: Chapter;
}

export interface Identifiers {
	[key: string]: string;
}


export interface Highlight {
	text: string;
	timestamp: Date;
	type: string;
	which: string;
	location: string[];
	notes?: string;

}

export interface Chapter {
	id: number;
	title: string;
	children: Chapter[];
	level: number;
}
