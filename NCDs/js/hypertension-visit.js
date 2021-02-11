//http://172.18.62.245/HTApi/api/

//ทดสอบ 
var Data = [{tid:'00-01',tname:'t1'},{tid:'00-02',tname:'t2'},{tid:'00-03',tname:'t3'}] 

var _labResult = [];

var Patient_LabResult = []; //ข้อมูลจากฐานข้อมูล Outstanding 

//CheckVaccine Status
var checkStatusVaccine = false ;
var checkStatusAge = false;
var StoragegetVaccine = []; 


//firstbmi
var Show_Datafirstbmi = [].sort((a,b) => (a.en > b.en) ? -1 : ((b.en > a.en) ? 1 : 0));
var main_Datafirstbmi = null;
var count_firstbmi = 0;
var _Datafirstbmi= [];
var main_data_personer= null;

//data 
var DisplayLabResultData = [];
var str_showDatafirstdate = false;

var DisplayBloodtestData = [];
var DisplayTreatmentData = [];
var DisplayBloodtestData_Imed = [];

var _DisplayBloodtestData = null; //ข้อมูลที่ตัดข้อมูลตามเงื่อนไขแล้ว
var _DisplayTreatmentData = null; //ข้อมูลที่ตัดข้อมูลตามเงื่อนไขแล้ว


var _DisplayBloodtestData_Imed = null; //ข้อมูลที่ตัดข้อมูลตามเงื่อนไขแล้ว


const countShowBTData = 4 //จำนวน Column ข้อมูลที่ให้แสดง
const countShowTFData = 5 //จำนวน Column ข้อมูลที่ให้แสดง

var str_NotdataTF_DBout = false;
var str_NotdataBT_DBout = false;

var json_Patient = null;

//Row Header  id , Name Header 
var Row_BTHeader_id = [ "Cholesterol_data", "Triglyceride_data", "HDL_data", "LDL_Direct_data", "LDL_data", "Glucose_data", "HbA1C_data", "Uric_data", "Creatinine_data", "Creatinine_GFR_data", "UrineProtein_data", 
                        "UrineMicroalbumin_data", "Hb_data", "Hematocrit_data", "Sodium_data", "Potassium_data"] 

var Row_BTHeader = ["Cholesterol (mg/dL)", "Triglycerides (mg/dL)", "HDL", "LDL (Direct)", "LDL (Calculate)", "FBS", "HbA1C", "Uric", "Cr", "GFR", "Urine protein (UA)", 
                    "Urine Microalbumin", "CBC :Hb (g/dL)", "CBC :Hct", "Na (Sodium)", "K (Potassium)"] 

var Row_TFHeader_id = [ "bw_data", "bmi_data", "wc_data", "bp_data", "hbp_data", "hr_data", "gdc_data", "em_data", "mf_data", "flu_data", "pneu_data", 
                        "cm_data", "da_data", "tm_data", ]//"nextp_data", "nextf_data"] 

var Row_TFHeader = ["BW (kg)", "BMI", "WC (cm/inch)", "BP (max/min)", "Home BP (range)", "HR", "Good Diet Control", "Exercise > 30 min (3 d/wk)", "กินยาสม่ำเสมอ (%)",
                    "Influenza (Flu) Vaccine", "Pneumococcal Vaccine อายุ > 65 ปี" , "Current Medicine", "ประวัติการแพ้ยา", "การปรับการรักษา", "Next Plan", "Next  F/U"] 
                    
//Data Bloodtest List
var DataBT_list = ["Cholesterol", "Triglyceride", "HDL", "LDL_Direct", "LDL", "Glucose", "HbA1C", "Uric", "Creatinine", "Creatinine_GFR", "UrineProtein", "UrineMicroalbumin", "Hb", "Hematocrit", "Sodium" , "Potassium"] ;

// getEnVitalsign
function getEnVitalsign(hncode){


    sessionStorage.removeItem("numTFlogdate")  //ตัวเลขสำหรับการเปลี่ยนตำแหน่งช่อง array ที่จะแสดง
    sessionStorage.removeItem("setTFlatestDate")  //วันที่บันทึกล่าสุด
    sessionStorage.removeItem("setTFfirstDate") //วันที่บันทึกที่น้อยที่สุด

    sessionStorage.removeItem("numBTlogdate")  //ตัวเลขสำหรับการเปลี่ยนตำแหน่งช่อง array ที่จะแสดง
    sessionStorage.removeItem("setBTlatestDate")  //วันที่บันทึกล่าสุด
    sessionStorage.removeItem("setBTfirstDate") //วันที่บันทึกที่ต่ำที่สุด
    
    // realtime_data();

    // checkVercine();

    // checkAge();

    column_Visit();

}

function checkVercine() {
    
    toastr.warning(' Name : '+sessionStorage.patient_name+' <br> Hn : '+sessionStorage.hncode+'','ระบบกำลังดึงข้อมูลการตรวจ');

    var _StorageHn = sessionStorage.hncode;
    $.ajax({    
        type: "GET",
        url: "http://172.18.62.245/ImedWebApi/api/FluVaccine?hncode="+_StorageHn,
        dataType: 'jsonp',
        success: function (response) {

            if (response == ""){

                column_Visit();

            }else{

                var json_response =JSON.parse(response);

                if (json_response != null || json_response != ""){
                    
                    checkStatusVaccine = true ;

                    for (var i = 0; i < json_response.length ; i++){

                        StoragegetVaccine.push(json_response[i]);
                    }

                    column_Visit();

                }else{

                    column_Visit();

                }
            }
        }      
    });
}

function checkAge() {
    var _StorageHn = sessionStorage.hncode;

    if (sessionStorage.age > 65){

        $.ajax({
            type: "GET",
            url: "",
            dataType: 'jsonp',
            success: function (response) {

                var json_response =JSON.parse(response);

                if (json_response != null || json_response != ""){

                    // checkStatusAge = true ;
                    // StoragegetVaccine = json_response[json_response.length-1]       
                }      
            }      
        }); 
    }
}

//Display Datatable แสดงข้อมูลในตาราง  [Recreive form getVitalsign()]
function column_Visit(){
 
    $.ajax({
        type: "GET",
        url: "https://localhost:44306/api/LabResult?hncode="+sessionStorage.hncode+"&ht_siteid="+sessionStorage.userSITE+"",
        dataType: 'json',
        // contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if(response == "" ||  response == null){
               
                document.getElementById("loading-tab1").innerHTML = "<h3 align='Center'>ไม่มีการบันทึกข้อมูล</h3>";
                document.getElementById("loading-tab2").innerHTML = "<h3 align='Center'>ไม่มีการบันทึกข้อมูล</h3>";

            } else {
                
                DisplayLabResultData =JSON.parse(response);

                Patient_LabResult =JSON.parse(response) //เก็บข้อมูลในตัวแปรสำหรับเรียกข้อมูล และสำหรับการแก้ไข

                main_data_personer=DisplayLabResultData[0].hncode;

                //Main Header
                for (var id_Name = 1 ; id_Name <= 2 ; id_Name++){
                    _column_header = "column_header"+id_Name+""
             
                    if (id_Name == 1){
                        document.getElementById(_column_header).innerHTML +="<td width='20%' rowspan='2' align='center' ><strong>Blood test</strong></td>" 

                    }else if (id_Name == 2){
                        document.getElementById(_column_header).innerHTML +="<td width='20%' rowspan='2' align='center' ><strong>Tratment & follow up</strong></td>" 
                    }
                    document.getElementById(_column_header).innerHTML +="<td colspan='"+Patient_LabResult.length+"' align='center' ><strong>Visit Date</strong></td>"
                }

                //Display  Row_Header Blood Test 
                for (var Row_i = 0 ; Row_i < Row_BTHeader_id.length ; Row_i++){

                    document.getElementById(Row_BTHeader_id[Row_i]).innerHTML = "<td><label class='col-md-12 text-left'>"+Row_BTHeader[Row_i]+"</label></td>"
        
                }

                //Display  Row_Header Treatment
                for (var Row_i = 0 ; Row_i < Row_TFHeader_id.length ; Row_i++){

                    if (Row_TFHeader_id[Row_i] ==  "flu_data" || Row_TFHeader_id[Row_i] ==  "pneu_data"){

                        document.getElementById(Row_TFHeader_id[Row_i]).innerHTML = "<td><label class='col-md-12 text-left'>"+Row_TFHeader[Row_i]+"<span id='imgVaccineStatus'> </span>   </label></td>"

                    }else{

                        document.getElementById(Row_TFHeader_id[Row_i]).innerHTML = "<td><label class='col-md-12 text-left'>"+Row_TFHeader[Row_i]+"</label></td>"

                    }
                }


            for (var bt_i = 0 ; bt_i < DisplayLabResultData.length  ; bt_i++){

                var Cholesterol = DisplayLabResultData[bt_i].Cholesterol
                var Triglyceride = DisplayLabResultData[bt_i].Triglyceride
                var HDL = DisplayLabResultData[bt_i].HDL
                var LDL_Direct = DisplayLabResultData[bt_i].LDL_Direct
                var LDL = DisplayLabResultData[bt_i].LDL
                var Glucose = DisplayLabResultData[bt_i].Glucose
                var HbA1C = DisplayLabResultData[bt_i].HbA1C
                var Uric = DisplayLabResultData[bt_i].Uric
                var Creatinine = DisplayLabResultData[bt_i].Creatinine
                var Creatinine_GFR = DisplayLabResultData[bt_i].Creatinine_GFR
                var UrineProtein = DisplayLabResultData[bt_i].UrineProtein
                var UrineMicroalbumin = DisplayLabResultData[bt_i].UrineMicroalbumin
                var Hb = DisplayLabResultData[bt_i].Hb
                var Hematocrit = DisplayLabResultData[bt_i].Hematocrit
                var Sodium = DisplayLabResultData[bt_i].Sodium
                var Potassium = DisplayLabResultData[bt_i].Potassium

                //เงื่อนไขตรวจสอบข้อมูล Bloodtest
                if (Cholesterol == "" 
                    && Triglyceride == ""
                    && HDL == "" 
                    && LDL_Direct == ""
                    && LDL == "" 
                    && Glucose == "" 
                    && HbA1C == "" 
                    && Uric == "" 
                    && Creatinine == "" 
                    && Creatinine_GFR == "" 
                    && UrineProtein == "" 
                    && UrineMicroalbumin == "" 
                    && Hb == "" 
                    && Hematocrit == "" 
                    && Sodium == "" 
                    && Potassium == "" ){


                } else {  
                            //push ข้อมูลที่ไม่ตรงกับเงื่อนไขข้างต้น เพื่อนำค่าที่เก็บไว้มาแสดงใน Table
                            DisplayBloodtestData.push(DisplayLabResultData[bt_i]);

                }
            }

            if(DisplayBloodtestData.length > 0) {

                _DisplayBloodtestData  = DisplayBloodtestData.sort((a,b) => (a.ep > b.ep) ? -1 : ((b.ep > a.ep) ? 1 : 0)) //เรียงลำดับข้อมูล
                sessionStorage.setItem("setBTlatestDate",_DisplayBloodtestData[0].visit_date); //วันที่ที่บันทึกข้อมูลล่าสุด
                sessionStorage.setItem("setBTfirstDate",_DisplayBloodtestData[_DisplayBloodtestData.length-1].visit_date);

            var _countShowBTData = 0
            //เงื่อนไขสำหรับแสดงจำนวน Column ตามที่กำหนด
            if(_DisplayBloodtestData.length < countShowBTData){

                _countShowBTData =  _DisplayBloodtestData.length  //แสดงตามจำนวนข้อมูล(_DisplayBloodtestData.length)ที่มี ไม่เกินจำนวน (countShowBTData) ที่กำหนด
            }else{
                _countShowBTData =  countShowBTData //ถ้าข้อมูล(_DisplayBloodtestData.length) เกินจำนวนที่กำหนด ก็ให้แสดงข้อมูลตาม (countShowBTData) ที่กำหนดไว้
            }   

                //แสดงข้อมูล ฺBloodtest ใน  Table
                for (var btDisplay_i = 0 ; btDisplay_i < _countShowBTData  ; btDisplay_i++){

                    let current_datetime = new Date(_DisplayBloodtestData[btDisplay_i].visit_date)
                    let _dateVisit = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()

                    if(_DisplayBloodtestData[btDisplay_i].ep.startsWith("O"))//opd
                    {
                        document.getElementById("column_visitdate1").innerHTML += "<td  align='center'><img  src='assets/images/OPD.png' height='30' width='30'/><strong  class='col-sm-12' data-toggle='modal' data-target='#myModalUpdateData' title='tab1'  id='" + _DisplayBloodtestData[btDisplay_i].ep + "'  onclick='DisplayData_Update(this)'>" +_dateVisit+ " <span> &nbsp <img  src='assets/images/icon-edit.png' height='30' width='30'/> </span></strong></td>"
                    }
                    else//ipd
                    {
                        document.getElementById("column_visitdate1").innerHTML += "<td  align='center'><img  src='assets/images/IPD.png' height='30' width='30'/><strong  class='col-sm-12' data-toggle='modal' data-target='#myModalUpdateData' title='tab1'  id='" + _DisplayBloodtestData[btDisplay_i].ep + "'  onclick='DisplayData_Update(this)'>" +_dateVisit+ " <span> &nbsp <img  src='assets/images/icon-edit.png' height='30' width='30'/> </span></strong></td>"
                    }
                    
                    for (var OutBT_list_i = 0; OutBT_list_i < DataBT_list.length; OutBT_list_i++) {

                        var _DataBTName = DataBT_list[OutBT_list_i]

                        //เงื่อนไขถ้าเป็นข้อมูล GFR ให้แสดงข้อมูลเป็น tag textarea  
                        if (Row_BTHeader_id[OutBT_list_i] == "Creatinine_GFR_data"){

                            document.getElementById(Row_BTHeader_id[OutBT_list_i]).innerHTML += "<td ><textarea class='form-control col-md-12' rows='6' disabled>"+_DisplayBloodtestData[btDisplay_i][_DataBTName]+"</textarea></td>"  

                        }else{
          
                            document.getElementById(Row_BTHeader_id[OutBT_list_i]).innerHTML += "<td align='center'><label class='col-md-12 text-center'>" + _DisplayBloodtestData[btDisplay_i][_DataBTName] + "</label></td>"

                        }
                    }
                }

                //เงื่อนไขแสดงปุ่ม Arrow ด้านขวา ใน Tap Bloodtest 
                if(_DisplayBloodtestData.length > _countShowBTData){

                    document.getElementById("arrowiconBT_right").innerHTML = "<span class='fa fa-angle-right' onclick='last_dateBTData()' style='position:absolute; top: 10px; right: 20px; font-size: 30px;'></span>"
                
                }
            }

            for (var tf_i = 0 ; tf_i < DisplayLabResultData.length  ; tf_i++){

                var weight = DisplayLabResultData[tf_i].weight
                var bmi = DisplayLabResultData[tf_i].bmi
                var pressure_min = DisplayLabResultData[tf_i].pressure_min
                var pressure_max = DisplayLabResultData[tf_i].pressure_max
                var pulse = DisplayLabResultData[tf_i].pulse

                //เงื่อนไขตรวจสอบข้อมูล Treatment & follow up  
                if (weight == "" && bmi == "" && pressure_min == "" && pressure_max == "" && pulse == ""  ){

                } else {  
                    
                    //push ข้อมูลที่ไม่ตรงกับเงื่อนไขข้างต้น เพื่อนำค่าที่เก็บไว้มาแสดงใน Table
                    DisplayTreatmentData.push(DisplayLabResultData[tf_i]);
                        
                }

            }

            if(DisplayTreatmentData.length > 0){

                _DisplayTreatmentData  = DisplayTreatmentData.sort((a,b) => (a.ep > b.ep) ? -1 : ((b.ep > a.ep) ? 1 : 0)) //ข้อมูลที่ทำการเช็คตามเงื่อนไข ที่ไม่มีข้อมูลทั้งหมด และจาก database ตัวไหน
                sessionStorage.setItem("setTFlatestDate",_DisplayTreatmentData[0].visit_date); //วันที่ที่บันทึกข้อมูลล่าสุด
                sessionStorage.setItem("setTFfirstDate",_DisplayTreatmentData[_DisplayTreatmentData.length-1].visit_date); //วันที่บันทึกที่เก่าสุด

            }


            //จำนวน Column ที่แสดงข้อมูล
            var _countShowTFData = 0
            if(_DisplayTreatmentData.length < countShowTFData){

                _countShowTFData =  _DisplayTreatmentData.length
            }else{
                _countShowTFData =  countShowTFData
            } 
            
            //เงื่อนไขแสดงปุ่ม Arrow ด้านขวา ใน Tap Treatment & follow up
            if(DisplayTreatmentData.length > _countShowTFData){

                document.getElementById("arrowiconTF_right").innerHTML = "<span class='fa fa-angle-right' onclick='last_dateTFData()' style='position:absolute; top: 10px; right: 20px; font-size: 30px;'></span>"
            }
            
            //แสดงข้อมูล Treatment & follow up  ใน  Table
            for (var tfDisplay_i = 0 ; tfDisplay_i < _countShowTFData  ; tfDisplay_i++){

                    let current_datetime = new Date(_DisplayTreatmentData[tfDisplay_i].visit_date)
                    let _dateVisit = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
                    if(_DisplayTreatmentData[tfDisplay_i].ep.startsWith("O"))//opd
                    {
                        document.getElementById("column_visitdate2").innerHTML += "<td  align='center'><img  src='assets/images/OPD.png' height='30' width='30'/><strong  class='col-sm-12' data-toggle='modal' data-target='#myModalUpdateData' title='tab2'  id='"+_DisplayTreatmentData[tfDisplay_i].ep+"'  onclick='DisplayData_Update(this)'>"+_dateVisit+"<span> &nbsp <img  src='assets/images/icon-edit.png' height='30' width='30'/> </span> </strong></td>"
                    }
                    else//ipd
                    {
                        document.getElementById("column_visitdate2").innerHTML += "<td  align='center'><img  src='assets/images/IPD.png' height='30' width='30'/><strong  class='col-sm-12' data-toggle='modal' data-target='#myModalUpdateData' title='tab2'  id='"+_DisplayTreatmentData[tfDisplay_i].ep+"'  onclick='DisplayData_Update(this)'>"+_dateVisit+"<span> &nbsp <img  src='assets/images/icon-edit.png' height='30' width='30'/> </span> </strong></td>"
                    }

                    if(_DisplayTreatmentData[tfDisplay_i].pressure_max == "" && _DisplayTreatmentData[tfDisplay_i].pressure_min == ""){

                        var txtDisplayTreatmentData = "<td align='center'><label class='col-md-12 text-center'></label></td>"

                    }else{

                        var txtDisplayTreatmentData = "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tfDisplay_i].pressure_max+"/"+_DisplayTreatmentData[tfDisplay_i].pressure_min+"</label></td>"

                    }
                        //Data Treatment
                        document.getElementById("bw_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tfDisplay_i].weight+"</label></td>"
                        document.getElementById("bmi_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tfDisplay_i].bmi+"</label></td>"
                        document.getElementById("wc_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tfDisplay_i].wc+"</label></td>"
                        document.getElementById("bp_data").innerHTML +=  txtDisplayTreatmentData
                        document.getElementById("hbp_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tfDisplay_i].home_bp+"</label></td>"
                        document.getElementById("hr_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tfDisplay_i].pulse+"</label></td>"
                        
                        //เงื่อนไขตรวจสอบ เพื่อแสดงการ Status Check ไปยัง Data table 
                        var gdc_data_status  = _DisplayTreatmentData[tfDisplay_i].Good_diet_control == true ? "Checked" : "" ;
                        var em_data_status  = _DisplayTreatmentData[tfDisplay_i].Exercise_minute == true ? "Checked" : "" ;
                        var flu_data_status  = _DisplayTreatmentData[tfDisplay_i].FluVaccine == true ? "Checked" : "" ; 
                        var pneu_data_status  = _DisplayTreatmentData[tfDisplay_i].PneumococcalVaccine == true ? "Checked" : "" ;

                        document.getElementById("gdc_data").innerHTML += "<td align='center'><input class='largerCheckbox'  type='checkbox' "+gdc_data_status+"></td>"  
                        document.getElementById("em_data").innerHTML += "<td align='center'><input  class='largerCheckbox' type='checkbox' "+em_data_status+" ></td>"  
                        document.getElementById("flu_data").innerHTML += "<td align='center'><input class='largerCheckbox' type='checkbox' "+flu_data_status+" ></td>"  
                        document.getElementById("pneu_data").innerHTML += "<td align='center'><input class='largerCheckbox' type='checkbox' "+pneu_data_status+" ></td>"  

                        document.getElementById("mf_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tfDisplay_i].Medication_frequency+"</label></td>"  
                        document.getElementById("da_data").innerHTML += "<td ><textarea class='form-control col-md-12'  disabled>"+_DisplayTreatmentData[tfDisplay_i].Drug_allergy+"</textarea></td>"   
                        document.getElementById("cm_data").innerHTML += "<td ><textarea class='form-control col-md-12' rows='15'  disabled>"+_DisplayTreatmentData[tfDisplay_i].Current_medicine+"</textarea></td>"  
                        document.getElementById("tm_data").innerHTML += "<td ><textarea class='form-control col-md-12'  disabled>"+_DisplayTreatmentData[tfDisplay_i].Treatment+"</textarea></td>"
                       // document.getElementById("nextp_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tfDisplay_i].Next_plan+"</label></td>"
                       // document.getElementById("nextf_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tfDisplay_i].Next_f_u+"</label></td>"
                
            }

                if (checkStatusAge == true){
    
                } else if (checkStatusVaccine == true){ 
    
                    for (var StoragegetVaccine_i = StoragegetVaccine.length-1 ; StoragegetVaccine_i >= 0 ; StoragegetVaccine_i--){

                        let current_datetime = new Date(StoragegetVaccine[StoragegetVaccine_i].vaccine_date)
                        let _dateVaccine = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()

                        //Modal Vaccine
                        document.getElementById("vaccineDetail").innerHTML += "<Strong>Vaccine Name :  </Strong>"+StoragegetVaccine[StoragegetVaccine_i].Vaccine_Name+"<br><Strong>Date : </Strong>"+_dateVaccine+"<br><br> ";
                    
                    }

                    document.getElementById("imgVaccineStatus").innerHTML = "<img  data-toggle='modal' data-target='#VaccineModal' src='assets/images/medicine.png' height='40' width='40'/>";
                }

                spinning();

            }
            // realtime_data();
            

        },
        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
            // console.log("Add new product failed, error is '" + thrownError + "'");

        }     

        });
    
}



//EditData  เมื่อกดที่วันที่ กรณีที่มีข้อมูลในฐานข้อมูล Outstanding (Modal (myModalUpdateData))  เรียกข้อมูลมาแสดงใน Modal
function DisplayData_Update(item){
    
    var episode_en = item.id;
    var tabTitle = item.title; // Display Check Active

    //Tab Str Active
    if (tabTitle == "tab1"){
        document.getElementById("activeUpdate-t1").setAttribute("class","nav-link active")
        document.getElementById("tab-update-t1").setAttribute("class","tab-pane active")
        document.getElementById("activeUpdate-t2").setAttribute("class","nav-link ")    
        document.getElementById("tab-update-t2").setAttribute("class","tab-pane ")

    }else if (tabTitle == "tab2"){
        document.getElementById("activeUpdate-t1").setAttribute("class","nav-link ")
        document.getElementById("tab-update-t1").setAttribute("class","tab-pane")
        document.getElementById("activeUpdate-t2").setAttribute("class","nav-link active")    
        document.getElementById("tab-update-t2").setAttribute("class","tab-pane active")

    }

    sessionStorage.setItem("LabResult_en", item.id); //สำหรับกำหนด en ตอน insert ข้อมูล
    var txt_measure_date = item.firstChild.data;
    document.getElementById("measure_date_edit").innerHTML = "ข้อมูลการตรวจ ("+ txt_measure_date+")";
    
    var edit_LabResult = Patient_LabResult;
    var check_Hn = main_data_personer

    if (sessionStorage.hncode == check_Hn){

        for (var i = 0 ; i < edit_LabResult.length ; i++){
            
            if (edit_LabResult[i].ep == episode_en){

                //Treatmant
                document.getElementById("editTF_BW").value = edit_LabResult[i].weight;
                document.getElementById("editTF_BMI").value = edit_LabResult[i].bmi;
                document.getElementById("editTF_WC").value = edit_LabResult[i].wc;
                document.getElementById("editTF_BP_min").value = edit_LabResult[i].pressure_min;
                document.getElementById("editTF_BP_max").value = edit_LabResult[i].pressure_max;
                document.getElementById("editTF_HBP").value = edit_LabResult[i].home_bp
                document.getElementById("editTF_HR").value = edit_LabResult[i].pulse;

                document.getElementById("editTF_MF").value = edit_LabResult[i].Medication_frequency;
                // document.getElementById("editTF_AppointmentRate").value = edit_LabResult[i].AppointmentRate;
                document.getElementById("editTF_Drug_allergy").value = edit_LabResult[i].Drug_allergy;

                document.getElementById("editTF_Current_medicine").innerHTML = edit_LabResult[i].Current_medicine;
                document.getElementById("editTF_Current_medicine").rows = "15";
                document.getElementById("editTF_External_Result").value = edit_LabResult[i].ExternalResult;
                document.getElementById("editTF_External_Result").rows = "7";

                 //set ค่าใน Value  True/False  สำหรับการแก้ไขจะได้เป็นค่านั้นๆ
                 document.getElementById("editTF_GDC").setAttribute("value", edit_LabResult[i].Good_diet_control )
                 document.getElementById("editTF_ExerciseMin").setAttribute("value", edit_LabResult[i].Exercise_minute)
                 document.getElementById("editTF_Flu").setAttribute("value", edit_LabResult[i].FluVaccine)
                 document.getElementById("editTF_Pneu").setAttribute("value", edit_LabResult[i].PneumococcalVaccine )

                 document.getElementById("editTF_Nutritionist").setAttribute("value", edit_LabResult[i].Nutritionist )
                 document.getElementById("editTF_Alcohol").setAttribute("value", edit_LabResult[i].Alcohol )
                 document.getElementById("editTF_Smoking").setAttribute("value", edit_LabResult[i].Smoking )
                 document.getElementById("editTF_SleepRate").setAttribute("value", edit_LabResult[i].SleepRate )

                $("#editTF_ExerciseMin").prop( "checked", edit_LabResult[i].Exercise_minute)
                $("#editTF_GDC").prop( "checked", edit_LabResult[i].Good_diet_control )
                $("#editTF_Flu").prop( "checked", edit_LabResult[i].FluVaccine )
                $("#editTF_Pneu").prop( "checked", edit_LabResult[i].PneumococcalVaccine )

                $("#editTF_Nutritionist").prop( "checked", edit_LabResult[i].Nutritionist)
                $("#editTF_Alcohol").prop( "checked", edit_LabResult[i].Alcohol )
                $("#editTF_Smoking").prop( "checked", edit_LabResult[i].Smoking )
                $("#editTF_SleepRate").prop( "checked", edit_LabResult[i].SleepRate )

                document.getElementById("editTF_Treatment").innerHTML = edit_LabResult[i].Treatment
                //document.getElementById("editTF_Next_plan").setAttribute("value",edit_LabResult[i].Next_plan)
                //document.getElementById("editTF_Next_f_u").setAttribute("value",edit_LabResult[i].Next_f_u) 

                //Blood Test
                document.getElementById("editBT_Cholesterol").value = edit_LabResult[i].Cholesterol;
                document.getElementById("editBT_Triglyceride").value = edit_LabResult[i].Triglyceride;
                document.getElementById("editBT_HDL").value = edit_LabResult[i].HDL;
                document.getElementById("editBT_LDL_Direct").value = edit_LabResult[i].LDL_Direct;
                document.getElementById("editBT_LDL").value = edit_LabResult[i].LDL;
                document.getElementById("editBT_HbA1C").value = edit_LabResult[i].HbA1C;
                document.getElementById("editBT_FBS").value = edit_LabResult[i].Glucose;
                document.getElementById("editBT_Uric").value = edit_LabResult[i].Uric;
                document.getElementById("editBT_Cr").value = edit_LabResult[i].Creatinine;
                document.getElementById("editBT_Creatinine_GFR").value = edit_LabResult[i].Creatinine_GFR;
                document.getElementById("editBT_Creatinine_GFR").rows = "6";
                document.getElementById("editBT_UrineProtein").value = edit_LabResult[i].UrineProtein;
                document.getElementById("editBT_UrineMicroalbumin").value = edit_LabResult[i].UrineMicroalbumin;
                document.getElementById("editBT_Hb").value = edit_LabResult[i].Hb;
                document.getElementById("editBT_Hematocrit").value = edit_LabResult[i].Hematocrit;
                document.getElementById("editBT_Sodium").value = edit_LabResult[i].Sodium;
                document.getElementById("editBT_Potassium").value = edit_LabResult[i].Potassium;

            }
        }
    }
}

//----------------------------------------------------------------- Function Update Data Realtime -----------------------------------------------------------------
function realtime_data(){

    // var check_DataImed = [];
    var PatientData_Out_En = [];
    var _C_Patientlastvitalsign_Imed = [];
    var _C_PatientLabResult_Imed = [];

    //ข้อมูลจัดเรียงลำดับแล้ว
    var C_Patientlastvitalsign_Imed = null;
    var C_PatientLabResult_Imed = null;

    //Get Data Patient_LabResult from OutStanding   (ดึงข้อมูลจาก Outstanding เพื่อนำ en มาเช็คกับ  en  ของข้อมูลใน Imed)
    $.ajax({
        type: "GET",
        url: "https://localhost:44306/api/LabResult?hncode="+sessionStorage.hncode+"&ht_siteid="+sessionStorage.userSITE+"", //LabResult จาก Outstanding
        dataType: 'json',
        // data:JSON.stringify(obj),
        success: function (response) {

            if(response == null || response == ""){

                console.log(null)

            }else{

                var PatientLabResult_Out =JSON.parse(response);
                // console.log(PatientLabResult_Out)

                    $.ajax({
                        type: "GET",
                        url: "http://172.18.62.245/ImedWebApi/api/Visit?hncode="+sessionStorage.hncode,  //LabResult จาก Imed
                        dataType: 'jsonp',
                        success: function (response) {

                            var json_response = JSON.parse(response)
                        
                        for (var i = 0 ; i < PatientLabResult_Out.length ; i++){

                            for (var l = 0 ; l < json_response.length ; l++){

                                if (PatientLabResult_Out[i].ep == json_response[l].en){ //นำ EN ที่มีใน DB Outstanding  เพื่อนำข้อมูลจาก Imed เฉพาะ en ที่มีใน Outstanding

                                    _C_PatientLabResult_Imed.push(json_response[l])
                                    PatientData_Out_En.push(json_response[l].en)
                                }
                            }
                        }

                        C_PatientLabResult_Imed = _C_PatientLabResult_Imed.sort((a,b) => (a.en > b.en) ? -1 : ((b.en > a.en) ? 1 : 0))

                            //เรียกข้อมูลจาก Imed Api 
                            for (var PatientData_Out_En_i = 0 ; PatientData_Out_En_i < PatientData_Out_En.length ; PatientData_Out_En_i++ ){

                                $.ajax({
                                    type: "GET",
                                    url: "http://172.18.62.245/ImedWebApi/api/VitalsignOPD?en="+PatientData_Out_En[PatientData_Out_En_i]+"&lastvitalsign=true",
                                    dataType: 'jsonp',
                                    success: function (response) {

                                        // var array_response = [];
                                        var json_response = JSON.parse(response)

                                        _C_Patientlastvitalsign_Imed.push(json_response[0])

                                        if (_C_Patientlastvitalsign_Imed.length >=  PatientData_Out_En.length){

                                            C_Patientlastvitalsign_Imed = _C_Patientlastvitalsign_Imed.sort((a,b) => (a.en > b.en) ? -1 : ((b.en > a.en) ? 1 : 0))  //เรียงลำดับ
                                            update_realtime();

                                        }
                                    }
                                });
                            }

                            //แก้ไขข้อมูลเรียลไทม์
                            function update_realtime(){
          
                                for (var _Response_i = 0 ; _Response_i < C_PatientLabResult_Imed.length ; _Response_i++){
                         
                                    if  (

                                        (C_Patientlastvitalsign_Imed[_Response_i].pressure_min != PatientLabResult_Out[_Response_i].pressure_min && C_Patientlastvitalsign_Imed[_Response_i].pressure_min != null && PatientLabResult_Out[_Response_i].pressure_min != "" ) ||
                                        (C_Patientlastvitalsign_Imed[_Response_i].pressure_max != PatientLabResult_Out[_Response_i].pressure_max && C_Patientlastvitalsign_Imed[_Response_i].pressure_max != null && PatientLabResult_Out[_Response_i].pressure_max != "" ) ||
                                        (C_Patientlastvitalsign_Imed[_Response_i].pulse != PatientLabResult_Out[_Response_i].pulse && C_Patientlastvitalsign_Imed[_Response_i].pulse != null && PatientLabResult_Out[_Response_i].pulse != "" ) 
                                        
                                        ) {

                                            formdata = {

                                                "_ep": C_Patientlastvitalsign_Imed[_Response_i].en, 
                                                "_pressure_min": C_Patientlastvitalsign_Imed[_Response_i].pressure_min,
                                                "_pressure_max": C_Patientlastvitalsign_Imed[_Response_i].pressure_max,
                                                "_pulse": C_Patientlastvitalsign_Imed[_Response_i].pulse,

                                            }

                                            console.log(formdata)

                                            $.ajax({
                                                type: "PUT",
                                                url: "https://localhost:44306/api/Realtime_update/",
                                                dataType: 'json',
                                                data: formdata,
                                                headers: {
                                                    "Access-Control-Allow-Origin":"*"
                                                },
                                                success: function (data) {

                                                    console.log("แก้ไขข้อมูลสำเร็จ")

                                                },
                                                error: function (jqXHR, xhr, ajaxOptions, thrownError) {    

                                                }
                                            });                                       
                                    }else{

                                        console.log("ไม่มีการแก้ไข")
                                    }
                                }
                            }                       
                        }
                    });
            }
        }, error: function (jqXHR, xhr, ajaxOptions, thrownError) {

            alert("Recrive Patients data failed, error is '" + thrownError + "'");

        }
    });  
}

//----------------------------------------------------------------- Function OnClick in  Insert Modal / Update Modal -----------------------------------------------------------------
function update_LabResult(){

    formdata = {
        "_ep": sessionStorage.LabResult_en, 
        "_weight": $('#editTF_BW').val(),
        "_bmi": $('#editTF_BMI').val(),
        "_wc": $('#editTF_WC').val(),
        "_pressure_min": $('#editTF_BP_min').val(),
        "_pressure_max": $('#editTF_BP_max').val(),
        "_home_bp": $('#editTF_HBP').val(),
        "_pulse": $('#editTF_HR').val(),
        "_Good_diet_control": $('#editTF_GDC').val(),
        "_Exercise_minute": $('#editTF_ExerciseMin').val(),
        "_Drug_allergy": $('#editTF_Drug_allergy').val(),
        "_Medication_frequency": $('#editTF_MF').val(),

        // "_AppointmentRate": $('#editTF_AppointmentRate').val(),

        "_FluVaccine": $('#editTF_Flu').val(),
        "_PneumococcalVaccine": $('#editTF_Pneu').val(),

        "_Nutritionist": $('#editTF_Nutritionist').val(),
        "_Alcohol": $('#editTF_Alcohol').val(),
        "_Smoking": $('#editTF_Smoking').val(),
        "_SleepRate": $('#editTF_SleepRate').val(),

        "_Current_medicine": $('#editTF_Current_medicine').val(),
        "_Treatment": $('#editTF_Treatment').val(),
        "_Next_plan": $('#editTF_Next_plan').val(),
        "_Next_f_u": $('#editTF_Next_f_u').val(),

        "_update_by": sessionStorage.userID,
        "_External_Result": $('#editTF_External_Result').val(),
    }

    console.log(formdata)

    $.ajax({
        type: "PUT",
        url: "https://localhost:44306/api/LabResult",
        dataType: 'json',
        data: formdata,
        headers: {
            "Access-Control-Allow-Origin":"*",
            "Access-Control-Allow-Methods": "PUT, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Special-Request-Header",
            "Access-Control-Allow-Credentials": true
        },
        success: function (data) {

            // console.log(data);
           
            $('#myModalUpdateData').modal('hide')
            $('#confirm_updatesModal').modal('hide')

            toastr.success('แก้ไขข้อมูลสำเร็จ');

            Clear_Data();

            
        },
        error: function (jqXHR, xhr, ajaxOptions, thrownError) {

        }
    });
}

//----------------------------------------------------------------- Function Clear Data in table -----------------------------------------------------------------

//Reset ค่าทุกอย่างใน page
function Clear_Data(){ 

    //Clear Data 
     _labResult = [];

     Patient_LabResult = null; //ข้อมูลจากฐานข้อมูล Outstanding 

    //Clear CheckVaccine Status
     checkStatusVaccine = false ;
     checkStatusAge = false;
     StoragegetVaccine = []; 

    //Clear Data firstbmi
     Show_Datafirstbmi = [].sort((a,b) => (a.en > b.en) ? -1 : ((b.en > a.en) ? 1 : 0));
     main_Datafirstbmi = null;
     count_firstbmi = 0;
     _Datafirstbmi= [];
     main_data_personer= null;

     //data 
    DisplayLabResultData = [];
    str_showDatafirstdate = false;

    DisplayBloodtestData = [];
    DisplayTreatmentData = [];
    DisplayBloodtestData_Imed = [];
    _DisplayBloodtestData = null; //ข้อมูลที่ตัดข้อมูลตามเงื่อนไขแล้ว
    _DisplayTreatmentData = null;
    _DisplayBloodtestData_Imed = null; //ข้อมูลที่ตัดข้อมูลตามเงื่อนไขแล้ว

    // countShowBTData = 2 //จำนวน Column ข้อมูลที่ให้แสดง
    // countShowTFData = 4 //จำนวน Column ข้อมูลที่ให้แสดง

    str_NotdataTF_DBout = false;
    str_NotdataBT_DBout = false;

     //Clear Data Vaccine in Modal
     document.getElementById("vaccineDetail").innerHTML = ""

     //Clear Column , Visitdate 
     for (var id_Name = 1 ; id_Name <= 2 ; id_Name++){     

        _column_header = "column_header"+id_Name+""
        _column_visitdate = "column_visitdate"+id_Name+""
 
        if (id_Name == 1){

            document.getElementById(_column_header).innerHTML =""
            document.getElementById(_column_visitdate).innerHTML = "" 

        }else if (id_Name == 2){

            document.getElementById(_column_header).innerHTML ="" 
            document.getElementById(_column_visitdate).innerHTML = "" 

        }

        document.getElementById(_column_header).innerHTML =""
       
    }
 
    //Clear Data Row_Header Bloodtest 
    for (var Row_i = 0 ; Row_i < Row_BTHeader_id.length ; Row_i++){

        document.getElementById(Row_BTHeader_id[Row_i]).innerHTML = ""
        
    }

    //Clear Data Row_Header Treatment 
    for (var Row_i = 0 ; Row_i < Row_TFHeader_id.length ; Row_i++){

        document.getElementById(Row_TFHeader_id[Row_i]).innerHTML = ""
        
    }

    $modal = $('#myModalUpdateData');
    $modal.find('form')[0].reset();

    document.getElementById("loading-tab1").innerHTML =  "<div class='modal-dialog modal-dialog-centered justify-content-center' role='document'> <span class='fa fa-spinner fa-spin fa-3x'></span>"
    document.getElementById("loading-tab2").innerHTML =  "<div class='modal-dialog modal-dialog-centered justify-content-center' role='document'> <span class='fa fa-spinner fa-spin fa-3x'></span>"

    document.getElementById("arrowiconBT_right").innerHTML = ""
    document.getElementById("arrowiconBT_left").innerHTML = ""

    document.getElementById("arrowiconTF_right").innerHTML = ""
    document.getElementById("arrowiconTF_left").innerHTML = ""

     getEnVitalsign(sessionStorage.hncode);  //เรียกข้อมูลมาใหม่
}

//----------------------------------------------------------------- Function Onclick Arrow Icon  ของ Treatment & Follow up -----------------------------------------------------------------

//onclick icon arrow right
function last_dateTFData(){

    clear_TFdatatable();

    var number= 0

    number = 1;

    last_visitTFData(number)
}

//onclick icon arrow left
function next_dateTFData(){

    clear_TFdatatable();

    var number= 0

    number = 1;

    next_visitTFData(number)
}

//ฟังก์ชันดึงข้อมูลมาแสดงใน Table  เมื่อ Click Arrow right   
function last_visitTFData(number){

var lastTFdate = 0;

var checknumlogdate = sessionStorage.numTFlogdate

if(checknumlogdate != null){

    lastTFdate = parseInt(sessionStorage.numTFlogdate)+ number;

}else{

    lastTFdate = 0 + number;
}


sessionStorage.setItem("numTFlogdate",lastTFdate)

var setTFlatestDate = new Date(sessionStorage.setTFlatestDate) //วันที่ที่บันทึกข้อมูลล่าสุด

var setTFlastestDisplay =  new Date(sessionStorage.setTFlatestDate); //วันที่ล่าสุดที่ทำการคลิก arrow right icon

setTFlastestDisplay.setDate(setTFlastestDisplay.getDate() - parseInt(sessionStorage.numTFlogdate));

//เงื่อนไขแสดงปุ่ม Arrow left 
if(setTFlastestDisplay.getTime()  <  setTFlatestDate.getTime()){ 

    document.getElementById("arrowiconTF_left").innerHTML = "<span class='fa fa-angle-left' onclick='next_dateTFData()' style='position:absolute; top: 10px; left: 20px;  font-size: 30px;'></span>"
    
}


if (_DisplayTreatmentData.length > 0){

    for (var tf_i = lastTFdate ; tf_i < (lastTFdate+countShowTFData)  ; tf_i++){

        //เงื่อนไขถ้าวันที่ที่แสดง = วันที่ที่เก่าที่สุด ปิดปุ่ม Arrow right 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        if(_DisplayTreatmentData[tf_i].visit_date == sessionStorage.setTFfirstDate){

                document.getElementById("arrowiconTF_right").innerHTML = "";
        
        }

                let current_datetime = new Date(_DisplayTreatmentData[tf_i].visit_date)
                let _dateVisit = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()

                if(_DisplayTreatmentData[tf_i].ep.startsWith("O"))//opd
                {
                    document.getElementById("column_visitdate2").innerHTML += "<td  align='center'><img  src='assets/images/OPD.png' height='30' width='30'/><strong  class='col-sm-12' data-toggle='modal' data-target='#myModalUpdateData' title='tab2'  id='"+_DisplayTreatmentData[tf_i].ep+"'  onclick='DisplayData_Update(this)'>"+_dateVisit+"<span> &nbsp <img  src='assets/images/icon-edit.png' height='30' width='30'/> </span> </strong></td>"
                }
                else//ipd
                {
                    document.getElementById("column_visitdate2").innerHTML += "<td  align='center'><img  src='assets/images/IPD.png' height='30' width='30'/><strong  class='col-sm-12' data-toggle='modal' data-target='#myModalUpdateData' title='tab2'  id='"+_DisplayTreatmentData[tf_i].ep+"'  onclick='DisplayData_Update(this)'>"+_dateVisit+"<span> &nbsp <img  src='assets/images/icon-edit.png' height='30' width='30'/> </span> </strong></td>"
                }

                if(_DisplayTreatmentData[tf_i].pressure_max == "" && _DisplayTreatmentData[tf_i].pressure_min == ""){

                    var txtDisplayTreatmentData = "<td align='center'><label class='col-md-12 text-center'></label></td>"

                }else{

                    var txtDisplayTreatmentData = "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].pressure_max+"/"+_DisplayTreatmentData[tf_i].pressure_min+"</label></td>"


                }

                //Data Treatment
                document.getElementById("bw_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].weight+"</label></td>"
                document.getElementById("bmi_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].bmi+"</label></td>"
                document.getElementById("wc_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].wc+"</label></td>"
                document.getElementById("bp_data").innerHTML += txtDisplayTreatmentData
                document.getElementById("hbp_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].home_bp+"</label></td>"
                document.getElementById("hr_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].pulse+"</label></td>"
                
                //เงื่อนไขตรวจสอบ เพื่อแสดงการ Status Check ไปยัง Data table 
                var gdc_data_status  = _DisplayTreatmentData[tf_i].Good_diet_control == true ? "Checked" : "" ;
                var em_data_status  = _DisplayTreatmentData[tf_i].Exercise_minute == true ? "Checked" : "" ;
                var flu_data_status  = _DisplayTreatmentData[tf_i].FluVaccine == true ? "Checked" : "" ; 
                var pneu_data_status  = _DisplayTreatmentData[tf_i].PneumococcalVaccine == true ? "Checked" : "" ;

                document.getElementById("gdc_data").innerHTML += "<td align='center'><input class='largerCheckbox' type='checkbox' "+gdc_data_status+"></td>"  
                document.getElementById("em_data").innerHTML += "<td align='center'><input  class='largerCheckbox' type='checkbox' "+em_data_status+" ></td>"  
                document.getElementById("flu_data").innerHTML += "<td align='center'><input class='largerCheckbox' type='checkbox' "+flu_data_status+" ></td>"  
                document.getElementById("pneu_data").innerHTML += "<td align='center'><input class='largerCheckbox' type='checkbox' "+pneu_data_status+" ></td>"  

                document.getElementById("mf_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].Medication_frequency+"</label></td>"  
                document.getElementById("da_data").innerHTML += "<td ><textarea class='form-control col-md-12'  disabled>"+_DisplayTreatmentData[tf_i].Drug_allergy+"</textarea></td>" 
                document.getElementById("cm_data").innerHTML += "<td ><textarea class='form-control col-md-12' rows='15'  disabled>"+_DisplayTreatmentData[tf_i].Current_medicine+"</textarea></td>"  
                document.getElementById("tm_data").innerHTML += "<td ><textarea class='form-control col-md-12'  disabled>"+_DisplayTreatmentData[tf_i].Treatment+"</textarea></td>"
               // document.getElementById("nextp_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].Next_plan+"</label></td>"
               // document.getElementById("nextf_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].Next_f_u+"</label></td>"

        }
    }
}

//ฟังก์ชันดึงข้อมูลมาแสดงใน Table  เมื่อ Click Arrow left
function next_visitTFData(number){

var lastTFdate = 0;

var checknumlogdate = sessionStorage.numTFlogdate

if(checknumlogdate != null){

    lastTFdate = parseInt(sessionStorage.numTFlogdate) - number;

}else{

    lastTFdate = 0 - number;
}


sessionStorage.setItem("numTFlogdate",lastTFdate)

var setTFlatestDate = new Date(sessionStorage.setTFlatestDate) //วันที่ล่าสุดที่บันทึกข้อมูล

var setTFlastestDisplay =  new Date(sessionStorage.setTFlatestDate); //วันที่ล่าสุดสุดที่ทำการคลิกแล้วแสดง (ซ้าย-ขวา)

setTFlastestDisplay.setDate(setTFlastestDisplay.getDate() - parseInt(sessionStorage.numTFlogdate));

var setTFfirstDate = new Date(sessionStorage.setTFfirstDate) //วันที่ล่าสุด(ซ้ายสุด)ที่มีข้อมูล (ซ้าย-ขวา)

if(setTFlatestDate.getTime() == setTFlastestDisplay.getTime()){ //ซ้อน arrow left นที่บันทึกข้อมูลล่าสุด เท่ากับ วันที่ด้านซ้ายที่แสดงล่าสุด 

    document.getElementById("arrowiconTF_left").innerHTML = ""
    
}

if (setTFlatestDate.getTime() > setTFfirstDate.getTime()) { //แสดง arrow right เมื่อ วันที่บันทึกข้อมูลล่าสุดมากกว่า วันที่ที่บันทึกน้อยที่สุด 

    document.getElementById("arrowiconTF_right").innerHTML = "<span class='fa fa-angle-right' onclick='last_dateTFData()' style='position:absolute; top: 10px; right: 20px; font-size: 30px;'></span>"

}

if (_DisplayTreatmentData.length > 0){ //ถ้าไม่มีข้อมูล Teartment ใน ฐานข้อมูล Outstanding

    for (var tf_i = lastTFdate ; tf_i < (lastTFdate+countShowTFData)  ; tf_i++){

                let current_datetime = new Date(_DisplayTreatmentData[tf_i].visit_date)
                let _dateVisit = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()

                if(_DisplayTreatmentData[tf_i].ep.startsWith("O"))//opd
                {
                    document.getElementById("column_visitdate2").innerHTML += "<td  align='center'><img  src='assets/images/OPD.png' height='30' width='30'/><strong  class='col-sm-12' data-toggle='modal' data-target='#myModalUpdateData' title='tab2'  id='"+_DisplayTreatmentData[tf_i].ep+"'  onclick='DisplayData_Update(this)'>"+_dateVisit+"<span> &nbsp <img  src='assets/images/icon-edit.png' height='30' width='30'/> </span> </strong></td>"
                }
                else//ipd
                {
                    document.getElementById("column_visitdate2").innerHTML += "<td  align='center'><img  src='assets/images/IPD.png' height='30' width='30'/><strong  class='col-sm-12' data-toggle='modal' data-target='#myModalUpdateData' title='tab2'  id='"+_DisplayTreatmentData[tf_i].ep+"'  onclick='DisplayData_Update(this)'>"+_dateVisit+"<span> &nbsp <img  src='assets/images/icon-edit.png' height='30' width='30'/> </span> </strong></td>"
                }
                if(_DisplayTreatmentData[tf_i].pressure_max == "" && _DisplayTreatmentData[tf_i].pressure_min == ""){

                    var txtDisplayTreatmentData = "<td align='center'><label class='col-md-12 text-center'></label></td>"

                }else{

                    var txtDisplayTreatmentData = "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].pressure_max+"/"+_DisplayTreatmentData[tf_i].pressure_min+"</label></td>"


                }

                //Data Treatment
                document.getElementById("bw_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].weight+"</label></td>"
                document.getElementById("bmi_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].bmi+"</label></td>"
                document.getElementById("wc_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].wc+"</label></td>"
                document.getElementById("bp_data").innerHTML += txtDisplayTreatmentData
                document.getElementById("hbp_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].home_bp+"</label></td>"
                document.getElementById("hr_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].pulse+"</label></td>" 
            
                //เงื่อนไขตรวจสอบ เพื่อแสดงการ Status Check ไปยัง Data table 
                var gdc_data_status  = _DisplayTreatmentData[tf_i].Good_diet_control == true ? "Checked" : "" ;
                var em_data_status  = _DisplayTreatmentData[tf_i].Exercise_minute == true ? "Checked" : "" ;
                var flu_data_status  = _DisplayTreatmentData[tf_i].FluVaccine == true ? "Checked" : "" ; 
                var pneu_data_status  = _DisplayTreatmentData[tf_i].PneumococcalVaccine == true ? "Checked" : "" ;

                document.getElementById("gdc_data").innerHTML += "<td align='center'><input class='largerCheckbox' type='checkbox' "+gdc_data_status+"></td>"  
                document.getElementById("em_data").innerHTML += "<td align='center'><input  class='largerCheckbox' type='checkbox' "+em_data_status+" ></td>"  
                document.getElementById("flu_data").innerHTML += "<td align='center'><input class='largerCheckbox' type='checkbox' "+flu_data_status+" ></td>"  
                document.getElementById("pneu_data").innerHTML += "<td align='center'><input class='largerCheckbox' type='checkbox' "+pneu_data_status+" ></td>"  

                document.getElementById("mf_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].Medication_frequency+"</label></td>"  
                document.getElementById("da_data").innerHTML += "<td ><textarea class='form-control col-md-12'  disabled>"+_DisplayTreatmentData[tf_i].Drug_allergy+"</textarea></td>"  
                document.getElementById("cm_data").innerHTML += "<td ><textarea class='form-control col-md-12' rows='15'  disabled>"+_DisplayTreatmentData[tf_i].Current_medicine+"</textarea></td>"    
                document.getElementById("tm_data").innerHTML += "<td ><textarea class='form-control col-md-12'  disabled>"+_DisplayTreatmentData[tf_i].Treatment+"</textarea></td>"
               // document.getElementById("nextp_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].Next_plan+"</label></td>"
               // document.getElementById("nextf_data").innerHTML += "<td align='center'><label class='col-md-12 text-center'>"+_DisplayTreatmentData[tf_i].Next_f_u+"</label></td>"
   
        }
    }
}

//Clear TF Datatable สำหรับโหลดข้อมูล Treatment & Follow up ใหม่
function clear_TFdatatable(){ 

    //Clear Data Vaccine in Modal
    document.getElementById("vaccineDetail").innerHTML = ""

    //Clear Header
    document.getElementById("column_header2").innerHTML ="" 
    document.getElementById("column_visitdate2").innerHTML = "" 

    //Clear Data Row_Header Treatment 
    for (var Row_i = 0 ; Row_i < Row_TFHeader_id.length ; Row_i++){

        document.getElementById(Row_TFHeader_id[Row_i]).innerHTML = ""
        
    }

    document.getElementById("column_header2").innerHTML +="<td width='20%' rowspan='2' align='center' ><strong>Tratment & follow up</strong></td>" 
        
    document.getElementById("column_header2").innerHTML +="<td colspan='"+Patient_LabResult.length+"' align='center' ><strong>Visit Date</strong></td>"

    //Display  Row_Header Treatment
    for (var Row_i = 0 ; Row_i < Row_TFHeader_id.length ; Row_i++){

        if (Row_TFHeader_id[Row_i] ==  "flu_data" || Row_TFHeader_id[Row_i] ==  "pneu_data"){

            document.getElementById(Row_TFHeader_id[Row_i]).innerHTML = "<td><label class='col-md-12 text-left'>"+Row_TFHeader[Row_i]+"<span id='imgVaccineStatus'> </span>   </label></td>"

        }else{

            document.getElementById(Row_TFHeader_id[Row_i]).innerHTML = "<td><label class='col-md-12 text-left'>"+Row_TFHeader[Row_i]+"</label></td>"

        }
    }

    if (checkStatusAge == true){


    } else if (checkStatusVaccine == true){ 

        for (var StoragegetVaccine_i = StoragegetVaccine.length-1 ; StoragegetVaccine_i >= 0 ; StoragegetVaccine_i--){

            let current_datetime = new Date(StoragegetVaccine[StoragegetVaccine_i].vaccine_date)
            let _dateVaccine = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()

            //Modal Vaccine
            document.getElementById("vaccineDetail").innerHTML += "<Strong>Vaccine Name :  </Strong>"+StoragegetVaccine[StoragegetVaccine_i].Vaccine_Name+"<br><Strong>Date : </Strong>"+_dateVaccine+"<br><br> ";
        
        }
        document.getElementById("imgVaccineStatus").innerHTML = "<img  data-toggle='modal' data-target='#VaccineModal' src='assets/images/medicine.png' height='40' width='40'/>";
    }

    // document.getElementById("loading-tab2").innerHTML =  "<div class='modal-dialog modal-dialog-centered justify-content-center' role='document'> <span class='fa fa-spinner fa-spin fa-3x'></span>"

}


//----------------------------------------------------------------- Function Onclick Arrow Icon  ของ Blood test -----------------------------------------------------------------

//onclick icon arrow right
function last_dateBTData(){

    clear_BTdatatable();

    var number= 0

    number = 1;

    last_visitBTData(number)
}

function next_dateBTData(){

    clear_BTdatatable();

    var number= 0

    number = 1;

    next_visitBTData(number)

}


function last_visitBTData(number){

var lastBTdate = 0;

var checknumlogdate = sessionStorage.numBTlogdate

if(checknumlogdate != null){

     lastBTdate = parseInt(sessionStorage.numBTlogdate)+ number;

}else{

     lastBTdate = 0 + number;
}



    sessionStorage.setItem("numBTlogdate",lastBTdate)

    var setBTlatestDate = new Date(sessionStorage.setBTlatestDate) //วันที่ที่บันทึกข้อมูลล่าสุด


    var setBTlastestDisplay =  new Date(sessionStorage.setBTlatestDate); //วันที่ล่าสุดที่ทำการคลิก arrow right icon

    setBTlastestDisplay.setDate(setBTlastestDisplay.getDate() - parseInt(sessionStorage.numBTlogdate));



    if(setBTlastestDisplay.getTime()  <  setBTlatestDate.getTime()){ 

        document.getElementById("arrowiconBT_left").innerHTML = "<span class='fa fa-angle-left' onclick='next_dateBTData()' style='position:absolute; top: 10px; left: 20px;  font-size: 30px;'></span>"
        
    }

    if(_DisplayBloodtestData.length > 0){ 

        for (var btDisplay_i = lastBTdate ; btDisplay_i < (lastBTdate+countShowBTData)  ; btDisplay_i++){

            if(_DisplayBloodtestData[btDisplay_i].visit_date == sessionStorage.setBTfirstDate){

                document.getElementById("arrowiconBT_right").innerHTML = "";
            }

                let current_datetime = new Date(_DisplayBloodtestData[btDisplay_i].visit_date)
                let _dateVisit = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
                if(_DisplayBloodtestData[btDisplay_i].ep.startsWith("O"))//opd
                {
                    document.getElementById("column_visitdate1").innerHTML += "<td  align='center'><img  src='assets/images/OPD.png' height='30' width='30'/><strong  class='col-sm-12' data-toggle='modal' data-target='#myModalUpdateData' title='tab1'  id='" + _DisplayBloodtestData[btDisplay_i].ep + "'  onclick='DisplayData_Update(this)'>" +_dateVisit+ " <span> &nbsp <img  src='assets/images/icon-edit.png' height='30' width='30'/> </span></strong></td>"
                }
                else//ipd
                {
                    document.getElementById("column_visitdate1").innerHTML += "<td  align='center'><img  src='assets/images/IPD.png' height='30' width='30'/><strong  class='col-sm-12' data-toggle='modal' data-target='#myModalUpdateData' title='tab1'  id='" + _DisplayBloodtestData[btDisplay_i].ep + "'  onclick='DisplayData_Update(this)'>" +_dateVisit+ " <span> &nbsp <img  src='assets/images/icon-edit.png' height='30' width='30'/> </span></strong></td>"
                }
                for (var OutBT_list_i = 0; OutBT_list_i < DataBT_list.length; OutBT_list_i++) {

                    var _DataBTName = DataBT_list[OutBT_list_i]

                        if (Row_BTHeader_id[OutBT_list_i] == "Creatinine_GFR_data"){

                            document.getElementById(Row_BTHeader_id[OutBT_list_i]).innerHTML += "<td ><textarea class='form-control col-md-12' rows='6' disabled>"+_DisplayBloodtestData[btDisplay_i][_DataBTName]+"</textarea></td>"  

                        }else{

                            
                            document.getElementById(Row_BTHeader_id[OutBT_list_i]).innerHTML += "<td align='center'><label class='col-md-12 text-center'>" + _DisplayBloodtestData[btDisplay_i][_DataBTName] + "</label></td>"

                        }
                }
        }
    }
}


function next_visitBTData(number){

var lastBTdate = 0;

var checknumlogdate = sessionStorage.numBTlogdate

if(checknumlogdate != null){

    lastBTdate = parseInt(sessionStorage.numBTlogdate) - number;

}else{

    lastBTdate = 0 - number;
}

    sessionStorage.setItem("numBTlogdate",lastBTdate)

    var setBTlatestDate = new Date(sessionStorage.setBTlatestDate) //วันที่ล่าสุดที่บันทึกข้อมูล

    var setBTlastestDisplay =  new Date(sessionStorage.setBTlatestDate); //วันที่ล่าสุดสุดที่ทำการคลิกแล้วแสดง (ซ้าย-ขวา)

    setBTlastestDisplay.setDate(setBTlastestDisplay.getDate() - parseInt(sessionStorage.numBTlogdate));


    var setBTfirstDate = new Date(sessionStorage.setBTfirstDate) //วันที่ล่าสุด(ซ้ายสุด)ที่มีข้อมูล (ซ้าย-ขวา)


    if(setBTlatestDate.getTime() == setBTlastestDisplay.getTime()){ //ซ้อน arrow left นที่บันทึกข้อมูลล่าสุด เท่ากับ วันที่ด้านซ้ายที่แสดงล่าสุด 

        document.getElementById("arrowiconBT_left").innerHTML = ""
        
    }

    if (setBTlatestDate.getTime() > setBTfirstDate.getTime()) { //แสดง arrow right เมื่อ วันที่บันทึกข้อมูลล่าสุดมากกว่า วันที่ที่บันทึกน้อยที่สุด 

        document.getElementById("arrowiconBT_right").innerHTML = "<span class='fa fa-angle-right' onclick='last_dateBTData()' style='position:absolute; top: 10px; right: 20px; font-size: 30px;'></span>"

    }

    //แสดงข้อมูล Bloodtest
    if(_DisplayBloodtestData.length > 0){ 

        for (var btDisplay_i = lastBTdate ; btDisplay_i < (lastBTdate+countShowBTData)  ; btDisplay_i++){

            let current_datetime = new Date(_DisplayBloodtestData[btDisplay_i].visit_date)
            let _dateVisit = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()

        
            if(_DisplayBloodtestData[btDisplay_i].ep.startsWith("O"))//opd
            {
                document.getElementById("column_visitdate1").innerHTML += "<td  align='center'><img  src='assets/images/OPD.png' height='30' width='30'/><strong  class='col-sm-12' data-toggle='modal' data-target='#myModalUpdateData' title='tab1'  id='" + _DisplayBloodtestData[btDisplay_i].ep + "'  onclick='DisplayData_Update(this)'>" +_dateVisit+ " <span> &nbsp <img  src='assets/images/icon-edit.png' height='30' width='30'/> </span></strong></td>"
            }
            else//ipd
            {
                document.getElementById("column_visitdate1").innerHTML += "<td  align='center'><img  src='assets/images/IPD.png' height='30' width='30'/><strong  class='col-sm-12' data-toggle='modal' data-target='#myModalUpdateData' title='tab1'  id='" + _DisplayBloodtestData[btDisplay_i].ep + "'  onclick='DisplayData_Update(this)'>" +_dateVisit+ " <span> &nbsp <img  src='assets/images/icon-edit.png' height='30' width='30'/> </span></strong></td>"
            }

            for (var OutBT_list_i = 0; OutBT_list_i < DataBT_list.length; OutBT_list_i++) {

                var _DataBTName = DataBT_list[OutBT_list_i]

                    if (Row_BTHeader_id[OutBT_list_i] == "Creatinine_GFR_data"){

                        document.getElementById(Row_BTHeader_id[OutBT_list_i]).innerHTML += "<td ><textarea class='form-control col-md-12' rows='6' disabled>"+_DisplayBloodtestData[btDisplay_i][_DataBTName]+"</textarea></td>"  
                    }else{
                        
                        document.getElementById(Row_BTHeader_id[OutBT_list_i]).innerHTML += "<td align='center'><label class='col-md-12 text-center'>" + _DisplayBloodtestData[btDisplay_i][_DataBTName] + "</label></td>"

                    }
            }
        }
    }
}


//Clear BT Datatable สำหรับโหลดข้อมูล Blood Test ใหม่
function clear_BTdatatable(){ 

    document.getElementById("column_header1").innerHTML ="" 
    document.getElementById("column_visitdate1").innerHTML = "" 

    //Clear Data Row_Header Treatment 
    for (var Row_i = 0 ; Row_i < Row_BTHeader_id.length ; Row_i++){

        document.getElementById(Row_BTHeader_id[Row_i]).innerHTML = ""
        
    }

    for (var Row_i = 0 ; Row_i < Row_BTHeader_id.length ; Row_i++){

        document.getElementById(Row_BTHeader_id[Row_i]).innerHTML = "<td><label class='col-md-12 text-left'>"+Row_BTHeader[Row_i]+"</label></td>"
       
    }

    document.getElementById("column_header1").innerHTML +="<td width='20%' rowspan='2' align='center' ><strong>Blood test</strong></td>"  
    document.getElementById("column_header1").innerHTML +="<td colspan='"+DisplayLabResultData.length+"' align='center' ><strong>Visit Date</strong></td>"

}


//------------------------------------------------------------------------------ Add Medicine  in Textarea -------------------------------------------------------------------------------

//ADD Medicine
function addCurrent_Medicine(){    
    ck_Select = document.getElementById('cmTest').innerHTML

    //แสดง Tag Select ในหน้า Update
    if(ck_Select == "" ){

        document.getElementById('cmTest').innerHTML +="<div class='row'><div class='col-9'>  <input type='hidden' class='form-control' id='Current_MedicineModalID'><select class='form-control' id='selectsetEn' value='' ></select></div><div class='col-3'><i class='mdi mdi-plus-circle-outline font-24' onclick='txtCurrent_Medicine(selectsetEn.value)'></i></div></div>"
   
        var selectsetEn = document.getElementById("selectsetEn");
        var option = document.createElement("option");
    
                for (var i = 0; i < Data.length; i++) {
                    
                        var option = document.createElement("option");
                        option.id = Data[i].tid;
                        option.text = Data[i].tname;
                        selectsetEn.add(option, selectsetEn[i]);
                }

    }else{

        document.getElementById('cmTest').innerHTML = "";

    }

}

//Input data textarea
function txtCurrent_Medicine(selectData){

    txtTest = selectData+' '

    document.getElementById("editTF_Current_medicine").value += txtTest;
    document.getElementById("editTF_Current_medicine").rows = "15"

}