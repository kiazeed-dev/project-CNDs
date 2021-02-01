function test(){

    $.ajax({
        type: "GET",
        url: "https://localhost:44306/api/Config?Disease=alldisease",
        dataType: 'json',
        success: function (response) {

    var json_diseasedetail = JSON.parse(response);
    var namelabel = "";

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