export interface CcsBooks {
	[key: number]: CcsBook,
}

export interface CcsBook {
	application_id: number;
	title: string;
	authors: string[];
	tags: string[];
	cover: string;
	cover_raw: string;
	comments?: string;
	thumbnail: string;
	publisher: string;
	series: string;
	pubdate: Date;
	last_modified: Date;
	languages: string[];
	rating: number,
	formats: string[];
	user_metadata: CcsUserMetadataWrapper;
	identifiers: CcsBookIdentifiers;
	highlights: CcsHighlight[];
	[key: string]: any;
}

export interface CcsBookIdentifiers {
	[key: string]: string;
}

export interface CcsBookManifest extends CcsAnnotation{
	version: number;
	toc: CcsChapter;
	metadata: CcsBook;
}

export interface CcsAnnotations {
	[key: string]: CcsAnnotation;
}

export interface CcsAnnotation {
	annotations_map: CcsAnnotationMap;
}

export interface CcsAnnotationMap {
	highlight: CcsHighlight[];
}

export interface CcsHighlight {
	highlighted_text: string;
	type: string;
	timestamp: Date;
	spine_index: number;
	spine_name: string;
	start_cfi: string;
	end_cfi: string;
	toc_family_titles: string;
	style: CcsHighlightStyle;
}

export interface CcsHighlightStyle {
	kind: string;
	type: string;
	which: string;
}


export interface CcsChapter {
	title: string;
	dest: string;
	frag: string;
	children: CcsChapter[];
	id: number;
}

export interface CcsUserMetadataWrapper {
	[key: string]: CcsUserMetadata;
}

export interface CcsUserMetadata {
	name: string;
	label: string;
	datatype: string;
	display: CcsUserMetadataDisplay;
	[key: string]: any;
}

export interface CcsUserMetadataDisplay {
	description: string;
}

export interface CcsBookSearchResults {
	total_num: number;
	book_ids: number[];
}

export interface CcsLibraryInfo {
	library_map: CcsLibrary;
	default_library: string;
}

export interface CcsLibrary {
	[key: string]: string;
}

export const FILE_NAME_REGEX = /["\/<>:|?]/gm;
