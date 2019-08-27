import { API_BASE_URL, NOTE_LIST_SIZE, ACCESS_TOKEN } from "../constants";

const request = options => {
  const headers = new Headers({
    "Content-Type": "application/json"
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then(response =>
    response.json().then(json => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export function getAllNotes(page, size) {
  page = page || 0;
  size = size || NOTE_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/notes?page=" + page + "&size=" + size,
    method: "GET"
  });
}

export function getNote(noteId) {
  return request({
    url: API_BASE_URL + "/notes/" + noteId,
    method: "GET"
  });
}

export function createNote(noteData) {
  return request({
    url: API_BASE_URL + "/notes",
    method: "POST",
    body: JSON.stringify(noteData)
  });
}

export function updateNote(noteData) {
  return request({
    url: API_BASE_URL + "/notes/" + noteData.id,
    method: "PUT",
    body: JSON.stringify(noteData)
  });
}

export function deleteNote(noteId) {
  return request({
    url: API_BASE_URL + "/notes",
    method: "DELETE",
    body: JSON.stringify(noteId)
  });
}

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/auth/signin",
    method: "POST",
    body: JSON.stringify(loginRequest)
  });
}

export function signup(signupRequest) {
  return request({
    url: API_BASE_URL + "/auth/signup",
    method: "POST",
    body: JSON.stringify(signupRequest)
  });
}

export function checkUsernameAvailability(username) {
  return request({
    url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
    method: "GET"
  });
}

export function checkEmailAvailability(email) {
  return request({
    url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
    method: "GET"
  });
}

export function getCurrentUser() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/user/me",
    method: "GET"
  });
}

export function getUserProfile(username) {
  return request({
    url: API_BASE_URL + "/users/" + username,
    method: "GET"
  });
}

export function getUserCreatedNotes(username, page, size) {
  page = page || 0;
  size = size || NOTE_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/users/" +
      username +
      "/notes?page=" +
      page +
      "&size=" +
      size,
    method: "GET"
  });
}
