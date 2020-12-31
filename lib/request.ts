import * as get from "simple-get";

export default async function request(config: any = {}) {
  return new Promise((resolve, reject) => {
    try {
      get.concat({ ...config, json: true }, (err, _, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    } catch (e) {
      reject(e);
    }
  });
}
