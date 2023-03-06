const fileSelector = document.getElementById('file-selector');
const reader = new FileReader();
var class_need_to_remind = [];
var mailSection = document.getElementById("mail-section");
mailSection.hidden = true;
var table;
var count_class = 0;
var campus = "";
var classByCampus = []
function calNextDay(){
    const monthList = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    var date = new Date()
    var day = date.getDate()
    var month = date.getMonth()
    var year = date.getFullYear()
    if((year % 100 != 0 && year % 4 == 0) || year % 400 == 0)
        monthList[1] = 29
    if(day + 1 > monthList[month]){
        day = 1
        if(month + 1 > 11){
            month = 1
            year += 1
        }
        else
            month += 1
    }
    else
        day += 1
    
    if(day < 10)
        day = "0" + day
    if(month + 1 < 10)
        month = "0" + (month + 1)
    return day + "/" + month + "/" + year
}

function createMessage(num){
    remindStr = class_need_to_remind[num]
    teacherName = remindStr["teacherName"]
    const ptName = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    content = ""
    for(var i = 0; i < remindStr["class"].length; i += 1){
        content += "- " + remindStr["class"][i] + ": Lesson " + remindStr["lesson"][i]
        content += "<br/>"
    }
    remind = "Hi Mr./Ms. " + teacherName +", I'm " +ptName+" - a " + position + " from " + campus + " campus.  I found that you forgot to input CPR for these groups:<br/>" + content
    var mess_section = document.getElementById("message-section")
    mess_section.innerHTML +="<br/><br/>" + remind + "<br/>" + 
            "Could you please make it before tomorrow (" + calNextDay() +")?<br/>" +
            "Thank you! Have a nice day!<br/>"+
            "*Note: If there are any issues with the CPR link, please mention it in your group on Slack."
}

function getClassList(){
    classByCampus = []
    count_class = 0
    error = document.getElementById("error")
    error.innerHTML = ""
    campus = document.getElementById("campus").value;
    if(campus == ""){
        error.innerHTML = "Bạn phải nhập tên campus!";
        return;
    }
    
    var rows = table[0].querySelectorAll("tr")
    var reg = "("+campus+"[^\\s]+)";
    rows.forEach(r => {
        if(r.childNodes[4].innerText.match(new RegExp(reg, "g")))
            classByCampus.push(r);
    })
    generateForm(0);
    // rows.forEach(r => {
    //     url = r.childNodes[4].innerText.match(/(https:[^\s]+)/)
    //     console.log(r.childNodes[8].innerText + "\n-" + r.childNodes[4].innerText.match(new RegExp(reg, "g")) + "\n-" + url)
    // })
}

function generateForm(i){
    r = classByCampus[i];
    // console.log(r);
    url = r.childNodes[4].innerText.match(/(https:[^\s]+)/)
    var reg = "("+campus+"[^\\s]+)";
    // // console.log(new RegExp(reg, "g"))
    const _class = r.childNodes[4].innerText.match(new RegExp(reg, "g"))
    if(_class){
        window.open(url, '_blank')
        var this_class = document.getElementsByName("class");
        var this_lesson = document.getElementsByName("lesson");
        var this_teacher = document.getElementsByName("teacher");
        // console.log(_class)
        try{
            _class[0] = _class[0].replace(_class[0].match("([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")[0], "")
        }
        catch(e){

        }
        this_class[0].value = _class[0];
        this_lesson[0].value = r.childNodes[1].innerText;
        this_teacher[0].value = r.childNodes[9].innerText;
        // let status;
        // window.focus();
        // status = window.prompt(_class + " - next lesson: " + r.childNodes[1].innerText + "- teacher: " + r.childNodes[9].innerText)
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
    r = classByCampus[count_class];
    var reg = "("+campus+"[^\\s]+)";
    // // console.log(new RegExp(reg, "g"))
    const _class = r.childNodes[4].innerText.match(new RegExp(reg, "g"))
    try{
        _class[0] = _class[0].replace(_class[0].match("([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")[0], "")
    }
    catch(e){

    }
    if(status[0].value.length > 0){
        var isNewTeacher = false
        var i = 0
        class_need_to_remind.forEach(c => {
            if(c["teacherName"] == r.childNodes[9].innerText)
            {
                isNewTeacher = true
                return;
            }
            i++;
        })
        if(!isNewTeacher)
        {
            var newClass = {
                teacherName: r.childNodes[9].innerText,
                class: [_class],
                lesson: [status[0].value]
            }
            class_need_to_remind.push(newClass)
            
        } 
        else{
            class_need_to_remind[i]["class"].push(_class)
            class_need_to_remind[i]["lesson"].push(status[0].value)
        }
        status[0].value = "";
    }
    count_class++;
    if(count_class < classByCampus.length)
        generateForm(count_class);
    else{
        class_need_to_remind.forEach(c => {
            addClassNeedToRemind(c)
        })
        var this_class = document.getElementsByName("class");
        this_class.value = "";
        var this_lesson = document.getElementsByName("lesson");
        this_lesson.value = "";
        var this_teacher = document.getElementsByName("teacher");
        this_teacher.value = "";
    }
    // console.log(count_class);
    
}
function addClassNeedToRemind(_class){
    var body = document.getElementsByTagName('tbody');
    // const remindStr = _class.split(",")
    const teacherName = _class["teacherName"]
    var className = ""
    _class["class"].forEach(c => {
        className += c + "<br/>"
    })

    var lesson = ""
    _class["lesson"].forEach(l => {
        lesson += l + "<br/>"
    })
    
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
        var i = 0
        mailbox.forEach(b => {
            if(b.checked==true)
                class_after24h.push(class_need_to_remind[i])
            i++
        });
        if(class_after24h.length > 0){
            var body = document.getElementById('remind-table');
            body.innerHTML = "";
            class_after24h.forEach(c => {
                const teacherName = c["teacherName"]
                var className = ""
                var lesson = ""
                for(var i = 0; i < c["class"].length; i++){
                    className += c["class"][i] + "<br/>"
                    lesson += c["lesson"][i] + "<br/>"
                }
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