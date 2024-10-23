// src/models/User.js

class User {
  constructor({
    id = null,
    name,
    email,
    password,
    pic = "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?w=826&t=st=1729501683~exp=1729502283~hmac=fb3d646cd8008770c4737c97ef508bfd0c7d6403df01c60c28cbb2d541aee33a",
    createdAt = new Date(),
  }) {
    this.id = id; // Document ID from Firestore.
    this.name = name.trim();
    this.email = email.trim();
    this.password = password.trim();
    this.pic = pic.trim();
    this.createdAt = createdAt;
  }

  // Convert the user object to Firestore document type.
  toFirestore() {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      pic: this.pic,
      createDate: this.createdAt,
    };
  }
}

module.exports = User;
