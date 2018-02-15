
    // инициализация ya.maps
ymaps.ready(init);
var myMap;
function init(){
    myMap = new ymaps.Map("map", {
        center: [53.902496, 27.561481],
        zoom: 7
    });
}
    // инициализация ya.speechkit
window.onload = function () {
    var textline = new ya.speechkit.Textline('answer', {
        apikey: '721aa226-9497-44f9-9e7c-9796f38dcaeb',
        onInputFinished: function(text) {
            checkAnswer(text.length - 1);
        }
    });
};