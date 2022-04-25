import t from "../src/l10n/locale";

describe('translation', function () {
	test('returns correct value', function () {
		expect(t("testingValue")).toEqual("Hello World");
	});
	test('fallback to default if no value in selected language', function () {
		expect(t("save")).toEqual("Save");
	});
	test('inserts', function () {
		expect(t('testingInserts', "World", "!")).toEqual("Hello World !");
	});
});
