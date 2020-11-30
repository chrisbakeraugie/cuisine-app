/* eslint-disable no-undef */
$(document).ready(() => {
  const socket = io()

  $('#chatForm').submit(() => {
    const text = $('#chat-input').val() // Grab text value from input field
    const userId = $('#chat-user-id').val()
    const userName = $('#chat-username').val()

    socket.emit('message', {
      content: text,
      userName: userName,
      userId: userId
    })
    $('#chat-input').val('')
    return false
  })

  socket.on('message', (message) => {
    displayMessage(message)
    for (let i = 0; i < 2; i++) {
      console.log('\n\nRan flash\n\n')
      $('.chat-icon').fadeOut(200).fadeIn(200)
    }
  })

  socket.on('load all messages', (data) => {
    data.forEach(message => {
      displayMessage(message)
    })
  })

  // Listen for "user disconnected" event and display a custom message
  socket.on('user disconnected', () => {
    displayMessage({
      userName: 'Notice',
      content: 'User left the chat'
    })
  })

  const displayMessage = (message) => {
    $('#chat').prepend($("<li style='list-style:none;'>").html(`
    <strong class="message ${getCurrentUserClass(message.user)}">
    ${message.userName}
    </strong>: ${message.content}`))
  }

  const getCurrentUserClass = (id) => {
    const userId = $('#chat-user-id').val()
    return (
      userId === id ? 'current-user' : '' // Check whether messages user id matches the form's user id
    )
  }

  // Get the modal
  const modal = document.getElementById('myModal')
  // Get the button that opens the modal
  const btn = document.getElementById('myBtn')
  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName('close')[0]
  // When the user clicks the button, open the modal
  btn.onclick = function () {
    modal.style.display = 'block'
    $(document).ready(() => {
      $.get('/api/courses?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNWZiZWM1NWIzZmMwNjkwODdjYmQzNzM4IiwiZXhwIjoxNjA2NTgxNzEwMjE5LCJpYXQiOjE2MDY0OTUzMTB9.vkZGSF1Xu2JVO--0bd8gfsN2MoSAhVJen9OV0Bu1qHI', (results = {}) => {
        const data = results.data
        if (!data || !data.courses) {
          return
        }
        data.courses.forEach((course) => {
          $('.modal-body').append(
            `<div class="card">
              <h4 class="course-title card-header">
                ${course.title}
                </h4>
                <div class="card-body">
                <p class="course-description card-text">
                  ${course.description}
                  </p>
                  <div class="text-right">
                    <button class='btn btn-info ${course.joined ? 'joined-button' : 'join-button'}' data-id="${course._id}">${course.joined ? 'Joined' : 'Join'}
                    </div>
                  </div>
              </div>`
          )
        })
      }).then(() => {
        addJoinButtonListener()
      })
    })
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = 'none'
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    // eslint-disable-next-line eqeqeq
    if (event.target == modal) {
      modal.style.display = 'none'
      $.get('/courses?format=json', (data) => {
        data.forEach((course) => {
          $('.modal-body').empty()
        })
      })
    }
  }
}
)

const addJoinButtonListener = () => {
  $('.join-button').click((event) => {
    const $button = $(event.target)
    const courseId = $button.data('id')
    $.get(`/api/courses/${courseId}/join`, (results = {}) => {
      const data = results.data
      if (data && data.success) {
        $button.text('Joined')
          .addClass('joined-button')
          .removeClass('join-button')
      } else {
        $button.text('Sorry, try again!')
      }
    })
  })
}
