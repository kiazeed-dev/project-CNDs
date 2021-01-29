//ฟังก์ชันดึงข้อมูลคนไข้ที่มีการบันทึกข้อมูลไว้แล้วห
function _hypertensionList(){
    $.ajax({
        type: "GET",
        url: "http://localhost:7500/hypertension-l/data",
        dataType: 'json',
        success: function (response) {
            if (response == ""){
                document.getElementById('example').innerHTML = "";
                document.getElementById('example').innerHTML = "<h3 align='Center'>ไม่มีการบันทึกข้อมูล</h3>";
            } else {
                var json_test = JSON.stringify(response);
                var json_patientList =JSON.parse(json_test);
                var datatable = $('#example').DataTable({
                    "data": json_patientList,
                    //"order": [[ 4, "desc" ]],
                    "columns": [
                        {"data": "Register_RowId"},
                        { "data": "patient_hn", render: function (data, type, row, meta) {
                            return type === 'display' ?
                                '<a href ="index.html#'+row.patient_hn+'"><p type="checkbox" id="'+row.patient_hn +'" onclick="view_DataPatient(id)">'+row.patient_hn+'</p></a>' : data;
                            }}, 
                            {"data": "dateforregister"},
                            { "data": "name" },
                            { "data": "sex" },
                            { "data": "age" },  
                            { "data": "nation" },
                            { "data": "ht" },
                            { "data": "dlp" },
                            { "data": "dm" },
                            { "data": "af" },
                            { "data": "cad" },
                            { "data": "copd" }, 
                            { "data": "stroke" },
                            { "data": "ckd" },
                            { "data": "goht" },
                            { "data": "famihx" },
                            { "data": "smoking" },
                            { "data": "other" },
                            { "data": "doctorcase",render: function (data, type, row, meta) {
                                return type === 'display' ?
                                '(' + row.diseasename + ') - ' + row.doctorcase : data;
                                }}, 

                            { "data": "currentmedicine" },
                            { "data": "bw" },
                            { "data": "bmi" },
                            { "data": "wc" },
                            { "data": "pressure_max" },
                            { "data": "pressure_min" },
                            { "data": "home_bp" },
                            { "data": "pulse" },
                            { "data": "ekg" },
                            { "data": "abi/cavi" },
                            { "data": "echo" },
                            { "data": "cacs" },
                            { "data": "cholesterol" },
                            { "data": "triglyceride" },
                            { "data": "hdl" },
                            { "data": "ldl_direct" },
                            { "data": "ldl" },
                            { "data": "glucose" },
                            { "data": "hba1c" },
                            { "data": "uric" },
                            { "data": "creatinine" },
                            { "data": "creatinine_gfr" },
                            { "data": "urineprotein" },
                            { "data": "urinemicroalbumin" },
                            { "data": "hb" },
                            { "data": "hematocrit" },
                            { "data": "sodium" },
                            { "data": "potassium" },
                            { "data": "nextplan/investtigate/consult" },
                            { "data": "nextdateappointment" },
                    ],
                    "dom": 'Bfrtip',
                    "buttons": [
                        'copyHtml5',
                        'excelHtml5',
                        'csvHtml5',
                        'pdfHtml5']
                });
            }
        }, error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                console.log("failed, error is '" + thrownError + "'");
                alert("Recrive Patients data failed, error is '" + thrownError + "'");
        }
    });  
}
function _hypertensionListbydate(){
    var startdate = document.getElementById('dateStartdate').value;
    var enddate = document.getElementById('dateEnddate').value;
    $('#ModalWait').modal('show');
    $.ajax({
        type: "GET",
        url: "http://172.18.62.245/HTApi/api/HTRegistry?hncode=all&startdate="+startdate+"&enddate="+enddate,
        dataType: 'json',
        success: function (response) {
            if (response == ""){
                document.getElementById('example').innerHTML = "";
                document.getElementById('example').innerHTML = "<h3 align='Center'>ไม่มีการบันทึกข้อมูล</h3>";
            } else {
                var json_patientList =JSON.parse(response);
                var datatable = $('#example').DataTable({
                    "data": json_patientList,
                    //"order": [[ 4, "desc" ]],
                    "columns": [
                        {"data": "Register_RowId"},
                        { "data": "patient_hn", render: function (data, type, row, meta) {
                            return type === 'display' ?
                                '<a href ="index.html#'+row.patient_hn+'"><p type="checkbox" id="'+row.patient_hn +'" onclick="view_DataPatient(id)">'+row.patient_hn+'</p></a>'  :
                                data;
                            }},
                            {"data": "create_date"},
                            { "data": "Name" },
                            { "data": "Sex" },
                            { "data": "Age" },
                            { "data": "Nation" },
                            { "data": "HT" },
                            { "data": "DLP" },
                            { "data": "DM" },
                            { "data": "AF" },
                            { "data": "CAD" },
                            { "data": "COPD" },
                            { "data": "Stroke" },
                            { "data": "CKD" },
                            { "data": "Gout" },
                            { "data": "FamiHX" },
                            { "data": "Smoking" },
                            { "data": "Other" },
                            { "data": "doctorcase" },
                            { "data": "Current_medicine" },
                            { "data": "weight" },
                            { "data": "bmi" },
                            { "data": "wc" },
                            { "data": "pressure_max" },
                            { "data": "pressure_min" },
                            { "data": "home_bp" },
                            { "data": "pulse" },
                            { "data": "EKG" },
                            { "data": "ABICAVI" },
                            { "data": "Echo" },
                            { "data": "CACs" },
                            { "data": "Cholesterol" },
                            { "data": "Triglyceride" },
                            { "data": "HDL" },
                            { "data": "LDL_Direct" },
                            { "data": "LDL" },
                            { "data": "Glucose" },
                            { "data": "HbA1C" },
                            { "data": "Uric" },
                            { "data": "Creatinine" },
                            { "data": "Creatinine_GFR" },
                            { "data": "UrineProtein" },
                            { "data": "UrineMicroalbumin" },
                            { "data": "Hb" },
                            { "data": "Hematocrit" },
                            { "data": "Sodium" },
                            { "data": "Potassium" },
                            { "data": "nextplan" },
                            { "data": "nextdate" },
                    ],
                    "dom": 'Bfrtip',
                    "bDestroy": true,
                    "buttons": [
                        'copyHtml5',
                        'excelHtml5',
                        'csvHtml5',
                        'pdfHtml5']
                });
            }
            $('#ModalWait').modal('hide');
        }, error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                console.log("failed, error is '" + thrownError + "'");
                alert("Recrive Patients data failed, error is '" + thrownError + "'");
        }
    });  
}
function searchhypertensionlist(){
    _hypertensionList()
}