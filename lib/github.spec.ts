import github from "./github";

describe("github", function () {
  it("should get file", () => {
    const FILE_NAME = "template.html";
    return github.getFile(FILE_NAME).then((data) => {
      console.log("bump:", data);
      expect(data).toBeDefined();
    });
  });

  it("should do CRUD file operation", () => {
    const FILE_NAME = "test.txt";
    const CONTENT = "test";

    return github
      .createFile(FILE_NAME, "--")
      .then(() => {
        expect(true).toEqual(true);
        return github.updateFile(FILE_NAME, CONTENT);
      })
      .then(() => {
        expect(true).toEqual(true);
        return github.getFile(FILE_NAME);
      })
      .then((text) => {
        expect(text).toEqual(CONTENT);
        return github.removeFile(FILE_NAME);
      })
      .then(() => {
        expect(true).toEqual(true);
      })
      .catch((err) => {
        console.log("crud error", err);
        expect(true).toEqual(false);
      });
  });
});
