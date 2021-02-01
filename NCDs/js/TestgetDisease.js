function getCv_Risk(){

    clear_cvrisk()

    var cv_risk_list = "";

        if (sessionStorage.hncode != null || sessionStorage.hncode != ""){
    
            $.ajax({
    
                type: "GET",
                url: "https://localhost:44306/api/CVLAB?hncode="+sessionStorage.hncode,
                dataType: 'json',
                success: function (response) {

                    if (response == null || response == ""){

                        document.getElementById("colum_cvriskname").innerHTML =   ""

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
                            url: "https://localhost:44306/api/Disease?Hn="+sessionStorage.hncode,
                            dataType: 'json',
                            success: function (data) {

                                if (data == ""){
                    
                                    document.getElementById("BaseCheck").innerHTML = "<button type='button' class='btn btn-primary' onclick='submitData_Patient()'>SAVE</button>"
                    
                                    document.getElementById("bl_hypertension_year").value = '';   
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

                                    $("").prop("checked", false)

                                    console.log("null")
                                }else{
                    
                                    var json_response =  JSON.parse(data)
                    
                                    var response = json_response[0]
                    
                                    if (response != "error"){
                                    
                                        document.getElementById("BaseCheck").innerHTML =  "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#confirm_editModal' >EDIT</button>"
                                        document.getElementById("bl_hypertension_year").setAttribute("value",response.bl_hypertension_year);
                                        document.getElementById("sc_other").innerHTML = (response.sc_other);
                             
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

                                        //แสดงการ Check  True/False
                                        $( "#bl_unknow" ).prop( "checked", response.bl_unknow )
                                        $( "#bl_resistant_hypertension" ).prop( "checked", response.bl_resistant_hypertension )
                                        $( "#cv_dm" ).prop( "checked", response.cv_dm )
                                        $( "#cv_dlp" ).prop( "checked", response.cv_dlp )
                                        $( "#cv_smoking" ).prop( "checked", response.cv_smoking )
                                        $( "#cv_cda" ).prop( "checked", response.cv_cda )
                                        $( "#od_af" ).prop( "checked", response.od_af )
                                        $( "#od_copd" ).prop( "checked", response.od_copd )
                                        $( "#od_gout" ).prop( "checked", response.od_gout )
                                        $( "#sc_osa" ).prop( "checked", response.sc_osa )
                    
                                        //set ค่า BaseInfo ให้ value เป็นค่าตามที่เรียกข้อมูลมาแสดง
                                        document.getElementById("bl_unknow").setAttribute("value",response.bl_unknow)
                                        document.getElementById("bl_resistant_hypertension").setAttribute("value",response.bl_resistant_hypertension)
                                        document.getElementById("cv_dm").setAttribute("value",response.cv_dm)
                                        document.getElementById("cv_dlp").setAttribute("value",response.cv_dlp )
                                        document.getElementById("cv_smoking").setAttribute("value",response.cv_smoking )
                                        document.getElementById("cv_cda").setAttribute("value",response.cv_cda)
                                        document.getElementById("od_af").setAttribute("value",response.od_af)
                                        document.getElementById("od_copd").setAttribute("value",response.od_copd)
                                        document.getElementById("od_gout").setAttribute("value",response.od_gout )
                                        document.getElementById("sc_osa").setAttribute("value", response.sc_osa)
                    
 
                                        if (response.sc_other == "" || response.sc_other == null){
                                        
                                        }else{
                    
                                            $( "#checkboxOther" ).prop( "checked", true )
                                            ck_Other()
                    
                                        }
                                    }else{
                    
                                        document.getElementById("bl_hypertension_year").value = '';
                                        document.getElementById("sc_other").innerHTML = "";
                                        document.getElementById("cvrisk_date").value = '';
                                        document.getElementById("cvrisk_percent").value = '';
                                        document.getElementById("cvrisk_multiply").value = '';   
                    
                                        $( "#bl_unknow" ).prop( "checked", false )
                                        $( "#bl_resistant_hypertension" ).prop( "checked", false )
                                        $( "#cv_dm" ).prop( "checked", false )
                                        $( "#cv_dlp" ).prop( "checked", false)
                                        $( "#cv_smoking" ).prop( "checked", false)
                                        $( "#cv_cda" ).prop( "checked", false )
                                        $( "#od_af" ).prop( "checked", false)
                                        $( "#od_copd" ).prop( "checked", false)
                                        $( "#od_gout" ).prop( "checked", false )
                                        $( "#sc_osa" ).prop( "checked", false)
                    
                                        $( "#checkboxOther" ).prop( "checked", false )
                                        ck_Other()
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