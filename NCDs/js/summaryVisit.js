//ปีที่จะให้เริ่มแสดงข้อมูล
const First_Year = 2016; 
//ปีปัจจุบัน
var Today=  new Date();
var str_next = null;
var str_last = null;
var str_arrowright = null; // เมื่อคลิก Click arrow right icon 
var str_first_success = false; //สถานะเมื่อมีการคลิก Arrrow Right ย้อนไปปีก่อนหน้า
var json_Lab_DataResult = []; //ข้อมูล Summary Lab_DataResult
var json_Xray_DataResult = []; //ข้อมูล Summary Xray_DataResult
var json_FluVaccine = []; //ข้อมูล Summary Lab_FluVaccine
//ข้อมูลทดสอบ PneuVaccine
var json_PneuVaccine = [];
/*[{
                        base_vaccine_type_id: "001",
                        Vaccine_Type: "วัคซีนไข้หวัดใหญ่",
                        Vaccine_Name: "TEST",
                        doctor_eid: "พ.ญ.โสภิดา รัตนพฤกษ์",
                        birthdate: "1931-04-20",
                        vaccine_date: "2018-10-17",
                        age: "87 Y 6 M 22 D ",
                        type: "Main"
                        },
                        {
                        base_vaccine_type_id: "001",
                        Vaccine_Type: "วัคซีนไข้หวัดใหญ่",
                        Vaccine_Name: "TEST2",
                        doctor_eid: null,
                        birthdate: "1931-04-20",
                        vaccine_date: "2019-09-18",
                        age: "88 Y 5 M 23 D ",
                        type: "Main"
                        }] */
var json_Appointment = [];// ข้อมูล Summary Appointment
var Data_Age = null; //อายุปัจจุบันของคนไข้
var _count_ShowData = 0;
// getDataPatient();
// getSumVisit(hncode)
function getDataPatient(){
    $.ajax({
        type: "GET",
        url: "http://172.18.62.245/ImedWebApi/api/Visit?hncode="+sessionStorage.hncode,
        dataType: 'jsonp',
        success: function (response) {
            var json_DataPatient = JSON.parse(response);
            Data_Age = parseInt(json_DataPatient[0].patient_age);
        },
        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
            console.log(" failed, error is '" + thrownError + "'");
        }
    });
}

function getSumVisit(hncode){
    toastr.warning(' Name : '+sessionStorage.patient_name+' <br> Hn : '+sessionStorage.hncode+'','ระบบกำลังดึงข้อมูลสรุปประจำปี');
    sessionStorage.removeItem("Number")
    sessionStorage.removeItem("last_Year")
    sessionStorage.removeItem("stamp_Year")
    $.ajax({
        type: "GET",
        url: "https://localhost:44306/api/LabResult?hncode="+hncode+"&ht_siteid="+sessionStorage.userSITE, //ข้อมูล Lab result ของคนไข้ตาม hncode
        dataType: 'json',
        success: function (response) {
            //เงื่อนไขสำหรับกรณีที่ผล Lab_Result ไม่มีการบันทึกข้อมูลคนไข้ 
            if (response == null || response == ""){
                $('#sumLoadModal').modal('show');
                //ดึงข้อมูล PneuVaccine จาก Imed Api 
                // $.ajax({
                //     type: "GET",
                //     url: "http://172.18.62.245/ImedWebApi/api/PneumococcalVaccine?hncode="+hncode, //ข้อมูล PneumococcalVaccine ของคนไข้ตาม hncode
                //     dataType: 'jsonp',
                //     success: function (response) {

                //         if (response != ""){

                //             json_PneuVaccine = JSON.parse(response);

                //         }else{

                //             json_PneuVaccine = [];

                //         }
                //     }      
                // }); 

                // $.ajax({
                //     type: "GET",
                //     url: "http://172.18.62.245/ImedWebApi/api/FluVaccine?hncode="+hncode, //ข้อมูล Flu ของคนไข้ตาม hncode
                //     dataType: 'jsonp',
                //     success: function (response) {
                //         if (response != ""){
                //             json_FluVaccine = JSON.parse(response);
                //         }else{
                //             json_FluVaccine = [];
                //         }
                        //ดึงข้อมูล Appointment จาก Imed Api 
                        // $.ajax({
                        //     type: "GET",
                        //     url: "http://172.18.62.245/ImedWebApi/api/Appointment?hncode="+hncode+"&year=all&department_id=3006",
                        //     dataType: 'jsonp',
                        //     success: function (response) {
                        //         if (response != ""){
                        //             json_Appointment = JSON.parse(response);
                        //         }else{
                        //             json_Appointment = []
                        //         }
                                
                                var countAppointment_true = 0
                                //ตัวแปรที่ข้อมูลมีการคำนวณ
                                var _resultAppointment = 0;
                                //ตัวแปรนับจำนวนผลลัพธ์
                                var _count_FluVaccine = 0;
                                var _count_PneuVaccine = 0;
                                var _count_Appointment = 0;

                                var Current_Year = Today.getUTCFullYear();
                                sessionStorage.setItem("last_Year",Current_Year)
                                var _current_year = 0;
                                //เงื่อนไขกำหนดปีที่แสดงข้อมูล  
                                if(Current_Year >= First_Year+3){ 
                                    _current_year = Current_Year-3
                                }else if(Current_Year > First_Year && Current_Year <= First_Year+3){
                                    _current_year = (Current_Year-(Current_Year - First_Year));
                                }else{
                                     _current_year = Current_Year
                                }
                                //ข้อมูลสี Header พื้นหลังหัวข้อ
                                if (Data_Age < 65) {
                                    document.getElementById("Pneumococcal-status").setAttribute("bgcolor", "#F5F5F5")
                                }

                                for (var column_year = Current_Year; column_year >= _current_year; column_year--) {  // Column แสดงข้อมูลตามปีที่กำหนด
                                    //ตัวแปรจำนวนที่มาตามนัด
                                    countAppointment_true = 0
                                    _count_FluVaccine = 0;
                                    _count_PneuVaccine = 0;
                                    _count_Appointment = 0;
                                    //Influenza (Flu) Vaccine
                                    for (var json_FluVaccine_i = 0; json_FluVaccine_i < json_FluVaccine.length; json_FluVaccine_i++) {

                                        var fluvaccine_date = new Date(json_FluVaccine[json_FluVaccine_i].vaccine_date)

                                        var create_FluVaccineDate_Date = fluvaccine_date.getUTCFullYear(); //วันที่ข้อมูลตามในแต่ละตำแหน่ง Array

                                        if (create_FluVaccineDate_Date == column_year) {

                                            _count_FluVaccine = 1 + _count_FluVaccine

                                        }
                                    }
                                    //Pneumococcal Vaccine
                                    for (var json_PneuVaccine_i = 0; json_PneuVaccine_i < json_PneuVaccine.length; json_PneuVaccine_i++) {

                                        var pneuvaccine_date = new Date(json_PneuVaccine[json_PneuVaccine_i].vaccine_date)

                                        var create_PneuVaccineDate_Date = pneuvaccine_date.getUTCFullYear(); //วันที่ข้อมูลตามในแต่ละตำแหน่ง Array

                                        if (create_PneuVaccineDate_Date == column_year) {

                                            _count_PneuVaccine = 1 + _count_PneuVaccine

                                        }
                                    }       
                                    //ตรวจตามนัดสม่ำเสมอ(ช้าได้ภายใน 1 เดือนหลังนัด)
                                    for (var json_Appointment_i = 0; json_Appointment_i < json_Appointment.length; json_Appointment_i++) {

                                        var appointment_date = new Date(json_Appointment[json_Appointment_i].visit_date);

                                        var create_Appointment_Date = appointment_da();

                                        if (create_Appointment_Date == column_year) {

                                            _count_Appointment = 1 + _count_Appointment;

                                            if (parseInt(json_Appointment[json_Appointment_i].cal_day) >= 0 && parseInt(json_Appointment[json_Appointment_i].cal_day) <= 30) {

                                                countAppointment_true = 1 + countAppointment_true;

                                            }
                                        }
                                    }
                                    //เงื่อนไขสำหรับแสดงปุ่ม Arrow ด้านขวา สำหรับดูข้อมูลย้อนหลัง 
                                    if (First_Year < (First_Year + 4) && (Today.getUTCFullYear() - First_Year) >= 4) { // 2563 < 2567 && 2560 > 2563
                                        document.getElementById("arrowicon_right").innerHTML = "<span class='fa fa-angle-right' onclick='last_yearData()' style='position:absolute; top: 10px; right: 20px; font-size: 30px;'></span>"
                                    }
                                    document.getElementById("column_yearHeader").innerHTML += "<th width='20%' style='text-align:center'><strong>" + column_year + "</strong><p><br></p></th>"
                                    //ถ้า json_FluVaccine มีข้อมูล ทำงานในเงื่อนไขนี้
                                    if (json_FluVaccine.length > 0) {
                                        //Show Data table
                                        if (_count_FluVaccine > 0) {
                                            // column_yearHeader
                                            /*
                                            document.getElementById("sumBPn_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"
                                            document.getElementById("sumBPh_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"

                                            document.getElementById("NutritionistRecommand_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("ExerciseRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("AlcoholRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("SmokingRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("SleepRate_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";

                                            document.getElementById("Medication_frequency_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"

                                            document.getElementById("diabetesFBS_HbA1C_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("lipidprofile_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("kidneyCr_GFR_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("kidneyProteinuria_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("ABI_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"*/

                                            document.getElementById("FluVaccine_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getFluVaccine_year(this.id)' src='assets/images/icon-injector.png' height='30' width='30'/></td>"
                                            /*
                                            if (Data_Age < 65) {
                                                document.getElementById("PneumococcalVaccine_data").innerHTML += "<td bgcolor='#F5F5F5' width='20%' align='center'><label ></label></td>"
                                            } else {
                                                if (_count_PneuVaccine <= 0) {
                                                    document.getElementById("PneumococcalVaccine_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"
                                                } else {
                                                    document.getElementById("PneumococcalVaccine_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getPneuVaccine_year(this.id)' src='assets/images/icon-injector.png' height='30' width='30'/></td>"
                                                }
                                            }

                                            if (_count_Appointment <= 0) {
                                                document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            } else {
                                                _resultAppointment = (((countAppointment_true / _count_Appointment) * 100).toFixed(2)) + " %" == "NaN %" ? "N/A" : (((countAppointment_true / _count_Appointment) * 100).toFixed(2)) + " %"
                                                document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label id='" + column_year + "' onclick='getAppointment_year(this.id)'>" + _resultAppointment + "</label></td>"
                                            }*/
                                        } else {
                                            //document.getElementById("column_yearHeader").innerHTML += "<th width='20%' style='text-align:center'><strong>" + column_year + "</strong><p><br></p></th>"
                                            /*document.getElementById("sumBPn_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"
                                            document.getElementById("sumBPh_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("NutritionistRecommand_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("ExerciseRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("AlcoholRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("SmokingRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("SleepRate_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("Medication_frequency_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"
                                            document.getElementById("diabetesFBS_HbA1C_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("lipidprofile_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("kidneyCr_GFR_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("kidneyProteinuria_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("ABI_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"*/
                                            document.getElementById("FluVaccine_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"

                                            /*if (Data_Age < 65) {
                                                document.getElementById("PneumococcalVaccine_data").innerHTML += "<td bgcolor='#F5F5F5' width='20%' align='center'><label ></label></td>"
                                            } else {
                                                if (_count_PneuVaccine <= 0) {
                                                    document.getElementById("PneumococcalVaccine_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"
                                                } else {
                                                    document.getElementById("PneumococcalVaccine_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getPneuVaccine_year(this.id)' src='assets/images/icon-injector.png' height='30' width='30'/></td>"
                                                }
                                            }
                                            //Show Appointment
                                            if (_count_Appointment <= 0) {
                                                document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            } else {
                                                _resultAppointment = (((countAppointment_true / _count_Appointment) * 100).toFixed(2)) + " %" == "NaN %" ? "N/A" : (((countAppointment_true / _count_Appointment) * 100).toFixed(2)) + " %"
                                                document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label id='" + column_year + "' onclick='getAppointment_year(this.id)'>" + _resultAppointment + "</label></td>"
                                            }*/
                                        }
                                    }
                                    else
                                    {
                                        document.getElementById("FluVaccine_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"
                                    }
                                    //ถ้า json_PneuVaccine มีข้อมูล ทำงานในเงื่อนไขนี้
                                    if (json_PneuVaccine.length > 0) {
                                        if (_count_PneuVaccine > 0) {
                                            // column_yearHeader
                                            /*document.getElementById("column_yearHeader").innerHTML += "<th width='20%' style='text-align:center'><strong>" + column_year + "</strong><p><br></p></th>"

                                            document.getElementById("sumBPn_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"
                                            document.getElementById("sumBPh_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"

                                            document.getElementById("NutritionistRecommand_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("ExerciseRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("AlcoholRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("SmokingRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("SleepRate_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";

                                            document.getElementById("Medication_frequency_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"

                                            document.getElementById("diabetesFBS_HbA1C_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("lipidprofile_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("kidneyCr_GFR_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("kidneyProteinuria_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("ABI_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"

                                            document.getElementById("FluVaccine_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"*/
                                            document.getElementById("PneumococcalVaccine_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getPneuVaccine_year(this.id)' src='assets/images/icon-injector.png' height='30' width='30'/></td>"
                                            if (_count_Appointment <= 0) {
                                                document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            } else {
                                                _resultAppointment = (((countAppointment_true / _count_Appointment) * 100).toFixed(2)) + " %" == "NaN %" ? "N/A" : (((countAppointment_true / _count_Appointment) * 100).toFixed(2)) + " %"
                                                document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label id='" + column_year + "' onclick='getAppointment_year(this.id)'>" + _resultAppointment + "</label></td>"
                                            }


                                        } else {

                                            /*document.getElementById("column_yearHeader").innerHTML += "<th width='20%' style='text-align:center'><strong>" + column_year + "</strong><p><br></p></th>"

                                            document.getElementById("sumBPn_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"
                                            document.getElementById("sumBPh_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"

                                            document.getElementById("NutritionistRecommand_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("ExerciseRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("AlcoholRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("SmokingRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("SleepRate_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";

                                            document.getElementById("Medication_frequency_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"

                                            document.getElementById("diabetesFBS_HbA1C_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("lipidprofile_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("kidneyCr_GFR_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("kidneyProteinuria_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("ABI_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"

                                            document.getElementById("FluVaccine_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"*/
                                            document.getElementById("PneumococcalVaccine_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"

                                            //Show Appointment
                                            /*if (_count_Appointment <= 0) {

                                                document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";

                                            } else {

                                                _resultAppointment = (((countAppointment_true / _count_Appointment) * 100).toFixed(2)) + " %" == "NaN %" ? "N/A" : (((countAppointment_true / _count_Appointment) * 100).toFixed(2)) + " %"

                                                document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label id='" + column_year + "' onclick='getAppointment_year(this.id)'>" + _resultAppointment + "</label></td>"

                                            }*/
                                        }
                                    }  
                                    else
                                    {
                                        document.getElementById("PneumococcalVaccine_data").innerHTML += "<td width='20%' align='center'>351<label ></label></td>"
                                    }      
                                    //ถ้า json_Appointment มีข้อมูล ทำงานในเงื่อนไขนี้
                                    if (json_Appointment.length > 0) {
                                        if (_count_Appointment > 0) {

                                            _resultAppointment = (((countAppointment_true / _count_Appointment) * 100).toFixed(2)) + " %" == "NaN %" ? "N/A" : (((countAppointment_true / _count_Appointment) * 100).toFixed(2)) + " %"
                                            /*
                                            // column_yearHeader
                                            document.getElementById("column_yearHeader").innerHTML += "<th width='20%' style='text-align:center'><strong>" + column_year + "</strong><p><br></p></th>"

                                            document.getElementById("sumBPn_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"
                                            document.getElementById("sumBPh_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"

                                            document.getElementById("NutritionistRecommand_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("ExerciseRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("AlcoholRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("SmokingRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("SleepRate_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";

                                            document.getElementById("Medication_frequency_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"

                                            document.getElementById("diabetesFBS_HbA1C_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("lipidprofile_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("kidneyCr_GFR_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("kidneyProteinuria_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("ABI_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("FluVaccine_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"
                                            document.getElementById("PneumococcalVaccine_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"*/
                                            document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label id='" + column_year + "' onclick='getAppointment_year(this.id)'>" + _resultAppointment + "</label></td>"
                                        } else {
                                            /*
                                            document.getElementById("column_yearHeader").innerHTML += "<th width='20%' style='text-align:center'><strong>" + column_year + "</strong><p><br></p></th>"

                                            document.getElementById("sumBPn_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"
                                            document.getElementById("sumBPh_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"

                                            document.getElementById("NutritionistRecommand_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("ExerciseRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("AlcoholRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("SmokingRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                            document.getElementById("SleepRate_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";

                                            document.getElementById("Medication_frequency_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"

                                            document.getElementById("diabetesFBS_HbA1C_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("lipidprofile_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("kidneyCr_GFR_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("kidneyProteinuria_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("ABI_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                            document.getElementById("FluVaccine_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"
                                            document.getElementById("PneumococcalVaccine_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"*/
                                            document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label id='" + column_year + "' onclick='getAppointment_year(this.id)'>N/A</label></td>"
                                        }
                                    }
                                    else
                                    {
                                        document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                    }
                                    /*else if(json_Xray_DataResult.length > 0)
                                            {

                                            }*/
                                    /*else {
                                        $('#sumLoadModal').modal('hide');
                                        document.getElementById("zero_config").innerHTML = "";
                                        document.getElementById("zero_config").innerHTML = "<h3 align='Center'>ไม่มีการบันทึกข้อมูล</h3>"
                                    }*/
                                }

                                $('#sumLoadModal').modal('hide');


                                // }, error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                                //             console.log("failed, error is '" + thrownError + "'");
                                //             alert("Recrive  data failed, error is '" + thrownError + "'");
                                //         }
                        // });
                    // }  
                // });
                
                //ดึงข้อมูล Xray_Result 
                 $.ajax({
                    type: "GET",
                    url: "https://localhost:44306/api/XrayResult?hncode="+hncode+"&ht_siteid="+sessionStorage.userSITE+"", //ข้อมูล Xray result ของคนไข้ตาม hncode
                    dataType: 'json',
                    success: function (response) {
                        if (response != ""){
                            json_Xray_DataResult = JSON.parse(response);
                        }else{
                            json_Xray_DataResult = [];
                        }

                        // $.ajax({
                        //     type: "GET",
                        //     url: "http://172.18.62.245/ImedWebApi/api/Appointment?hncode="+hncode+"&year=all&department_id=3006",
                        //     dataType: 'jsonp',
                        //     success: function (response) {

                                var countBP_nm = 0; //normal
                                var countBP_h = 0; //high
                                var Medication_frequency= 0;
                                var countAppointment_true = 0

                                //ตัวแปรที่ข้อมูมีการคำนวณ
                                var _resultBP_nm = 0;
                                var _resultBP_h = 0;
                                var _resultMedication_frequency = 0;
                                var _resultAppointment = 0;
                                
                                //ตัวแปรนับจำนวนผลลัพธ์
                                var _count_thisyear = 0;
                                var _count_FluVaccine = 0;
                                var _count_PneuVaccine = 0;
                                var _count_Appointment = 0;
                                var _count_xraythisyear = 0;

                                //ตัวแปรผลลัพธ์ Summary
                                var _resultEKG = null;
                                var _resultEcho = null;
                                var _resultCAC = null;
                                var _resultABI = null;
                                var _resultCAVI = null;

                                var _resultNutritionist = null;
                                var _resultAlcohol = null;
                                var _resultSmoking = null;
                                var _resultSleepRate = null;
                                var _resultExercise_minute = null;

                                var _Date_titleinput = "";
                                
                                var Current_Year = Today.getUTCFullYear();

                                sessionStorage.setItem("last_Year", Current_Year)
                                if (response != "") {
                                    json_Appointment = JSON.parse(response);
                                } else {
                                    json_Appointment = []
                                }

                                var _current_year = 0;
                                if (Current_Year >= First_Year + 3) {
                                    _current_year = Current_Year - 3
                                } else if (Current_Year > First_Year && Current_Year <= First_Year + 3) {
                                    _current_year = (Current_Year - (Current_Year - First_Year));
                                } else {
                                    _current_year = Current_Year
                                }

                                if (Data_Age < 65) {
                                    document.getElementById("Pneumococcal-status").setAttribute("bgcolor", "#F5F5F5")
                                }

                                //Column แสดงข้อมูลตามรอบปีที่กำหนด
                                for (var column_year = Current_Year; column_year >= _current_year; column_year--) {

                                    countBP_nm = 0; //BPnormal
                                    countBP_h = 0; //BPhigh
                                    countAppointment_true = 0

                                    _count_thisyear = 0;
                                    _count_FluVaccine = 0;
                                    _count_PneuVaccine = 0;
                                    _count_Appointment = 0;
                                    _count_xraythisyear = 0;
                                    Medication_frequency = 0;
                                    //ข้อมูล X-Ray 
                                    for (var i = 0; i < json_Xray_DataResult.length; i++) {
                                        //เงื่อนไขตรวจสอบจำนวนข้อมูล json_Xray_DataResult.length
                                        if (json_Xray_DataResult.length != 1) {

                                            if (create_Date_Data == column_year && parseInt(sessionStorage.stamp_Year) != create_Date_Data) { //แสดงเฉพาะข้อมูลล่าสุดของปีนั้นๆ (การดูแลและติดตาม , Cardiovascular evaluation)

                                                _resultEKG = json_Xray_DataResult[i].EKG;
                                                _resultEcho = json_Xray_DataResult[i].Echo;
                                                _resultCAC = json_Xray_DataResult[i].CACs;
                                                _resultABI = json_Xray_DataResult[i].ABI;
                                                _resultCAVI = json_Xray_DataResult[i].CAVI;

                                                sessionStorage.setItem("stamp_Year", create_Date_Data) //เก็บปีที่มีการแสดงข้อมูลแล้ว 
                                            }

                                        } else {

                                            _resultEKG = json_Xray_DataResult[0].EKG;
                                            _resultEcho = json_Xray_DataResult[0].Echo;
                                            _resultCAC = json_Xray_DataResult[0].CACs;
                                            _resultABI = json_Xray_DataResult[0].ABI;
                                            _resultCAVI = json_Xray_DataResult[0].CAVI;
                                        }
                                        //BP Control
                                        if (create_Date_Data == column_year) { //แสดงเฉพาะค่าล่าสุด เพราะใน List มีการจัดลำดับตาม ep ที่มาแล้ว 

                                            _count_xraythisyear = 1 + _count_xraythisyear  //จำนวนข้อมูลใน DB Out ที่มีปี Visit_date ตรงกับปีของ Column ทั้งหมด  

                                        }
                                    }

                                    //Influenza (Flu) Vaccine
                                    for (var json_FluVaccine_i = 0; json_FluVaccine_i < json_FluVaccine.length; json_FluVaccine_i++) {

                                        var vaccine_date = new Date(json_FluVaccine[json_FluVaccine_i].vaccine_date)

                                        var create_FluVaccineDate_Date = vaccine_date.getUTCFullYear(); //วันที่ข้อมูลตามในแต่ละตำแหน่ง list


                                        if (create_FluVaccineDate_Date == column_year) { //แสดงเฉพาะค่าล่าสุด เพราะใน List มีการจัดลำดับตาม ep ที่มาแล้ว 

                                            _count_FluVaccine = 1 + _count_FluVaccine

                                        }
                                    }

                                    //Pneumococcal Vaccine
                                    for (var json_PneuVaccine_i = 0; json_PneuVaccine_i < json_PneuVaccine.length; json_PneuVaccine_i++) {

                                        var pneuvaccine_date = new Date(json_PneuVaccine[json_PneuVaccine_i].vaccine_date)

                                        var create_PneuVaccineDate_Date = pneuvaccine_date.getUTCFullYear(); //วันที่ข้อมูลตามในแต่ละตำแหน่ง list


                                        if (create_PneuVaccineDate_Date == column_year) { //แสดงเฉพาะค่าล่าสุด เพราะใน List มีการจัดลำดับตาม ep ที่มาแล้ว 

                                            _count_PneuVaccine = 1 + _count_PneuVaccine

                                        }
                                    }

                                    //ตรวจตามนัดสม่ำเสมอ(ช้าได้ภายใน 1 เดือนหลังนัด)
                                    for (var json_Appointment_i = 0; json_Appointment_i < json_Appointment.length; json_Appointment_i++) {

                                        var appointment_date = new Date(json_Appointment[json_Appointment_i].visit_date);

                                        var create_Appointment_Date = appointment_date.getUTCFullYear();

                                        if (create_Appointment_Date == column_year) {

                                            _count_Appointment = 1 + _count_Appointment;

                                            if (parseInt(json_Appointment[json_Appointment_i].cal_day) >= 0 && parseInt(json_Appointment[json_Appointment_i].cal_day) <= 30) {

                                                countAppointment_true = 1 + countAppointment_true;

                                            }
                                        }
                                    }



                                    //Show FluVaccine
                                    if (_count_FluVaccine <= 0) {


                                        document.getElementById("FluVaccine_data").innerHTML += "<td width='20%' align='center'></td>"

                                    } else {

                                        document.getElementById("FluVaccine_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getFluVaccine_year(this.id)' src='assets/images/icon-injector.png' height='30' width='30'/></td>"

                                    }

                                    if (Data_Age < 65) {

                                        document.getElementById("PneumococcalVaccine_data").innerHTML += "<td bgcolor='#F5F5F5' width='20%' align='center'><label ></label></td>"

                                    } else {

                                        //Show PneuVaccine
                                        if (_count_PneuVaccine <= 0) {


                                            document.getElementById("PneumococcalVaccine_data").innerHTML += "<td width='20%' align='center'></td>"

                                        } else {

                                            document.getElementById("PneumococcalVaccine_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getPneuVaccine_year(this.id)' src='assets/images/icon-injector.png' height='30' width='30'/></td>"


                                        }

                                    }

                                    //Show Appointment
                                    if (_count_Appointment <= 0) {


                                        document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";

                                    } else {

                                        _resultAppointment = (((countAppointment_true / _count_Appointment) * 100).toFixed(2)) + " %" == "NaN %" ? "N/A" : (((countAppointment_true / _count_Appointment) * 100).toFixed(2)) + " %"

                                        document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label id='" + column_year + "' onclick='getAppointment_year(this.id)'>" + _resultAppointment + "</label></td>"

                                    }
                                    //Show Xray
                                    if (_count_xraythisyear <= 0) {
                                        document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'><label  >633</label></td>"
                                        document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                        document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                        document.getElementById("ABI_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                    } else {
                                        if (_countresultEKG > 0) {
                                            document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getEKG_year(this.id)' src='assets/images/x-ray.png' height='30' width='30'/>640</td>"
                                        }
                                        else {
                                            document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'></td>"
                                        }
                                        if (_countresultEcho > 0) {
                                            document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getEcho_year(this.id)' src='assets/images/x-ray.png' height='30' width='30'/></td>"
                                        }
                                        else {
                                            document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'></td>"
                                        }
                                        if (_countresultCAC > 0) {
                                            document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getCAC_year(this.id)' src='assets/images/x-ray.png' height='30' width='30'/></td>"
                                        }
                                        else {
                                            document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'></td>"
                                        }
                                        if ((_countresultABI > 0) ||(_countresultCAVI > 0) ){
                                            document.getElementById("ABI_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getABI_year(this.id)' src='assets/images/x-ray.png' height='30' width='30'/></td>"
                                        }
                                        else {
                                            document.getElementById("ABI_data").innerHTML += "<td width='20%' align='center'></td>"
                                        }
                                    }
                                }

                                $('#sumLoadModal').modal('hide');

                            // }, error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                            //             console.log("failed, error is '" + thrownError + "'");
                            //             alert("Recrive  data failed, error is '" + thrownError + "'");
                            //         }
                        // });
                    }
                });
            //เงื่อนไขสำหรับกรณีที่ผล Lab_Result มีการบันทึกข้อมูลคนไข้ 
            }else{ 
                // $('#sumLoadModal').modal('show');
                // json_Lab_DataResult =JSON.parse(response);
                // $.ajax({
                //     type: "GET",
                //     url: "http://172.18.62.245/ImedWebApi/api/FluVaccine?hncode="+hncode, //ข้อมูล Vaccine ของคนไข้ตาม hncode
                //     dataType: 'jsonp',
                //     success: function (response) {

                //         if (response != ""){

                //             json_FluVaccine = JSON.parse(response);

                //         }else{

                //             json_FluVaccine = [];

                //         }
                //     }      
                // });

               

                 //ดึงข้อมูล Xray_Result 
                 $.ajax({
                    type: "GET",
                    url: "https://localhost:44306/api/XrayResult?hncode="+hncode+"&ht_siteid="+sessionStorage.userSITE+"", //ข้อมูล Xray result ของคนไข้ตาม hncode
                    dataType: 'json',
                    success: function (response) {
                        if (response != ""){
                            json_Xray_DataResult = JSON.parse(response);
                        }else{
                            json_Xray_DataResult = [];
                        }

                        // $.ajax({
                        //     type: "GET",
                        //     url: "http://172.18.62.245/ImedWebApi/api/PneumococcalVaccine?hncode="+hncode, //ข้อมูล PneumococcalVaccine ของคนไข้ตาม hncode
                        //     dataType: 'jsonp',
                        //     success: function (response) {
                        //         if (response != ""){
                        //             json_PneuVaccine = JSON.parse(response);
                        //         }else{
                        //             json_PneuVaccine = [];
                        //         }

                                // $.ajax({
                                //     type: "GET",
                                //     url: "http://172.18.62.245/ImedWebApi/api/Appointment?hncode=" + hncode + "&year=all&department_id=3006",
                                //     dataType: 'jsonp',
                                //     success: function (response) {

                                        var countBP_nm = 0; //normal
                                        var countBP_h = 0; //high
                                        var Medication_frequency = 0;
                                        var countAppointment_true = 0

                                        //ตัวแปรที่ข้อมูมีการคำนวณ
                                        var _resultBP_nm = 0;
                                        var _resultBP_h = 0;
                                        var _resultMedication_frequency = 0;
                                        var _resultAppointment = 0;

                                        //ตัวแปรนับจำนวนผลลัพธ์
                                        var _count_thisyear = 0;
                                        var _count_FluVaccine = 0;
                                        var _count_PneuVaccine = 0;
                                        var _count_Appointment = 0;
                                        var _count_xraythisyear = 0;

                                        //ตัวแปรผลลัพธ์ Summary
                                        var _resultGlucose = null;
                                        var _resultHbA1C = null;
                                        var _resultCholesterol = null;
                                        var _resultCreatinine = null;
                                        var _resultCreatinine_GFR = null;
                                        var _resultUrineProtein = null;
                                        var _resultEKG = null;
                                        var _resultEcho = null;
                                        var _resultCAC = null;
                                        var _resultABI = null;
                                        var _resultCAVI = null;

                                        //count lab
                                        var _countresultGlucose = 0;
                                        var _countresultHbA1C = 0;
                                        var _countresultCholesterol = 0;
                                        var _countresultCreatinine = 0;
                                        var _countresultCreatinine_GFR = 0;
                                        var _countresultLDL = 0;
                                        var _countresultEKG = 0;
                                        var _countresultEcho = 0;
                                        var _countresultCAC = 0;
                                        var _countresultABI = 0;
                                        var _countresultCAVI = 0;
                                        var _countresultUrineProtein = 0;

                                        var _resultNutritionist = null;
                                        var _resultAlcohol = null;
                                        var _resultSmoking = null;
                                        var _resultSleepRate = null;
                                        var _resultExercise_minute = null;

                                        var _Date_titleinput = "";

                                        var Current_Year = Today.getUTCFullYear();

                                        sessionStorage.setItem("last_Year", Current_Year)


                                        if (response != "") {

                                            json_Appointment = JSON.parse(response);

                                        } else {

                                            json_Appointment = []
                                        }


                                        var _current_year = 0;

                                        if (Current_Year >= First_Year + 3) {

                                            _current_year = Current_Year - 3

                                        } else if (Current_Year > First_Year && Current_Year <= First_Year + 3) {

                                            _current_year = (Current_Year - (Current_Year - First_Year));

                                        } else {

                                            _current_year = Current_Year
                                        }

                                        if (Data_Age < 65) {

                                            document.getElementById("Pneumococcal-status").setAttribute("bgcolor", "#F5F5F5")
                                        }

                                        //Column แสดงข้อมูลตามรอบปีที่กำหนด
                                        for (var column_year = Current_Year; column_year >= _current_year; column_year--) {

                                            countBP_nm = 0; //BPnormal
                                            countBP_h = 0; //BPhigh
                                            countAppointment_true = 0

                                            _count_thisyear = 0;
                                            _count_FluVaccine = 0;
                                            _count_PneuVaccine = 0;
                                            _count_Appointment = 0;
                                            _count_xraythisyear = 0;
                                            Medication_frequency = 0;
                                            _countresultGlucose = 0;
                                            _countresultHbA1C = 0;
                                            _countresultCholesterol = 0;
                                            _countresultCreatinine = 0;
                                            _countresultCreatinine_GFR = 0;
                                            _countresultLDL = 0;
                                            _countresultEKG = 0;
                                            _countresultEcho = 0;
                                            _countresultCAC = 0;
                                            _countresultABI = 0;
                                            _countresultCAVI = 0;
                                            _countresultUrineProtein = 0;

                                            //การดูแลและติดตาม , Cardiovascular evaluation
                                            for (var i = 0; i < json_Lab_DataResult.length; i++) {

                                                var pressure_max = parseInt(json_Lab_DataResult[i].pressure_max)
                                                var pressure_min = parseInt(json_Lab_DataResult[i].pressure_min)

                                                var data_date = new Date(json_Lab_DataResult[i].visit_date)

                                                var create_Date_Data = data_date.getUTCFullYear(); //วันที่ข้อมูลตามในแต่ละตำแหน่งของ list
                                                if (create_Date_Data == column_year) {
                                                    if (json_Lab_DataResult[i].Glucose != "") {
                                                        _countresultGlucose = 1;
                                                    }

                                                    if (json_Lab_DataResult[i].HbA1C != "") {
                                                        _countresultHbA1C = 1;
                                                    }

                                                    if (json_Lab_DataResult[i].Cholesterol != "") {
                                                        _countresultCholesterol = 1;
                                                    }

                                                    if (json_Lab_DataResult[i].Creatinine != "") {
                                                        _countresultCreatinine = 1;
                                                    }

                                                    if (json_Lab_DataResult[i].Creatinine_GFR != "") {
                                                        _countresultCreatinine_GFR = 1;
                                                    }

                                                    if (json_Lab_DataResult[i].UrineProtein != "") {
                                                        _countresultUrineProtein = 1;
                                                    }

                                                    if (json_Lab_DataResult[i].LDL_Direct != "") {
                                                        _countresultLDL = 1;
                                                    }
                                                }

                                                //เงื่อนไขตรวจสอบจำนวนข้อมูล json_Lab_DataResult.length
                                                if (json_Lab_DataResult.length != 1) {
                                                    if (create_Date_Data == column_year && parseInt(sessionStorage.stamp_Year) != create_Date_Data) { //แสดงเฉพาะข้อมูลล่าสุดของปีนั้นๆ (การดูแลและติดตาม , Cardiovascular evaluation)

                                                        _resultGlucose = json_Lab_DataResult[i].Glucose;
                                                        _resultHbA1C = json_Lab_DataResult[i].HbA1C;
                                                        _resultCholesterol = json_Lab_DataResult[i].Cholesterol;
                                                        _resultCreatinine = json_Lab_DataResult[i].Creatinine;
                                                        _resultCreatinine_GFR = json_Lab_DataResult[i].Creatinine_GFR;
                                                        _resultUrineProtein = json_Lab_DataResult[i].UrineProtein;

                                                        _resultNutritionist = json_Lab_DataResult[i].Nutritionist == true ? "Checked" : "";
                                                        _resultAlcohol = json_Lab_DataResult[i].Alcohol == true ? "Checked" : "";
                                                        _resultSmoking = json_Lab_DataResult[i].Smoking == true ? "Checked" : "";
                                                        _resultSleepRate = json_Lab_DataResult[i].SleepRate == true ? "Checked" : "";
                                                        _resultExercise_minute = json_Lab_DataResult[i].Exercise_minute == true ? "Checked" : "";

                                                        let current_datetime = new Date(json_Lab_DataResult[i].visit_date)
                                                        _Date_titleinput = ("0" + (current_datetime.getDate())).slice(-2) + "-" + ("0" + (current_datetime.getMonth() + 1)).slice(-2) + "-" + current_datetime.getFullYear()

                                                        _count_ShowData = 1 + _count_ShowData

                                                        sessionStorage.setItem("stamp_Year", create_Date_Data) //เก็บปีที่มีการแสดงข้อมูลแล้ว 

                                                    }
                                                } else {

                                                    _resultGlucose = json_Lab_DataResult[0].Glucose;
                                                    _resultHbA1C = json_Lab_DataResult[0].HbA1C;
                                                    _resultCholesterol = json_Lab_DataResult[0].Cholesterol;
                                                    _resultCreatinine = json_Lab_DataResult[0].Creatinine;
                                                    _resultCreatinine_GFR = json_Lab_DataResult[0].Creatinine_GFR;
                                                    _resultUrineProtein = json_Lab_DataResult[0].UrineProtein;


                                                    _resultNutritionist = json_Lab_DataResult[0].Nutritionist == true ? "Checked" : "";
                                                    _resultAlcohol = json_Lab_DataResult[0].Alcohol == true ? "Checked" : "";
                                                    _resultSmoking = json_Lab_DataResult[0].Smoking == true ? "Checked" : "";
                                                    _resultSleepRate = json_Lab_DataResult[0].SleepRate == true ? "Checked" : "";
                                                    _resultExercise_minute = json_Lab_DataResult[0].Exercise_minute == true ? "Checked" : "";

                                                    let current_datetime = new Date(json_Lab_DataResult[0].visit_date)
                                                    _Date_titleinput = ("0" + (current_datetime.getDate())).slice(-2) + "-" + ("0" + (current_datetime.getMonth() + 1)).slice(-2) + "-" + current_datetime.getFullYear()


                                                }

                                                //BP Control
                                                if (create_Date_Data == column_year) { //แสดงเฉพาะค่าล่าสุด เพราะใน List มีการจัดลำดับตาม ep ที่มาแล้ว 

                                                    _count_thisyear = 1 + _count_thisyear  //จำนวนข้อมูลใน DB Out ที่มีปี Visit_date ตรงกับปีของ Column ทั้งหมด  

                                                    if (pressure_max <= 130 || pressure_min <= 80) {

                                                        countBP_nm = 1 + countBP_nm

                                                    }

                                                    if (pressure_max <= 140 || pressure_min <= 90) {

                                                        countBP_h = 1 + countBP_h

                                                    }

                                                    Medication_frequency = parseInt(json_Lab_DataResult[i].Medication_frequency) + Medication_frequency;
                                                }
                                            }
                                            _countresultEKG = 0;
                                            _countresultEcho = 0;
                                            _countresultCAC = 0;
                                            _countresultABI = 0;
                                            _countresultCAVI = 0;
                                            //ข้อมูล X-Ray 
                                            for (var i = 0; i < json_Xray_DataResult.length; i++) {
                                                //เงื่อนไขตรวจสอบจำนวนข้อมูล json_Xray_DataResult.length
                                                var data_date = new Date(json_Xray_DataResult[i].visit_date)

                                                var create_Date_Data = data_date.getUTCFullYear(); //วันที่ข้อมูลตามในแต่ละตำแหน่งของ list
                                                if (create_Date_Data == column_year) {
                                                    if (json_Xray_DataResult[i].EKG != "") {
                                                        _countresultEKG = 1;
                                                    }
                                                    if (json_Xray_DataResult[i].Echo != "") {
                                                        _countresultEcho = 1;
                                                    }
                                                    if (json_Xray_DataResult[i].CACs != "") {
                                                        _countresultCAC = 1;
                                                    }
                                                    if (json_Xray_DataResult[i].ABI != "") {
                                                        _countresultABI = 1;
                                                    }
                                                    if (json_Xray_DataResult[i].CAVI != "") {
                                                        _countresultCAVI = 1;
                                                    }
                                                }
                                                if (json_Xray_DataResult.length != 1) {

                                                    if (create_Date_Data == column_year && parseInt(sessionStorage.stamp_Year) != create_Date_Data) { //แสดงเฉพาะข้อมูลล่าสุดของปีนั้นๆ (การดูแลและติดตาม , Cardiovascular evaluation)

                                                        _resultEKG = json_Xray_DataResult[i].EKG;
                                                        _resultEcho = json_Xray_DataResult[i].Echo;
                                                        _resultCAC = json_Xray_DataResult[i].CACs;
                                                        _resultABI = json_Xray_DataResult[i].ABI;
                                                        _resultCAVI = json_Xray_DataResult[i].CAVI;
                                                        sessionStorage.setItem("stamp_Year", create_Date_Data) //เก็บปีที่มีการแสดงข้อมูลแล้ว 
                                                    }

                                                } else {

                                                    _resultEKG = json_Xray_DataResult[0].EKG;
                                                    _resultEcho = json_Xray_DataResult[0].Echo;
                                                    _resultCAC = json_Xray_DataResult[0].CACs;
                                                    _resultABI = json_Xray_DataResult[0].ABI;
                                                    _resultCAVI = json_Xray_DataResult[0].CAVI;
                                                }
                                                //BP Control
                                                if (create_Date_Data == column_year) {

                                                    _count_xraythisyear = 1 + _count_xraythisyear  //จำนวนข้อมูลใน DB Out ที่มีปี Visit_date ตรงกับปีของ Column ทั้งหมด  

                                                }
                                            }

                                            //Influenza (Flu) Vaccine
                                            for (var json_FluVaccine_i = 0; json_FluVaccine_i < json_FluVaccine.length; json_FluVaccine_i++) {

                                                var vaccine_date = new Date(json_FluVaccine[json_FluVaccine_i].vaccine_date)

                                                var create_FluVaccineDate_Date = vaccine_date.getUTCFullYear(); //วันที่ข้อมูลตามในแต่ละตำแหน่ง list


                                                if (create_FluVaccineDate_Date == column_year) { //แสดงเฉพาะค่าล่าสุด เพราะใน List มีการจัดลำดับตาม ep ที่มาแล้ว 

                                                    _count_FluVaccine = 1 + _count_FluVaccine

                                                }
                                            }

                                            //Pneumococcal Vaccine
                                            for (var json_PneuVaccine_i = 0; json_PneuVaccine_i < json_PneuVaccine.length; json_PneuVaccine_i++) {

                                                var pneuvaccine_date = new Date(json_PneuVaccine[json_PneuVaccine_i].vaccine_date)

                                                var create_PneuVaccineDate_Date = pneuvaccine_date.getUTCFullYear(); //วันที่ข้อมูลตามในแต่ละตำแหน่ง list


                                                if (create_PneuVaccineDate_Date == column_year) { //แสดงเฉพาะค่าล่าสุด เพราะใน List มีการจัดลำดับตาม ep ที่มาแล้ว 

                                                    _count_PneuVaccine = 1 + _count_PneuVaccine

                                                }
                                            }

                                            //ตรวจตามนัดสม่ำเสมอ(ช้าได้ภายใน 1 เดือนหลังนัด)
                                            for (var json_Appointment_i = 0; json_Appointment_i < json_Appointment.length; json_Appointment_i++) {

                                                var appointment_date = new Date(json_Appointment[json_Appointment_i].visit_date);

                                                var create_Appointment_Date = appointment_date.getUTCFullYear();

                                                if (create_Appointment_Date == column_year) {

                                                    _count_Appointment = 1 + _count_Appointment;

                                                    if (parseInt(json_Appointment[json_Appointment_i].cal_day) >= 0 && parseInt(json_Appointment[json_Appointment_i].cal_day) <= 30) {

                                                        countAppointment_true = 1 + countAppointment_true;

                                                    }
                                                }
                                            }

                                            //Show FluVaccine
                                            if (_count_FluVaccine <= 0) {
                                                document.getElementById("FluVaccine_data").innerHTML += "<td width='20%' align='center'></td>"

                                            } else {
                                                document.getElementById("FluVaccine_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getFluVaccine_year(this.id)' src='assets/images/icon-injector.png' height='30' width='30'/></td>"
                                            }

                                            if (Data_Age < 65) {

                                                document.getElementById("PneumococcalVaccine_data").innerHTML += "<td bgcolor='#F5F5F5' width='20%' align='center'><label ></label></td>"

                                            } else {

                                                //Show PneuVaccine
                                                if (_count_PneuVaccine <= 0) {


                                                    document.getElementById("PneumococcalVaccine_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"

                                                } else {

                                                    document.getElementById("PneumococcalVaccine_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getPneuVaccine_year(this.id)' src='assets/images/icon-injector.png' height='30' width='30'/></td>"
                                                }

                                            }

                                            //Show Appointment
                                            if (_count_Appointment <= 0) {


                                                document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";

                                            } else {

                                                _resultAppointment = (((countAppointment_true / _count_Appointment) * 100).toFixed(2)) + " %" == "NaN %" ? "N/A" : (((countAppointment_true / _count_Appointment) * 100).toFixed(2)) + " %"

                                                document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label id='" + column_year + "' onclick='getAppointment_year(this.id)'>" + _resultAppointment + "</label></td>"

                                            }


                                            //Show SumData
                                            if (_count_thisyear <= 0) {

                                                if (First_Year < (First_Year + 4) && (Today.getUTCFullYear() - First_Year) >= 4) { // 2563 < 2567 && 2560 > 2563

                                                    document.getElementById("arrowicon_right").innerHTML = "<span class='fa fa-angle-right' onclick='last_yearData()' style='position:absolute; top: 10px; right: 20px; font-size: 30px;'></span>"

                                                }
                                                _resultBP_nm = 0
                                                _resultBP_h = 0
                                                _resultMedication_frequency = 0

                                                // column_yearHeader
                                                document.getElementById("column_yearHeader").innerHTML += "<th width='20%' style='text-align:center'><strong>" + column_year + "</strong><p><br></p></th>"

                                                document.getElementById("sumBPn_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"
                                                document.getElementById("sumBPh_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"

                                                document.getElementById("NutritionistRecommand_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";
                                                document.getElementById("ExerciseRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                                document.getElementById("AlcoholRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                                document.getElementById("SmokingRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                                                document.getElementById("SleepRate_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";

                                                document.getElementById("Medication_frequency_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"

                                                document.getElementById("diabetesFBS_HbA1C_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                                document.getElementById("lipidprofile_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                                document.getElementById("kidneyCr_GFR_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                                document.getElementById("kidneyProteinuria_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"

                                            }
                                            else {
                                                //คำนวณหาเปอร์เซ็นจากข้อมูลทั้งหมด
                                                _resultBP_nm = ((countBP_nm / _count_thisyear) * 100).toFixed(2)
                                                _resultBP_h = ((countBP_h / _count_thisyear) * 100).toFixed(2)
                                                _resultMedication_frequency = (parseInt(Medication_frequency) / _count_thisyear).toFixed(2);


                                                //Check Data Value null     
                                                var resultGlucose = _resultGlucose == "" ? "N/A" : _resultGlucose;
                                                var resultHbA1C = _resultHbA1C == "" ? "N/A" : _resultHbA1C;
                                                var resultCholesterol = _resultCholesterol == "" ? "N/A" : _resultCholesterol;
                                                var resultCreatinine = _resultCreatinine == "" ? "N/A" : _resultCreatinine;
                                                var resultCreatinine_GFR = _resultCreatinine_GFR == "" ? "N/A" : _resultCreatinine_GFR;
                                                var resultUrineProtein = _resultUrineProtein == "" ? "N/A" : _resultUrineProtein;


                                                // column_yearHeader
                                                document.getElementById("column_yearHeader").innerHTML += "<th style='text-align:center'><strong>" + column_year + "</strong> <p> (" + _Date_titleinput + ") </p></th>"

                                                document.getElementById("sumBPn_data").innerHTML += "<td width='20%' align='center'><label id='" + column_year + "' onclick='getBPnm_year(this.id)'>" + _resultBP_nm + " %</label></td>"
                                                document.getElementById("sumBPh_data").innerHTML += "<td width='20%' align='center'><label id='" + column_year + "' onclick='getBPh_year(this.id)'>" + _resultBP_h + " %</label></td>"

                                                document.getElementById("NutritionistRecommand_data").innerHTML += "<td align='center'><input  class='largerCheckbox' type='checkbox' " + _resultNutritionist + " ></td>";
                                                document.getElementById("ExerciseRate_data").innerHTML += " <td align='center'><input  class='largerCheckbox' type='checkbox' " + _resultExercise_minute + " ></td>";
                                                document.getElementById("AlcoholRecommand_data").innerHTML += " <td align='center'><input  class='largerCheckbox' type='checkbox' " + _resultAlcohol + " ></td>";
                                                document.getElementById("SmokingRecommand_data").innerHTML += "<td align='center'><input  class='largerCheckbox' type='checkbox' " + _resultSmoking + " ></td>";
                                                document.getElementById("SleepRate_data").innerHTML += " <td align='center'><input  class='largerCheckbox' type='checkbox' " + _resultSleepRate + " ></td>";


                                                document.getElementById("Medication_frequency_data").innerHTML += "<td width='20%' align='center'><label id='" + column_year + "' onclick='getMF_year(this.id)'>" + _resultMedication_frequency + " %</label></td>"

                                                if (_countresultGlucose > 0 || _countresultHbA1C > 0) {
                                                    document.getElementById("diabetesFBS_HbA1C_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getFBS_year(this.id)' src='assets/images/lab.png' height='30' width='30'/></td>"
                                                }
                                                else {
                                                    document.getElementById("diabetesFBS_HbA1C_data").innerHTML += "<td width='20%' align='center'></td>"
                                                }

                                                if (_countresultCholesterol > 0 || _countresultLDL > 0) {
                                                    document.getElementById("lipidprofile_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getLipid_year(this.id)' src='assets/images/lab.png' height='30' width='30'/></td>"
                                                }
                                                else {
                                                    document.getElementById("lipidprofile_data").innerHTML += "<td width='20%' align='center'></td>"
                                                }

                                                if (_countresultCreatinine > 0 || _countresultCreatinine_GFR > 0) {
                                                    document.getElementById("kidneyCr_GFR_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getCr_year(this.id)' src='assets/images/lab.png' height='30' width='30'/></td>"
                                                }
                                                else {
                                                    document.getElementById("kidneyCr_GFR_data").innerHTML += "<td width='20%' align='center'></td>"
                                                }

                                                if (_countresultUrineProtein > 0) {
                                                    document.getElementById("kidneyProteinuria_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getProteinuria_year(this.id)' src='assets/images/lab.png' height='30' width='30'/></td>"
                                                }
                                                else {
                                                    document.getElementById("kidneyProteinuria_data").innerHTML += "<td width='20%' align='center'></td>"
                                                }
                                            }

                                            //Show Xray
                                            if (_count_xraythisyear <= 0) {

                                                document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                                document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                                document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                                                document.getElementById("ABI_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"

                                            } else {

                                                var resultEKG = _resultEKG == null ? "N/A" : _resultEKG;
                                                var resultEcho = _resultEcho == null ? "N/A" : _resultEcho;
                                                var resultCAC = _resultCAC == null ? "N/A" : _resultCAC;
                                                var resultABI = _resultABI == null ? "N/A" : _resultABI;
                                                var resultCAVI = _resultCAVI == null ? "N/A" : _resultCAVI;
                                                if (_countresultEKG > 0) {
                                                    document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getEKG_year(this.id)' src='assets/images/x-ray.png' height='30' width='30'/></td>"
                                                }
                                                else {
                                                    document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'></td>"
                                                }
                                                if (_countresultEcho > 0) {
                                                    document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getEcho_year(this.id)' src='assets/images/x-ray.png' height='30' width='30'/></td>"
                                                }
                                                else {
                                                    document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'></td>"
                                                }
                                                if (_countresultCAC > 0) {
                                                    document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getCAC_year(this.id)' src='assets/images/x-ray.png' height='30' width='30'/></td>"
                                                }
                                                else {
                                                    document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'></td>"
                                                }
                                                if ((_countresultABI > 0) ||(_countresultCAVI > 0)){
                                                    document.getElementById("ABI_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getABI_year(this.id)' src='assets/images/x-ray.png' height='30' width='30'/></td>"
                                                }
                                                else {
                                                    document.getElementById("ABI_data").innerHTML += "<td width='20%' align='center'></td>"
                                                }
                                            }
                                        }

                                        $('#sumLoadModal').modal('hide');

                                    // }, error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                                    //     console.log("failed, error is '" + thrownError + "'");
                                    //     alert("Recrive  data failed, error is '" + thrownError + "'");
                                    // }
                                // });
                            // }
                        // }); 
                        
                    }
                });
            }    
        }
    }); 
}

//ฟังก์ชันเมื่อกดปุ่ม arrow right 
function last_yearData(){
    str_next = false;
    str_last = true;
    clear_datatable();
    var number= 0
    number = 1;
    str_arrowright = true
    reloadSumVisit(number)
}
//ฟังก์ชันเมื่อกดปุ่ม arrow left  
function next_yearData(){
    str_next = true;
    str_last = false;
    clear_datatable();
    var number= 0
    number = 1;
    str_arrowright = true
    reloadSumVisit(number)
}
//รีเซ็ทข้อมูลใน Table
function clear_datatable(){
    document.getElementById("column_yearHeader").innerHTML = "";
    document.getElementById("sumBPn_data").innerHTML = "<td><label class='col-md-12 text-left'>BP <= 130/80 mmHg (%) </label></td>";
    document.getElementById("sumBPh_data").innerHTML = "<td><label class='col-md-12 text-left'>BP <= 140/90 mmHg (%) </label></td>";
    document.getElementById("NutritionistRecommand_data").innerHTML = " <td><label class='col-md-12 text-left'>ประเมินการคุมอาหารโดยนักโภชนาการ</label></td>";
    document.getElementById("ExerciseRate_data").innerHTML = "<td><label class='col-md-12 text-left'>Exercise > 30 min (3 days/wk)</label></td>";
    document.getElementById("AlcoholRecommand_data").innerHTML = "<td><label class='col-md-12 text-left'>แนะนำเลิกแอลกอฮอร์ : Alcohol</label></td>";
    document.getElementById("SmokingRecommand_data").innerHTML = "<td><label class='col-md-12 text-left'>แนะนำเลิกสูบบุหรี่</label></td>";
    document.getElementById("SleepRate_data").innerHTML = " <td><label class='col-md-12 text-left'>ประเมินการนอนหลับ เช่น นอนกรน หยุดหายใจขณะหลับ</label></td>";
    document.getElementById("AppointmentRate_data").innerHTML = "<td><label class='col-md-12 text-left'>ตรวจตามนัดสม่ำเสมอ(ช้าได้ภายใน 1 เดือนหลังนัด) *</label></td>";
    document.getElementById("Medication_frequency_data").innerHTML = "<td><label class='col-md-12 text-left'>รับประทานยาสม่ำเสมอ (%)</label></td>";
    document.getElementById("FluVaccine_data").innerHTML = "<td><label class='col-md-12 text-left'>Influenza (Flu) Vaccine *</label></td>";
    document.getElementById("PneumococcalVaccine_data").innerHTML = "<td id='Pneumococcal-status' bgcolor=''><label class='col-md-12 text-left'>Pneumococcal Vaccine อายุ > 65 ปี * </label></td>"                                               
    document.getElementById("diabetesFBS_HbA1C_data").innerHTML = "<td><label class='col-md-12 text-left'>ประเมินเบาหวาน (FBS, HbA1C)</label></td>";
    document.getElementById("lipidprofile_data").innerHTML = "<td><label class='col-md-12 text-left'>ประเมินระดับ Lipid Profile(Lipid,LDL)</label> </td>";
    document.getElementById("kidneyCr_GFR_data").innerHTML = "<td><label class='col-md-12 text-left'>ประเมินการทำงานของไต (Cr, GFR) </label></td>";
    document.getElementById("kidneyProteinuria_data").innerHTML = "<td><label class='col-md-12 text-left'>ประเมินการทำงานของไต (Proteinuria/MAU)</label> </td>";
    document.getElementById("EKG_data").innerHTML = "<td><label class='col-md-12 text-left'>EKG</label></td>";
    document.getElementById("Echo_data").innerHTML = "<td><label class='col-md-12 text-left'>Echo : If LVH in EKG</label></td>";
    document.getElementById("CAC_data").innerHTML = "<td><label class='col-md-12 text-left'>Coronary calcium scoring (CACs)</label></td>";
    document.getElementById("ABI_data").innerHTML = "<td><label class='col-md-12 text-left'>ABI/CAVI</label></td>";
}
//ฟังก์ชันสำหรับใช้ Arrow icon ในการดูข้อมูลก่อนหน้าที่ไม่แสดง
function reloadSumVisit(number){
    if(str_last == true){
        if(parseInt(sessionStorage.last_Year) == First_Year+4){
            document.getElementById("arrowicon_right").innerHTML = ""
        }
        sessionStorage.setItem("Number", number);
        var countBP_nm = 0; //normal
        var countBP_h = 0; //high
        var Medication_frequency= 0;
        var countAppointment_true = 0
        //ตัวแปรที่ข้อมูมีการคำนวณ
        var _resultBP_nm = 0;
        var _resultBP_h = 0;
        var _resultMedication_frequency = 0;
        var _resultAppointment = 0;
                
        //ตัวแปรนับจำนวนผลลัพธ์
        var _count_thisyear = 0;
        var _count_FluVaccine = 0;
        var _count_PneuVaccine = 0;
        var _count_Appointment = 0;
        var _count_xraythisyear = 0;
        var _resultGlucose = null;
        var _resultHbA1C = null;
        var _resultCholesterol = null;
        var _resultCreatinine = null;
        var _resultCreatinine_GFR = null;
        var _resultUrineProtein = null;
        var _resultEKG = null;
        var _resultNutritionist = null;
        var _resultAlcohol = null;
        var _resultSmoking = null;
        var _resultSleepRate = null;
        var _resultExercise_minute = null;
        var _Date_titleinput = "";
        
        //สำหรับ set ปี Column แรก
        if(str_arrowright == true && str_first_success == false){  //กด arrow ครั้งแรก
            var Current_Year = Today.getUTCFullYear()-number;
            sessionStorage.setItem("last_Year",Current_Year)
            str_first_success = true;
        }else if (str_first_success == true && str_arrowright == true){  //กด arrow ครั้งถัดไป (โดยที่ไม่ Reload page)
            var Current_Year = parseInt(sessionStorage.last_Year)-number;
            sessionStorage.setItem("last_Year",Current_Year)
        }
        //สำหรับ set Column ปีก่อนหน้า ที่จะให้แสดง โดยไปเกินจำนวน Column ที่กำหนด 
        var _current_year = 0;
        if(Current_Year >= First_Year+3){
            _current_year = Current_Year-3
        }else if(Current_Year > First_Year && Current_Year <= First_Year+3){
            _current_year = (Current_Year-(Current_Year - First_Year));
        }else{
            _current_year = Current_Year
        }

        if (_count_ShowData <= 2 ){
            sessionStorage.setItem("stamp_Year",parseInt(sessionStorage.stamp_Year)-1)
        }

        if (Data_Age < 65){ 
            document.getElementById("Pneumococcal-status").setAttribute("bgcolor","#F5F5F5")
        }

        for (var column_year = Current_Year ; column_year >= _current_year ; column_year--)
        { //
            countBP_nm = 0; //BPnormal
            countBP_h = 0; //BPhigh
            countAppointment_true = 0 
            _count_thisyear = 0;
            _count_FluVaccine = 0;
            _count_PneuVaccine = 0;
            _count_Appointment = 0;
            Medication_frequency = 0;
            _count_xraythisyear = 0;

            //Lab
            for (var i = 0 ; i < json_Lab_DataResult.length ; i++){
                var pressure_max = parseInt(json_Lab_DataResult[i].pressure_max) 
                var pressure_min = parseInt(json_Lab_DataResult[i].pressure_min) 
                var data_date = new Date( json_Lab_DataResult[i].visit_date)
                var create_Date_Data =  data_date.getUTCFullYear();
                if (json_Lab_DataResult.length != 1)
                    {
                        if (create_Date_Data == column_year && parseInt(sessionStorage.stamp_Year) != create_Date_Data)
                        { //แสดงเฉพาะข้อมูลล่าสุด 
                            _resultGlucose = json_Lab_DataResult[i].Glucose;
                            _resultHbA1C = json_Lab_DataResult[i].HbA1C;
                            _resultCholesterol = json_Lab_DataResult[i].Cholesterol ;
                            _resultCreatinine = json_Lab_DataResult[i].Creatinine;
                            _resultCreatinine_GFR = json_Lab_DataResult[i].Creatinine_GFR;
                            _resultUrineProtein = json_Lab_DataResult[i].UrineProtein;

                            _resultNutritionist = json_Lab_DataResult[i].Nutritionist == true ? "Checked" : "";
                            _resultAlcohol = json_Lab_DataResult[i].Alcohol == true ? "Checked" : "";
                            _resultSmoking = json_Lab_DataResult[i].Smoking == true ? "Checked" : "";
                            _resultSleepRate = json_Lab_DataResult[i].SleepRate == true ? "Checked" : "";
                            _resultExercise_minute = json_Lab_DataResult[i].Exercise_minute == true ? "Checked" : "";

                            let current_datetime = new Date(json_Lab_DataResult[i].visit_date)
                            _Date_titleinput = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
                            sessionStorage.setItem("stamp_Year",create_Date_Data) //เก็บปีที่มีการแสดงข้อมูลแล้ว 
                        }
                }else{
                        _resultGlucose = json_Lab_DataResult[0].Glucose;
                        _resultHbA1C = json_Lab_DataResult[0].HbA1C;
                        _resultCholesterol = json_Lab_DataResult[0].Cholesterol ;
                        _resultCreatinine = json_Lab_DataResult[0].Creatinine;
                        _resultCreatinine_GFR = json_Lab_DataResult[0].Creatinine_GFR;
                        _resultUrineProtein = json_Lab_DataResult[0].UrineProtein;

                        _resultNutritionist = json_Lab_DataResult[0].Nutritionist == true ? "Checked" : "";
                        _resultAlcohol = json_Lab_DataResult[0].Alcohol == true ? "Checked" : "";
                        _resultSmoking = json_Lab_DataResult[0].Smoking == true ? "Checked" : "";
                        _resultSleepRate = json_Lab_DataResult[0].SleepRate == true ? "Checked" : "";
                        _resultExercise_minute = json_Lab_DataResult[0].Exercise_minute == true ? "Checked" : "";
                        
                        let current_datetime = new Date(json_Lab_DataResult[0].visit_date)
                        _Date_titleinput = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
                }
                if (create_Date_Data == column_year){
                        _count_thisyear = 1 + _count_thisyear
                        if(pressure_max <= 130 || pressure_min <= 80){
                            countBP_nm = 1+countBP_nm
                        }
                        if(pressure_max <= 140 || pressure_min <= 90){
                            countBP_h = 1+countBP_h
                        }
                        Medication_frequency = parseInt(json_Lab_DataResult[i].Medication_frequency) + Medication_frequency;
                }
            }

            //Xray
            for (var i = 0 ; i < json_Xray_DataResult.length ; i++){
                var create_Date_Data =  data_date.getUTCFullYear();
                if (json_Xray_DataResult.length != 1){
                    if (create_Date_Data == column_year && parseInt(sessionStorage.stamp_Year) != create_Date_Data){ //แสดงเฉพาะข้อมูลล่าสุด 
                        _resultEKG = json_Xray_DataResult[i].EKG;
                        _resultEcho = json_Xray_DataResult[i].Echo;
                        _resultCAC = json_Xray_DataResult[i].CACs ;
                        _resultABI = json_Xray_DataResult[i].ABI;
                        _resultCAVI = json_Xray_DataResult[i].CAVI;

                        let current_datetime = new Date(json_Xray_DataResult[i].visit_date)
                        _Date_titleinput = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
                        sessionStorage.setItem("stamp_Year",create_Date_Data) //เก็บปีที่มีการแสดงข้อมูลแล้ว 
                    }
                }else{
                    _resultEKG = json_Xray_DataResult[0].EKG;
                    _resultEcho = json_Xray_DataResult[0].Echo;
                    _resultCAC = json_Xray_DataResult[0].CACs ;
                    _resultABI = json_Xray_DataResult[0].ABI;
                    _resultCAVI = json_Xray_DataResult[0].CAVI;

                    let current_datetime = new Date(json_Xray_DataResult[i].visit_date)
                    _Date_titleinput = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
                    sessionStorage.setItem("stamp_Year",create_Date_Data) //เก็บปีที่มีการแสดงข้อมูลแล้ว 
                }
                if (create_Date_Data == column_year){
                    _count_xraythisyear = 1 + _count_xraythisyear
                }
            }

            //Flu Vaccine
            for (var json_FluVaccine_i = 0 ; json_FluVaccine_i < json_FluVaccine.length ; json_FluVaccine_i++){
                var vaccine_date = new Date( json_FluVaccine[json_FluVaccine_i].vaccine_date)
                var create_FluVaccineDate_Date =  vaccine_date.getUTCFullYear(); //วันที่ข้อมูลตามในแต่ละตำแหน่ง list
                if (create_FluVaccineDate_Date == column_year){ //แสดงเฉพาะค่าล่าสุด เพราะใน List มีการจัดลำดับตาม ep ที่มาแล้ว 
                    _count_FluVaccine = 1 + _count_FluVaccine 
                    _resultFluVaccineName = json_FluVaccine[json_FluVaccine_i].Vaccine_Name
                    _resultFluVaccineDate = json_FluVaccine[json_FluVaccine_i].vaccine_date
                } 
            }
            //Pneumococcal Vaccine
            for (var json_PneuVaccine_i = 0 ; json_PneuVaccine_i < json_PneuVaccine.length ; json_PneuVaccine_i++){
                var pneuvaccine_date = new Date( json_PneuVaccine[json_PneuVaccine_i].vaccine_date)
                var create_PneuVaccineDate_Date =  pneuvaccine_date.getUTCFullYear(); //วันที่ข้อมูลตามในแต่ละตำแหน่ง list
                if (create_PneuVaccineDate_Date == column_year){ //แสดงเฉพาะค่าล่าสุด เพราะใน List มีการจัดลำดับตาม ep ที่มาแล้ว 
                    _count_PneuVaccine = 1 + _count_PneuVaccine 
                }
            }
            //Appointmant
            for (var json_Appointment_i = 0 ; json_Appointment_i < json_Appointment.length ; json_Appointment_i++){
                var appointment_date = new Date( json_Appointment[json_Appointment_i].visit_date);
                var create_Appointment_Date = appointment_date.getUTCFullYear();
                if (create_Appointment_Date == column_year){
                    _count_Appointment = 1 + _count_Appointment;
                    if (json_Appointment[json_Appointment_i].cal_day >= 0 && json_Appointment[json_Appointment_i].cal_day <= 30){
                        countAppointment_true = 1 + countAppointment_true;
                    }
                }
            }

            //Show FluVaccine
            if(_count_FluVaccine <=0){
                document.getElementById("FluVaccine_data").innerHTML +=   "<td width='20%' align='center'><label ></label></td>"
            }else{
                document.getElementById("FluVaccine_data").innerHTML += "<td width='20%' align='center'><img id='"+column_year+"' onclick='getFluVaccine_year(this.id)' src='assets/images/icon-injector.png' height='30' width='30'/></td>"
            }

            if (Data_Age < 65){ 
                document.getElementById("PneumococcalVaccine_data").innerHTML += "<td bgcolor='#F5F5F5' width='20%' align='center'><label ></label></td>"
            }else{
                //Show PneuVaccine
                if(_count_PneuVaccine <=0){
                    document.getElementById("PneumococcalVaccine_data").innerHTML +=   "<td width='20%' align='center'><label ></label></td>"
                }else{
                    document.getElementById("PneumococcalVaccine_data").innerHTML += "<td width='20%' align='center'><img id='"+column_year+"' onclick='getPneuVaccine_year(this.id)' src='assets/images/icon-injector.png' height='30' width='30'/></td>"
                }
            }
            //Show Appointment
            if(_count_Appointment <=0){
                                            

                            document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";

            }else{

                            _resultAppointment = (((countAppointment_true/_count_Appointment)*100).toFixed(2))+" %" == "NaN %" ? "N/A" : (((countAppointment_true/_count_Appointment)*100).toFixed(2))+" %"

                            document.getElementById("AppointmentRate_data").innerHTML +=   "<td width='20%' align='center'><label id='"+column_year+"' onclick='getAppointment_year(this.id)'>"+_resultAppointment+"</label></td>"

            }
            //Show Lab
            if (_count_thisyear <=0){
                _resultBP_nm = 0;
                _resultBP_h = 0;
                _resultMedication_frequency = 0;
                // column_yearHeader
                document.getElementById("column_yearHeader").innerHTML += "<th style='text-align:center'><strong>"+column_year+"</strong><p><br></p></th>"
                document.getElementById("sumBPn_data").innerHTML +=   "<td width='20%' align='center'><label></label></td>"
                document.getElementById("sumBPh_data").innerHTML +=   "<td width='20%' align='center'><label></label></td>"
                document.getElementById("NutritionistRecommand_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";
                document.getElementById("ExerciseRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                document.getElementById("AlcoholRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                document.getElementById("SmokingRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                document.getElementById("SleepRate_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";
                document.getElementById("Medication_frequency_data").innerHTML +=   "<td width='20%' align='center'><label></label></td>"
                document.getElementById("diabetesFBS_HbA1C_data").innerHTML +=   "<td width='20%' align='center'><label  ></label></td>"
                document.getElementById("lipidprofile_data").innerHTML +=   "<td width='20%' align='center'><label  ></label></td>"
                document.getElementById("kidneyCr_GFR_data").innerHTML +=   "<td width='20%' align='center'><label  ></label></td>" 
                document.getElementById("kidneyProteinuria_data").innerHTML +=   "<td width='20%' align='center'><label  ></label></td>"
            }else{
                //คำนวณหาเปอร์เซ็นจากข้อมูลทั้งหมด
                _resultBP_nm = ((countBP_nm/_count_thisyear)*100).toFixed(2)
                _resultBP_h = ((countBP_h/_count_thisyear)*100).toFixed(2)
                _resultMedication_frequency = (parseInt(Medication_frequency)/_count_thisyear).toFixed(2);
                //Check Data Value null     
                var resultGlucose = _resultGlucose == "" ? "N/A" : _resultGlucose;
                var resultHbA1C =_resultHbA1C == "" ? "N/A" : _resultHbA1C;
                var resultCholesterol =_resultCholesterol == "" ? "N/A" : _resultCholesterol;
                var resultCreatinine =_resultCreatinine == "" ? "N/A" : _resultCreatinine;
                var resultCreatinine_GFR = _resultCreatinine_GFR == "" ? "N/A" : _resultCreatinine_GFR;
                var resultUrineProtein =_resultUrineProtein == "" ? "N/A" : _resultUrineProtein;
                // column_yearHeader
                document.getElementById("column_yearHeader").innerHTML += "<th style='text-align:center'><strong >"+column_year+"</strong><p> ("+_Date_titleinput+") </p></th>"
                document.getElementById("sumBPn_data").innerHTML +=   "<td width='20%' align='center'><label id='"+column_year+"' onclick='getBPnm_year(this.id)'>"+_resultBP_nm+" %</label></td>"
                document.getElementById("sumBPh_data").innerHTML +=   "<td width='20%' align='center'><label id='"+column_year+"' onclick='getBPh_year(this.id)'>"+_resultBP_h+" %</label></td>"
                document.getElementById("NutritionistRecommand_data").innerHTML += "<td align='center'><input class='largerCheckbox' type='checkbox' "+_resultNutritionist+" ></td>";
                document.getElementById("ExerciseRate_data").innerHTML += " <td align='center'><input class='largerCheckbox' type='checkbox' "+_resultExercise_minute+" ></td>";
                document.getElementById("AlcoholRecommand_data").innerHTML +=" <td align='center'><input class='largerCheckbox' type='checkbox' "+_resultAlcohol+" ></td>";
                document.getElementById("SmokingRecommand_data").innerHTML += "<td align='center'><input class='largerCheckbox' type='checkbox' "+_resultSmoking+" ></td>";
                document.getElementById("SleepRate_data").innerHTML += " <td align='center'><input class='largerCheckbox' type='checkbox' "+_resultSleepRate+" ></td>";
                document.getElementById("Medication_frequency_data").innerHTML +=   "<td width='20%' align='center'><label id='"+column_year+"' onclick='getMF_year(this.id)'>"+_resultMedication_frequency+" %</label></td>"
                document.getElementById("diabetesFBS_HbA1C_data").innerHTML +=   "<td width='20%' align='center'><label  >"+resultGlucose+" , "+resultHbA1C +"</label></td>"
                document.getElementById("lipidprofile_data").innerHTML +=   "<td width='20%' align='center'><label  >"+resultCholesterol+"</label></td>"
                document.getElementById("kidneyCr_GFR_data").innerHTML +=   "<td width='20%' align='center'><label>"+resultCreatinine+" , "+resultCreatinine_GFR+"</label></td>"
                document.getElementById("kidneyProteinuria_data").innerHTML +=   "<td width='20%' align='center'><label  >"+resultUrineProtein+"</label></td>"
            }
            //Show Xray
            if (_count_xraythisyear <=0){
                document.getElementById("EKG_data").innerHTML +=   "<td width='20%' align='center'><label  ></label></td>"
                document.getElementById("Echo_data").innerHTML +=   "<td width='20%' align='center'><label  ></label></td>"
                document.getElementById("CAC_data").innerHTML +=   "<td width='20%' align='center'><label  ></label></td>"
                document.getElementById("ABI_data").innerHTML +=   "<td width='20%' align='center'><label  ></label></td>"   
            }else{
                var resultEKG =_resultEKG == null ? "N/A"  : _resultEKG;
                var resultEcho =_resultEcho == null ? "N/A"  : _resultEcho;
                var resultCAC =_resultCAC == null ? "N/A"  : _resultCAC;
                var resultABI =_resultABI == null ? "N/A"  : _resultABI;
                var resultCAVI =_resultCAVI == null ? "N/A"  : _resultCAVI;
                if (_countresultEKG > 0) {
                    document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getEKG_year(this.id)' src='assets/images/x-ray.png' height='30' width='30'/>1529</td>"
                }
                else {
                    document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'></td>"
                }
                if (_countresultEcho > 0) {
                    document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getEcho_year(this.id)' src='assets/images/x-ray.png' height='30' width='30'/></td>"
                }
                else {
                    document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'></td>"
                }
                if (_countresultCAC > 0) {
                    document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getCAC_year(this.id)' src='assets/images/x-ray.png' height='30' width='30'/></td>"
                }
                else {
                    document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'></td>"
                }
                if ((_countresultABI > 0)|| (_countresultCAVI > 0) ) {
                    document.getElementById("ABI_data").innerHTML += "<td width='20%' align='center'><img id='" + column_year + "' onclick='getABI_year(this.id)' src='assets/images/x-ray.png' height='30' width='30'/></td>"
                }
                else {
                    document.getElementById("ABI_data").innerHTML += "<td width='20%' align='center'></td>"
                }
            }
        }
        
        if(parseInt(sessionStorage.last_Year) < (Today.getUTCFullYear())){
            document.getElementById("arrowicon_left").innerHTML = "<span class='fa fa-angle-left' onclick='next_yearData()' style='position:absolute; top: 10px; left: 20px;  font-size: 30px;'></span>"
        }
    }
    else{
        if( (Today.getUTCFullYear()-1) == parseInt(sessionStorage.last_Year) ){
            document.getElementById("arrowicon_left").innerHTML = ""
        }
        sessionStorage.setItem("Number", number);
        var countBP_nm = 0; //normal
        var countBP_h = 0; //high
        var Medication_frequency= 0;
        var countAppointment_true = 0
        //ตัวแปรที่ข้อมูมีการคำนวณ
        var _resultBP_nm = 0;
        var _resultBP_h = 0;
        var _resultMedication_frequency = 0;
        var _resultAppointment = 0;
        //ตัวแปรนับจำนวนผลลัพธ์
        var _count_thisyear = 0;
        var _count_FluVaccine = 0;
        var _count_PneuVaccine = 0;
        var _count_Appointment = 0;
        var _resultGlucose = null;
        var _resultHbA1C = null;
        var _resultCholesterol = null;
        var _resultCreatinine = null;
        var _resultCreatinine_GFR = null;
        var _resultUrineProtein = null;
        var _resultEKG = null;
        var _resultEcho = null;
        var _resultCAC = null;
        var _resultABI = null;
        var _resultCAVI = null;
        var _resultNutritionist = null;
        var _resultAlcohol = null;
        var _resultSmoking = null;
        var _resultSleepRate = null;
        var _resultExercise_minute = null;
        var _Date_titleinput = "";
        // var Current_Year = 2566+number;
        var Current_Year = parseInt(sessionStorage.last_Year)+number;
        sessionStorage.setItem("last_Year",Current_Year)
        
        var _current_year = 0;
        if(Current_Year >= First_Year+3){
            _current_year = Current_Year-3
        }else if(Current_Year > First_Year && Current_Year <= First_Year+3){
            _current_year = (Current_Year-(Current_Year - First_Year));
        }else{
            _current_year = Current_Year
        }

        if (_count_ShowData <= 2 ){
            sessionStorage.setItem("stamp_Year",parseInt(sessionStorage.stamp_Year)-1)
        }

        if (Data_Age < 65){ 
            document.getElementById("Pneumococcal-status").setAttribute("bgcolor","#F5F5F5")
        }
    
        for (var column_year = Current_Year ; column_year >= _current_year ; column_year--)
        {
            countBP_nm = 0; //BPnormal
            countBP_h = 0; //BPhigh
            countAppointment_true = 0 
            _count_thisyear = 0;
            _count_FluVaccine = 0;
            _count_PneuVaccine = 0;
            _count_Appointment = 0;
            Medication_frequency = 0;
            //Lab DataResult
            for (var i = 0 ; i < json_Lab_DataResult.length ; i++){
    
                            var pressure_max = parseInt(json_Lab_DataResult[i].pressure_max) 
                            var pressure_min = parseInt(json_Lab_DataResult[i].pressure_min) 
            
                             var data_date = new Date( json_Lab_DataResult[i].visit_date)
                            //.getUTCFullYear()
    
                            var create_Date_Data =  data_date.getUTCFullYear();

                            if (json_Lab_DataResult.length != 1){

                                if (create_Date_Data == column_year && parseInt(sessionStorage.stamp_Year) != create_Date_Data){ //แสดงเฉพาะข้อมูลล่าสุด 

                                    _resultGlucose = json_Lab_DataResult[i].Glucose;
                                    _resultHbA1C = json_Lab_DataResult[i].HbA1C;
                                    _resultCholesterol = json_Lab_DataResult[i].Cholesterol ;
                                    _resultCreatinine = json_Lab_DataResult[i].Creatinine;
                                    _resultCreatinine_GFR = json_Lab_DataResult[i].Creatinine_GFR;
                                    _resultUrineProtein = json_Lab_DataResult[i].UrineProtein;

                                    _resultNutritionist = json_Lab_DataResult[i].Nutritionist == true ? "Checked" : "";
                                    _resultAlcohol = json_Lab_DataResult[i].Alcohol == true ? "Checked" : "";
                                    _resultSmoking = json_Lab_DataResult[i].Smoking == true ? "Checked" : "";
                                    _resultSleepRate = json_Lab_DataResult[i].SleepRate == true ? "Checked" : "";
                                    _resultExercise_minute = json_Lab_DataResult[i].Exercise_minute == true ? "Checked" : "";

                                    let current_datetime = new Date(json_Lab_DataResult[i].visit_date)
                                    _Date_titleinput = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()

                                    // _resultExercise_minute = json_Lab_DataResult[i].Exercise_minute;
                
                                    sessionStorage.setItem("stamp_Year",create_Date_Data) //เก็บปีที่มีการแสดงข้อมูลแล้ว 

                                    // console.log(column_year,json_Lab_DataResult[i]);
                                    
                                }

                            }else{

                                _resultGlucose = json_Lab_DataResult[0].Glucose;
                                _resultHbA1C = json_Lab_DataResult[0].HbA1C;
                                _resultCholesterol = json_Lab_DataResult[0].Cholesterol ;
                                _resultCreatinine = json_Lab_DataResult[0].Creatinine;
                                _resultCreatinine_GFR = json_Lab_DataResult[0].Creatinine_GFR;
                                _resultUrineProtein = json_Lab_DataResult[0].UrineProtein;

                                _resultNutritionist = json_Lab_DataResult[0].Nutritionist == true ? "Checked" : "";
                                _resultAlcohol = json_Lab_DataResult[0].Alcohol == true ? "Checked" : "";
                                _resultSmoking = json_Lab_DataResult[0].Smoking == true ? "Checked" : "";
                                _resultSleepRate = json_Lab_DataResult[0].SleepRate == true ? "Checked" : "";
                                _resultExercise_minute = json_Lab_DataResult[0].Exercise_minute == true ? "Checked" : "";

                                let current_datetime = new Date(json_Lab_DataResult[0].visit_date)
                                _Date_titleinput = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()

                            }

                            if (create_Date_Data == column_year){
    
                                _count_thisyear = 1 + _count_thisyear
                              
                                if(pressure_max <= 130 || pressure_min <= 80){
                
                                    countBP_nm = 1+countBP_nm
                
                                }
                
                                if(pressure_max <= 140 || pressure_min <= 90){

                                    countBP_h = 1+countBP_h

                                }

                                Medication_frequency = parseInt(json_Lab_DataResult[i].Medication_frequency) + Medication_frequency;
                            }
            }
            //Flu Vaccine
            for (var json_FluVaccine_i = 0 ; json_FluVaccine_i < json_FluVaccine.length ; json_FluVaccine_i++){

                            var vaccine_date = new Date( json_FluVaccine[json_FluVaccine_i].vaccine_date)

                            var create_FluVaccineDate_Date =  vaccine_date.getUTCFullYear(); //วันที่ข้อมูลตามในแต่ละตำแหน่ง list

                            if (create_FluVaccineDate_Date == column_year){ //แสดงเฉพาะค่าล่าสุด เพราะใน List มีการจัดลำดับตาม ep ที่มาแล้ว 

                                _count_FluVaccine = 1 + _count_FluVaccine 

                                _resultFluVaccineName = json_FluVaccine[json_FluVaccine_i].Vaccine_Name
                                _resultFluVaccineDate = json_FluVaccine[json_FluVaccine_i].vaccine_date
                             
                            }
            }
            //Pneumococcal Vaccine
            for (var json_PneuVaccine_i = 0 ; json_PneuVaccine_i < json_PneuVaccine.length ; json_PneuVaccine_i++){
                
                            var pneuvaccine_date = new Date( json_PneuVaccine[json_PneuVaccine_i].vaccine_date)

                            var create_PneuVaccineDate_Date =  pneuvaccine_date.getUTCFullYear(); //วันที่ข้อมูลตามในแต่ละตำแหน่ง list


                            if (create_PneuVaccineDate_Date == column_year){ //แสดงเฉพาะค่าล่าสุด เพราะใน List มีการจัดลำดับตาม ep ที่มาแล้ว 

                                _count_PneuVaccine = 1 + _count_PneuVaccine 

                            }
            }
            //Appointment
            for (var json_Appointment_i = 0 ; json_Appointment_i < json_Appointment.length ; json_Appointment_i++){

                            var appointment_date = new Date( json_Appointment[json_Appointment_i].visit_date);

                            var create_Appointment_Date = appointment_date.getUTCFullYear();

                            if (create_Appointment_Date == column_year){

                                _count_Appointment = 1 + _count_Appointment;

                                if (json_Appointment[json_Appointment_i].cal_day >= 0 && json_Appointment[json_Appointment_i].cal_day <= 30){

                                    countAppointment_true = 1 + countAppointment_true;

                                }

                            }
            }
            //X-ray DataResult
            for (var i = 0 ; i < json_Xray_DataResult.length ; i++){
    
                            var pressure_max = parseInt(json_Lab_DataResult[i].pressure_max) 
                            var pressure_min = parseInt(json_Lab_DataResult[i].pressure_min) 
            
                             var data_date = new Date( json_Lab_DataResult[i].visit_date)
                            //.getUTCFullYear()
    
                            var create_Date_Data =  data_date.getUTCFullYear();

                            if (json_Xray_DataResult.length != 1){
                                if (create_Date_Data == column_year && parseInt(sessionStorage.stamp_Year) != create_Date_Data){ //แสดงเฉพาะข้อมูลล่าสุด 

                                    _resultEKG = json_Xray_DataResult[i].EKG;
                                    _resultEcho = json_Xray_DataResult[i].Echo;
                                    _resultCAC = json_Xray_DataResult[i].CAC;
                                    _resultABI = json_Xray_DataResult[i].ABI;
                                    _resultCAVI = json_Xray_DataResult[i].CAVI;

                                    let current_datetime = new Date(json_Lab_DataResult[i].visit_date)
                                    _Date_titleinput = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
                                    sessionStorage.setItem("stamp_Year",create_Date_Data) //เก็บปีที่มีการแสดงข้อมูลแล้ว 
                                }
                            }else{
                                _resultEKG = json_Lab_DataResult[0].EKG;
                                _resultEcho = json_Xray_DataResult[0].Echo;
                                _resultCAC = json_Xray_DataResult[0].CAC;
                                _resultABI = json_Xray_DataResult[0].ABI;
                                _resultCAVI = json_Xray_DataResult[0].CAVI;

                                let current_datetime = new Date(json_Lab_DataResult[0].visit_date)
                                _Date_titleinput = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
                            }
            }
            //Show FluVaccine
            if(_count_FluVaccine <=0){

                            document.getElementById("FluVaccine_data").innerHTML +=   "<td width='20%' align='center'><label ></label></td>"

            }else{

                            document.getElementById("FluVaccine_data").innerHTML += "<td width='20%' align='center'><img id='"+column_year+"' onclick='getFluVaccine_year(this.id)' src='assets/images/icon-injector.png' height='30' width='30'/></td>"
                            // document.getElementById("FluVaccine_data").innerHTML +=   "<td width='20%'><span ><strong>Vaccine Name : </strong>"+_resultFluVaccineName+"<br><strong> Vaccine Date : </strong>"+_resultFluVaccineDate+"</span></td>"

            }

            if (Data_Age < 65){ 
                document.getElementById("PneumococcalVaccine_data").innerHTML += "<td bgcolor='#F5F5F5' width='20%' align='center'><label ></label></td>"
            }else{
                //Show PneuVaccine
                if(_count_PneuVaccine <=0){
                    document.getElementById("PneumococcalVaccine_data").innerHTML +=   "<td width='20%' align='center'><label ></label></td>"
                }else{
                    document.getElementById("PneumococcalVaccine_data").innerHTML += "<td width='20%' align='center'><img id='"+column_year+"' onclick='getPneuVaccine_year(this.id)' src='assets/images/icon-injector.png' height='30' width='30'/></td>"
                }
            }

            //Show Appointment
            if(_count_Appointment <=0){
                document.getElementById("AppointmentRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
            }else{
                _resultAppointment = (((countAppointment_true/_count_Appointment)*100).toFixed(2))+" %" == "NaN %" ? "N/A" : (((countAppointment_true/_count_Appointment)*100).toFixed(2))+" %"
                document.getElementById("AppointmentRate_data").innerHTML +=   "<td width='20%' align='center'><label id='"+column_year+"' onclick='getAppointment_year(this.id)'>"+_resultAppointment+"</label></td>"
            }
    
            if (_count_thisyear <=0){
                _resultBP_nm = 0;
                _resultBP_h = 0;
                _resultMedication_frequency = 0;
                // column_yearHeader
                document.getElementById("column_yearHeader").innerHTML += "<th style='text-align:center'><strong>"+column_year+"</strong><p><br></p></th>"
                document.getElementById("sumBPn_data").innerHTML +=   "<td width='20%' align='center'><label ></label></td>"
                document.getElementById("sumBPh_data").innerHTML +=   "<td width='20%' align='center'><label  ></label></td>"
                document.getElementById("NutritionistRecommand_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";
                document.getElementById("ExerciseRate_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                document.getElementById("AlcoholRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                document.getElementById("SmokingRecommand_data").innerHTML += "<td width='20%' align='center'><label ></label></td>";
                document.getElementById("SleepRate_data").innerHTML += " <td width='20%' align='center'><label ></label></td>";

                document.getElementById("Medication_frequency_data").innerHTML += "<td width='20%' align='center'><label ></label></td>"

                document.getElementById("diabetesFBS_HbA1C_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                document.getElementById("lipidprofile_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                document.getElementById("kidneyCr_GFR_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                document.getElementById("kidneyProteinuria_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'><label  ></label></td>"
                document.getElementById("ABI_data").innerHTML +=   "<td width='20%' align='center'><label  ></label></td>"
            }else{
                //คำนวณหาเปอร์เซ็นจากข้อมูลทั้งหมด
                _resultBP_nm = ((countBP_nm / _count_thisyear) * 100).toFixed(2);
                _resultBP_h = ((countBP_h / _count_thisyear) * 100).toFixed(2);
                _resultMedication_frequency = (parseInt(Medication_frequency) / _count_thisyear).toFixed(2);

                //Check Data Value null    
                var resultGlucose = _resultGlucose == "" ? "N/A" : _resultGlucose;
                var resultHbA1C = _resultHbA1C == "" ? "N/A" : _resultHbA1C;
                var resultCholesterol = _resultCholesterol == "" ? "N/A" : _resultCholesterol;
                var resultCreatinine = _resultCreatinine == "" ? "N/A" : _resultCreatinine;
                var resultCreatinine_GFR = _resultCreatinine_GFR == "" ? "N/A" : _resultCreatinine_GFR;
                var resultUrineProtein = _resultUrineProtein == "" ? "N/A" : _resultUrineProtein;
                var resultEKG = _resultEKG == "" ? "N/A" : _resultEKG;
                var resultEcho = _resultEcho == "" ? "N/A" : _resultEcho;
                var resultCAC = _resultCAC == "" ? "N/A" : _resultCAC;
                var resultABI = _resultABI == "" ? "N/A" : _resultABI;
                var resultCAVI = _resultCAVI == "" ? "N/A" : _resultCAVI;

                // column_yearHeader
                document.getElementById("column_yearHeader").innerHTML += "<th style='text-align:center'><strong>" + column_year + "</strong><p> (" + _Date_titleinput + ") </p></th>"

                document.getElementById("sumBPn_data").innerHTML += "<td width='20%' align='center'><label id='" + column_year + "' onclick='getBPnm_year(this.id)'>" + _resultBP_nm + " %</label></td>"
                document.getElementById("sumBPh_data").innerHTML += "<td width='20%' align='center'><label id='" + column_year + "' onclick='getBPh_year(this.id)'>" + _resultBP_h + " %</label></td>"

                document.getElementById("NutritionistRecommand_data").innerHTML += "<td align='center'><input class='largerCheckbox' type='checkbox' " + _resultNutritionist + " ></td>";
                document.getElementById("ExerciseRate_data").innerHTML += " <td align='center'><input class='largerCheckbox' type='checkbox' " + _resultExercise_minute + " ></td>";
                document.getElementById("AlcoholRecommand_data").innerHTML += " <td align='center'><input class='largerCheckbox' type='checkbox' " + _resultAlcohol + " ></td>";
                document.getElementById("SmokingRecommand_data").innerHTML += "<td align='center'><input class='largerCheckbox' type='checkbox' " + _resultSmoking + " ></td>";
                document.getElementById("SleepRate_data").innerHTML += " <td align='center'><input class='largerCheckbox' type='checkbox' " + _resultSleepRate + " ></td>";
                document.getElementById("Medication_frequency_data").innerHTML += "<td width='20%' align='center'><label id='" + column_year + "' onclick='getMF_year(this.id)'>" + _resultMedication_frequency + " %</label></td>"

                document.getElementById("diabetesFBS_HbA1C_data").innerHTML += "<td width='20%' align='center'><label  >" + resultGlucose + " , " + resultHbA1C + "</label></td>"
                document.getElementById("lipidprofile_data").innerHTML += "<td width='20%' align='center'><label  >" + resultCholesterol + "</label></td>"
                document.getElementById("kidneyCr_GFR_data").innerHTML += "<td width='20%' align='center'><label>" + resultCreatinine + " , " + resultCreatinine_GFR + "</label></td>"
                document.getElementById("kidneyProteinuria_data").innerHTML += "<td width='20%' align='center'><label  >" + resultUrineProtein + "</label></td>"
                document.getElementById("EKG_data").innerHTML += "<td width='20%' align='center'><label>"+_resultEKG+"</label></td>"
                document.getElementById("Echo_data").innerHTML += "<td width='20%' align='center'><label>"+_resultEcho+"</label></td>"
                document.getElementById("CAC_data").innerHTML += "<td width='20%' align='center'><label  >"+_resultCAC+"</label></td>"
                document.getElementById("ABI_data").innerHTML += "<td width='20%' align='center'><label  >" + _resultABI + " , " + _resultCAVI + "</label></td>"
            }
        }

        //เงื่อนไขแสดงป่ม Arrow right  
        if(First_Year < (First_Year+4)){
            document.getElementById("arrowicon_right").innerHTML = "<span class='fa fa-angle-right' onclick='last_yearData()' style='position:absolute; top: 10px; right: 20px; font-size: 30px;'></span>"
        }
    }
}
//ฟังก์ชันแสดงข้อมูลการนัดของปีนั้นๆ  Modal
function getAppointment_year(year){
    var _count_Appointment = 0;
    var _countAppointment_true = 0;
    document.getElementById("SumAppointmentDetail").innerHTML = "";
    var _year =  parseInt(year) ;
    if (json_Appointment == null || json_Appointment == ""){
    }else{
        for (var i = 0; i < json_Appointment.length; i++) {

            var AppointmentYear = new Date(json_Appointment[i].visit_date);

            var _AppointmentYear = AppointmentYear.getUTCFullYear();

            if (_year == _AppointmentYear) {

                let current_datetime = new Date(json_Appointment[i].visit_date)
                let _Date_SumAppointment = ("0" + (current_datetime.getDate())).slice(-2) + "-" + ("0" + (current_datetime.getMonth() + 1)).slice(-2) + "-" + current_datetime.getFullYear()

                _count_Appointment = 1 + _count_Appointment;


                if (json_Appointment[i].cal_day >= 0 && json_Appointment[i].cal_day <= 30) {

                    showCal_day = "มาตามนัด"   // แสดงข้อความ

                    _countAppointment_true = 1 + _countAppointment_true;

                } else {

                    showCal_day = "ไม่มาตามนัด"   // แสดงข้อความ
                }


                document.getElementById("SumAppointmentDetail").innerHTML += "<tr><td width='5%'align='center'>" + _Date_SumAppointment + "</td>" +
                    "<td width='5%'align='center'>" + showCal_day + "</td></tr>"
            }
        }
        document.getElementById("SumAppointmentModalLabel").innerHTML = "Appointment Details (" + year + ")"
        document.getElementById("countAppointment").innerHTML = "<b>จำนวนการมาตามนัด : </b>" + _countAppointment_true + " ครั้ง <br>" +
            "<b>จำนวนการนัดทั้งหมด :  </b>" + _count_Appointment + " ครั้ง"

        $('#SumAppointmentModal').modal('show');
    }
}

//ฟังก์แสดงรายชื่อการฉีดยาในปีนั้นๆ Modal
function getFluVaccine_year(year){
    document.getElementById("SumFluVaccineDetail").innerHTML = "";
    var _year =  parseInt(year) ;
    if (json_FluVaccine == null || json_FluVaccine == "") {

    } else {
        for (var i = 0; i < json_FluVaccine.length; i++) {
            var FluVaccineYear = new Date(json_FluVaccine[i].vaccine_date);
            var _FluVaccineYear = FluVaccineYear.getUTCFullYear();
            let _vaccinedate = ("0" + (FluVaccineYear.getDate())).slice(-2) + "-" + ("0" + (FluVaccineYear.getMonth() + 1)).slice(-2) + "-" + FluVaccineYear.getFullYear()
            if (_year == _FluVaccineYear) {
                document.getElementById("SumFluVaccineDetail").innerHTML += "<Strong>Vaccine Name :  </Strong>" + json_FluVaccine[i].Vaccine_Name + "<br><Strong>Date : </Strong>" + _vaccinedate + "<br> ";
            }
        }
        $('#SumFluVaccineModal').modal('show');
    }
}
//ฟังก์ชันแสดงข้อมูลแสดงรายชื่อการฉีดยาในปีนั้นๆ Modal
function getPneuVaccine_year(year){
    console.log(year)
    document.getElementById("SumPneuVaccineDetail").innerHTML = "";
    var _year = parseInt(year);
    if (json_PneuVaccine == null || json_PneuVaccine == "") {

    } else {

        for (var i = 0; i < json_PneuVaccine.length; i++) {

            var PneuVaccineYear = new Date(json_PneuVaccine[i].vaccine_date);

            let _vaccinedate = ("0" + (PneuVaccineYear.getDate())).slice(-2) + "-" + ("0" + (PneuVaccineYear.getMonth() + 1)).slice(-2) + "-" + PneuVaccineYear.getFullYear()

            var _PneuVaccineYear = PneuVaccineYear.getUTCFullYear();

            if (_year == _PneuVaccineYear) {

                document.getElementById("SumPneuVaccineDetail").innerHTML += "<Strong>Vaccine Name :  </Strong>" + json_PneuVaccine[i].Vaccine_Name + "<br><Strong>Date : </Strong>" + _vaccinedate + "<br> ";

            }
        }

        $('#SumPneuVaccineModal').modal('show');

    }
}
//ฟังก์ชันแสดงข้อมูล Modal Detail Blood Pressure  (pressure_max <= 130 || pressure_min <= 80) Modal
function getBPnm_year(year){
    var _countBP_year = 0;
    var _countBP_n = 0 ; 
    document.getElementById("BPDetail").innerHTML = "" 
    // console.log(year)
    for (var i = 0 ; i < json_Lab_DataResult.length ; i++){

        var pressure_max = parseInt(json_Lab_DataResult[i].pressure_max) 
        var pressure_min = parseInt(json_Lab_DataResult[i].pressure_min)     

        var data_date = new Date( json_Lab_DataResult[i].visit_date)

        var create_Date_Data =  data_date.getUTCFullYear(); //วันที่ข้อมูลตามในแต่ละตำแหน่งของ list

        if (create_Date_Data == year){ //แสดงเฉพาะค่าล่าสุด เพราะใน List มีการจัดลำดับตาม ep ที่มาแล้ว 

            _countBP_year = 1 + _countBP_year
            
            if(pressure_max <= 130 || pressure_min <= 80){

                let current_datetime = new Date(json_Lab_DataResult[i].visit_date)
                let _Date_BP = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()

                _countBP_n = 1 + _countBP_n;
                document.getElementById("BPDetail").innerHTML +=    "<tr><td width='5%'align='center'>"+_Date_BP+"</td>" + 
                                                                    "<td width='5%'align='center'>"+json_Lab_DataResult[i].pressure_max+" / "+json_Lab_DataResult[i].pressure_min+"</td></tr>"
            }
        }
    }
    document.getElementById("detailBPModalLabel").innerHTML =  "Blood Pressure Control ("+year+")"
    document.getElementById("countBP").innerHTML =  "<b>จำนวนการวัดความดันตามเกณฑ์ : </b>"+_countBP_n+" ครั้ง <br>" + 
                                                    "<b>จำนวนการวัดความดันทั้งหมด :  </b>"+_countBP_year+" ครั้ง"

    $('#detailBPModal').modal('show');

}
//ฟังก์ชันแสดงข้อมูล Modal Detail Blood Pressure  (pressure_max <= 140 || pressure_min <= 90) Modal
function getBPh_year(year){
    var _countBP_h = 0 ; 
    var _countBP_year = 0;
    document.getElementById("BPDetail").innerHTML = "" 
    for (var i = 0 ; i < json_Lab_DataResult.length ; i++){
        var pressure_max = parseInt(json_Lab_DataResult[i].pressure_max) 
        var pressure_min = parseInt(json_Lab_DataResult[i].pressure_min)     

        var data_date = new Date( json_Lab_DataResult[i].visit_date)

        var create_Date_Data =  data_date.getUTCFullYear(); //วันที่ข้อมูลตามในแต่ละตำแหน่งของ Array

        if (create_Date_Data == year){ //แสดงเฉพาะค่าล่าสุด เพราะใน Array มีการจัดลำดับตาม ep ที่มาแล้ว 

            _countBP_year = 1 + _countBP_year

            if(pressure_max <= 140 || pressure_min <= 90){

                let current_datetime = new Date(json_Lab_DataResult[i].visit_date)
                let _Date_BP = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()

                _countBP_h = 1 + _countBP_h;
                document.getElementById("BPDetail").innerHTML +=    "<tr><td width='5%'align='center'>"+_Date_BP+"</td>" + 
                                                                    "<td width='5%'align='center'>"+json_Lab_DataResult[i].pressure_max+" / "+json_Lab_DataResult[i].pressure_min+"</td></tr>"
            }
        }
    }

    document.getElementById("detailBPModalLabel").innerHTML =  "Blood Pressure ("+year+")"

    document.getElementById("countBP").innerHTML =  "<Strong>จำนวนการวัดความดันตามเกณฑ์ : </Strong>"+_countBP_h+" ครั้ง <br>" + 
                                                    "<Strong>จำนวนการวัดความดันทั้งหมด :  </Strong>"+_countBP_year+" ครั้ง"

    $('#detailBPModal').modal('show');

}
//ฟังก์ชันแสดงข้อมูลการรับประทานยาสม่ำเสมอ Modal
function getMF_year(year){
    var _countMF_year = 0;
    document.getElementById("MFDetail").innerHTML = "" 

    for (var i = 0 ; i < json_Lab_DataResult.length ; i++){
        var data_date = new Date( json_Lab_DataResult[i].visit_date)
        var create_Date_Data =  data_date.getUTCFullYear(); //วันที่ข้อมูลตามในแต่ละตำแหน่งของ Array
        if (create_Date_Data == year){ //แสดงเฉพาะค่าล่าสุด เพราะใน Array มีการจัดลำดับตาม ep ที่มาแล้ว 
            let current_datetime = new Date(json_Lab_DataResult[i].visit_date)
            let _Date_MF = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
            _countMF_year = 1 + _countMF_year
            document.getElementById("MFDetail").innerHTML +=    "<tr><td width='5%'align='center'>"+_Date_MF+"</td>" + 
                                                                    "<td width='5%'align='center'>"+json_Lab_DataResult[i].Medication_frequency+"</td></tr>"

        }
    }
    document.getElementById("detailMFModalLabel").innerHTML =  "การรับประทานยาสม่ำเสมอ ("+year+")"
    document.getElementById("countMF").innerHTML = "<Strong>จำนวนการตรวจบันทึกทั้งหมด :  </Strong>"+_countMF_year+" วัน"
    $('#detailMFModal').modal('show');
}

function getFBS_year(year){
    var _countFBS_year = 0;
    document.getElementById("FBSModalLabel").innerHTML =  "ประเมินเบาหวาน (FBS, HbA1C) ("+year+")"
    document.getElementById("countFBSDetail").innerHTML =  "";
    for (var i = 0 ; i < json_Lab_DataResult.length ; i++){
        //if (create_Date_Data == year){ //แสดงเฉพาะค่าล่าสุด เพราะใน Array มีการจัดลำดับตาม ep ที่มาแล้ว 
            let current_datetime = new Date(json_Lab_DataResult[i].visit_date)
            let _Date_FBS = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
            if(current_datetime.getFullYear() == year)
            {
                if((json_Lab_DataResult[i].Glucose != "")||(json_Lab_DataResult[i].Glucose != ""))
                {
                    _countFBS_year = 1 + _countFBS_year
                    document.getElementById("countFBSDetail").innerHTML +=   "<tr><td width='5%'align='center'>"+_Date_FBS+"</td>" + 
                                                                    "<td width='5%'align='center'>"+json_Lab_DataResult[i].Glucose+"</td>" +
                                                                    "<td width='5%'align='center'>"+json_Lab_DataResult[i].HbA1C+"</td></tr>" 
                } 
            }
    }
    document.getElementById("countFBS").innerHTML = "<Strong>จำนวนการตรวจบันทึกทั้งหมด :  </Strong>"+_countFBS_year+" วัน"
    $('#FBSModal').modal('show');
}

function getLipid_year(year){
    var _countLipid_year = 0;
    document.getElementById("LipidModalLabel").innerHTML =  "ประเมินระดับ Lipid Profile(Lipid,LDL) ("+year+")"
    document.getElementById("countLipidDetail").innerHTML =  "";
    for (var i = 0 ; i < json_Lab_DataResult.length ; i++){
        //if (create_Date_Data == year){ //แสดงเฉพาะค่าล่าสุด เพราะใน Array มีการจัดลำดับตาม ep ที่มาแล้ว 
            let current_datetime = new Date(json_Lab_DataResult[i].visit_date)
            let _Date_Lipid = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
            if(current_datetime.getFullYear() == year)
            {
                if((json_Lab_DataResult[i].Cholesterol != "")||(json_Lab_DataResult[i].LDL_Direct != ""))
                {
                _countLipid_year = 1 + _countLipid_year
                document.getElementById("countLipidDetail").innerHTML +=   "<tr><td width='5%'align='center'>"+_Date_Lipid+"</td>" + 
                                                                    "<td width='5%'align='center'>"+json_Lab_DataResult[i].Cholesterol+"</td>" +
                                                                    "<td width='5%'align='center'>"+json_Lab_DataResult[i].LDL_Direct+"</td></tr>"  
                }
            }
    }
    document.getElementById("countLipid").innerHTML = "<Strong>จำนวนการตรวจบันทึกทั้งหมด :  </Strong>"+_countLipid_year+" วัน"
    $('#LipidModal').modal('show');
}

function getCr_year(year){
    var _countCR_year = 0;
    document.getElementById("CrModalLabel").innerHTML =  "ประเมินการทำงานของไต (Cr, GFR) ("+year+")"
    document.getElementById("countCrDetail").innerHTML =  "";
    for (var i = 0 ; i < json_Lab_DataResult.length ; i++){
        //if (create_Date_Data == year){ //แสดงเฉพาะค่าล่าสุด เพราะใน Array มีการจัดลำดับตาม ep ที่มาแล้ว 
            let current_datetime = new Date(json_Lab_DataResult[i].visit_date)
            let _Date_Cr = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
            if(current_datetime.getFullYear() == year)
            {
                if((json_Lab_DataResult[i].Creatinine != "")||(json_Lab_DataResult[i].Creatinine_GFR != ""))
                {
                _countCR_year = 1 + _countCR_year
                document.getElementById("countCrDetail").innerHTML +=   "<tr><td width='5%'align='center'>"+_Date_Cr+"</td>" + 
                                                                    "<td width='5%'align='center'>"+json_Lab_DataResult[i].Creatinine+"</td>" +
                                                                    "<td width='5%'align='center'>"+json_Lab_DataResult[i].Creatinine_GFR+"</td></tr>"  
                }
            }
    }
    document.getElementById("countCr").innerHTML = "<Strong>จำนวนการตรวจบันทึกทั้งหมด :  </Strong>"+_countCR_year+" วัน"
    $('#CrModal').modal('show');
}

function getProteinuria_year(year){
    var _countProteinuria_year = 0;
    document.getElementById("ProteinuriaModalLabel").innerHTML =  "ประเมินการทำงานของไต (Proteinuria/MAU) ("+year+")"
    document.getElementById("countProteinuriaDetail").innerHTML =  "";
    for (var i = 0 ; i < json_Lab_DataResult.length ; i++){
        //if (create_Date_Data == year){ //แสดงเฉพาะค่าล่าสุด เพราะใน Array มีการจัดลำดับตาม ep ที่มาแล้ว 
            let current_datetime = new Date(json_Lab_DataResult[i].visit_date)
            let _Date_Proteinuria = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
            if(current_datetime.getFullYear() == year)
            {
                if((json_Lab_DataResult[i].UrineProtein != ""))
                {
                _countProteinuria_year = 1 + _countProteinuria_year
                document.getElementById("countProteinuriaDetail").innerHTML +=   "<tr><td width='5%'align='center'>"+_Date_Proteinuria+"</td>" + 
                                                                    "<td width='5%'align='center'>"+json_Lab_DataResult[i].UrineProtein+"</td></tr>"  
                }
            }
    }
    document.getElementById("countProteinuria").innerHTML = "<Strong>จำนวนการตรวจบันทึกทั้งหมด :  </Strong>"+_countProteinuria_year+" วัน"
    $('#ProteinuriaModal').modal('show');
}

function getEKG_year(year){
    var _countEKG_year = 0;
    document.getElementById("EKGModalLabel").innerHTML =  "EKG ("+year+")"
    document.getElementById("countEKGDetail").innerHTML =  "";
    for (var i = 0 ; i < json_Xray_DataResult.length ; i++){
        //if (create_Date_Data == year){ //แสดงเฉพาะค่าล่าสุด เพราะใน Array มีการจัดลำดับตาม ep ที่มาแล้ว 
            let current_datetime = new Date(json_Xray_DataResult[i].visit_date)
            let _Date_EKG = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
            if(current_datetime.getFullYear() == year)
            {
                if((json_Xray_DataResult[i].EKG != ""))
                {
                _countEKG_year = 1 + _countEKG_year
                document.getElementById("countEKGDetail").innerHTML +=   "<tr><td width='5%'align='center'>"+_Date_EKG+"</td>" + 
                                                                    "<td width='5%'align='center'>"+json_Xray_DataResult[i].EKG+"</td></tr>"  
                }
            }
    }
    document.getElementById("countEKG").innerHTML = "<Strong>จำนวนการตรวจบันทึกทั้งหมด :  </Strong>"+_countEKG_year+" วัน"
    $('#EKGModal').modal('show');
}

function getEcho_year(year){
    var _countEcho_year = 0;
    document.getElementById("EchoModalLabel").innerHTML =  "Echo : If LVH in EKG ("+year+")"
    document.getElementById("countEchoDetail").innerHTML =  "";
    for (var i = 0 ; i < json_Xray_DataResult.length ; i++){
        //if (create_Date_Data == year){ //แสดงเฉพาะค่าล่าสุด เพราะใน Array มีการจัดลำดับตาม ep ที่มาแล้ว 
            let current_datetime = new Date(json_Xray_DataResult[i].visit_date)
            let _Date_Echo = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
            if(current_datetime.getFullYear() == year)
            {
                if((json_Xray_DataResult[i].Echo != ""))
                {
                    _countEcho_year = 1 + _countEcho_year
                document.getElementById("countEchoDetail").innerHTML +=   "<tr><td width='5%'align='center'>"+_Date_Echo+"</td>" + 
                                                                    "<td width='5%'align='center'>"+json_Xray_DataResult[i].EKG+"</td></tr>"  
                }
            }
    }
    document.getElementById("countEcho").innerHTML = "<Strong>จำนวนการตรวจบันทึกทั้งหมด :  </Strong>"+_countEcho_year+" วัน"
    $('#EchoModal').modal('show');
}

function getCAC_year(year){
    var _countCACs_year = 0;
    document.getElementById("CACsModalLabel").innerHTML =  "Coronary calcium scoring (CACs) ("+year+")"
    document.getElementById("countCACsDetail").innerHTML =  "";
    for (var i = 0 ; i < json_Xray_DataResult.length ; i++){
        //if (create_Date_Data == year){ //แสดงเฉพาะค่าล่าสุด เพราะใน Array มีการจัดลำดับตาม ep ที่มาแล้ว 
            let current_datetime = new Date(json_Xray_DataResult[i].visit_date)
            let _Date_CACs = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
            if(current_datetime.getFullYear() == year)
            {
                if((json_Xray_DataResult[i].CACs != ""))
                {
                    _countCACs_year = 1 + _countCACs_year
                    document.getElementById("countCACsDetail").innerHTML +=   "<tr><td width='5%'align='center'>"+_Date_CACs+"</td>" + 
                                                                    "<td width='5%'align='center'>"+json_Xray_DataResult[i].CACs+"</td></tr>"  
                }
            }
    }
    document.getElementById("countCACs").innerHTML = "<Strong>จำนวนการตรวจบันทึกทั้งหมด :  </Strong>"+_countCACs_year+" วัน"
    $('#CACsModal').modal('show');
}

function getABI_year(year){
    var _countABI_year = 0;
    document.getElementById("ABIModalLabel").innerHTML =  "ABI/CAVI ("+year+")"
    document.getElementById("countABIDetail").innerHTML =  "";
    for (var i = 0 ; i < json_Xray_DataResult.length ; i++){
        //if (create_Date_Data == year){ //แสดงเฉพาะค่าล่าสุด เพราะใน Array มีการจัดลำดับตาม ep ที่มาแล้ว 
            let current_datetime = new Date(json_Xray_DataResult[i].visit_date)
            let _Date_ABI = ("0"+(current_datetime.getDate())).slice(-2) + "-" + ("0"+(current_datetime.getMonth()+1)).slice(-2) + "-" + current_datetime.getFullYear()
            if(current_datetime.getFullYear() == year)
            {
                if((json_Xray_DataResult[i].ABI != "")||(json_Xray_DataResult[i].CAVI != ""))
                {
                    _countABI_year = 1 + _countABI_year
                    document.getElementById("countABIDetail").innerHTML +=   "<tr><td width='5%'align='center'>"+_Date_ABI+"</td>" + 
                                                                    "<td width='5%'align='center'>"+json_Xray_DataResult[i].ABI+"</td>"  +
                                                                    "<td width='5%'align='center'>"+json_Xray_DataResult[i].CAVI+"</td></tr>"  
                }
            }
    }
    document.getElementById("countABI").innerHTML = "<Strong>จำนวนการตรวจบันทึกทั้งหมด :  </Strong>"+_countABI_year+" วัน"
    $('#ABIModal').modal('show');
}





 

