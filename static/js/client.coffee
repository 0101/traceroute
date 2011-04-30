input = $ '#input'
output = $ '#output'

initializeDisplay = (display, headerText) ->
  header = $ '<h2/>', text: headerText
  display.append header
  display.append $ '<div/>', class: 'inner'
  closeButton = $ '<span/>', class: 'closeButton'
  closeButton.appendTo header
  closeButton.click ->
    display.fadeOut 100
    input.focus()

input.hide()
loadingText = $ '<span/>', class: 'loading', text: "Please wait..."
loadingText.insertAfter input


now.startOutput = (id) -> output.prepend $ '<pre/>', id: id

now.endOutput = (id) -> $('#' + id).addClass 'done'

now.output = (id, content) ->
  display = $ '#' + id
  if display.children().size() is 0
    initializeDisplay display, content
  else
    display.find('.inner').append $ '<span/>', text: content

now.error = (id, content) ->
  display = $('#' + id).append $ '<div/>', class: 'error', text: content
  setTimeout (-> display.fadeOut 2000), 5000


now.ready ->
  loadingText.hide()
  input.show().focus()
  input.keydown (e) ->
    if e.keyCode == 13 and input.val() isnt ''
      now.run input.val()
      input.val ''
