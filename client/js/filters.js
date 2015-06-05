var data = [
  'Full-Stack',
  'No-Stack',
  'What-Stack',
  'Cool-Stack',
  'Whatver-Stack',
  'Fsdf',
  'fdfsdf'
];

var finalData = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.whitespace,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  local: data
});

$(function() {

  $('.typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'roles',
    source: finalData
  });

});
