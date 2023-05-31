


function showResult(str) {
    if(str.length==0) {
        document.getElementById("livesearch").innerHTML = "";
        document.getElementById("livesearch").style.border ="0px";
        return;
    }
    $.ajax({
        url: `/api/search?name=${str}`,
        type: "GET",
        success: (response) => {
            console.log(response.data)
            let html = response.data.map(item=>(`
                <div class="findSearch" style="border:1px solid #ccc;margin: 6px 2px">
                    <p style="margin:2px 4px">
                        Mã đất: ${item.ma_memo}
                    </p>
                    <p style="margin:2px 4px">
                        Diện tích: ${parseFloat(item?.shape_area).toFixed(2)}m\u00B2
                    </p>
                    <a href='javascript:void(0);'style="margin:2px 4px" onclick='di_den_diem(${item.x},${item.y},${item.xtb},${item.ytb},${item.xmin},${item.ymin})'>Xem ngay</a>
                </div>`
            ))
            $('#livesearch')[0].innerHTML = html.join("");
            // $('#livesearch').css('border', '1px solid #A5ACB2');
            
            $('#livesearch').css('overflow-y', 'scroll');
            $('#livesearch').css('height',$("#map")[0].clientHeight );
        },
        error: (err) => {
            console.log(err)
        }
    })

}