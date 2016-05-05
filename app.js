var nw = require('nw.gui');
var win = nw.Window.get();
var fs = require('fs');
var WebSocket = require('ws');
var open = require("open");


var submissions, students, courses, assignments;

var fn = "";


var onInit = function(){

  var ws = new WebSocket('ws://localhost:5000');
  ws.on('open', function(){
    console.log('Connected');
  });
  ws.on('message', function(data){
    if(typeof data === 'string'){
      if(data == "Pluto/Handshake/ID")
        ws.send('Pluto/Handshake/ID:1');
      else if(data.indexOf('$') != -1){
        var d = data.split('$');
        if(d[0] === "submissions"){
          submissions = JSON.parse(d[1]);
          $('.tdata').remove();
          for(var i=0;i<submissions.submissions.length;i++){
            var tr = "<tr class='tdata'><td>"+submissions.submissions[i].SubmissionID+"</td>";
            var links = '';
            var fl = submissions.submissions[i].fileList.split('*');
            for(var j=0; j<fl.length;j++){
              var d = fl[j].split('|');
              links += ' <button type="button" value="'+d[0]+'" class="fbtn" >'+d[0]+'</button>'
            }
            tr += "<td>"+submissions.submissions[i].fileList+' -'+links+"</td>";
            tr += "<td>"+submissions.submissions[i].AssignmentID+"</td>";
            tr += "<td>"+submissions.submissions[i].StudentID+"</td>";
            tr += "<td>"+submissions.submissions[i].CreatedBy+"</td>";
            tr += "<td>"+submissions.submissions[i].CreatedDateTime+"</td>";
            tr += "<td>"+submissions.submissions[i].ModifiedBy+"</td>";
            tr += "<td>"+submissions.submissions[i].ModifiedDateTime+"</td></tr>";
            $('#submissions').append(tr);
          }
          $('.fbtn').click(function(e){
            e.preventDefault();
            open(this.value);
          });
        }
        else if(d[0] === "students"){
          students = JSON.parse(d[1])
        }
        else if(d[0] === "courses"){
          courses = JSON.parse(d[1])
        }
        else if(d[0] === "assignments"){
          assignments = JSON.parse(d[1])
        }
      }
      else if(data.indexOf('#') != -1){
        fn = data.split('#')[1];
      }
    }
    else{
      console.log(typeof data);
      fs.writeFileSync(fn, data);
    }
  });
}
