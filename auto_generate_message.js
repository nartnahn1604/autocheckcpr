
// sum = 0
// count = 0
// function Purify(text) {
//     var urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
//     return text.replace(urlRegex, function (url) {
//         return '<a class="text-blurple" target="_blank" href="' + url + '">' + url + '</a>';
//     })
// }
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
        console.log(content)
    }
    remind = remindStr[0].replace("-","") + "<br/>Hi " + teacherName +", I'm " +ptName+" - a " + position +" at Algorithmics. This message is for reminding you about filling in the CPR:<br/>" + content
    var mess_section = document.getElementById("message-section")
    mess_section.innerHTML +="<br/><br/>" + remind + "<br/>Thank you,<br/>" + ptName
    mess_section.hidden = false
    // alert(remind + "<br/>Thank you,<br/>" + ptName)
}
document.addEventListener("DOMContentLoaded", () => {
    // console.log("Hello World!");
    fileSelector.addEventListener('change', (event) => {
        const fileList = event.target.files;
        reader.readAsText(fileList[0])
        reader.addEventListener('load', (e) => {
            // console.log(e.target.result);
            const data = e.target.result;
            var parser = new DOMParser();
            
            // Parse the text
            var doc = parser.parseFromString(data, "text/html");
            var table = doc.getElementsByTagName('table')
            
            console.log(table[0]);
            var rows = table[0].querySelectorAll("tr")
            console.log(rows)
            var stopLoop = false
            rows.forEach(r => {
                if(stopLoop)
                    return;
                url = r.childNodes[4].innerText.match(/(https:[^\s]+)/)
                const _class = r.childNodes[4].innerText.match(/(NVH[^\s]+)/g)
                console.log(_class)
                if(_class){
                    window.focus();
                    window.open(url, '_blank')
                    let status = prompt(_class + " - next lesson: " + r.childNodes[1].innerText + "- teacher: " + r.childNodes[10].innerText)
                    if(status != null || status.length > 0){
                        if(status != 0){
                            console.log(status)
                            class_need_to_remind.push(_class + "," + status + "," + r.childNodes[10].innerText)
                            addClassNeedToRemind(_class + "," + status + "," + r.childNodes[10].innerText)
                            console.log(_class + "," + status + "," + r.childNodes[10].innerText)
                        }
                        // status.replace(status.match(/\d[^\s]+/g),"")
                    }
                    else
                        stopLoop = true;
                }
            })
            // console.log(class_need_to_remind)
        });
    });
    
    function addClassNeedToRemind(_class){
        var body = document.getElementsByTagName('tbody');
        console.log(body)
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
    // var addMess = document.querySelectorAll('#messageBtn')
    // var count = 1
    // addMess.forEach(btn => {
    //     btn.addEventListener('click', createMessage(count));
    //     count++;
    // })
    // function createMessage(num){
    //     // root = document.getElementById("root")
    //     remindStr = class_need_to_remind[num].split(",")
    //     teacherName = remindStr[remindStr.length - 1]
    //     const ptName = document.getElementById("name").value;
    //     const position = document.getElementById("position").value;
    //     content = ""
    //     for(var i = 0; i < remindStr.length - 1; i += 2){
    //         content += "- " + remindStr[i] + ": Lesson " + remindStr[i + 1]
    //         content += "\n"
    //         console.log(content)
    //     }
    //     remind = remindStr[0].replace("-","") + "\nHi " + teacherName +", I'm " +ptName+" - a " + position +" at Algorithmics. This message is for reminding you about filling in the CPR:\n" + content
    //     var mess_section = document.getElementById("message-section")
    //     mess_section.innerHTML += remind
    //     alert(remind + "\nThank you,\n" + ptName)
    // }
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
            console.log(body)
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
        // console.log(class_after24h);
        mailSection.removeAttribute("hidden")
        // alert(1);
        // console.log(mailbox)
    })
    // mailBtn.onclick = createMail(class_need_to_remind);
    // function createMail(classes){
    //     if(mailBtn.click == true)
    //         alert(1)
    // }
  });