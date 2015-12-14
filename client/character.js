'use strict';

$(document).ready(function() {
  var activeChar;

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
              '<button class="charContent btn delete" id="deleteChar" title=""Delete Character">X</button>' +
              '<button class="charContent btn select" id="selectChar" title=""Select Character">></button>' +
              '</div>');
            break;

          case 'deletechar':
            $("#" + result.id).remove();
            break;

          case 'selectchar':
            setActiveChar(result.char);
            socket.emit('select char', activeChar);
            break;
            
          case 'updatechar':
            setActiveChar(result.char);
            $('#' + result.char._id).children('h3').html(result.char.name);
            socket.emit('select char', activeChar);
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

  $('.select').on('click', function(e) {
    e.preventDefault();
    $('#activeChar').html('');

    sendAjax($('#selectChar').attr('action'), { id: $(this).parent().attr('id') });

    $('#charArea').animate({
      top: '-500'
    });

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

  //Helper Functions
  function setActiveChar(charData) {
    activeChar = {
      name: charData.name,
      str: charData.strength,
      dex: charData.dexterity,
      con: charData.constitution,
      int: charData.intelligence,
      wis: charData.wisdom,
      cha: charData.charisma,
      id: charData._id
    };
    
    fillActiveChar();
  }
  
  function fillActiveChar() {
    $('#activeChar').html('<h3 class="activeCharName">' + activeChar.name + '</h3>' +
                          '<div class="col1-2 activeStatArea"' +
                          '<p class="activeStat">Str: ' + activeChar.str + '</p>' +
                          '<p class="activeStat">Dex: ' + activeChar.dex + '</p>' +
                          '<p class="activeStat">Con: ' + activeChar.con + '</p>' +
                          '</div>' +
                          '<div class="col1-2 activeStatArea"' +
                          '<p class="activeStat">Int: ' + activeChar.int + '</p>' +
                          '<p class="activeStat">Wis: ' + activeChar.wis + '</p>' +
                          '<p class="activeStat">Cha: ' + activeChar.cha + '</p>' +
                          '</div>' +
                          '<div class="activeButtons">' +
                          '<button class="btn" id="editCharButton"> Edit </button>' +
                          '</div>');

    $('#editCharButton').on('click', handleEditChar);
  }

  function handleEditChar() {
    $('#activeChar').html('<form id="editCharForm" class="editForm" method="POST" action="/editchar" name="editCharForm">' +
                          '<input id="editCharName" class="activeCharName" name="editName" value="' + activeChar.name + '"></input><br>' +
                          '<div class="col1-2 activeStatArea">' +
                          '<label for="strength">Str:</label>' +
                          '<input id="editCharStr" type="number" class="editStat" value="' + activeChar.str +'" name="strength"></input>' +
                          '<label for="dexterity">Dex:</label>' +
                          '<input id="editCharDex" type="number" class="editStat" value="' + activeChar.dex +'" name="dexterity"></input>' +
                          '<label for="constitution">Con:</label>' +
                          '<input id="editCharCon" type="number" class="editStat" value="' + activeChar.con +'" name="constitution"></input>' +
                          '</div>' +
                          '<div class="col1-2 activeStatArea">' +
                          '<label for="intelligence">Int:</label>' +
                          '<input id="editCharInt" type="number" class="editStat" value="' + activeChar.int +'" name="intelligence"></input>' +
                          '<label for="wisdom">Wis:</label>' +
                          '<input id="editCharWis" type="number" class="editStat" value="' + activeChar.wis +'" name="wisdom"></input>' +
                          '<label for="charisman">Cha:</label>' +
                          '<input id="editCharCha" type="number" class="editStat" value="' + activeChar.cha +'" name="charisma"></input>' +
                          '</div>' +
                          '<div class="activeButtons">' +
                          '<button id="cancelEditCharButton", class="btn">Cancel</button>' + 
                          '<button id="saveEditCharButton", class="btn">Save</button>' +
                          '</div>' +
                          '</form>');

    $('#cancelEditCharButton').on('click', fillActiveChar);
    $('#saveEditCharButton').on('click', handleSaveEdit);
  }

  function handleSaveEdit() {
    if($('#editCharName').val() == '' ||
       $('#editCharStr').val() == '' || $('#editCharDex').val() == '' || $('#editCharCon').val() == '' ||
       $('#editCharInt').val() == '' || $('#editCharWis').val() == '' || $('#editCharCha').val() == '') {
      handleError('All fields are required!');
      return false;
    }
    
    var updateChar = {
      name: $('#editCharName').val(),
      str: $('#editCharStr').val(),
      dex: $('#editCharDex').val(),
      con: $('#editCharCon').val(),
      int: $('#editCharInt').val(),
      wis: $('#editCharWis').val(),
      cha: $('#editCharCha').val()
    };

    sendAjax($('#editCharForm').attr('action'), { old: activeChar, update: updateChar });

    return false;
  }
});