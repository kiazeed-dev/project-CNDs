function submitData_Test() { //บันทึกข้อมูลพื้นฐานของคนไข้ 
    var drcase = document.getElementById("selectsetDoctorcase").value;
    var inputHN = sessionStorage.hncode;

    updateHTRegistry(inputHN,sessionStorage.userID,drcase)

    var str_cvrisk_data = false;

    //Get ข้อมูลเพื่อเช็คข้อมูลซ้ำใน Database OutStanding
    $.ajax({
        type: "GET",
        url: "https://localhost:44306/api/Disease?Hn="+sessionStorage.hncode,
        dataType: 'json',
        // contentType: 'application/json; charset=utf-8',
        success: function (data) {

            var disease_json = JSON.parse(data);
            var data_json = JSON.parse(disease_json);

            console.log(data_json)

            if (data_json == ""){ 

                $.ajax({
                    type: "GET",
                    url: "https://localhost:44306/api/Config?Disease=alldisease",
                    dataType: 'json',
                    success: function (iddata) {
                        var IdData = JSON.parse(iddata);

                        for (let i = 0; i < IdData.length; i++ ) {
                            var Diseaseid = IdData[i].disease_id;
                            var Diseasedetailid = IdData[i].diseasedetail_id;

                            var formdata = {
                                document.getElementById(Diseaseid).checked
                            }
                        }
                    }
                })


                $.ajax({
                    
                    type: "POST",
                    url: "http://172.18.62.245/HTApi/api/Data_personnal/",
                    dataType: 'json',
                    data: formdata,
                    // contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                      
                        // alert("บันทึกข้อมูลสำเร็จ")

                        toastr.success('บันทึกข้อมูลสำเร็จ')
                        getCv_Risk()

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
                                "_update_by" : sessionStorage.userID
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
    
                    var formdata = {
                        "_hncode": sessionStorage.hncode,
                        "_first_clinic_visit": document.getElementById('date_first_visit').value , 
                        "_bl_hypertension_year":  document.getElementById('bl_hypertension_year').value , 
                        "_bl_unknow": document.getElementById('bl_unknow').checked , 
                        "_bl_resistant_hypertension": document.getElementById('bl_resistant_hypertension').checked,
                        "_cv_dm": document.getElementById('cv_dm').checked,
                        "_cv_dlp": document.getElementById('cv_dlp').checked,
                        "_cv_smoking": document.getElementById('cv_smoking').checked,
                        "_cv_cda": document.getElementById('cv_cda').checked,
                        "_od_af": document.getElementById('od_af').checked,
                        "_od_copd": document.getElementById('od_copd').checked,
                        "_od_gout": document.getElementById('od_gout').checked,
                        "_sc_osa": document.getElementById('sc_osa').checked,
                        "_sc_other": document.getElementById('sc_other').checked,
                        "_update_by": sessionStorage.userID
                    }
                     
                      $.ajax({
                    
                        type: "POST",
                        url: "http://172.18.62.245/HTApi/api/Data_personnal/",
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
                }else{
                
                    alert("มีการบันทึกข้อมูลคนไข้แล้ว")
                }
            }
            
          },
          error: function (jqXHR, xhr, ajaxOptions, thrownError) {
              // console.log("Add new product failed, error is '" + thrownError + "'");
          }
      });
}
