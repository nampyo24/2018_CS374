// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.

var budgetCheck = false;
var modeCheck = false;
var gameCheck = false;
var notSupportedGame = false;
var notSupportedBudget = false;

var alertMessageWarning ='<strong><i class="fas fa-exclamation-triangle"></i>&nbsp;경고!</strong> 현재 버전에서는 Baffle Ground만 지원되며, 나머지는 자동으로 선택 해제 후 진행됩니다.'
var alertMessageDanger ='<strong><i class="fas fa-exclamation-triangle"></i>&nbsp;경고!</strong> 현재 버전에서는 70만원 ~ 110만원 사이의 예산만 지원됩니다. 변경 부탁드립니다.'

var games=[{index : 0, title  : "히오스"},
         {index : 1, title : "리그 오브 레전드"},
         {index : 2, title : "오버워치"},
         {index : 3, title : "파크라이 5"},
         {index : 4, title : "피파 온라인 3"},
         {index : 5, title : 'Baffle Ground'},
         {index : 6, title : "GTA 5"},
         {index : 7, title : "하스스톤"}];

$( document ).ready(function() {

  var budgetInputbox = document.getElementById('budgetInputbox');
  var budgetSubmit = document.getElementById('budgetSubmit');

  // 예산 슬라이더 handler
  $( "#budgetSlider" ).slider({
    range: "min",
    value: 650000,
    min: 650000,
    max: 1150000,
    step: 10000,
    slide: function( event, ui ) {
      $( "#budgetInputbox" ).val( Number(ui.value).toLocaleString('en') );
    },
    change: function(event, ui){

      var temp = $(this).slider("value");
      if(700000 <= temp && temp <= 1100000){
        budgetCheck=true;
        notSupportedBudget = false;

        $("#alertNext").removeClass("alert-danger");
        $("#alertNext").addClass("alert-warning");
        $("#alertData").html(alertMessageWarning);

        if(!notSupportedGame){
          $("#alertNext").attr("hidden" , true);
        }else{
          for(var i = 0; i < 8; i++){
            if(i==5) continue;
            else{
              if(document.getElementById(i).checked) {
                checkNextStep();
                return;
              };
            }
          }
          notSupportedGame=false;
        }
      }else{
        budgetCheck=false;
        notSupportedBudget = true;
        $("#alertNext").removeClass("alert-warning");
        $("#alertNext").addClass("alert-danger");
        $("#alertData").html(alertMessageDanger);
        $("#alertNext").attr("hidden" , false);
      }
      checkNextStep();
    }
  });

  // 게임 선택 체크박스 생성자
  $( ".gameSelector" ).checkboxradio();


  // 게임 선택 체크박스 handler
  $(".gameSelector").on("change", function(event){

    if(games[parseInt(this.id)].title === "Baffle Ground"){
      if(this.checked){
        gameCheck = true;
        checkNextStep();
      }else{
        gameCheck = false;
        checkNextStep();
      }
    }else if(notSupportedBudget){

      if(!notSupportedGame){
        $("#alertNext").attr('hidden', false);
        notSupportedGame = true;
      }else{
        for(var i = 0; i < 8; i++){
          if(i==5) continue;
          else{
            if(document.getElementById(i).checked) return;
          }
        }

        notSupportedGame=false;
      }
    }else{

      if(!notSupportedGame){

        $("#alertNext").attr('hidden', false);
        notSupportedGame = true;
        for(var i = 0; i < 8; i++){
          if(i==5) continue;
          else{
            if(document.getElementById(i).checked) return;
          }
        }
        notSupportedGame=false;
        $("#alertNext").attr('hidden', true);
      }else{
        for(var i = 0; i < 8; i++){
          if(i==5) continue;
          else{
            if(document.getElementById(i).checked) return;
          }
        }
        notSupportedGame=false;
        $("#alertNext").attr('hidden', true);
      }
    }
  })

  // 예산 text 입력 자동완성 handler
  $( "#budgetInputbox" ).autocomplete({
    minLength:2,
    autofocus: true,
    source: function(request, response){
      var temp = request.term;

      if(100 <= temp && temp <= 115){
        var answer = [temp*10000];
      }else if(1000 <= temp && temp <= 1150 && (temp % 10) == 0){
        var answer = [temp*1000];
      }else if(10000 <= temp && temp <= 11500 && (temp % 100) == 0){
        var answer = [temp*100];
      }else if(100000 <= temp && temp <= 115000 && (temp % 1000) == 0){
        var answer = [temp*10];
      }else if(65 <= temp && temp <= 99){
        var answer = [temp*10000];
      }else if(650 <= temp && temp <= 990 && (temp % 10) == 0){
        var answer = [temp*1000];
      }else if(6500 <= temp && temp <= 9900 && (temp % 100) == 0){
        var answer = [temp*100];
      }else if(65000 <= temp && temp <= 99000 && (temp % 1000) == 0){
        var answer = [temp*10];
      }else{
        response([]);
        return;
      }
      response([answer.toString()]);
    },
    response: function(event, ui){
      if(ui.content.length == 1){
        //console.log(ui.content[0]);
        $(this).val(ui.content[0].value);
        var temp = parseInt(ui.content[0].value);
        $( "#budgetSlider").slider( "value", temp);
        $( "#budgetSubmit" ).attr('disabled', true);
        $(this).autocomplete("close");
      }
    },
    select: function(event, ui){
      //console.log(ui.item.value);
      var temp = parseInt(ui.item.value.replace(/,/g,''));
      $( "#budgetInputbox" ).val( parseInt(ui.item.value).toLocaleString('en') )
      $( "#budgetSlider").slider( "value", temp);
    }

  });



  // 예산 text 입력 -> 변경 버튼 click handler
  $( "body" ).on("click", "#budgetSubmit", function(){
    var temp = parseInt($( "#budgetInputbox" ).val().replace(/,/g, ''));
    $( "#budgetSlider").slider( "value", temp);
    $( "#budgetSubmit" ).attr('disabled', true);
    $( "#budgetInputbox" ).val(Number($("#budgetSlider").slider("value")).toLocaleString("en"));
  });


  // 게임 이름 검색 handler
  $('.ui.search')
    .search({
      source: games
    });


});

  // 매 업데이트 마다 다음 단계로 넘어갈 수 있는 조건인지 검사해야 ;
function checkNextStep(){
  if(budgetCheck && modeCheck && gameCheck){
    $("#nextButton").attr('disabled', false);
  }else{
    $("#nextButton").attr('disabled', true);
  }
}

// budgetInputbox onblur handler
function budgetInputboxOnblur(){
  var temp = parseInt($( "#budgetInputbox" ).val().replace(/,/g, ''));
  if (isNaN(temp) || temp  < 650000 || temp > 1150000){
    $( "#budgetInputbox" ).val(Number($("#budgetSlider").slider("value")).toLocaleString("en"));
    return;
  }else {
    $( "#budgetInputbox" ).val(Number(temp).toLocaleString("en"));
  }
  if(temp !== $("#budgetSlider").slider("value")){
    //console.log(temp);
    //console.log($("#budgetSlider").slider("value"));
    $( "#budgetSubmit" ).attr('disabled', false);
  }


}



function modeButtonClickHandler(id, otherId){

  $(id).removeClass('basic');
  $(id).addClass('inverted');

  if($(id).hasClass('active')){
    modeCheck = false;
    $(id).removeClass('active');
    $(id).blur();
    // 클릭시 다른 쪽 설정이 자동으로 선택되게 하려면 주석 해제
    //$(otherId).addClass('active');
    //modeCheck= true;
    $(id).removeClass('inverted');
    $(id).addClass('basic');

  }else {
    $(id).addClass('active');
    $(otherId).removeClass('active');
    modeCheck = true;
  }
  checkNextStep();
}

function modeButtonHoverHandler(id){
  if(! $(id).hasClass('active')){
    $(id).removeClass('inverted');
    $(id).addClass('basic');
  }
}

function modeButtonHoverEndHandler(id){
  $(id).removeClass('basic');
  $(id).addClass('inverted');
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
