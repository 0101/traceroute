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

storage = (->
  # if localStorage is available, this object can be used to store entered
  # names for autocompletion.
  if localStorage?
    names = (JSON.parse(localStorage.names) if localStorage.names?) or {}
    commit = -> localStorage.names = JSON.stringify(names)

  ifLS = (fn) ->
    decoratedFn = (args...) ->
      if localStorage?
        fn(args...)
        commit()
        null

  # API:
  add: ifLS (target) -> names[target] = 1
  remove: ifLS (target) -> delete names[target]
  getList: -> if names? then (n for n of names) else []
)()

# bind nowjs functions
now.startOutput = (id) -> output.prepend $ '<pre/>', id: id

now.endOutput = (id) -> $("##{id}").addClass 'done'

now.output = (id, content, target) ->
  display = $ "##{id}"
  if display.children().size() is 0
    initializeDisplay display, content
    storage.add target
  else
    display.find('.inner').append $ '<span/>', text: content

now.error = (id, content, target) ->
  display = $("##{id}").append $ '<div/>', class: 'error', text: content
  setTimeout (-> display.fadeOut 2000), 5000
  storage.remove target


# initialize autocomplete
acFilter = $.ui.autocomplete.filter
input.autocomplete
  source: (request, response) -> response acFilter storage.getList(), request.term
  delay: 10


# display loading text before nowjs is ready
input.hide()
loadingText = $ '<span/>', class: 'loading', text: "Please wait..."
loadingText.insertAfter input


now.ready ->
  loadingText.hide()
  input.show().focus()
  input.keydown (e) ->
    if e.keyCode == 13 and input.val() isnt ''
      now.run input.val()
      input.val ''
