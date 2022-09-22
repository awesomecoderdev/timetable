// const { default: axios } = require("axios");

// const awesomecoder_featch = document.getElementById("awesomecoder_featch");
// const awesomecoder_animate = document.getElementById("awesomecoder_animate");
// const icon = document.getElementById("awesomecoder_app_icon");
// const downloads = document.getElementById("awesomecoder_app_downloads");
// const stars = document.getElementById("awesomecoder_app_stars");
// const ratings = document.getElementById("awesomecoder_app_ratings");
// const devName = document.getElementById("awesomecoder_app_devName");
// const devLink = document.getElementById("awesomecoder_app_devLink");
// const title = document.getElementById("title");
// const awesomecoder_app_url = document.getElementById("awesomecoder_app_url");

// awesomecoder_featch.addEventListener("click", function (e) {
//   awesomecoder_animate.classList.add("animate-spin");
//   axios
//     .post(awesomecoder.ajaxurl, {
//       app: awesomecoder_app_url.value,
//       name: "Ibrahim",
//     })
//     .then(function (res) {
//       const response = res.data;
//       // console.log(response);

//       if (response.name !== "") {
//         title.value = response.name;
//       }
//       if (response.icon !== "") {
//         icon.value = response.icon;
//       }
//       if (response.downloads !== "") {
//         downloads.value = response.downloads;
//       }
//       if (response.stars !== "") {
//         stars.value = response.stars;
//       }
//       if (response.ratings !== "") {
//         ratings.value = response.ratings;
//       }
//       if (response.devName !== "") {
//         devName.value = response.devName;
//       }
//       if (response.devLink !== "") {
//         devLink.value = response.devLink;
//       }
//       awesomecoder_animate.classList.remove("animate-spin");
//     })
//     .catch(function (err) {
//       awesomecoder_animate.classList.remove("animate-spin");
//     });
// });
