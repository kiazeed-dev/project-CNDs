//521517
//ตรวจสอบการใส่ข้อมูล
function check_login() {
    if (txtuser.value != "" && txtpass.value != "" && selectsethospital.value !="Hospital") {

        login(txtuser.value, txtpass.value, selectsethospital.value)
    }
    else {

        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }   
}
//เข้าสู่ระบบจาก Imed
function loginImed(usr, pass , hn) {

    var _hn = hn

    formdata = {
        "_username": usr, 
        "_password": pass,
        "_sitename":site,
    }
    $.ajax({
        type: "POST",
        url: "https://localhost:44306/api/LoginUser",
        data: formdata,
        dataType: "json",
        success: re_checklogin,
        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
            console.log("+++++++++++++++++++++++++  Bot notification failed, error is '" + thrownError + "' " + jqXHR.responseText);
            chk = false;
        }
    });

    function re_checklogin(response) {
        var str = response;

        if(str == "" || str == null){

            alert("รหัสไม่ถูกต้อง")
            
        }else{

            var data = JSON.parse(str);

            sessionStorage.setItem("userID", data[0].ht_username);

            document.getElementById("empID").innerHTML = ""+sessionStorage.userID+""

            sessionStorage.setItem("UserActive", true)

            if(_hn != "" && sessionStorage.UserActive == "true" ){

                inputHN.value = _hn;
                reloadpage_local(_hn); 

            }
        }
    }
}

//เข้าสู่ระบบจาก Page login.html 
function login(usr,pass,site) {

    formdata = {

        "_username": usr, 
        "_password": pass,
        "_sitename": site, 
       
    }
    $.ajax({
        type: "GET",
        url: "https://localhost:44306/api/LoginUser",
        data: formdata,
        dataType: "json",
        success: re_getlogin,
        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
            console.log("+++++++++++++++++++++++++  Bot notification failed, error is '" + thrownError + "' " + jqXHR.responseText);
            chk = false;
        }
    });
    function re_getlogin(response) {

        var str = response;
        console.log(response)
        if(str == "" || str == null){

            alert("กรุณาตรวจสอบ Username หรือ Password หรือ Sitename")

        }else{

            var data = JSON.parse(str);

            sessionStorage.setItem("userID", data[0].ht_username);
            
            window.location = "index.html";
        }
    }
}