import Ember from 'ember';

export default Ember.ArrayController.extend({
  town: null,

  actions: {
    process: function  () {
      var _this = this;

      var fr = new FileReader();
      var fileInputElement = document.getElementById("file");
      fr.readAsText(fileInputElement.files[0]);

      fr.onload = function () {
          var allTextLines = fr.result.split(/\r\n|\n/);
          var headers = allTextLines[0].split(';');
          if (headers.length < 2) {
            headers = allTextLines[0].split(',');
          }
          var lines = [];

          for (var i=1; i<allTextLines.length; i++) {       
              var data = allTextLines[i].split(';');
              if (data.length < 2)
                data = allTextLines[i].split(',');

              if (data.length == headers.length) {
                  var tarr = Ember.Object.create({
                    lineNumber: i
                  });
                  for (var j=0; j<headers.length; j++) {
                      tarr.set(headers[j].toLowerCase().replace(/ /g, '_'), data[j]);
                  }
                  lines.push(tarr);
              }
          }
          _this.proccesLines(lines);
      };
    },      
  
  },
  
  proccesLines: function (lines) {
      if (this.get('town')) {
        var _this = this;
        this.get('store').find('borough', {town: this.get('town').get('id')}).then(function (boroughs) {
          var schools = [];
          var boards = [];
          

          lines.forEach(function (line) {

            var borough = boroughs.findProperty('id', line.get('zona'));

            if (borough) {
              var school = _this.get('store').createRecord('school', {
                name: line.get('escuela'),
                address: line.get('direccion'),
                borough: borough,
                town: _this.get('town')                 
              });

              for (var i = parseInt(line.get('mesa_desde')); i <= parseInt(line.get('mesa_hasta')); i++) {
                var board = _this.get('store').createRecord('board', {
                    name: i.toString(),
                    school: school,
                    borough: borough,
                    town: _this.get('town') 
                });
                boards.pushObject(board);
              }
              schools.pushObject(school);
            }
          });


          var promises = Ember.A();
          

          schools.forEach(function(item){      
              promises.push(item.save());
          });

          Ember.RSVP.Promise.all(promises).then(function(resolvedPromises){       
              boards.forEach(function(item){
                  promises.push(item.save());     
              });
              Ember.RSVP.Promise.all(promises).then(function(resolvedPromises){
                 //
              });
          });   
        });
      }
  },  
});
