var Stamp_En = "";
var db_HyperEn = [];
var checkhncode = "";
var str_selectOption = false;
var _getDBLabResult = [];
var _getDBXRayResult = [];
var inputHN = sessionStorage.hncode;
var txtpt_name = $('#txtpt_name').val();
var txtpt_dob = $('#txtpt_dob').val();
var txtpt_age = $('#txtpt_age').val();
var date_visit = $('#date-visit').val()
var txtpt_drname = $('#txtpt_drname').val();
var _labResult = [];
var _allergy = [];
var _labResult = [];
var _firstbmi = [];
var _lastvitalsign = [];
var _allergy = [];
var _xrayResult = [];


//เมื่อกรอก hncode จะเรียกข้อมูลของคนไข้ 
function getPatient(db_hn) {  
    if (db_hn == "") {
        return "";
    }
    SelectddlEn(db_hn); 
}
//เมื่อเลือก en ที่ Dropdown จะเรียกข้อมูลคนไข้ของ en ที่เลือก
function selectOption(select_en){  
  
    if (select_en == ""){

    }
    var hn = "";
    var select_en = select_en;
    str_selectOption = true;
    // var en = en;
    SelectddlEn(hn,select_en);
}
//เมื่อรีโหลดหน้าเว็ป ให้แสดงข้อมูล ของ hncode จาก sessionStorage
function reloadpage_local(local_hn,local_en){ 
    if (local_hn == "" || local_en == ""){
        return("null")
    }
    var local_hn = local_hn;
    var local_en = local_en;
    document.getElementById("inputHN").value  = local_hn;
    // var en = en;
    SelectddlEn(local_hn,local_en);
} 
//รับ Parameter จากฟังก์ชัน  getPatient(), selectOption(), reloadpage_local() ที่ส่ง Parameter มา
function SelectddlEn(hn,en) { 
    _getDBLabResult = [];
    _getDBXRayResult = [];
    $('#alert_nDataModal').modal('show');
    // console.log(sessionStorage)
    document.getElementById("selectsetEn").innerHTML = "";
    var _Hn = hn;
    cs_dbEn(_Hn) //ฟังก์ชันเรียก push en มาเก็บใน array  เพื่อตรวจสอบการบันทึกข้อมูลใน DB EMR ส่ง hncode เพื่อดึง en ของคนไข้นั้นๆ 
    
    var Hn =$('#inputHN').val().toString();
    //Parameter จาก reloadpage_local() ,  selectOption()
    if ( Hn != "" && en != null) {
        // $( "#bl_unknow" ).prop( "checked", false )
        // $( "#bl_resistant_hypertension" ).prop( "checked", false )
        // $( "#cv_dm" ).prop( "checked", false )
        // $( "#cv_dlp" ).prop( "checked", false)
        // $( "#cv_smoking" ).prop( "checked", false)
        // $( "#cv_cda" ).prop( "checked", false )
        // $( "#od_af" ).prop( "checked", false)
        // $( "#od_copd" ).prop( "checked", false)
        // $( "#od_gout" ).prop( "checked", false )
        // $( "#sc_osa" ).prop( "checked", false)
        // $( "#checkboxOther" ).prop( "checked", false )

        for (var index = 0; index < eiei.length; index++) {
            var diseaseid = eiei[index].disease_id;
            var diseasedetailid = eiei[index].diseasedetail_id;
            var diseasedetailType = eiei[index].diseasedetail_Type;

            if ([index] == 0) {

                    $("#"+[diseaseid]).prop("checked", false)
                    $("#"+diseasedetail_id+"").val("")

            } else if (eiei[index].disease_id == eiei[index-1].disease_id){
                
                if (diseasedetailType == "checkboxplus"){

                    $("#"+[diseasedetailid]).prop("checked", false)
                    $("#"+[diseasedetailid+"text"]).val("")

                } else if (diseasedetailType == "customtext") {
                    $("#"+diseasedetail_id+"").val("")
                }
                else {

                    $("#"+[diseasedetailid]).prop("checked", false)

                }

            } else {

                    $("#"+[diseaseid]).prop("checked", false)

                    if (diseasedetailType == "checkboxplus"){

                        $("#"+[diseasedetailid]).prop("checked", false)
                        $("#"+[diseasedetailid+"text"]).val("")
    
                    } else if (diseasedetailType == "customtext") {
                        $("#"+diseasedetail_id+"").val("")
                    }
                    else {
                        $("#"+[diseasedetailid]).prop("checked", false)
                    }
            }
        }

        $.ajax({

            type: "GET",
            url: "http://172.18.62.245/ImedWebApi/api/Visit?hncode="+Hn,
            dataType: 'json',
            success: function (response) {

                //ตรวจสถานะจาก selectOption() 
                if (str_selectOption == false){
                  
                    if (response != ""){

                        sessionStorage.setItem("hncode", _Hn);

                        //getCv_Risk();
                        var data =JSON.parse(response);
                        var json_response =JSON.parse(response);
                        var count_response = json_response.length-1;

                        //for loop ข้อมูล  Visit ทั้งหมดของคนไข้
                        for (var i = 0 ;i < json_response.length;i++){
                            //เงื่อนไข ตรวจสอบ en ที่เลือกใน dropdown มาตรวจสอบกับ en ใน Visit
                            if (json_response[i].patient_en == en){

                                //document.getElementById("tag_image").innerHTML = "<img src=\""+json_response[i].patientphoto+"\" onerror=\"imageError()\" class=\"image\">";
                                document.getElementById("txtpt_name").value = json_response[i].patient_name;
                                document.getElementById("txtpt_dob").value = json_response[i].patient_dob;
                                document.getElementById("txtpt_age").value = json_response[i].patient_age;
                                document.getElementById("date-visit").value = json_response[i].patient_visit_date;            
                                //document.getElementById("txtpt_drname").value = json_response[i].patient_doctorname;
                                sessionStorage.setItem("hncode", json_response[i].patient_hncode);
                                sessionStorage.setItem("patient_name", json_response[i].patient_name);
                                sessionStorage.setItem("en", json_response[i].patient_en);
                                sessionStorage.setItem("age", json_response[0].patient_age);
                                sessionStorage.setItem("visit_date",json_response[i].patient_visit_date)
                                Stamp_En = en;
                            }
                            document.getElementById("date_first_visit").setAttribute("value",json_response[count_response].patient_visit_date); //วันที่มาตรวจครั้งแรก
                        }
                        document.getElementById("inputHN").value  = _Hn;
                        //getDoctorcasebyHN();

                        var selectsetEn = document.getElementById("selectsetEn");
                        var option = document.createElement("option");
                        document.getElementById("selectsetEn").innerHTML = "";

                        for (var i = 0; i < data.length; i++) {
                          
                            //เงื่อนไข ตัด en ที่มีการบันทึกข้อมูลไว้แล้ว
                            if (!db_HyperEn.includes(data[i].patient_en)){
                                var option = document.createElement("option");
                                option.text = data[i].patient_en;
                                selectsetEn.add(option, selectsetEn[i]);
                            }
                        }
                        
                       
                            if(db_HyperEn.length == data.length){

                                document.getElementById("txtpt_dob").setAttribute("value","");
                                document.getElementById("txtpt_age").setAttribute("value","");

                                document.getElementById("date-visit").value = null;;
                                document.getElementById("date-visit").setAttribute("disabled",true);
                                
                                document.getElementById("selectsetEn").value = null;

                                //document.getElementById("txtpt_drname").setAttribute("value","");                         
                                //document.getElementById("txtpt_drname").setAttribute("disabled",true);                    

                            }else{

                                document.getElementById("selectsetEn").value = Stamp_En;
                            }

                            //ซ่อน Modal spinning  เมื่อดึงข้อมูลเสร็จสิ้น
                            $('#alert_nDataModal').modal('hide');

                            //แปลงวันที่ แสดงเป็น ว/ด/ป
                            let current_datetime = new Date(sessionStorage.patient_visit_date)
                            let _dateVisit = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
            
                            toastr.success('EN : '+Stamp_En+' <br> Visit Date : '+_dateVisit+'', 'ดึงข้อมูลคนไข้สำเร็จ');
                            if(selectsetEn.length == 0)
                            {
                                document.getElementById("butregister").style.visibility = "hidden";
                                document.getElementById("butretrieve").style.visibility = "hidden";
                            }

                    } else {

                        document.getElementById("selectsetDoctorcase").value = "";
                        clear_IndexPage()
            
                    }

                //ตรวจสถานะจาก selectOption()
                }else if (str_selectOption == true){

                    getCv_Risk();

                    if (response != ""){

                        sessionStorage.setItem("hncode", _Hn);

                        var data =JSON.parse(response);
                        var json_response =JSON.parse(response);
                        var count_response = json_response.length-1;

                        //for loop ข้อมูล  Visit ทั้งหมดของคนไข้
                        for (var i = 0 ;i<json_response.length;i++){

                            //เงื่อนไข ตรวจสอบ en ที่เลือกใน dropdown มาตรวจสอบกับ en ใน Visit
                            if (json_response[i].patient_en == en){

                                //document.getElementById("tag_image").innerHTML = "<img src=\""+json_response[i].patientphoto+"\" onerror=\"imageError()\" class=\"image\">";
                                document.getElementById("txtpt_name").value = json_response[i].patient_name;
                                document.getElementById("txtpt_dob").value = json_response[i].patient_dob;
                                document.getElementById("txtpt_age").value = json_response[i].patient_age;
                                document.getElementById("date-visit").value = json_response[i].patient_visit_date;
                                        
                                //document.getElementById("txtpt_drname").value = json_response[i].patient_doctorname;

                                sessionStorage.setItem("hncode", json_response[i].patient_hncode);
                                sessionStorage.setItem("patient_name", json_response[i].patient_name);
                                sessionStorage.setItem("en", json_response[i].patient_en);
                                sessionStorage.setItem("age", json_response[0].patient_age);
                                sessionStorage.setItem("visit_date", json_response[i].patient_visit_date);
                                Stamp_En = en;
                         
                            }

                            document.getElementById("date_first_visit").setAttribute("value",json_response[count_response].patient_visit_date);
                        }
                        //getDoctorcasebyHN();
                        var selectsetEn = document.getElementById("selectsetEn");
                        
                        var option = document.createElement("option");
                        document.getElementById("selectsetEn").innerHTML = "";
                        for (var i = 0; i < data.length; i++) {

                                //เงื่อนไข ตัด en ที่มีการบันทึกข้อมูลไว้แล้ว
                                if (!db_HyperEn.includes(data[i].patient_en)){

                                    var option = document.createElement("option");
                                    option.text = data[i].patient_en;
                                    selectsetEn.add(option, selectsetEn[i]);
                            }
                        }
                        
                        document.getElementById("selectsetEn").value = Stamp_En;
                       

                        //ซ่อน Modal spinning  เมื่อดึงข้อมูลเสร็จสิ้น
                        $('#alert_nDataModal').modal('hide');

                        //แปลงวันที่ แสดงเป็น ว/ด/ป
                        let current_datetime = new Date(sessionStorage.patient_visit_date)
                        let _dateVisit = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
                        toastr.success('EN : '+Stamp_En+' <br> Visit Date : '+_dateVisit+'', 'ดึงข้อมูลคนไข้สำเร็จ');

                    } else {

                        clear_IndexPage()
                    }
                }

                getDBLabResult()
                getDBXRayResult();
            },
            error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                console.log("Add new Stockcard failed, error is '" + thrownError + "'");
            }
        });
    //Parameter จาก getPatient()
    } else if (_Hn != ""){
        
        // $( "#bl_unknow" ).prop( "checked", false )
        // $( "#bl_resistant_hypertension" ).prop( "checked", false )
        // $( "#cv_dm" ).prop( "checked", false )
        // $( "#cv_dlp" ).prop( "checked", false)
        // $( "#cv_smoking" ).prop( "checked", false)
        // $( "#cv_cda" ).prop( "checked", false )
        // $( "#od_af" ).prop( "checked", false)
        // $( "#od_copd" ).prop( "checked", false)
        // $( "#od_gout" ).prop( "checked", false )
        // $( "#sc_osa" ).prop( "checked", false)
        // $( "#checkboxOther" ).prop( "checked", false )

        // เซ็ทส่วนขวา ให้พร้อมกรอก
        for (var index = 0; index < eiei.length; index++) {
            var diseaseid = eiei[index].disease_id;
            var diseasedetailid = eiei[index].diseasedetail_id;
            var diseasedetailType = eiei[index].diseasedetail_Type;

            if ([index] == 0) {

                    $("#"+[diseaseid]).prop("checked", false)
                    $("#"+[diseasedetailid]).prop("checked", false)

            } else if (eiei[index].disease_id == eiei[index-1].disease_id){
                
                if (diseasedetailType == "checkboxplus"){

                    $("#"+[diseasedetailid]).prop("checked", false)
                    $("#"+[diseasedetailid+"text"]).prop("checked", false)

                } else {

                    $("#"+[diseasedetailid]).prop("checked", false)

                }

            } else {

                    $("#"+[diseaseid]).prop("checked", false)
                    $("#"+[diseasedetailid]).prop("checked", false)
            }
        }

        var cData_en = [];
        $.ajax({
            type: "GET",
            url: "https://localhost:44306/api/Patients?hncode="+_Hn+"&ht_siteid="+sessionStorage.userSITE+"", 
            dataType: 'json',
            success: function (response) {
                
                if (response != "" && response != null){
                    sessionStorage.setItem("hncode", _Hn);

                    getCv_Risk();
                    var data =JSON.parse(response);
                    var json_response =JSON.parse(response);
                    var count_response = json_response.length-1;

                    for (var i = 0 ; i < json_response.length ; i++){

                        if (db_HyperEn != []){

                            if (!db_HyperEn.includes(json_response[i].patient_en)){

                                var En = json_response[i];
                                cData_en.push(En);    
                                
                            }

                        } else {
                            console.log("null");
                        }
                    }

                    if (cData_en.length > 0){
                        //document.getElementById("tag_image").innerHTML = "<img src=\""+cData_en[0].patientphoto+"\"  onerror=\"imageError()\" class=\"image\">";
                        document.getElementById("txtpt_name").value = cData_en[0].patient_name;
                        document.getElementById("txtpt_dob").value = cData_en[0].patient_dob;
                        document.getElementById("txtpt_age").value = cData_en[0].patient_age;
                        document.getElementById("date-visit").value = cData_en[0].patient_visit_date;
                        // document.getElementById("date-visit").setAttribute("value",json_response[0].visit_date);
                        //document.getElementById("txtpt_drname").value = cData_en[0].patient_doctorname;
                        document.getElementById("date_first_visit").value = json_response[count_response].patient_visit_date;
        
                        sessionStorage.setItem("patient_name", cData_en[0].patient_name);
                        sessionStorage.setItem("en", cData_en[0].patient_en);
                        sessionStorage.setItem("age", cData_en[0].patient_age);
                        sessionStorage.setItem("visit_date",cData_en[0].patient_visit_date)
                        
                        Stamp_En = cData_en[0].patient_en

                    }else{
                        
                    //document.getElementById("tag_image").innerHTML = "<img src=\""+json_response[0].patientphoto+"\" onerror=\"imageError()\" class=\"image\">";
                        document.getElementById("txtpt_name").value = json_response[0].patient_name;
                        document.getElementById("txtpt_dob").value = json_response[0].patient_dob;
                        document.getElementById("txtpt_age").value = json_response[0].patient_age;
                        document.getElementById("date-visit").value = json_response[0].patient_visit_date;
                        // document.getElementById("date-visit").setAttribute("value",json_response[0].visit_date);
                        // document.getElementById("txtpt_drname").value = json_response[0].patient_doctorname;
                        document.getElementById("date_first_visit").value = json_response[count_response].patient_visit_date;
        
                        sessionStorage.setItem("patient_name", json_response[0].patient_name);
                        sessionStorage.setItem("en", json_response[0].patient_en);
                        sessionStorage.setItem("age", json_response[0].patient_age);
                        sessionStorage.setItem("visit_date",json_response[0].patient_visit_date)
                        Stamp_En = json_response[0].patient_en
                        
                    }
                
                    //เรียง EN ของ patient_en();
                    var selectsetEn = document.getElementById("selectsetEn");
                    var option = document.createElement("option");
                    document.getElementById("selectsetEn").innerHTML = "";
                    for (var i = 0; i < data.length; i++) {
                        if (!db_HyperEn.includes(data[i].patient_en)){
                            var option = document.createElement("option");
                            option.text = data[i].patient_en;
                            selectsetEn.add(option, selectsetEn[i]); 
                        }
                    }
                
                    document.getElementById("selectsetEn").value = Stamp_En;
                    console.log(Stamp_En)
                    $('#alert_nDataModal').modal('hide');

                    let current_datetime = new Date(sessionStorage.visit_date)
                    let _dateVisit = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
                    
                    toastr.success('EN : '+Stamp_En+' <br> Visit Date : '+_dateVisit+'', 'ดึงข้อมูลคนไข้สำเร็จ');
                

                } else {

                    clear_IndexPage()

                }

                getDBLabResult();
                getDBXRayResult();

                },
                error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                    console.log("Error is '" + thrownError + "'");
                    //alert("Add new product failed, error is '" + thrownError + "'");
                }
            });

        } else {
            alert("กรุณาระบุ HN")
        }   
}

//ฟังก์ชัน สำหรับนำข้อมูลเฉพาะ EN ที่มีใน DB EMR ดึงมาตรวจสอบกับ Visit ทั้งหมด
function cs_dbEn(_Hn){ 

    if (_Hn == ""){

        var _Hn =$('#inputHN').val().toString();
    }
    
    db_HyperEn = [];

    $.ajax({
        type: "GET",
        url: "https://localhost:44306/api/LabResult?hncode="+sessionStorage.hncode+"&ht_siteid="+sessionStorage.userSITE+"",
        dataType: 'json',
        success: function (response) {

        if (response == ""){

        } else {
            
            var json_response =JSON.parse(response);

            for (var i = 0; i < json_response.length; i++) {

                En = json_response[i].ep;

                db_HyperEn.push(En);      
            }
        }

        }, error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                    console.log("failed, error is '" + thrownError + "'");
                    alert("Recrive Patients data failed, error is '" + thrownError + "'");
                }
        });  
}

//กรณีภาพ Profile Error  หรือไม่มีภาพ
function imageError(){
    document.getElementById("tag_image").innerHTML = "<img src=\"assets/images/img_avatar.png\"  class=\"image\">";
}
//ดึงข้อมูลมาตรวจสอบ สำหรับดึงข้อมา Default เช่น ปี 2560 มีการเก็บข้อมูลไว้แล้วก่อนหน้า ก็เอาข้อมูล Checkbox ที่เก็บไว้ก่อนหน้ามา Default
function getDBLabResult(){

    $.ajax({
        type: "GET",
        url: "https://localhost:44306/api/LabResult?hncode="+sessionStorage.hncode+"&ht_siteid="+sessionStorage.userSITE+"",
        dataType: 'json',
        // contentType: 'application/json; charset=utf-8',
        success: function (response) {

            if (response == ""){

            } else {
        
                _getDBLabResult =  JSON.parse(response);
            }
        },
        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
    
        }     
    }); 
}
function getDBXRayResult(){

    $.ajax({
        type: "GET",
        url: "https://localhost:44306/api/XrayResult?hncode="+sessionStorage.hncode+"&ht_siteid="+sessionStorage.userSITE+"",
        dataType: 'json',
        // contentType: 'application/json; charset=utf-8',
        success: function (response) {

            if (response == ""){

            } else {
        
                _getDBXRayResult =  JSON.parse(response);
            }
        },
        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
    
        }     
    }); 
}

//สำหรับบันทึกข้อมูลการตรวจของคนไข้ จาก DB Imed ไปยัง DB Outstanding
function submitPatient() {

    var episode_en = sessionStorage.en
    $('#confirm_patientModal').modal('hide')
    var Patient_LabResult_Data = null;

    var selectsetEn = document.getElementById("selectsetEn");
    for(var i = 0 ; i < selectsetEn.length;i++)
    {
        Stamp_En = selectsetEn.options[i].text
        selectOption(Stamp_En);
        $('#Modal1').modal('show');
        //Data List
        var _labResult = [];
        var _firstbmi = [];
        var _lastvitalsign = [];
        var _allergy = [];
        var _xrayResult = [];
        var inputHN = sessionStorage.hncode;
        var txtpt_name = $('#txtpt_name').val();
        var txtpt_dob = $('#txtpt_dob').val();
        var txtpt_age = $('#txtpt_age').val();
        var date_visit = $('#date-visit').val()
        var txtpt_drname = $('#txtpt_drname').val();
        var txtpt_drname = $('#txtpt_drname').val();
        if  (inputHN == "" || txtpt_name == "" || txtpt_dob == "" || txtpt_age == "" || date_visit == "" || txtpt_drname == "" || Stamp_En == null ) 
        { 
            alert("ข้อมูลไม่ครบถ้วน") 
        }
        else{
            //$('#Modal1').modal('show');
            var _StorageHn = sessionStorage.hncode;
                $.ajax({
                type: "GET",
                url: "https://localhost:44306/api/LabResult?hncode="+_StorageHn+"&en="+Stamp_En,
                dataType: 'jsonp',
                success: function (response) {
                if (response == ""){
                    _labResult = [];
                } else {
                    var  json_labresult =  JSON.parse(response);
                    _labResult = json_labresult
                }
                $.ajax({
                    type: "GET",
                    url: "http://172.18.62.245/ImedWebApi/api/xrayresult?hncode="+_StorageHn+"&en="+Stamp_En,
                    dataType: 'jsonp',
                    success: function (response) {
    
                    if (response == ""){
    
                        _xrayResult = [];
    
                    } else {
    
                        var  json_xrayresult =  JSON.parse(response);
    
                        _xrayResult = json_xrayresult
            
                    }
 
                    $.ajax({
                    type: "GET",
                    url: "http://172.18.62.245/ImedWebApi/api/VitalsignOPD?en="+Stamp_En+"&firstbmi=true",
                    dataType: 'jsonp',
                    success: function (response) {

                        if (response == ""){

                            _firstbmi = [];

                        } else {
                        
                            var  json_firstbmi =  JSON.parse(response);
                            _firstbmi = json_firstbmi

                        }

                    $.ajax({
                        type: "GET",
                        url: "http://172.18.62.245/ImedWebApi/api/Allergy?hncode="+_StorageHn,
                        dataType: 'jsonp',
                        success: function (response) { 

                            if (response == ""){

                                _allergy = [];
    
                            } else {
                            
                                var  json_allergy =  JSON.parse(response);
    
                                _allergy = json_allergy
    
                            }

                            $.ajax({
                                type: "GET",
                                url: "http://172.18.62.245/ImedWebApi/api/VitalsignOPD?en="+Stamp_En+"&lastvitalsign=true",
                                dataType: 'jsonp',
                                success: function (response) {
                                    var count_lastvitalsign = [];
                                    if (response == ""){
    
                                        count_lastvitalsign = [];
    
                                    } else {
                        
                                        var  json_lastvitalsign =  JSON.parse(response);
    
                                        _lastvitalsign = json_lastvitalsign
    
                                        count_lastvitalsign = (_lastvitalsign.length)-1
    
                            
                                    }
                                    // DB Table Patient
                                    formPatient = {
                                        "_patient_en": Stamp_En,
                                        "_patient_hncode": sessionStorage.hncode,
                                        "_patient_name": txtpt_name,
                                        "_patient_dob": txtpt_dob,
                                        "_patient_age": txtpt_age,
                                        "_patient_visit_date": date_visit,
                                        "_patient_doctorname": txtpt_drname,
                                        "_update_by": sessionStorage.userID,
                                    }
                                    //Check LabResult
                                    if (_labResult.length == 0){
    
                                        var Cholesterol =   null
                                        var Triglyceride =   null
                                        var HDL =  null
                                        var LDL_Direct = null   
                                        var LDL = null   
                                        var Glucose = null  
                                        var HbA1C = null  
                                        var Uric = null  
                                        var currentmed = null
        
                                        var Creatinine = null  
                                        var Creatinine_GFR = null  
                                        var UrineProtein = null 
                                        var UrineMicroalbumin = null
                                        var Hb = null  
                                        var Hematocrit = null  
                                        var Sodium = null 
                                        var Potassium = null  
    
                                    }else{
    
                                        var Cholesterol =   _labResult[0].Cholesterol
                                        var Triglyceride =   _labResult[0].Triglyceride
                                        var HDL =   _labResult[0].HDL
                                        var LDL_Direct =   _labResult[0].LDL_Direct
                                        var LDL =   _labResult[0].LDL
                                        var Glucose =   _labResult[0].Glucose
                                        var HbA1C =   _labResult[0].HbA1C
                                        var Uric =   _labResult[0].Uric
                                        var currentmed = _labResult[0].currentmed
        
                                        var Creatinine =   _labResult[0].Creatinine
                                        var Creatinine_GFR =   _labResult[0].Creatinine_GFR
                                        var UrineProtein =   _labResult[0].UrineProtein
                                        var UrineMicroalbumin = _labResult[0].UrineMicroalbumin
                                        var Hb =   _labResult[0].Hb
                                        var Hematocrit =   _labResult[0].Hematocrit
                                        var Sodium =   _labResult[0].Sodium
                                        var Potassium =   _labResult[0].Potassium
                                    }
                                    //Check  XrayResult
                                    if (_xrayResult.length == 0){
                                        var EKG =   null
                                        var Echo =   null
                                        var CAC =  null
                                        var ABI = null 

                                    }else{
                                        var EKG =   _xrayResult[0].ekg
                                        var Echo =   _xrayResult[0].echo
                                        var CAC =  _xrayResult[0].cacs
                                        var ABI = _xrayResult[0].abi
                                        var VisitDate = _xrayResult[0].visit_date
                                    }
                                    if (_allergy.length == 0){
    
                                        var Allergy =   null
                                       
    
                                    }else{
    
                                        var Allergy =   _allergy[0].drug_allergy
                                    }
                                    //Default Check แบบการประเมินแต่ละ Visit ให้ Default ข้อมูลล่าสุดของปีนั้นๆ
                                    if(_getDBLabResult != null || _getDBLabResult.length > 1){
    
                                        const split_en_header = episode_en.split("-"); // Split EN เช่น (O05-19-259618) 
    
                                        for (var _getDBLabResult_i = _getDBLabResult.length-1 ;_getDBLabResult_i >= 0 ; _getDBLabResult_i-- ){ 
    
                                        const split_en_LabResult = _getDBLabResult[_getDBLabResult_i].ep.split("-");
    
                                            //เงื่อนไขถ้า En ที่กำลังบันทึกอยู่ เท่ากับข้อมูลของล่าสุดของปี ค.ศ นั้น  เพื่อนำข้เฉพาะข้อมูลส่วนนั้นไปเป็น Default
                                            if(parseInt(split_en_LabResult[1]) == parseInt(split_en_header[1])){  // ตัวอย่าง parseInt(split_en_header[1]) ก็คือ 19 
    
                                                Patient_LabResult_Data = _getDBLabResult[_getDBLabResult_i] 
                                            }
                                        }
                
                                        //Checkbox Default
                                        if(Patient_LabResult_Data != null){
    
                                            //set ค่าใน Value  True/False  สำหรับการแก้ไขจะได้เป็นค่านั้นๆ  
                                            var Nutritionist =  Patient_LabResult_Data.Nutritionist ;
                                            var Alcohol = Patient_LabResult_Data.Alcohol ;
                                            var Smoking = Patient_LabResult_Data.Smoking ;
                                            var SleepRate = Patient_LabResult_Data.SleepRate ;
    
                                            var Good_diet_control = Patient_LabResult_Data.Good_diet_control
                                            var Exercise_minute = Patient_LabResult_Data.Exercise_minute
                                            var FluVaccine = Patient_LabResult_Data.FluVaccine
                                            var PneumococcalVaccine = Patient_LabResult_Data.PneumococcalVaccine
    
                                        }else{
    
                                            //set ค่าใน Value  True/False  สำหรับการแก้ไขจะได้เป็นค่านั้นๆ
                                            var Nutritionist =  false ;
                                            var Alcohol = false ;
                                            var Smoking = false ;
                                            var SleepRate = false ;
    
                                            var Good_diet_control =false ;
                                            var Exercise_minute = false ;
                                            var FluVaccine = false ;
                                            var PneumococcalVaccine = false ;
    
                                        }
                                    }
                                    //
                                    if(_getDBXRayResult != null || _getDBXRayResult.length > 1){
    
                                        const split_en_header = episode_en.split("-"); // Split EN เช่น (O05-19-259618) 
    
                                        for (var _getDBXRayResult_i = _getDBXRayResult.length-1 ;_getDBXRayResult_i >= 0 ; _getDBXRayResult_i-- ){ 
    
                                        const split_en_XRayResult = _getDBXRayResult[_getDBXRayResult_i].ep.split("-");
    
                                            //เงื่อนไขถ้า En ที่กำลังบันทึกอยู่ เท่ากับข้อมูลของล่าสุดของปี ค.ศ นั้น  เพื่อนำข้เฉพาะข้อมูลส่วนนั้นไปเป็น Default
                                            if(parseInt(split_en_XRayResult[1]) == parseInt(split_en_header[1])){  // ตัวอย่าง parseInt(split_en_header[1]) ก็คือ 19 
    
                                                Patient_XRayResult_Data = _getDBXRayResult[_getDBXRayResult_i] 
                                            }
                                        }
                                    }
                                    // DB table Labresult
                                    formLabresult = {
    
                                        //Treatment & follow up
                                        "_ep": Stamp_En, 
                                        "_hncode": sessionStorage.hncode, 
                                        "_weight": _firstbmi[0].weight,
                                        "_bmi": _firstbmi[0].bmi,
                                        "_wc": null,
                                        "_pressure_min": _lastvitalsign[count_lastvitalsign].pressure_min,
                                        "_pressure_max": _lastvitalsign[count_lastvitalsign].pressure_max,
                                        "_home_bp": null,
                                        "_pulse": _lastvitalsign[count_lastvitalsign].pulse,
                                        "_Good_diet_control": Good_diet_control,
                                        "_Exercise_minute": Exercise_minute,
                                        "_FluVaccine": FluVaccine,
                                        "_PneumococcalVaccine": PneumococcalVaccine,
                                
                                        "_Nutritionist": Nutritionist,
                                        "_Alcohol": Alcohol,
                                        "_Smoking": Smoking,
                                        "_SleepRate": SleepRate,
                                        // "_AppointmentRate": $('#txtTF_AppointmentRate').val(),
                                
                                        "_Medication_frequency": "0%", //กินยาสม่ำเสมอ(%)
                                        "_Drug_allergy": Allergy, // ประวัติการแพ้ยา
                                        "_Current_medicine": null,
                                        "_Treatment": null,
                                        "_Next_plan": null,
                                        "_Next_f_u": null,
                                
                                        //Blood test
                                        "_Cholesterol": Cholesterol,
                                        "_Triglyceride": Triglyceride,
                                        "_HDL": HDL,
                                        "_LDL_Direct": LDL_Direct,
                                        "_LDL":LDL,
                                        "_Glucose": Glucose,
                                        "_HbA1C": HbA1C,
                                        "_Uric": Uric,
                                        "_Creatinine": Creatinine,
                                        "_Creatinine_GFR": Creatinine_GFR,
                                        "_UrineProtein": UrineProtein,
                                        "_UrineMicroalbumin": UrineMicroalbumin,
                                        "_Hb": Hb,
                                        "_Hematocrit": Hematocrit,
                                        "_Sodium": Sodium,
                                        "_Potassium": Potassium,
                                        "_Current_medicine": currentmed,
                                        "_visit_date": sessionStorage.visit_date,
                                        "_update_by": sessionStorage.userID 
                                        
                                    }
                                    //DB table Xrayresult
                                    formXRayresult = {
                                        "_ep": Stamp_En, 
                                        "_hncode": sessionStorage.hncode, 
                                        "_ekg": EKG,
                                        "_echo": Echo,
                                        "_cac": CAC,
                                        "_abi": ABI,
                                        "_visit_date": VisitDate,
                                        "_update_by": sessionStorage.userID
                                    }
    
                                    $.ajax({
                                        type: "POST",
                                        url: "http://172.18.62.245/HTApi/api/Patients/",
                                        dataType: 'json',
                                        data: formPatient,
                                        success: function (data) {
    
                                            $.ajax({
                                                type: "POST",
                                                url: "http://172.18.62.245/HTApi/api/Lab_DataResult/",
                                                dataType: 'json',
                                                data: formLabresult,
                                                success: function (data) {
                                        
                                                    sessionStorage.removeItem("visit_date")
                                                    $('#Modal1').modal('hide');
                                                    
                                                    toastr.success('บันทึกข้อมูลสำเร็จ');
                                                    getPatient(sessionStorage.hncode);
                                        
                                                },
                                                error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                                                    // console.log("Add new product failed, error is '" + thrownError + "'");
                                                    toastr.error('บันทึกข้อมูลไม่สำเร็จ');
                                        
                                                }
                                            });

                                            $.ajax({
                                                type: "POST",
                                                url: "http://172.18.62.245/HTApi/api/Xray_DataResult/",
                                                dataType: 'json',
                                                data: formXRayresult,
                                                success: function (data) {
                                        
                                                    sessionStorage.removeItem("visit_date")
                                                    $('#Modal1').modal('hide');
                                                    
                                                    toastr.success('บันทึกข้อมูลสำเร็จ');
                                                    getPatient(sessionStorage.hncode);
                                        
                                                },
                                                error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                                                    console.log("Add new product failed, error is '" + thrownError + "'");
                                                    toastr.error('บันทึกข้อมูลไม่สำเร็จ');
                                        
                                                }
                                            });
                                        },
                                        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                                            // console.log("Add new product failed, error is '" + thrownError + "'");
                                
                                        }
                                    });
                                }
                            });
                        }
                    });
                    }
                    });

                    }
                });
                }      
            });
        }
    }
}

// ดึงข้อมูล HN จาก DB มาโชว์
function getCv_Risk(){

    clear_cvrisk()

    var cv_risk_list = "";

        if (sessionStorage.hncode != null || sessionStorage.hncode != ""){
    
            $.ajax({
    
                type: "GET",
                url: "https://localhost:44306/api/CVLAB?hncode="+sessionStorage.hncode+"&ht_siteid="+sessionStorage.userSITE+"",
                dataType: 'json',
                success: function (response) {

                    if (response == null || response == ""){

                        document.getElementById("colum_cvriskname").innerHTML = ""

                        document.getElementById("loading-cvrisk").innerHTML =  ""
                        // document.getElementById("loading-cvrisk").innerHTML = "<h3 align='Center'>ไม่พบข้อมูล</h3>";
                        getData_personnal();

                    }else{

                        cv_risk_list = JSON.parse(response);
                        getData_personnal()
                        

                    }
                    //ฟังก์ชันดึงสำหรับข้อมูล Data_personnal จาก DB EMR
                    function getData_personnal(){
                        $.ajax({
                    
                            type: "GET",
                            url: "https://localhost:44306/api/Disease?_hncode="+sessionStorage.hncode+"&_ht_siteid="+localStorage.userSITE+"",
                            dataType: 'json',
                            success: function (data) {

                                if (data == ""){
                    
                                    document.getElementById("BaseCheck").innerHTML = "<button type='button' class='btn btn-primary' onclick='submitData_Patient()'>SAVE</button>"
                    
                                    // document.getElementById("bl_hypertension_year").value = '';   
                                    // document.getElementById("sc_other").innerHTML = "";
                                    document.getElementById("cvrisk_date").value = '';
                                    document.getElementById("cvrisk_percent").value = '';
                                    document.getElementById("cvrisk_multiply").value = '';   
                                    // $( "#bl_unknow" ).prop( "checked", false )
                                    // $( "#bl_resistant_hypertension" ).prop( "checked", false )
                                    // $( "#cv_dm" ).prop( "checked", false )
                                    // $( "#cv_dlp" ).prop( "checked", false)
                                    // $( "#cv_smoking" ).prop( "checked", false)
                                    // $( "#cv_cda" ).prop( "checked", false )
                                    // $( "#od_af" ).prop( "checked", false)
                                    // $( "#od_copd" ).prop( "checked", false)
                                    // $( "#od_gout" ).prop( "checked", false )
                                    // $( "#sc_osa" ).prop( "checked", false)
                    
                                    // $( "#checkboxOther" ).prop( "checked", false )
                                    // ck_Other()
                                    for (var index = 0; index < localStorage.length; index++) {
                                        $(""+localStorage.idDs_+[index]+"").prop("checked", false)
                                        $(""+localStorage.idDsdt_+[index]+"").prop("checked", false)
                                    }
                    
                                    console.log("null")
                                }else{
                    
                                    if (response != "error"){
                                    
                                        document.getElementById("BaseCheck").innerHTML =  "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#confirm_editModal' >EDIT</button>"

                                        if (cv_risk_list.length > 0){

                                            if (cv_risk_list.length < 3){

                                                document.getElementById("loading-cvrisk").innerHTML =  "<div class='modal-dialog modal-dialog-centered justify-content-center' role='document'> <span class='fa fa-spinner fa-spin fa-3x'></span>"

                                                document.getElementById("colum_cvriskname").innerHTML =   "<td align='center'><h6>DATE</h6></td><td align='center'><h6>PERCENT</h6></td><td align='center'><h6>TIMES</h6></td>"
        
                                                //ตารางแสดง CV-Risk
                                                for (var i = 0 ; i < cv_risk_list.length ; i++){

                                                    let current_datetime = new Date(cv_risk_list[i].cvrisk_date)
                                                    let _dateCvRisk = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
                            
                                                    var cv_table_id = "display_cvrisk"+i+""
                            
                                                    document.getElementById(cv_table_id).innerHTML +=   "<td align='center'><label class='col-md-12 text-center'>"+_dateCvRisk+"</label></td>"+
                                                                                                        "<td align='center'><label class='col-md-12 text-center'>"+cv_risk_list[i].cvrisk_percent+" %</label></td>"  +
                                                                                                        "<td align='center'><label class='col-md-12 text-center'>"+cv_risk_list[i].cvrisk_multiply+" เท่า</label></td>" 
                                                                                                        
                                                }

                                                spinning();
        
                                            }else{

                                                document.getElementById("loading-cvrisk").innerHTML =  "<div class='modal-dialog modal-dialog-centered justify-content-center' role='document'> <span class='fa fa-spinner fa-spin fa-3x'></span>"
        
                                                document.getElementById("colum_cvriskname").innerHTML =   "<td align='center'><h6>DATE</h6></td><td align='center'><h6>PERCENT</h6></td><td align='center'><h6>TIMES</h6></td>"
        
                                                for (var i = 0 ; i < 3 ; i++){
                            
                                                    let current_datetime = new Date(cv_risk_list[i].cvrisk_date)
                                                    let _dateCvRisk = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()

                                                    var cv_table_id = "display_cvrisk"+i+""
                                                    
                                                    document.getElementById(cv_table_id).innerHTML +=   "<td align='center'><label class='col-md-12 text-center'>"+_dateCvRisk+"</label></td>"+
                                                                                                        "<td align='center'><label class='col-md-12 text-center'>"+cv_risk_list[i].cvrisk_percent+" %</label></td>"  +
                                                                                                        "<td align='center'><label class='col-md-12 text-center'>"+cv_risk_list[i].cvrisk_multiply+" เท่า</label></td>" 
                                                    }

                                                spinning();
        
                                            }
                                        }

                                        var DataJson = JSON.parse(data)
                                        var Topic = DataJson.TopicDataJson[0]

                                        //แสดงการ Check  True/False
                                        // $( "#bl_unknow" ).prop( "checked", response.bl_unknow )
                                        // $( "#bl_resistant_hypertension" ).prop( "checked", response.bl_resistant_hypertension )
                                        // $( "#cv_dm" ).prop( "checked", response.cv_dm )
                                        // $( "#cv_dlp" ).prop( "checked", response.cv_dlp )
                                        // $( "#cv_smoking" ).prop( "checked", response.cv_smoking )
                                        // $( "#cv_cda" ).prop( "checked", response.cv_cda )
                                        // $( "#od_af" ).prop( "checked", response.od_af )
                                        // $( "#od_copd" ).prop( "checked", response.od_copd )
                                        // $( "#od_gout" ).prop( "checked", response.od_gout )
                                        // $( "#sc_osa" ).prop( "checked", response.sc_osa )
                    
                                        //set ค่า BaseInfo ให้ value เป็นค่าตามที่เรียกข้อมูลมาแสดง
                                        // document.getElementById("bl_unknow").setAttribute("value",response.bl_unknow)
                                        // document.getElementById("bl_resistant_hypertension").setAttribute("value",response.bl_resistant_hypertension)
                                        // document.getElementById("cv_dm").setAttribute("value",response.cv_dm)
                                        // document.getElementById("cv_dlp").setAttribute("value",response.cv_dlp )
                                        // document.getElementById("cv_smoking").setAttribute("value",response.cv_smoking )
                                        // document.getElementById("cv_cda").setAttribute("value",response.cv_cda)
                                        // document.getElementById("od_af").setAttribute("value",response.od_af)
                                        // document.getElementById("od_copd").setAttribute("value",response.od_copd)
                                        // document.getElementById("od_gout").setAttribute("value",response.od_gout )
                                        // document.getElementById("sc_osa").setAttribute("value", response.sc_osa)

                                    }else{
                    
                                        // document.getElementById("bl_hypertension_year").value = '';
                                        document.getElementById("sc_other").innerHTML = "";
                                        document.getElementById("cvrisk_date").value = '';
                                        document.getElementById("cvrisk_percent").value = '';
                                        document.getElementById("cvrisk_multiply").value = '';   
                    
                                        // $( "#bl_unknow" ).prop( "checked", false )
                                        // $( "#bl_resistant_hypertension" ).prop( "checked", false )
                                        // $( "#cv_dm" ).prop( "checked", false )
                                        // $( "#cv_dlp" ).prop( "checked", false)
                                        // $( "#cv_smoking" ).prop( "checked", false)
                                        // $( "#cv_cda" ).prop( "checked", false )
                                        // $( "#od_af" ).prop( "checked", false)
                                        // $( "#od_copd" ).prop( "checked", false)
                                        // $( "#od_gout" ).prop( "checked", false )
                                        // $( "#sc_osa" ).prop( "checked", false)
                    
                                        // $( "#checkboxOther" ).prop( "checked", false )
                                        // ck_Other()
                                    }
                                }
                              },
                              error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                
                              }
                          });
                    }
                },
                error: function (jqXHR, xhr, ajaxOptions, thrownError) {

                }
            });
        }else{
    
    
        }
}
            
//ฟังก์ชันบันทึกข้อมูล CVrisk
function addcvrisk_Patient(){
    // var drcase = document.getElementById("selectsetDoctorcase").value;
    var inputHN = sessionStorage.hncode;
    // updateHTRegistry(inputHN,sessionStorage.userID,drcase)
    var str_cvrisk_data = false;

    $.ajax({
                    
        type: "GET",
        url: "http://172.18.62.245/HTApi/api/CvRisk?hncode="+sessionStorage.hncode,
        dataType: 'json',
        success: function (data) {  
            
            var hncode = sessionStorage.hncode;
            var cvrisk_date =  $('#cvrisk_date').val();
            var cvrisk_percent = $('#cvrisk_percent').val();
            var cvrisk_multiply = $('#cvrisk_multiply').val();

            if (data != "" ){

                var json_response = JSON.parse(data)
                if (hncode != "" && cvrisk_date != "" && cvrisk_percent != "" && cvrisk_multiply != ""){

                    if(sessionStorage.hncode == $('#inputHN').val()){

                        for (var i=0 ; i < json_response.length ; i++){

                            if (cvrisk_date == json_response[i].cvrisk_date){

                                var C_cvrisk_data = json_response[i].cvrisk_date

                                if (C_cvrisk_data == cvrisk_date){

                                    alert("มีการระบุวันที่นี้แล้ว!!!")
                                    str_cvrisk_data = true;

                                }
                            } 
                        }

                        if (str_cvrisk_data == false){

                            //บันทึกข้อมูล CvRisk
                            $.ajax({
                                type: "POST",
                                url: "http://172.18.62.245/HTApi/api/CvRisk/",
                                dataType: 'json',
                                data:{ 
                                        "_hncode" : hncode ,
                                        "_cvrisk_date" : cvrisk_date,
                                        "_cvrisk_percent" : cvrisk_percent,
                                        "_cvrisk_multiply" : cvrisk_multiply, 
                                        "_update_by": sessionStorage.userID
                                    },
                                
                                success: function (data) {

                                        toastr.success('บันทึกข้อมูลสำเร็จ')
                                        getCv_Risk()
                                },
                                error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                                        
                                        toastr.error('บันทึกข้อมูลไม่สำเร็จ')
                                        
                                    }           
                                });
                        }
                    }
                }else{

                    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
                }

            }else{

                if (hncode != "" && cvrisk_date != "" && cvrisk_percent != "" && cvrisk_multiply != ""){

                    $.ajax({
                                    
                        type: "POST",
                        url: "http://172.18.62.245/HTApi/api/CvRisk/",
                        dataType: 'json',
                        data:{ 
                                "_hncode" : hncode ,
                                "_cvrisk_date" : cvrisk_date,
                                "_cvrisk_percent" : cvrisk_percent,
                                "_cvrisk_multiply" : cvrisk_multiply,
                                "_update_by": sessionStorage.userID 
                            },
                        
                        success: function (data) {
                
                            toastr.success('บันทึกข้อมูลสำเร็จ')
                            getCv_Risk()

                        },
                        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                            toastr.error('บันทึกข้อมูลไม่สำเร็จ')
                        }           
                    });
                
                }else{
                    // toastr.warning('กรุณากรอกข้อมูลให้ครบถ้วน!');
                    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
                }
            }
        },
        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
             console.log("Get data failed, error is '" + thrownError + "'");
        }           
    });
}

//ฟังก์ชันเคลียร์ข้อมูล Cvrisk คนไข้ที่แสดงอยู่
function clear_cvrisk(){
    
    document.getElementById("cvrisk_date").value = '';
    document.getElementById("cvrisk_percent").value = '';
    document.getElementById("cvrisk_multiply").value = '';   
    
    //clear table cvrisk
    for (var i = 0 ; i < 3 ; i++){

        var cv_table_id = "display_cvrisk"+i+""

        document.getElementById(cv_table_id).innerHTML = "";
    }

    document.getElementById("loading-cvrisk").innerHTML =  ""
}

//ฟังก์ชันเคลียร์ข้อมูลคนไข้ที่แสดงอยู่ กรณีไม่มีข้อมูลคนไข้ ใน hncode นั้น
function clear_IndexPage(){

    $('#alert_nDataModal').modal('hide');

    document.getElementById("tag_image").innerHTML = ""
    document.getElementById("txtpt_name").value = ""
    document.getElementById("txtpt_dob").value = ""
    document.getElementById("txtpt_age").value = ""
    document.getElementById("date-visit").value = ""

    sessionStorage.removeItem("hncode");
    sessionStorage.removeItem("en");
    sessionStorage.removeItem("age");

    document.getElementById("cvrisk_date").value = '';
    document.getElementById("cvrisk_percent").value = '';
    document.getElementById("cvrisk_multiply").value = '';   

    // $( "#bl_unknow" ).prop( "checked", false )
    // $( "#bl_resistant_hypertension" ).prop( "checked", false )
    // $( "#cv_dm" ).prop( "checked", false )
    // $( "#cv_dlp" ).prop( "checked", false)
    // $( "#cv_smoking" ).prop( "checked", false)
    // $( "#cv_cda" ).prop( "checked", false )
    // $( "#od_af" ).prop( "checked", false)
    // $( "#od_copd" ).prop( "checked", false)
    // $( "#od_gout" ).prop( "checked", false )
    // $( "#sc_osa" ).prop( "checked", false)

    // $( "#checkboxOther" ).prop( "checked", false )
    // ck_Other()
    for (var index = 0; index < localStorage.length; index++) {
        $(""+localStorage.idDs_+[index]+"").prop("checked", false)
        $(""+localStorage.idDsdt_+[index]+"").prop("checked", false)
    }


    document.getElementById("cvrisk_date").value = '';
    document.getElementById("cvrisk_percent").value = '';
    document.getElementById("cvrisk_multiply").value = '';   
    
    //clear table cvrisk
    document.getElementById("colum_cvriskname").innerHTML =   ""

    for (var i = 0 ; i < 3 ; i++){

        var cv_table_id = "display_cvrisk"+i+""

        document.getElementById(cv_table_id).innerHTML = "";
    }

    document.getElementById("loading-cvrisk").innerHTML =  ""

    alert("ไม่พบข้อมูลคนไข้")

}

//ดึงข้อมูล แพทย์ประจำเคส
function getDoctorcase(){
    $.ajax({
        type: "GET",
        url: "http://172.18.62.245/ImedWebApi/api/Doctorcase",
        dataType: 'jsonp',
        success: function (response) {
            var json_response =JSON.parse(response);

            var selectsetDoctorcase = document.getElementById("selectsetDoctorcase");
            var option = document.createElement("option");
            option.text = "";
            selectsetDoctorcase.add(option, selectsetDoctorcase[0]);

            for (var i = 0; i < json_response.length; i++) {
                var option = document.createElement("option");
                option.text = json_response[i].alias_name;
                selectsetDoctorcase.add(option, selectsetDoctorcase[i+1]);
            }
        }
    });
}

//ดึงข้อมูล patient ทั้งหมด
async function allgetData(){
    // var drcase = document.getElementById("selectsetDoctorcase").value;
    $('#Modal1').modal('show');
        var inputHN = sessionStorage.hncode;
        // updateHTRegistry(inputHN,sessionStorage.userID,drcase)
        // retrieve(inputHN,sessionStorage.userID,drcase)
    $('#Modal1').modal('hide');
}
function updateHTRegistry(inputHN,update,drcase)
{
    $.ajax({
        type: "GET",
        url: "http://172.18.62.245/ImedWebApi/api/HTRegistry?hncode="+inputHN+"&update="+update+"&drcase="+drcase,
        dataType: 'jsonp',
        success: function (response) {
            if (response != ""){
                toastr.success('อัพเดทเรียบร้อย');
                
            }
        }
    });
}

var eiei = {};
function test(){

    $.ajax({
        type: "GET",
        url: "https://localhost:44306/api/Config?Disease=alldisease",
        dataType: 'json',
        success: function (response) {

            var json_diseasedetail = JSON.parse(response);
            var namelabel = "";
            eiei = json_diseasedetail

            //var row$ = $('<div class="border-top"/>');

            for (let index = 0; index < json_diseasedetail.length; index++) {
                var namelabel = json_diseasedetail[index].name;
                var disease = json_diseasedetail[index].disease;
                var diseaseid = json_diseasedetail[index].disease_id;
                var diseasedetail = json_diseasedetail[index].diseasedetail
                var diseasedetailid = json_diseasedetail[index].diseasedetail_id
                var disease_Type = json_diseasedetail[index].disease_Type
                var diseasedetail_Type = json_diseasedetail[index].diseasedetail_Type
                var diseasedetailplaceholder = json_diseasedetail[index].diseasedetail_placeholder

                // localStorage.setItem("idDsDt",JSON.stringify(diseasedetailid));

                if(index == 0){
                    
                    //row$.append($('<div class="form-group row/>').html('<label class="col-md-3 text-right">'+namelabel+'</label><div class="col-md-9">'));
                    if (disease_Type == "checkbox"){
                        var fristdisease = checkbox(diseaseid,disease)
                    }else if(disease_Type == "checkboxend"){
                        var fristdisease = checkboxend(diseaseid,disease)
                    }else{
                        console.log("fristdisease --- Error ---")
                    }
                    if(diseasedetail_Type == "checkboxdetail"){
                        var fristdiseasedetail = checkboxdetail(diseasedetailid,diseasedetail,diseaseid)
                    }else if(diseasedetail_Type == "customtext"){
                        var fristdiseasedetail = customtext(diseasedetailid,diseasedetail,diseasedetailplaceholder)
                    }else if(diseasedetail_Type == "checkboxplus"){
                        var fristdiseasedetail = checkboxplus(diseasedetailid,diseasedetail,diseasedetailplaceholder)
                    }else if(diseasedetail_Type == "alltext"){
                        var fristdiseasedetail = alltext(diseasedetailid,diseasedetailplaceholder)
                    }else if(diseasedetail_Type == "doctor"){
                        var fristdiseasedetail = doctor(diseaseid)
                    }else{
                        fristdiseasedetail = "";
                    }

                    $("#fristlabel").append('<div class="border-top"><br><div class="form-group row" id=json_"'+index+'><label class="col-md-3 text-right">'+namelabel+'</label><div class="col-md-9">'+fristdisease+'<div style="display:none;" class='+diseaseid+'Hide>'+fristdiseasedetail+'');
                    //$("#fristlabel").append(fristdisease)
                    //$("#fristlabel").append('<div class="custom-control custom-checkbox mr-sm-2"><input type="checkbox" class="custom-control-input" onClick="oc_diseasecheckboxend(this);" id="'+ diseaseid +'" value="false" onchange="this.value=this.checked? true : false" ><label class="custom-control-label"  for="'+ diseaseid +'">'+ disease +'</label></div>')
                    //$("#fristlabel").append(fristdiseasedetail)
                    //$("#fristlabel").append(row$);

                }else{
                    if (disease_Type == "checkbox"){
                        var fristdisease = checkbox(diseaseid,disease)
                    }else if(disease_Type == "checkboxend"){
                        var fristdisease = checkboxend(diseaseid,disease)
                    }else{
                        console.log("fristdisease --- Error ---")
                    }
                    if(diseasedetail_Type == "checkboxdetail"){
                        var fristdiseasedetail = checkboxdetail(diseasedetailid,diseasedetail)
                    }else if(diseasedetail_Type == "customtext"){
                        var fristdiseasedetail = customtext(diseasedetailid,diseasedetail,diseasedetailplaceholder)
                    }else if(diseasedetail_Type == "checkboxplus"){
                        var fristdiseasedetail = checkboxplus(diseasedetailid,diseasedetail,diseasedetailplaceholder)
                    }else if(diseasedetail_Type == "alltext"){
                        var fristdiseasedetail = alltext(diseasedetailid,diseasedetailplaceholder)
                    }else if(diseasedetail_Type == "doctor"){
                        var fristdiseasedetail = doctor(diseaseid)
                    }else{
                        fristdiseasedetail = "";
                    }


                    if(json_diseasedetail[index].name != json_diseasedetail[index-1].name){
                        //row$.append($('<div class="form-group row/>').html('<label class="col-md-3 text-right">'+namelabel+'</label><div class="col-md-9">'));
                        $("#fristlabel").append('<div class="border-top"><br><div class="form-group row " id=json_"'+index+'><label class="col-md-3 text-right">'+namelabel+'</label><div class="col-md-9">'+fristdisease+'<div style="display:none;" class='+diseaseid+'Hide>'+fristdiseasedetail+'');
                        //$("#fristlabel").append(row$);
                    }
                    else{
                        if(json_diseasedetail[index].disease != json_diseasedetail[index-1].disease){
                            if (disease_Type == "checkbox"){
                                var fristdisease = checkbox(diseaseid,disease)
                            }else if(disease_Type == "checkboxend"){
                                var fristdisease = checkboxend(diseaseid,disease)
                            }else{
                                console.log("fristdisease --- Error ---")
                            }
                            if(diseasedetail_Type == "checkboxdetail"){
                                var fristdiseasedetail = checkboxdetail(diseasedetailid,diseasedetail)
                            }else if(diseasedetail_Type == "customtext"){
                                var fristdiseasedetail = customtext(diseasedetailid,diseasedetail,diseasedetailplaceholder)
                            }else if(diseasedetail_Type == "checkboxplus"){
                                var fristdiseasedetail = checkboxplus(diseasedetailid,diseasedetail,diseasedetailplaceholder)
                            }else if(diseasedetail_Type == "alltext"){
                                var fristdiseasedetail = alltext(diseasedetailid,diseasedetailplaceholder)
                            }else if(diseasedetail_Type == "doctor"){
                                var fristdiseasedetail = doctor(diseaseid)
                            }else{
                                fristdiseasedetail = "";
                            }


                        $("#fristlabel").append('<div class="form-group row"><label class="col-md-3 text-right"></label><div class="col-md-9" id="Baselinedisease">'+fristdisease + '<div style="display:none;" class='+diseaseid+'Hide>' +fristdiseasedetail)
                        //$("#fristlabel").append('<div class="custom-control custom-checkbox mr-sm-2"><input type="checkbox" class="custom-control-input" onClick="oc_disease(this);" id="'+diseaseid+'" value="false" onchange="this.value=this.checked? true : false" ><label class="custom-control-label"  for="'+ diseaseid +'">'+ disease +'</label>' + '<div style="display:none;" id='+diseaseid+'Hide>')
                        //$("#fristlabel").append(fristdiseasedetail)
                        }else{
                            if(json_diseasedetail[index].diseasedetail != json_diseasedetail[index-1].diseasedetail){
                                if(diseasedetail_Type == "checkboxdetail"){
                                    var fristdiseasedetail = checkboxdetail(diseasedetailid,diseasedetail)
                                }else if(diseasedetail_Type == "customtext"){
                                    var fristdiseasedetail = customtext(diseasedetailid,diseasedetail,diseasedetailplaceholder)
                                }else if(diseasedetail_Type == "checkboxplus"){
                                    var fristdiseasedetail = checkboxplus(diseasedetailid,diseasedetail,diseasedetailplaceholder)
                                }else if(diseasedetail_Type == "alltext"){
                                    var fristdiseasedetail = alltext(diseasedetailid,diseasedetailplaceholder)
                                }else if(diseasedetail_Type == "doctor"){
                                    var fristdiseasedetail = doctor(diseaseid)
                                }else{
                                    fristdiseasedetail = "";
                                }
                            $("#fristlabel").append('<div style="display:none;" class='+diseaseid+'Hide><div class="form-group row"><label class="col-md-3 text-right"></label><div class="col-md-9" id="Baselinedisease"></label><div class="col-md-9 disease">'+fristdiseasedetail)
                            }
                        }
                    }

                }
            }
            
        }
    })
}


function checkbox(diseaseid,disease){
    var disease_end = '<div class="custom-control custom-checkbox mr-sm-2 "><input type="checkbox" class="custom-control-input" onClick="oc_disease(this)" id="'+diseaseid+'" value="false" onchange="this.value=this.checked? true : false" ><label class="custom-control-label"  for="'+ diseaseid +'">'+ disease +'</label>'
    return disease_end;
}

function checkboxend(diseaseid,disease){
    var disease_end = '<div class="custom-control custom-checkbox mr-sm-2"><input type="checkbox" class="custom-control-input" onClick="oc_diseasecheckboxend(this);" id="'+ diseaseid +'" value="false" onchange="this.value=this.checked? true : false" ><label class="custom-control-label"  for="'+ diseaseid +'">'+ disease +'</label></div>'
    return disease_end;
}

function customtext(diseasedetailid,diseasedetail,diseasedetailplaceholder){
    var disease_end = '<div class="form-group row "><div class="input-group "><div class=" col-form-label"><div class="custom-control custom-checkbox mr-sm-2"><label for="'+diseasedetailid+'">'+diseasedetail+'</label></div></div><div class="input-group-append"><input type="text"  maxlength="250" class="col-sm-9 form-control '+diseasedetailid+'" id="'+diseasedetailid+'" placeholder="'+diseasedetailplaceholder+'"></div></div></div>'
    return disease_end;
}

function checkboxdetail(diseasedetailid,diseasedetail){
    var disease_end = '<div class=" col-form-label" ><div class="custom-control custom-checkbox mr-sm-9 " ><input type="checkbox" class="custom-control-input" onClick="oc_diseasedetail(this);" id="'+diseasedetailid+'" value="false" onchange="this.value=this.checked? true : false"><label class="custom-control-label" for="'+diseasedetailid+'">'+diseasedetail+'</label></div></div>'
    return disease_end;
}

function checkboxplus(diseasedetailid,diseasedetail,diseasedetailplaceholder){
    var disease_end = '<div class="input-group " ><div class=" col-form-label"><div class="custom-control custom-checkbox mr-sm-2"><input type="checkbox" class="custom-control-input" onClick="oc_diseasedetail(this);" id="'+diseasedetailid+'" value="false" onchange="this.value=this.checked? true : false"><label class="custom-control-label" for="'+diseasedetailid+'">'+diseasedetail+'</label></div>  </div> <div class="input-group-append"><input type="text"  maxlength="250" class="col-sm-9 form-control '+diseasedetailid+'" id="'+diseasedetailid+'text" placeholder="'+diseasedetailplaceholder+'"></div></div>'
    return disease_end;
}
function alltext(diseasedetailid,diseasedetailplaceholder){
    var disease_end = '<div class="input-group-append"><textarea  class="form-control " id="'+diseasedetailid+'" placeholder='+diseasedetailplaceholder+'></textarea></div>'
    return disease_end;
}
function doctor(diseaseid){
    var disease_end = '<div class="col-sm-9"><input type="hidden" class="form-control" id="inputdoctorcase'+diseaseid+'"><select class="form-control" id="Doctor'+diseaseid+'" value=""></select></div>'
    return disease_end;
}

// อิอิ1
function submitData_Patient() { //บันทึกข้อมูลพื้นฐานของคนไข้ 
    // var drcase = document.getElementById("selectsetDoctorcase").value;
    var inputHN = sessionStorage.hncode;
    // updateHTRegistry(inputHN,sessionStorage.userID,drcase)
    var str_cvrisk_data = false;

    //Get ข้อมูลเพื่อเช็คข้อมูลซ้ำใน Database OutStanding
    $.ajax({
        type: "GET",
        url: "https://localhost:44306/api/Disease?_hncode="+sessionStorage.hncode+"&_ht_siteid="+localStorage.userSITE+"",
        dataType: 'json',
        // contentType: 'application/json; charset=utf-8',
        success: function (data) {

            console.log(data)
            
            if (data == "") {
                var sometinglikeData_Type_Json = function checked_data () {

                    var data = {};
            
                    for (var index = 0; index < eiei.length; index++) {
                        var diseaseid = eiei[index].disease_id;
                        var diseasedetailid = eiei[index].diseasedetail_id;
                        var diseasedetailType = eiei[index].diseasedetail_Type;
            
                        if ([index] == 0) {
            
                            data = {
                                [diseaseid] : {
                                    [diseaseid] : document.getElementById([diseaseid]).value,
                                    [diseasedetailid] : document.getElementById([diseasedetailid]).value
                                }
                            }
            
                        } else if (eiei[index].disease_id == eiei[index-1].disease_id){
                            
                            if (diseasedetailType == "checkboxplus"){
            
                                data[diseaseid][diseasedetailid] = document.getElementById([diseasedetailid]).value,
                                data[diseaseid][diseasedetailid+"text"] = document.getElementById([diseasedetailid+"text"]).value
            
                            } else {
            
                               data[diseaseid][diseasedetailid] = document.getElementById([diseasedetailid]).value
            
                            }
            
                        } else {
                                data[diseaseid] = {
                                    [diseaseid] : document.getElementById([diseaseid]).value,
                                    [diseasedetailid]:document.getElementById([diseasedetailid]).value
                                }
                        }
                    }
                    return JSON.stringify(data)
                }

                var formdata = {
                        "_hncode": sessionStorage.hncode,
                        "_TopicDataJson" : sometinglikeData_Type_Json,
                        "_update_by" : sessionStorage.userID,
                        "_ht_siteid" : sessionStorage.userSITE
                    }

                $.ajax({
                    
                    type: "POST",
                    url: "https://localhost:44306/api/Disease",
                    dataType: 'json',
                    data: formdata,
                    // contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        
                        // alert("บันทึกข้อมูลสำเร็จ")

                        toastr.success('บันทึกข้อมูลสำเร็จ')

                    },
                    error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                        // console.log("Add new product failed, error is '" + thrownError + "'");
                        toastr.success('บันทึกข้อมูลไม่สำเร็จ')
                    }           
                });
        
                var hncode = sessionStorage.hncode;
                var cvrisk_date =  $('#cvrisk_date').val();
                var cvrisk_percent = $('#cvrisk_percent').val();
                var cvrisk_multiply = $('#cvrisk_multiply').val();

                if (hncode != "" && cvrisk_date != "" && cvrisk_percent != "" && cvrisk_multiply != "") {

                    $.ajax({
                    
                        type: "POST",
                        url: "http://172.18.62.245/HTApi/api/CvRisk/",
                        dataType: 'json',
                        data:{ 
                                "_hncode" : hncode ,
                                "_cvrisk_date" : cvrisk_date,
                                "_cvrisk_percent" : cvrisk_percent,
                                "_cvrisk_multiply" : cvrisk_multiply, 
                                "_update_by" : sessionStorage.userID,
                                "_ht_siteid" : sessionStorage.userSITE
                            },
                        
                        success: function (data) {
                            // console.log(data);
                            $('#confirm_patientModal').modal('hide');
                            // alert("บันทึกข้อมูลสำเร็จ")

                            toastr.success('บันทึกข้อมูลสำเร็จ')
                            getCv_Risk()
                        },
                        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                            // console.log("Add new product failed, error is '" + thrownError + "'");
                            toastr.error('บันทึกข้อมูลไม่สำเร็จ')
                        }           
                    });
                }
            } else {

                var json_response =  JSON.parse(data)

                var response = json_response[0]
    
                var checkhncode = response.hncode

                if (checkhncode != sessionStorage.hncode){
                    var sometinglikeData_Type_Json = function checked_data () {

                        var data = {};
                
                        for (var index = 0; index < eiei.length; index++) {
                            var diseaseid = eiei[index].disease_id;
                            var diseasedetailid = eiei[index].diseasedetail_id;
                            var diseasedetailType = eiei[index].diseasedetail_Type;
                
                            if ([index] == 0) {
                
                                data = {
                                    [diseaseid] : {
                                        [diseaseid] : document.getElementById([diseaseid]).value,
                                        [diseasedetailid] : document.getElementById([diseasedetailid]).value
                                    }
                                }
                
                            } else if (eiei[index].disease_id == eiei[index-1].disease_id){
                                
                                if (diseasedetailType == "checkboxplus"){
                
                                    data[diseaseid][diseasedetailid] = document.getElementById([diseasedetailid]).value,
                                    data[diseaseid][diseasedetailid+"text"] = document.getElementById([diseasedetailid+"text"]).value
                
                                } else {
                
                                   data[diseaseid][diseasedetailid] = document.getElementById([diseasedetailid]).value
                
                                }
                
                            } else {
                                    data[diseaseid] = {
                                        [diseaseid] : document.getElementById([diseaseid]).value,
                                        [diseasedetailid]:document.getElementById([diseasedetailid]).value
                                    }
                            }
                        }
                        return JSON.stringify(data)
                    }
    
                    var formdata = {
                        "_hncode": sessionStorage.hncode,
                        "_TopicDataJson" : sometinglikeData_Type_Json,
                        "_update_by" : sessionStorage.userID,
                        "_ht_siteid" : sessionStorage.userSITE
                    }

                    $.ajax({
                    
                        type: "POST",
                        url: "https://localhost:44306/api/Disease",
                        dataType: 'json',
                        data: formdata,
                        // contentType: 'application/json; charset=utf-8',
                        success: function (data) {
                            
                            //   alert("บันทึกข้อมูลสำเร็จ")
                            toastr.success('บันทึกข้อมูลสำเร็จ')
                            getCv_Risk()
                            
                        },
                        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                            // console.log("Add new product failed, error is '" + thrownError + "'");
                            toastr.error('บันทึกข้อมูลไม่สำเร็จ')
                        }           
                    });
                } else {
                    
                    alert("มีการบันทึกข้อมูลคนไข้แล้ว")
                }
            }
        },
        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
              // console.log("Add new product failed, error is '" + thrownError + "'");
            }    
    })
}

function UpdateBaseInfo(){
    var inputHN = sessionStorage.hncode;
    // updateHTRegistry(inputHN,sessionStorage.userID,drcase)
    var str_cvrisk_data = false;

    var sometinglikeData_Type_Json = function checked_data () {

        var data = {};

        for (var index = 0; index < eiei.length; index++) {
            var diseaseid = eiei[index].disease_id;
            var diseasedetailid = eiei[index].diseasedetail_id;
            var diseasedetailType = eiei[index].diseasedetail_Type;

            if ([index] == 0) {

                data = {
                    [diseaseid] : {
                        [diseaseid] : document.getElementById([diseaseid]).value,
                        [diseasedetailid] : document.getElementById([diseasedetailid]).value
                    }
                }

            } else if (eiei[index].disease_id == eiei[index-1].disease_id){
                
                if (diseasedetailType == "checkboxplus"){

                    data[diseaseid][diseasedetailid] = document.getElementById([diseasedetailid]).value,
                    data[diseaseid][diseasedetailid+"text"] = document.getElementById([diseasedetailid+"text"]).value

                } else {

                   data[diseaseid][diseasedetailid] = document.getElementById([diseasedetailid]).value

                }

            } else {
                    data[diseaseid] = {
                        [diseaseid] : document.getElementById([diseaseid]).value,
                        [diseasedetailid]:document.getElementById([diseasedetailid]).value
                    }
            }
        }
        return JSON.stringify(data)
    }
    
    var formdata = {
        "_hncode": sessionStorage.hncode,
        "_TopicDataJson" : sometinglikeData_Type_Json,
        "_update_by" : sessionStorage.userID,
        "_ht_siteid" : sessionStorage.userSITE
    }

    $.ajax({
        type: "POST",
        url: "https://localhost:44306/api/Disease",
        dataType: 'json',
        data: formdata,
        success: function (data) {
            $('#confirm_editModal').modal('hide');
            toastr.success('แก้ไขข้อมูลสำเร็จ');
            // getCv_Risk()
        },
        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
            toastr.error('แก้ไขข้อมูลไม่สำเร็จ');
        }
    });
}