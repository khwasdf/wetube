const removeBtn = document.querySelectorAll(".remove-btn")
const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

async function handleCommentRemove(event) {
    const li = event.target.parentElement;
    const commentId = li.dataset.id
    li.remove();
    await fetch(`/api/videos/${commentId}/delete`, {
      method: "DELETE",
    });
}
const addComment = async  (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const button = document.createElement("button");
  button.innerText = "❌";
  button.className = "remove-btn"
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(button);
  button.addEventListener("click", handleCommentRemove)
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  // fetch는 response 반환
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    // 백엔드에서 보낸 json 정보 받기
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if(removeBtn) {
  removeBtn.forEach(function(button) {button.addEventListener("click", handleCommentRemove)})
}