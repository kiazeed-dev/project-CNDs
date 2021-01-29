//ฟังก์ชันดึงข้อมูลคนไข้ที่มีการบันทึกข้อมูลไว้แล้วห
function _patientList(){
    $('#ModalWait').modal('show');
    $.ajax({
        type: "GET",
        url: "http://localhost:7500/patient/data",
        dataType: 'json',

        success: function (response) {

        if (response == ""){

            document.getElementById('example').innerHTML = "";
            document.getElementById('example').innerHTML = "<h3 align='Center'>ไม่มีการบันทึกข้อมูล</h3>";

        } else {
            var test = JSON.stringify(response)
            var json_patientList =JSON.parse(test);
            var datatable = $('#example').DataTable({
                "data": json_patientList,
                "order": [[ 5, "desc" ]],
                "columns": [
                    { "data": "register_rowid" },
                    { "data": "patient_hncode", render: function (data, type, row, meta) {
                            return type === 'display' ?
                                '<a href ="index.html#'+row.patient_hncode+'"><p type="checkbox" id="'+row.patient_hncode +'" onclick="view_DataPatient(id)">'+row.patient_hncode+'</p></a>'  :
                                data;
                        }
                    },
                    { "data": "patient_name" },
                    { "data": "patient_dob" },
                    { "data": "patient_age" },
                    { "data": "create_date" },
                    { "data": "statusfollow", render: function (data, type, row, meta) {
                        return type === 'display' ?
                            '<button type="button" id='+row.patient_hncode+' onclick="updateFollow(this.id)">'+row.statusfollow+'</button>'  :
                            data;
                    } },
                    { "data": "follownote" },
                ],
                "dom": 'Bfrtip',
                "buttons": [
                        'copyHtml5',
                        'excelHtml5',
                        'csvHtml5',
                        'pdfHtml5'
                    ]
            });
            
        }
        $('#ModalWait').modal('hide');
        }, error: function (jqXHR, xhr, ajaxOptions, thrownError) {
                    console.log("failed, error is '" + thrownError + "'");
                    alert("Recrive Patients data failed, error is '" + thrownError + "'");
                }
        });  
}
function updateFollow(hncode)
{
    $.ajax({
        type: "PUT",
        url: "http://localhost:7500/patient/data/hncode="+hncode,
        dataType: 'json',
        success: function (response) {
            if (response == ""){
            }
            elsej7
            {
                var json_patientList =JSON.parse(response);
                
                if(json_patientList[0]["Follow"] != false)
                {
                    $('#confirm_updateModal').modal('show');
                    document.getElementById("hiddenhn").value = hncode;
                }
                else
                {
                    Followactivenote(hncode,"");
                }
            }
        },
        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
            location.reload();
            console.log(" failed, error is '" + thrownError + "'");
        }
    });
}

function Followactivenote(hncode,reason)
{
    var radios = document.getElementsByName('cause');
    var reason = "";
    for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
        reason = radios[i].value + ' '+ document.getElementById("othernote").value
        break;
    }
}
    $.ajax({
        type: "POST",
        url: "http://172.18.62.245/HTApi/api/HTRegistry?hncode="+hncode+"&reason="+reason,
        dataType: 'json',
        success: function (response) {
            location.reload();
        },
        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
            location.reload();
            console.log(" failed, error is '" + thrownError + "'");
        }
    });
}
function Follownote(hncode,reason)
{
    $.ajax({
        type: "POST",
        url: "http://172.18.62.245/HTApi/api/HTRegistry?hncode="+hncode+"&reason="+reason,
        dataType: 'json',
        success: function (response) {
            location.reload();
        },
        error: function (jqXHR, xhr, ajaxOptions, thrownError) {
            location.reload();
            console.log(" failed, error is '" + thrownError + "'");
        }
    });
}
function view_DataPatient(id){
    console.log(id)
}
