console.log("OBJECTS");

const post = {
  username: "efrenreyes",
  imageLink:
    "",
  caption: "This is a post",
  likes: 0,
  comments: [],
  shares: 0,
  isPublic: true,
  createdAt: "2020-02-07T17:00:00.000Z",
};

// Update values in object
post.likes = 10;

// delete values in object
delete post.createdAt;

// Access values in object
console.log(
  `${post.username} posted "${post.caption}" and got ${post.likes} likes`
);

console.log("Post", post);
