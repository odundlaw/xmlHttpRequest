const postTemplate = document.getElementById("single-post");
const listItem = document.querySelector(".posts");
const form = document.querySelector("#new-post form");
const fetchBtn = document.querySelector("#available-posts button");

async function httpRequest(method, url, data) {
  /* const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.send(data && JSON.stringify(data));

    xhr.onload = function () {
      resolve(JSON.parse(xhr.response));
    };

    xhr.onerror = function () {
      reject(xhr.response);
    };
  });
 */

  const response = await fetch(url, {
    method: method ? method : "GET",
    body: data ? JSON.stringify(data) : null,
  });
  return response;
}

async function fetchPosts() {
  try {
    const response = await httpRequest(
      "GET",
      "https://jsonplaceholder.typicode.com/posts"
    );

    if (response.statusCode < 200 || response.statusCode > 201) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const postData = await response.json();

    for (const post of postData) {
      const template = document.importNode(postTemplate.content, true);
      template.querySelector("h2").textContent = post.title.toUpperCase();
      template.querySelector("p").textContent = post.body;
      template.querySelector("li").id = post.id;
      listItem.append(template);
    }
  } catch (err) {
    console.log(err);
  }
}

async function createPost(title, content) {
  const userId = Math.random();
  const post = {
    userId,
    title,
    content,
  };

  const response = await httpRequest(
    "POST",
    "https://jsonplaceholder.typicode.com/posts",
    post
  );
  console.log(response);
}

async function deletePost(postId) {
  const response = await httpRequest(
    "DELETE",
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );
  console.log(response);
}

fetchBtn.addEventListener("click", fetchPosts);

listItem.addEventListener("click", (event) => {
  if (event.target.textContent === "DELETE") {
    const id = event.target.closest("li").id;
    deletePost(id);
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(event.currentTarget);
  const enteredTitle = event.currentTarget.querySelector("#title").value;
  const enteredContent = event.currentTarget.querySelector("#content").value;

  createPost(enteredTitle, enteredContent);
});
