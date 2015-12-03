'use strict';

$(document).ready(function() {

  function handleError(message) {
    alert(message);
  }
  
  function resetFields() {
    $('#makeChar').css('box-shadow', 'none');
    
    $('#charName').val('');
    $('#charStr').val('');
    $('#charDex').val('');
    $('#charCon').val('');
    $('#charInt').val('');
    $('#charWis').val('');
    $('#charCha').val('');
  }

  function sendAjax(action, data) {
    console.log(action);
    console.log(data);
    $.ajax({
      cache: false,
      type: 'POST',
      url: action,
      data: data,
      dataType: 'json',
      success: function(result, status, xhr) {
        console.log(result);
        window.location = result.redirect;
      },
      error: function(xhr, status, error) {
        console.log('wat');
        var messageObj = JSON.parse(xhr.responseText);
        handleError(messageObj.error);
      }
    });        
  }
  
  //Nav Bar Buttons
  $('#logout').on('click', function(e) {
    e.preventDefault();
    window.location.href = '/logout';
  });
  
  $('#charButton').on('click', function(e) {
    e.preventDefault();
    
    $('#charArea').animate({
      top: '0'
    });
  });
  
  $('#help').on('click', function(e) {
    e.preventDefault();
    
    $('#helpArea').animate({
      top: '0'
    });
  });
  
  //Help Area Buttons
  $('#closeHelpArea').on('click', function(e) {
    e.preventDefault();
    
    $('#helpArea').animate({
      top: '-500'
    });
  });
  
  //Char Area Buttons
  $('#createChar').on('click', function(e) {
    e.preventDefault();
    
    $('#makeChar').css({
      display: 'block'
    });
  });
  
  $('#closeCharArea').on('click', function(e) {
    e.preventDefault();
    
    $('#charArea').animate({
      top: '-500'
    });
  });

  //Char Form Buttons
  $('#makeCharSubmit').on('click', function(e) {
    e.preventDefault();
    
    if($('#charName').val() == '' ||
       $('#charStr').val() == '' || $('#charDex').val() == '' || $('#charCon').val() == '' ||
       $('#charInt').val() == '' || $('#charWis').val() == '' || $('#charCha').val() == '') {
      handleError('All fields are required!');
      return false;
    }
    
    sendAjax($('#charForm').attr('action'), $('#charForm').serialize());
    
    $('#makeChar').css({
      display: 'none'
    }, resetFields);

    return false;
  });
  
  $('#addChar').on('click', function(e) {
    e.preventDefault();
    
    $('#makeChar').animate({
      left: $(window).width()/2-200
    }, 400, function() {
      $('#makeChar').css('box-shadow', '0 0 100000px #000');
    });
  });
  
  $('#cancelCharSubmit').on('click', function(e) {
    e.preventDefault();
    
    $('#makeChar').css({
      display: 'none'
    });
  });
});