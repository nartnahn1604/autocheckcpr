const fileSelector = document.getElementById('file-selector');
const reader = new FileReader();
var class_need_to_remind = [];
var mailSection = document.getElementById("mail-section");
mailSection.hidden = true;
var table;
var count_class = 1;
var campus = "";
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
}

function generateForm(i){
    if(i == 1){
        campus = document.getElementById("campus").value;
    }
    var rows = table[0].querySelectorAll("tr")
    r = rows[i];
    // console.log(r);
    url = r.childNodes[4].innerText.match(/(https:[^\s]+)/)
    var reg = "("+campus+"[^\\s]+)";
    console.log(new RegExp(reg, "g"))
    const _class = r.childNodes[4].innerText.match(new RegExp(reg, "g"))
    if(_class){
        window.open(url, '_blank')
        var this_class = document.getElementsByName("class");
        var this_lesson = document.getElementsByName("lesson");
        var this_teacher = document.getElementsByName("teacher");
        console.log(this_class)
        this_class[0].value = _class;
        this_lesson[0].value = r.childNodes[1].innerText;
        this_teacher[0].value = r.childNodes[10].innerText;
        // let status;
        // window.focus();
        // status = window.prompt(_class + " - next lesson: " + r.childNodes[1].innerText + "- teacher: " + r.childNodes[10].innerText)
        // setTimeout(function(){
        // }, 1000)
        // window.focus();
    }
    else{
        var this_class = document.getElementsByName("class");
        this_class.value = "";
        var this_lesson = document.getElementsByName("lesson");
        this_lesson.value = "";
        var this_teacher = document.getElementsByName("teacher");
        this_teacher.value = "";
    }
}

function next_class(){
    var status = document.getElementsByName("remind");
    console.log(status[0])
    var rows = table[0].querySelectorAll("tr")
    r = rows[count_class];
    const _class = r.childNodes[4].innerText.match(/(NVH[^\s]+)/g)
    if(status[0].value.length > 0){
        class_need_to_remind.push(_class + "," + status[0].value + "," + r.childNodes[10].innerText)
        addClassNeedToRemind(_class + "," + status[0].value + "," + r.childNodes[10].innerText)
        status[0].value = "";
    }
    count_class++;
    generateForm(count_class);
    // console.log(count_class);
    
}
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
            '</td>'+
            '<td>'+
            '   <input type="checkbox" value="Add to mail remind">'+
            '</td>'
        '</tr>'
    body[0].innerHTML += str;
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
            table = doc.getElementsByTagName('table')
        });
    });
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