const fileSelector = document.getElementById('file-selector');
const reader = new FileReader();
var class_need_to_remind = [];
var mailSection = document.getElementById("mail-section");
mailSection.hidden = true;
function createMessage(num){
    remindStr = class_need_to_remind[num].split(",")
    teacherName = remindStr[remindStr.length - 1]
    const ptName = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    content = ""
    for(var i = 0; i < remindStr.length - 1; i += 2){
        content += "- " + remindStr[i] + ": Lesson " + remindStr[i + 1]
        content += "<br/>"
    }
    remind = remindStr[0].replace("-","") + "<br/>Hi " + teacherName +", I'm " +ptName+" - a " + position +" at Algorithmics. This message is for reminding you about filling in the CPR:<br/>" + content
    var mess_section = document.getElementById("message-section")
    mess_section.innerHTML +="<br/><br/>" + remind + "<br/>Thank you,<br/>" + ptName
    mess_section.hidden = false
}
document.addEventListener("DOMContentLoaded", () => {
    fileSelector.addEventListener('change', (event) => {
        const fileList = event.target.files;
        reader.readAsText(fileList[0])
        reader.addEventListener('load', (e) => {
            const data = e.target.result;
            var parser = new DOMParser();
            
            // Parse the text
            var doc = parser.parseFromString(data, "text/html");
            var table = doc.getElementsByTagName('table')
            
            var rows = table[0].querySelectorAll("tr")
            var stopLoop = false
            rows.forEach(r => {
                if(stopLoop)
                    return;
                url = r.childNodes[4].innerText.match(/(https:[^\s]+)/)
                const _class = r.childNodes[4].innerText.match(/(NVH[^\s]+)/g)
                if(_class){
                    window.open(url, '_blank')
                    let status;
                    window.focus();
                    status = window.prompt(_class + " - next lesson: " + r.childNodes[1].innerText + "- teacher: " + r.childNodes[10].innerText)
                    // setTimeout(function(){
                    // }, 1000)
                    window.focus();
                    if(status != null || status.length > 0){
                        if(status != 0){
                            class_need_to_remind.push(_class + "," + status + "," + r.childNodes[10].innerText)
                            addClassNeedToRemind(_class + "," + status + "," + r.childNodes[10].innerText)
                        }
                    }
                    else
                        stopLoop = true;
                }
            })
        });
    });
    
    function addClassNeedToRemind(_class){
        var body = document.getElementsByTagName('tbody');
        const remindStr = _class.split(",")
        const teacherName = remindStr[remindStr.length - 1]
        const className = remindStr[0].substring(0, remindStr[0].length - 4)
        const lesson = remindStr[1]
        var str = '<tr>'+
                '<td>'+ (body[0].children.length + 1) +'</td>'+
                '<td>' + className + '</td>'+
                '<td>' + teacherName + '</td>'+
                '<td>'+ lesson + '</td>'+
                '<td>'+
                '    <input id="messageBtn" onclick="createMessage(' +body[0].children.length+ ')" type="button" value="Create message">'+
                '    <input type="checkbox" value="false">'+
                '</td>'+
            '</tr>'
        body[0].innerHTML += str;
    }
    var mailBtn = document.getElementById("create-mail");
    mailBtn.addEventListener('click', function(){
        var mailbox = document.querySelectorAll('input[type="checkbox"]')
        // var count = 0;
        var class_after24h = []
        mailbox.forEach(b => {
            if(b.checked==true)
                class_after24h.push(b.parentElement.parentElement.children[1].innerText+","+b.parentElement.parentElement.children[2].innerText+","+b.parentElement.parentElement.children[3].innerText)
        });
        if(class_after24h.length > 0){
            var body = document.getElementById('remind-table');
            class_after24h.forEach(c => {
                const remindStr = c.split(",")
                const teacherName = remindStr[1]
                const className = remindStr[0]
                const lesson = remindStr[2]
                var str = '<tr>'+
                        '<td>'+ (body.children.length + 1) +'</td>'+
                        '<td>' + className + '</td>'+
                        '<td>' + teacherName + '</td>'+
                        '<td>'+ lesson + '</td>'+
                        '</td>'+
                    '</tr>'
                body.innerHTML += str;
            })
        }
        mailSection.removeAttribute("hidden")
    })
  });