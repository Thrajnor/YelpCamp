var $

function init() {

  $('#editButton').on('click', function() {
    $('#editForm').slideToggle('350')
  })

  $('#commentButton').on('click', function() {
    $('#commentForm').slideToggle('350')
  })

  function resizingImageContainer() {
    var height = $('#image').height() - 70
    height = Math.floor(height)
    $('#imageContainer').css('height', height)
  }
  resizingImageContainer()

}

init()
