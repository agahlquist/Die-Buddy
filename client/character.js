'use strict';

$(document).ready(function() {

  function handleError(message) {
    alert(message);
  }
  
  function resetFields() {
    $('#charName').val('');
    $('#charStr').val('');
    $('#charDex').val('');
    $('#charCon').val('');
    $('#charInt').val('');
    $('#charWis').val('');
    $('#charCha').val('');
  }

  function sendAjax(action, data) {
    console.log('sendAjax(action): ' + action);
    console.log('sendAjax(data): ' + data);
    $.ajax({
      cache: false,
      type: 'POST',
      url: action,
      data: data,
      dataType: 'json',
      success: function(result, status, xhr) {
        console.log(result);
        switch(result.type) {
          case 'makechar':
            $('.charSelect').append(
              '<div class="char">' + 
              '<h3 class="charName charContent">' + result.name + '</h3>' +
              '<button class="charContent btn delete", id="deleteChar", title=""Delete Character">X</button>' +
              '<button class="charContent btn select", id="selectChar", title=""Select Character">></button>' +
              '</div>');
            console.log('added div');
            break;
            
          case 'deletechar':
            console.log(result.id);
            $("#" + result.id).remove();
            break;
        }
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
  
  $('.delete').on('click', function(e) {
    e.preventDefault();
    
    sendAjax($('#deleteChar').attr('action'), { id: $(this).parent().attr('id') });
    
    return false;
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
    });
    resetFields();

    return false;
  });
  
  $('#cancelCharSubmit').on('click', function(e) {
    e.preventDefault();
    
    $('#makeChar').css({
      display: 'none'
    });
    resetFields();
  });
});