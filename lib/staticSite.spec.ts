import staticSite from "./staticSite";

describe("site generator", () => {
  it("should format html", () => {
    const data = [
      { id: "123", subject: "test", body: "this is test description" },
      { id: "111", subject: "one more", body: "some info" },
    ];
    const template =
      "{{#each data}}<h3>{{subject}}</h3><p>{{body}}</p>{{/each}}";
    const result = staticSite.generate(data, template);
    expect(result).toEqual(
      "<h3>test</h3><p>this is test description</p><h3>one more</h3><p>some info</p>"
    );
  });
});
