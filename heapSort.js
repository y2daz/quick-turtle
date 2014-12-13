/**
 * Created by Yazdaan Alimudeen on 25/08/14.
 * IT 13001308
 */

$(document).ready(function(){

    var myEasing = "swing";
    var sortArray = [];
    var arrSize;
    var heapSize;
    var pQueue = [];
    var qQueue = [];
    var messageQueue = [];
    var pause = false;
    var speed = 1000;

    $(".note").hide();  ///Hides error message span

    $('#speed').on('change', function(){ ///Changes the animation speed with user's choice.
        speed = parseInt($(this).val());
        if (speed < 200)
        {
            $(".note").show();
        }
        else
        {
            $(".note").hide();
        }
    }); ///Changes the animation speed with user's choice.

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

    function layOutDiv( i ){ //Puts sorting divs one after the other for easy viewing after sorting
        var percent;
        var thisStyle;
        var number = $('.moveDiv').length;
        var next = i + 1;

        $("#message").html("");

        if ( i == null )
        {
            return;
        }
        else
        {
            if ( i == number - 1 )
            {
                next = null;
            }
        }

        percent = ( ( i + 1) * 100 / (number + 1) ).toString() + "%";
        console.log( i + " is " + percent );
        thisStyle = {"left" : percent, "top" : 0};
        $("#" + i).animate( thisStyle, speed, myEasing, function(){
            layOutDiv( next );
        });

    } ///Puts sorting divs one after the other for easy viewing after sorting

    function execAnimQueue(){ ///Dequeues queued swaps for animation purposes

        var p = parseInt( pQueue.shift() );
        var q = parseInt( qQueue.shift() );
        var message = messageQueue.shift();

        var pPos = $("#" + p).position();
        var pLeft = pPos.left;
        var pTop = pPos.top;
        var qPos = $("#" + q).position();
        var qLeft = qPos.left;
        var qTop = qPos.top;

        $(".moveDiv").removeClass("moving");
        $("#" + p).addClass("moving");
        $("#" + q).addClass("moving");

        $("#message").addClass("kw").html(message);

        var thisStyle1 = {"top" : qTop};
        var thisStyle2 = {"top" : pTop};

            $("#" + p).animate( thisStyle1, speed, myEasing);

            $("#" + q).animate( thisStyle2, speed, myEasing, function(){

                thisStyle1 = {"left" : qLeft};
                $("#" + p).animate( thisStyle1, speed, myEasing);

                thisStyle2 = {"left" : pLeft};
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
                            $(".moveDiv").removeClass("moving");
                            $(".moveDiv").addClass("currentArr");
                            $(":button").attr("disabled", false);
                            $("#btnPause").attr("disabled", true);
                            $("#btnPause").attr("value", "Pause.");
                            $("#noofItems").attr("disabled", false);
                            layOutDiv( 0 );
                        }

                        })});
    } ///Dequeues queued swaps for animation purposes

    function visualHeap(){ //Arranges sorting divs into a heap visually
        var number = $('.moveDiv').length;

        $('.moveDiv').addClass("currentArr").each( function(i, obj){

            var k = parseInt( $(this).attr("id") );
            var percent = ( ( k + 1) * 100 / (number + 1)).toString() + "%";
            var thisStyle = {"left" : percent, "top": 0};
            $(this).animate( thisStyle, 400, myEasing, function(){

                var k = parseInt( $(this).attr("id") );
                var thisHeight = Math.floor(  Math.log( k+1 )/Math.LN2 );
                var percent = ( ( ( ( k - (Math.pow(2, thisHeight )) ) + 2) * 100) / (Math.pow(2, thisHeight) + 1)).toString() + "%";

                var thisTop = "+=" + (thisHeight * 50) + "px";
                var thisStyle = {"top" : thisTop, "left" : percent};
                $(this).animate( thisStyle, 400, myEasing);
            });
        });
    } ///Arranges sorting divs into a heap visually

    function HeapSort(A){ //Actual HeapSort algorithm
        BuildHeap( A );

        var i;

        for (i = heapSize-1; i >= 1; i--)
        {
            exchange(A, 0, i, "HeapSort");
            heapSize--;
            Heapify(A, 0, "Heapify");
        }
    } ///Actual HeapSort algorithm

    function BuildHeap(A, r){ //
        var i;
        var startI = parseInt(heapSize / 2);

        for (i = startI ; i >= 0; i--)
        {
            Heapify(A, i, "BuildHeap");
        }
    }

    function Heapify(A, i, message){
        var largest = 0;
        var l = leftChild(i);
        var r = rightChild(i);

        if (( l < heapSize) && (A[l] > A[i])){
            largest = l;
        }
        else{
            largest = i;
        }

        if (( r < heapSize ) && ( A[r] > A[largest])){
            largest = r;
        }

        if (largest != i){
            exchange(A, i, largest, message);
            Heapify(A, largest);
        }
    }

    function exchange(A, x, y, message){ //Exchanges 2 values in the array. Message past is to know from where it is being called.
        var temp = A[x];
        A[x] = A[y];
        A[y] = temp;
        pQueue.push( x );
        qQueue.push( y );
        messageQueue.push( message );
    } ///Exchanges 2 values in the array. Message past is to know from where it is being called.

    function leftChild(a){ //Gets the left-child of an array index
        return (2 * a) + 1;
    } ///Gets the left-child of an array index

    function rightChild(a){ //Gets the right-child of an array index
        return (2 * a) + 2;
    } ///Gets the right-child of an array index

    function isDivSorted(){ //Uses an O(n) algorithm to check if the array is already sorted
        var i;
        for (i = 1; i < $('.moveDiv').length; i++)
        {
            if ( parseInt( $("#" + (i-1) ).html() ) > parseInt( $("#" + (i) ).html() ) )
            {
                return false;
            }
        }
        return true;
    } ///Uses an O(n) algorithm to check if the array is already sorted

    $('#btnItemCount').on('click', function(e){ //Actual setting of number of values
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

        if (!isDivSorted())
        {
            visualHeap();
            heapSize = number;
            HeapSort(sortArray);
            setTimeout(execAnimQueue, 1000);
            $(this).attr("disabled", true);
            $('#btnPause').attr("disabled", false);
        }
        else
        {
            setTimeout( layOutDiv( 0 ), 0);
            $(".moveDiv").addClass("currentArr");
            $(":button").attr("disabled", false);
            $("#btnPause").attr("disabled", true);
            $("#noofItems").attr("disabled", false);
        }
    }); ///Clicked Sort! button

    $('#btnPause').on('click', function(e){ //Clicked Pause button
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
    }); ///Clicked Pause button

    $('#btnPutRandomValues').on('click', function(e){  //Generating random values
        $('.value').each( function(i, obj){
            $(obj).val( Math.floor( (Math.random() * 100) ) );
            refreshArray();
        })}); ///Generating random values

});