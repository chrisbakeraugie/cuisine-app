$(document).ready(() => {
  const socket = io();

  $("#chatForm").submit(() => {
    let text = $("#chat-input").val(); // Grab text value from input field
    let userId = $("#chat-user-id").val();
    let userName = $("#chat-username").val();

    socket.emit("message", {
      content: text,
      userName: userName,
      userId: userId
    });
    $("#chat-input").val("");
    return false;
  });

  socket.on("message", (message) => {
    displayMessage(message);
  });

  socket.on("load all messages", (data) => {
    data.forEach(message => {
      displayMessage(message);
    });
  });

  let displayMessage = (message) => {
    $("#chat").prepend($("<li style='list-style:none;'>").html(`
    <strong class="message ${getCurrentUserClass(message.user)}">
    ${message.userName}
    </strong>: ${message.content}`));
  };

  let getCurrentUserClass = (id) => {
    let userId = $("#chat-user-id").val();
    return (
      userId === id ? "current-user" : "" // Check whether messages user id matches the form's user id
    );
  }


  // Get the modal
  var modal = document.getElementById("myModal");
  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");
   // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks the button, open the modal 
  btn.onclick = function () {
    modal.style.display = "block";
    $(document).ready(() => {
      $.get("/api/courses?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNWZiZWM1NWIzZmMwNjkwODdjYmQzNzM4IiwiZXhwIjoxNjA2NTgxNzEwMjE5LCJpYXQiOjE2MDY0OTUzMTB9.vkZGSF1Xu2JVO--0bd8gfsN2MoSAhVJen9OV0Bu1qHI", (results = {}) => {
        let data = results.data;
        if (!data || !data.courses) {
          return;
        }
        data.courses.forEach((course) => {
          $(".modal-body").append(
            `<div class="card">
              <h4 class="course-title card-header">
                ${course.title}
                </h4>
                <div class="card-body">
                <p class="course-description card-text">
                  ${course.description}
                  </p>
                  <div class="text-right">
                    <button class='btn btn-info ${course.joined ? "joined-button" : "join-button"}' data-id="${course._id}">${course.joined ? "Joined" : "Join"}
                    </div>
                  </div>
              </div>`
          );
        });
      }).then(() => {
        addJoinButtonListener()
      });
    });
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }


  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      $.get("/courses?format=json", (data) => {
        data.forEach((course) => {
          $(".modal-body").empty();
        })
      })

    }
  }
}
);

let addJoinButtonListener = () => {
  $(".join-button").click((event) => {
    let $button = $(event.target)
    let courseId = $button.data("id");
    $.get(`/api/courses/${courseId}/join`, (results = {}) => {
      let data = results.data;
      if (data && data.success) {
        $button.text("Joined")
          .addClass("joined-button")
          .removeClass("join-button");
      } else {
        $button.text('Sorry, try again!');
      }
    })
  })
}

// $(document).ready(() => {
//   $("#modal-button").click(() => {
//     $(".modal-body").html("");
//     $.get("/courses?format=json", data => {
//       data.forEach(course => {
//         $(".modal-body").append(
//           `<div>
// 						<span class="course-title">
//               ${course.title}
// 						</span>
// 						<div class="course-description">
// 							${course.description}
// 						</div>
// 					</div>`
//         );
//       });
//     });
//   });
// });
