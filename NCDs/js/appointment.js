//ฟังก์ชันดึงข้อมูลคนไข้ที่มีนัด
function _appointmentList(){
    //$('#ModalWait').modal('show');
    $.ajax({
        type: "GET",
        url: "http://localhost:7500/appointment/data",
        dataType: 'json',
        success: function (response) {
            if (response == ""){
                document.getElementById('example').innerHTML = "";
                document.getElementById('example').innerHTML = "<h3 align='Center'>ไม่มีการบันทึกข้อมูล</h3>";
            } else {
                departtshort = document.getElementById("OpDeparttment").value;
                if (departtshort === "Select"){
                    console.log(departtshort)
                    result = response
                }else{
                result = response.filter((response) => {
                    return response.departtment == departtshort;
                    });
                }
                var datatable = $('#example').DataTable({
                    destroy: true,
                    "data": result,
                    //"order": [[ 9, "asc" ]],
                    "columns": [
                        { "data": "hn"},
                        { "data": "name"},
                        { "data": "doctor" },
                        { "data": "departtment" },
                        { "data": "mobile" },
                        { "data": "email" },
                        { "data": "province" },
                        { "data": "lastvisitdate" },
                        { "data": "lostday" },
                    ],
                    "dom": 'Bfrtip',
                    "buttons": [
                        'copyHtml5',
                        'excelHtml5',
                        'csvHtml5',
                        'pdfHtml5']
                });
            }
            $('#ModalWait').modal('hide');
        },error: function (jqXHR, xhr, ajaxOptions, thrownError) {
            console.log("failed, error is '" + thrownError + "'");
            alert("Recrive Patients data failed, error is '" + thrownError + "'");
        }
    });  
}
var departtshort
function departtment(){
    $.ajax({
        type: "GET",
        url: "http://localhost:7500/appointment/data",
        dataType: 'json',
        success: function (response) {
            var selectsetOpDeparttment = document.getElementById("OpDeparttment");
            var option = document.createElement("option");
            option.text = "Select";
            OpDeparttment.add(option, OpDeparttment[0]);
            const result = response.filter((response) => {
                return response.departtment
            })
            for (var i = 0; i < result.length; i++) {
                var option = document.createElement("option");
                option.text = result[i].departtment;
                OpDeparttment.add(option, OpDeparttment[i+1]);
            }
        }
    });  
}