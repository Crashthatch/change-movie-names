'use strict'
var promiseCSV = require('./promiseCSV.js');

String.prototype.toTitleCase = function () {
  return this.replace(/\w\S*/g, function(txt){
    if( txt.toUpperCase() == txt ) //Leave roman numerals, or "XXX" alone.
      return txt;
    else
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

//Load movie titles:
var movieNames = [];
var englishWordsSet = new Set();
let funnyNames = new Set();
promiseCSV("movie_metadata.csv", { 'headers': true })
  .then(function (movies) {
    movieNames = movies.map( m => m.movie_title.trim());
    return promiseCSV("/usr/share/dict/words");
  })
  .then(function(englishWords){
    englishWords.forEach(word => englishWordsSet.add(word[0].toLowerCase()));
  })
  .then( function(){
    movieNames.map(movieName => {
        movieName.split(" ").map( movieWord => {
          if( !movieWord.toLowerCase().includes("r") || new Set(['your', 'years', 'year', 'part', 'or', 'far']).has(movieWord.toLowerCase()) ){
            return;
          }
          for( let i=0; i<movieWord.length; i++){
            if( movieWord[i].toLowerCase() == "r" ){
              const alteredWord = movieWord.substring(0,i)+movieWord.substring(i+1);
              if( englishWordsSet.has(alteredWord.toLowerCase()) ){
                //console.log( movieWord, alteredWord);
                 funnyNames.add(movieName.replace( movieWord, alteredWord).toTitleCase() );
              }
            }
          }
      });
    });
    funnyNames.forEach(title => {console.log(title); console.log(" ");});
  });



//process.exit();