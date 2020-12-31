import github from "./github";

const auth = {
	token: process.env.GH_TOKEN,
	branch: process.env.GH_BRANCH,
	owner: process.env.GH_USER,
	repo: process.env.GH_REPO,
  };

describe("github", function () {
  it("should get file", () => {

    const FILE_NAME = "data.json";
    return github.getFile(auth, FILE_NAME).then((data) => {
      console.log("bump:", data);
      expect(data).toBeDefined();
    });
  });

  it("should do CRUD file operation", () => {
    const FILE_NAME = "test.txt";
    const CONTENT = "test";

    return github
      .createFile(auth, FILE_NAME, "--")
      .then(() => {
        expect(true).toEqual(true);
        return github.updateFile(auth, FILE_NAME, CONTENT);
      })
      .then(() => {
        expect(true).toEqual(true);
        return github.getFile(auth, FILE_NAME);
      })
      .then((text) => {
        expect(text).toEqual(CONTENT);
        return github.removeFile(auth, FILE_NAME);
      })
      .then(() => {
        expect(true).toEqual(true);
      })
      .catch((err) => {
        console.log("crud error", err);
        expect(true).toEqual(false);
      });
  });

  it("should create repo", () => {

    return github
      .createRepo(auth, auth.repo)
      .then((info) => {
        expect(info).toEqual("test is failed");
      })
      .catch((err) => {
        expect(err).toEqual("exist");
      });
  });
});
