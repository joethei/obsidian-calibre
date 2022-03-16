import {assert} from "chai";
import t from "../src/l10n/locale";

describe('translation', function () {
	it('', function () {
		assert.equal(t("testingValue"), "Hello World");
	});
	it('fallback to default if no value in selected language', function () {
		assert.equal(t("save"), "Save");
	});
	it('inserts', function () {
		assert.equal(t('testingInserts', "World", "!"), "Hello World !")
	});
});
