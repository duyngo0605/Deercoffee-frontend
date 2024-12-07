import { BE_ENDPOINT, TOKEN } from "../../../settings/localVar";
import { sUserInfo } from "../../../app/pages/Login/loginStore";

const KEY = "adminDuy";
const HEADERS = {
  "Content-Type": "application/json",
  accept: "application/json",
  key: KEY,
};

export const get = async (uri, onSuccess, onFail) => {
  const res = await fetch(BE_ENDPOINT + uri, {
    headers: {
      ...HEADERS,
      token: localStorage.getItem(TOKEN),
    },
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
    headers: {
      ...HEADERS,
      token: localStorage.getItem(TOKEN),
    },
    body: JSON.stringify(reqData),
  });

  if (!res.ok) {
    onFail();
    return;
  }

  const data = await res.json();
  onSuccess(data);
};

export const put = async (uri, reqData, onSuccess, onFail) => {
  const res = await fetch(BE_ENDPOINT + uri, {
    method: "PUT",
    headers: {
      ...HEADERS,
      token: localStorage.getItem(TOKEN),
    },
    body: JSON.stringify(reqData),
  });

  if (!res.ok) {
    onFail();
    return;
  }

  const data = await res.json();
  onSuccess(data);
};

export const del = async (uri, onSuccess, onFail) => {
  const res = await fetch(BE_ENDPOINT + uri, {
    method: "DELETE",
    headers: {
      ...HEADERS,
      token: localStorage.getItem(TOKEN),
      },
  });

  if (!res.ok) {
    onFail();
    return;
  }

  const data = await res.json();
  onSuccess(data);
};

