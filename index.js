import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  push,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-a1088-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsInDB = ref(database, "endorsementsList");

const publishBtn = document.getElementById("publish-btn");
const endorsementsOutput = document.getElementById("endorsements-output");
const fromText = document.getElementById("from-text");
const toText = document.getElementById("to-text");
const endorsementText = document.getElementById("endorsement-text");
const endorsementLikes = document.querySelectorAll(".like-icon");
const endorsementLikesCount = document.querySelectorAll("like-count");

let endorsement = {
  sender: "",
  message: "",
  recipient: "",
  reaction: "",
};
publishBtn.addEventListener("click", function () {
  endorsement = {
    sender: fromText.value,
    recipient: toText.value,
    message: endorsementText.value,
    reaction: "",
  };
  //   let message =
  //     "To you my friend, Jeffu. You deserve this win. It has been a long time coming. Sit back and revel in it's glory. I pray that the joy lasts forever 🫶.";
  if (
    endorsementText.value === "" ||
    toText.value === "" ||
    fromText.value === ""
  ) {
    return endorsementsInDB;
  } else {
    clearEndorsementsOutput();
    push(endorsementsInDB, endorsement);
    clearEndorsement();
  }
});

onValue(endorsementsInDB, function (snapshot) {
  if (snapshot.exists()) {
    clearEndorsementsOutput();

    let itemsArray = Object.entries(snapshot.val());
    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemValue = currentItem[1];
      let renderedOutput = document.createElement("div");
      renderedOutput.className = "endorsements-output";
      renderedOutput.innerHTML = `
      <h3 class="sender">From: ${currentItemValue.sender}</h3>
      <p class="endorsement-paragraph">${currentItemValue.message}</p> 
      <div class="block">
        <h3 class="recipient">To: ${currentItemValue.recipient}</h3> 
        <div class="reaction">
            <span class="like-icon">❤️</span>
            <span class="like-count">0</span>
        <div>
      </div>
      `;
      endorsementsOutput.append(renderedOutput);
    }
  } else {
    endorsementsOutput.innerHTML = `<p style="color:white">Be the first to celebrate this awesome creator!"</p>`;
  }
});
function clearEndorsementsOutput() {
  endorsementsOutput.innerHTML = "";
}
function clearEndorsement() {
  endorsementText.value = "";
  toText.value = "";
  fromText.value = "";
}

renderEndorsement(console.log(endorsement));

document.addEventListener("DOMContentLoaded", function () {
  function handleLikeClick() {
    // Check if the user has already liked this content
    if (!this.classList.contains("liked")) {
      // Increment like count
      const likeCount = this.parentElement.querySelector(".like-count");
      likeCount.textContent = parseInt(likeCount.textContent) + 1;

      // Mark as liked
      this.classList.add("liked");

      // Disable further clicks and visually indicate it
      this.classList.add("disabled");

      // Remove the event listener to prevent further clicks
      this.removeEventListener("click", handleLikeClick);
    } else {
      // Inform the user that they have already liked this content
      alert("You've already liked this content.");
    }
  }

  // Attach click event handler to each like button
  endorsementLikes.forEach(function (btn) {
    btn.addEventListener("click", handleLikeClick);
  });
});
