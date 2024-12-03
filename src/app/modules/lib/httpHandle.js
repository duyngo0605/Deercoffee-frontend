import { BE_ENDPOINT } from "../../../settings/localVar";

const KEY = "adminDuy";
const HEADERS = {
  "Content-Type": "application/json",
  accept: "application/json",
  key: KEY,
};

export const get = async (uri, onSuccess, onFail) => {
  console.log(uri)
  const res = await fetch(BE_ENDPOINT + uri, {
    headers: HEADERS,
  });

  if (!res.ok) {
    onFail();
    return;
  }

  const data = await res.json();
  onSuccess(data);
};

export const post = async (uri, reqData, onSuccess, onFail) => {
  const res = await fetch(BE_ENDPOINT + uri, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(reqData),
  });

  if (!res.ok) {
    onFail();
    return;
  }

  const data = await res.json();
  onSuccess(data);
};
