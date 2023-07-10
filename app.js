// DOM functions
const searchInput = document.querySelector(".search-input"); // how to access HTML elements in JS
const searchBtn = document.querySelector("#search-btn");
const postsDiv = document.querySelector(".posts");

const usernameInput = document.querySelector("#username");
const imageLinkInput = document.querySelector("#imagelink");
const captionInput = document.querySelector("#caption");
const createPostBtn = document.querySelector("#create-post-btn");
const editPostBtn = document.querySelector("#edit-post-btn");
const logoutBtn = document.querySelector("#logout-btn");
editPostBtn.style.display = "none";

const editBtn = document.querySelector("#edit-btn");

const modal = new bootstrap.Modal(document.getElementById("modal"));
const showCreateModal = document.querySelector("#show-create-modal");

console.log("searchInput", searchInput, searchBtn);



// Global variables
var feed = [];
//   {
//     id: 0,
//     username: "efrenreyes",
//     imageLink: "https://frabjous-pavlova-ebea4c.netlify.app/assets/post.png",
//     caption: "Sky diving is fun!",
//     likes: 0,
//     comments: [],
//     shares: 0,
//     isPublic: true,
//     createdAt: new Date(),
//   },
// ]
// global property
var isEditMode = false;
var postToEditId = null;


const uploadPostToFirebase = (post) => {
  db.collection("posts")
    .doc(post.id + "")
    .set(post)
    .then(() => {
      console.log("POST UPLOADED TO FIREBASE");
    })
    .catch((error) => {
      console.log("ERROR", error);
    });
}



// const uploadPostToFirebase = () => {
//   const postsRef = db.collection("posts");
//   postsRef.get().then( (querySnapshot) => {
//     console.log("querySnapshot", querySnapshot)
//     querySnapshot.forEach((doc) => {
//       console.log(doc.data)
//     })
//   })
// }

const getPostsFromFirebase = () => {
  db.collection("posts")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        feed.push(doc.data());
        outputFeed();
      });
    });
};

// CRUD - Create, Read, Update, Delete
// CREATING A POST
const createPost = (imageLink, caption, username) => {
  const newPost = {
    id: feed.length,
    username: username,
    imageLink: imageLink,
    caption: caption,
    likes: 0,
    comments: [],
    shares: 0,
    isPublic: true,
    createdAt: new Date(),
  };
  console.log("FEED", feed);
  uploadPostToFirebase(newPost);
  feed.push(newPost);
  outputFeed();
  modal.hide();
  // outputFeed(feed);
};

// READING ALL POSTS
// array + anonyomous function: map
const outputFeed = () => {
  // return statuses of the posts
  // map function returns a new array of just the statuses
  const updatedFeed = feed.map((post) => {
    return `
    <div class="post">
      <div class="post-header">
          <p>${post.username}</p>
          <button class="btn btn-sm btn-primary" onclick="showEditPostModal(${post.id})">Edit</button>
      </div>
      <img src="${post.imageLink}" alt="">
      <div class="caption">
          <p>${post.caption}</p>
      </div>
    </div>
    `;
  });
  postsDiv.innerHTML = updatedFeed.join(" ");
};

// UPDATE POST
const updatePost = (id, newImageLink, newCaption) => {
  // update the post with the specific id

  const updatedFeed = feed.map((post) => {
    if (post.id === id) {
      post.imageLink = newImageLink;
      post.caption = newCaption;
    }
    return post;
  });
  feed = updatedFeed;
  outputFeed();
};

// DELETE POST
const deletePost = (id) => {
  // delete the post with the specific id
  const updatedFeed = feed.filter((post) => {
    if (post.id !== id) {
      return post;
    }
  });
  feed = updatedFeed;
  uploadPostToFirebase(feed[id]);
  outputFeed();
};

const outputPostStatus = (post) => {
  const output = `
  POST INFO:
  ID: ${post.id}
  Username: ${post.username}
  Image Link: ${post.imageLink}
  Caption: ${post.caption}
  `;
  return output;
};

const showEditPostModal = (id) => {
  postToEditId = id;
  isEditMode = true;
  createPostBtn.style.display = "none";
  editPostBtn.style.display = "block";
  const postToEdit = feed[id];
  console.log("postToEdit", postToEdit);
  usernameInput.value = postToEdit.username;
  imageLinkInput.value = postToEdit.imageLink;
  captionInput.value = postToEdit.caption;
  modal.show();
};

// IMPLEMENTATION
outputFeed();
getPostsFromFirebase();
// outputFeed(feed);
// demo of creating a post
// createPost(
//   "https://frabjous-pavlova-ebea4c.netlify.app/assets/post.png",
//   "Sky diving was fun...",
//   "efrenreyes"
// );
// createPost(
//   "https://frabjous-pavlova-ebea4c.netlify.app/assets/post.png",
//   "iX is awesome",
//   "unam"
// );
// createPost(
//   "https://frabjous-pavlova-ebea4c.netlify.app/assets/post.png",
//   "Elon musk owns twitter now...",
//   "elonmusk"
// );
// createPost(
//   "https://frabjous-pavlova-ebea4c.netlify.app/assets/post.png",
//   "Demo object",
//   "demoperson"
// );
// createPost(
//   "https://frabjous-pavlova-ebea4c.netlify.app/assets/post.png",
//   "fruits are delicious",
//   "healthyperson"
// );

// updatePost(2, "www.imagelink.com/imagelink", "SpaceX next launch soon!");
// deletePost(4);
// deletePost(0);

outputFeed();

// Event Listeners
searchBtn.addEventListener("click", () => {
  console.log(searchInput.value);
  searchInput.style.background = "red";
});
createPostBtn.addEventListener("click", () => {
  console.log("create post btn clicked");
  createPost(imageLinkInput.value, captionInput.value, usernameInput.value);
});
showCreateModal.addEventListener("click", () => {
  isEditMode = false;
  createPostBtn.style.display = "block";
  editPostBtn.style.display = "none";
  usernameInput.value = "";
  imageLinkInput.value = "";
  captionInput.value = "";
  modal.show();
});
editPostBtn.addEventListener("click", () => {
  console.log("edit post btn clicked");
  updatePost(postToEditId, imageLinkInput.value, captionInput.value);
  modal.hide();
});
logoutBtn.addEventListener("click", () => {
  handleLogout();
});

// //Methdd to delete an image from the firebase storage
// deleteIMG () {
//   console.log(this.postData.postID);

//   let storage = firebaseStorage.ref().child(this.postData.imgFile);

//   storage.delete();

//   setTimeout(() => {
//     this.deletePost();
    
//   }, 3000);
// }

// //Method to delete the post from the firebase database
// deletePost() {
//   db
//     .collection("posts")
//     .doc(this.postData.postID)
//     .delete()
//     .then(() => {
//       console.log("Document successfully deleted!");
//       this.RetrievePost();
//     })
//     .catch((error) => {
//       console.error("Error removing document: ", error);
//     });
// }