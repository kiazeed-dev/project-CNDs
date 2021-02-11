//ฟังก์ชันแก้ไขข้อมูล BaseInfo
// function UpdateBaseInfo(){
//     var inputHN = sessionStorage.hncode;
//     // updateHTRegistry(inputHN,sessionStorage.userID,drcase)
//     var str_cvrisk_data = false;

    // var sometinglikeData_Type_Json = function checked_data () {

    //     var data = {
    //         Disease : []
    //     };

    //     for (var index = 0; index < eiei.length; index++) {
    //         var diseaseid = eiei[index].disease_id;
    //         var diseasedetailid = eiei[index].diseasedetail_id;
    //         // var diseasedetailType = eiei[index].diseasedetail_Type;

    //         if ([index] == 0) {
    //             var newdata = {
    //                 [diseaseid] : [
    //                     {[diseaseid] : document.getElementById([diseaseid]).value},
    //                     {[diseasedetailid] : document.getElementById([diseasedetailid]).value}
    //                 ]
    //             }
    //             data.Disease.push(newdata)
    //             // console.log(data)
    //             return JSON.stringify(data)

    //         } else if (eiei[index].disease_id == eiei[index-1].disease_id){

//                 newdescription = {[diseasedetailid] : document.getElementById([diseasedetailid]).value}
                    
//                 data.Disease[data.Disease.length-1][diseaseid].push(newdescription)
//                 // console.log(data)
//                 return JSON.stringify(data)
//             } else {
                
//                 var newdatanew = {
//                     [diseaseid] : [
//                         {[diseaseid] : document.getElementById([diseaseid]).value},
//                         {[diseasedetailid] : document.getElementById([diseasedetailid]).value}
//                     ]
//                 }
//                 data.Disease.push(newdatanew)
//                 // console.log(newdatanew)
//                 return JSON.stringify(data)
//             }
//         }
//     }
    
//     var formdata = {
//         "_hncode": sessionStorage.hncode,
//         "_TopicDataJson" : sometinglikeData_Type_Json,
//         "_update_by" : sessionStorage.userID,
//         "_ht_siteid" : sessionStorage.userSITE
//     }
// 6
//     $.ajax({
//         type: "POST",
//         url: "https://localhost:44306/api/Disease",
//         dataType: 'json',
//         data: formdata,
//         success: function (data) {
//             $('#confirm_editModal').modal('hide');
//             toastr.success('แก้ไขข้อมูลสำเร็จ');
//             // getCv_Risk()
//         },
//         error: function (jqXHR, xhr, ajaxOptions, thrownError) {
//             toastr.error('แก้ไขข้อมูลไม่สำเร็จ');
//         }
//     });

// }