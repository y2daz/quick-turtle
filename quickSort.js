/**
 * Created by Yazdaan Alimudeen on 25/08/14.
 * IT 13001308
 */

$(document).ready(function(){

    var myEasing = "swing"; ///Animation easing
    var sortArray = new Array();
    var arrSize;
    var pQueue = [];
    var qQueue = [];
    var pause = false;
    var speed = 1000;

    $(".note").hide();  ///Hides error message span

    $('#speed').on('change', function(){  ///Changes the animation speed with user's choice.
        speed = parseInt($(this).val());
        if (speed < 200)
        {
            $(".note").show();
        }
        else
        {
            $(".note").hide();
        }
    }) ///Changes the animation speed with user's choice.

    $('#noofItems').on('input', function(){ //Detects change in the number of values
        $('#btnItemCount').click();
    }); ///Detects change in the number of values

    $(document).on("input propertychange paste", "input.value", function() { //Detects changes in the array value text boxes and reflects them in our array
        refreshArray();
    }); ///Detects changes in the array value text boxes and reflects them in our array

    function refreshArray(){ //Updates values in our array to the ones input by the user
        $('.value').each( function(i, obj){
            var temp = this.id.split("_");
            var num = temp[1];

            sortArray[num] = parseInt(this.value);
            putSortingDiv();
        })
    } ///Updates values in our array to the ones input by the user

    function putSortingDiv(){   //Puts values in our array to the divs for animation
        var i, number = $(".value").length;
        var nextDiv;
        var myDiv = document.createElement("div");

        for(i = 0; i < number; i++)
        {
            nextDiv = document.createElement("div");
            nextDiv.innerHTML = sortArray[i];
            $(nextDiv).addClass("moveDiv");
            $(nextDiv).attr('id', i);
            myDiv.appendChild(nextDiv);
        }

        var oldDiv = document.getElementById("sorting");
        myDiv.id = "sorting";

        $(oldDiv).replaceWith(myDiv);
        $('#sorting').hide();
    } ///Puts values in our array to the divs for animation

    function execAnimQueue(){ ///De-queues queued swaps for animation purposes

        var thisRowP = pQueue.shift().split("_");
        var p = parseInt( thisRowP[0] );
        var thisRowQ = qQueue.shift().split("_");
        var q = parseInt( thisRowQ[0] );

        var number = $('.moveDiv').length;
        var i;

        $(".currentArr").removeClass("currentArr");
        $(".moveDiv").removeClass("moving");
        for(i = parseInt( thisRowP[1] ); i <= parseInt( thisRowQ[1] ); i++ )
        {
            $("#" + i).addClass("currentArr");
        }

        $("#" + p).addClass("moving");
        $("#" + q).addClass("moving");


            var thisStyle1 = {"top" : "+=80px"};
            var thisStyle2 = {"top" : "+=50px"};

            $("#" + p).animate( thisStyle1, speed, myEasing);

            $("#" + q).animate( thisStyle2, speed, myEasing, function(){

                var leftQ = ( ( q + 1) * 100 / (number + 1)).toString() + "%";
                thisStyle1 = {"left" : "" + leftQ};
                $("#" + p).animate( thisStyle1, 1.3 * speed, myEasing);

                var leftP = ( ( p + 1) * 100 / (number + 1)).toString() + "%";
                thisStyle2 = {"left" : "" + leftP};
                $("#" + q).animate( thisStyle2, 1.3 * speed, myEasing, function(){

                    var thisStyle1 = {"top" : "-=80px"};
                    $("#" + p).animate( thisStyle1, speed, myEasing);

                    thisStyle2 = {"top" : "-=50px"};
                    $("#" + q).animate( thisStyle2, speed, myEasing, function(){

                        var tempOb = 0;
                        var pOb = $("#" + p);
                        var qOb = $("#" + q);

                        tempOb = $(pOb).attr("id");
                        $(pOb).attr( "id", $(qOb).attr("id"));
                        $(qOb).attr( "id", tempOb);

                        $("#btnPause").attr("disabled", false);

                            if(pQueue.length > 0){
                                if(pause == false)
                                {
                                    execAnimQueue();
                                }
                            }
                            else{
                                $(".moveDiv").addClass("currentArr");
                                $(":button").attr("disabled", false);
                                $("#btnPause").attr("disabled", true);
                                $("#btnPause").attr("value", "Pause.");
                                $("#noofItems").attr("disabled", false);
                                $(".moveDiv").removeClass("moving");
                            }

                    })})});
    } ///De-queues queued swaps for animation purposes

    function QuickSort(A, p, r){
        var q;
        if (p < r){
            q = partition(A, p, r);
            QuickSort(A, p, parseInt(q) - 1);
            QuickSort(A, parseInt(q) + 1, r);
        }
    }

    function partition(A, p, r){
        var x = parseInt(r);
        var i = parseInt(p);
        var j; var temp;

        for( j = parseInt(p); j <= parseInt(r) - 1; j++)
        {
            if ( A[j] < A[x] )
            {
                if ( i != j )
                {
                    temp = A[i];
                    A[i] = A[j];
                    A[j] = temp;
                    pQueue.push( i + "_" + p );
                    qQueue.push( j + "_" + r );
                }
                i = i + 1;
            }
        }
        if ( i != r )
        {
            temp = A[i];
            A[i] = A[r];
            A[r] = temp;
            pQueue.push(i + "_" + p);
            qQueue.push(r + "_" + r);
        }

        return (i);
    }

    function isDivSorted(){ //Uses an O(n) algorithm to check if the array is already sorted
        var i;
        for (i = 1; i < $('.moveDiv').length; i++)
        {
            if (parseInt($("#" + (i-1)).html()) > parseInt($("#" + (i)).html()))
            {
                return false;
            }
        }
        return true;
    } ///Uses an O(n) algorithm to check if the array is already sorted

    $('#btnItemCount').on('click', function(e){  //Actual setting of number of values
        e.preventDefault();

        var number = document.getElementById("noofItems").value;

        if (number > 20 || number < 2)
        {
            $.noop();
        }
        else
        {
            arrSize = number;
            var i;
            var myTable = document.createElement('table');
            myTable.id = "ArrayValues";

            var numRow = document.createElement("tr");
            var textRow = document.createElement("tr");
            var innerString = "";

            for(i = 0; i < arrSize; i++)
            {
                innerString += "<td class='valNo'>" + (parseInt(i)) + "</td>";
            }

            numRow.innerHTML = innerString;
            myTable.appendChild(numRow);

            innerString = "";

            for(i = 0; i < arrSize; i++)
            {
                innerString += "<td><input id='value_" + i + "' type='text' maxlength='2' class='value' value='0'></td>";
            }

            textRow.innerHTML = innerString;
            myTable.appendChild(textRow);

            var oldTable = document.getElementById("ArrayValues");
            myTable.id = "ArrayValues";
            $(oldTable).replaceWith(myTable);

            refreshArray();
            $('#btnSort').attr("disabled", false);
            $('#btnPause').attr("disabled", true);
        }
    }); ///Actual setting of number of values

    $('#btnSort').on('click', function(e){ //Clicked Sort! button

        pause = false;

        $('#sorting').show();
        $(":button").attr("disabled", true);
        $("#btnPause").attr("disabled", false);
        $("#noofItems").attr("disabled", true);
        var number = $('.moveDiv').length;

        $('.moveDiv').each( function(i, obj){

            var k = parseInt( $(this).attr("id") );
            var percent = ( ( k + 1) * 100 / (number + 1)).toString() + "%";

            var thisStyle = {"left" : percent, "top": 0};
            $(this).animate( thisStyle, 400);
        });


        if (!isDivSorted())
        {
            QuickSort(sortArray, 0, number - 1);
            execAnimQueue();
            $(this).attr("disabled", true);
            $('#btnPause').attr("disabled", false);
        }
        else
        {
            $(".moveDiv").addClass("currentArr");
            $(":button").attr("disabled", false);
            $("#btnPause").attr("disabled", true);
            $("#noofItems").attr("disabled", false);
        }
    }); ///Clicked Sort! button

    $('#btnPause').on('click', function(e){ //Clicked the Pause button
        if ( pause == false)
        {
            $(this).val("Play");
            $("#btnPause").attr("disabled", true);
            pause = true;
        }
        else
        {
            $(this).val("Pause.");
            pause = false;
            if (isDivSorted())
            {
                $(".moveDiv").addClass("currentArr");
                $(":button").attr("disabled", false);
                $("#btnPause").attr("disabled", true);
                $("#noofItems").attr("disabled", false);
            }
            else
            {
                execAnimQueue();
            }
        }
    }); ///Clicked the Pause button

    $('#btnPutRandomValues').on('click', function(e){  //Generating random values
        $('.value').each( function(i, obj){
            $(obj).val( Math.floor( (Math.random() * 100) ) );
            refreshArray();
        })}); ///Generating random values

});