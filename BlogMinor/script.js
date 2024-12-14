document.getElementById("createForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("createTitle").value;
    const content = document.getElementById("createContent").value;

    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);

    fetch("create_post.php", {
        method: "POST",
        body: postData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Post Created Successfully!");
            loadPosts();
        } else {
            alert("Failed to create post.");
        }
    })
    .catch(error => alert("Error: " + error));
});

document.getElementById("updateForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("updateTitle").value;
    const content = document.getElementById("updateContent").value;
    const id = document.getElementById("updateId").value;

    const postData = new FormData();
    postData.append("id", id);
    postData.append("title", title);
    postData.append("content", content);

    fetch("update_post.php", {
        method: "POST",
        body: postData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Post Updated Successfully!");
            loadPosts();
            document.getElementById("updateForm").reset();
            document.getElementById("updateForm").style.display = "none";
        } else {
            alert("Failed to update post.");
        }
    })
    .catch(error => alert("Error: " + error));
});

function loadPosts() {
    fetch("get_posts.php")
    .then(response => response.json())
    .then(posts => {
        const postsDiv = document.getElementById("blog-posts");
        postsDiv.innerHTML = '';
        posts.forEach(post => {
            const postDiv = document.createElement("div");
            postDiv.classList.add("post");
            postDiv.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <small>Created on: ${post.created_at}</small>
                <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
                <button class="edit-btn" onclick="editPost(${post.id}, '${post.title}', '${post.content}')">Edit</button>
            `;
            postsDiv.appendChild(postDiv);
        });
    })
    .catch(error => alert("Error loading posts: " + error));
}

function deletePost(id) {
    if (confirm("Are you sure you want to delete this post?")) {
        fetch(`delete_post.php?id=${id}`, { method: "GET" })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Post Deleted Successfully!");
                    loadPosts();
                } else {
                    alert("Failed to delete post.");
                }
            })
            .catch(error => alert("Error: " + error));
    }
}

function editPost(id, title, content) {
    document.getElementById("updateTitle").value = title;
    document.getElementById("updateContent").value = content;
    document.getElementById("updateId").value = id;
    document.getElementById("updateForm").style.display = "block";
}

// Load posts on page load
loadPosts();
