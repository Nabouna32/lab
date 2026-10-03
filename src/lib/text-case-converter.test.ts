import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { convertTextCase } from "./text-case-converter.ts";

describe("convertTextCase", () => {
  const input = "  HelloWorld — XML parser & déjà vu!  ";

  it("converts free text to uppercase and lowercase", () => {
    assert.equal(convertTextCase(input, "uppercase"), "  HELLOWORLD — XML PARSER & DÉJÀ VU!  ");
    assert.equal(convertTextCase(input, "lowercase"), "  helloworld — xml parser & déjà vu!  ");
  });

  it("normalizes words for title and identifier cases", () => {
    assert.equal(convertTextCase(input, "title"), "Hello World Xml Parser Déjà Vu");
    assert.equal(convertTextCase(input, "camel"), "helloWorldXmlParserDéjàVu");
    assert.equal(convertTextCase(input, "pascal"), "HelloWorldXmlParserDéjàVu");
    assert.equal(convertTextCase(input, "snake"), "hello_world_xml_parser_déjà_vu");
    assert.equal(convertTextCase(input, "kebab"), "hello-world-xml-parser-déjà-vu");
  });

  it("handles empty and separator-only input", () => {
    assert.equal(convertTextCase("", "camel"), "");
    assert.equal(convertTextCase(" --- ___ ", "snake"), "");
  });

  it("splits acronym boundaries without destroying words", () => {
    assert.equal(convertTextCase("parseJSONResponse", "title"), "Parse Json Response");
    assert.equal(convertTextCase("parseJSONResponse", "camel"), "parseJsonResponse");
  });

  it("preserves whitespace for simple upper/lower transformations", () => {
    assert.equal(convertTextCase("\nFoo\tBAR\n", "uppercase"), "\nFOO\tBAR\n");
  });
});
