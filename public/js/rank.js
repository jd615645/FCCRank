jQuery(document).ready(function($) {
  var socket = io.connect(),
      compele_list = [],
      user = [],
      challenge_list = [],
      MAX,
      menu = 0;


  $.getJSON('./json/challenge_list.json', function(data) {
    challenge_list = data[0]['html'];
    MAX = challenge_list.length;
    // listen socker emit 'fcc_info'
    socket.on('fcc_info', function(fcc_info) {
      // 計算完成題目
      compele_list = [];
      for (var i = 0; i < fcc_info.length; i++) {
        /*
          username: fcc'suser[username] username
          source: 完成指定的題目數量
          completed_list: 完成的的題目
         */
        var username = fcc_info[i].username,
            source = 0,
            completed_list = [],
            all_completed_challenge = fcc_info[i].challenge,
            fcc_completed_list = fcc_info[i].challenge;

        $.each(challenge_list, function(key, val) {
          if ($.inArray(val, fcc_completed_list) != -1) {
            completed_list.push(val);
          }
        });
        source = completed_list.length;

        // first get user's data
        if($('#fcc #' + username).length == 0) {
          user[username] = { username: username, img: fcc_info[i].img, source: source,all_completed: all_completed_challenge ,
            completed_list: completed_list };
          adduser(user[username]);
        }
        // already have this user's data
        else {
          // have new sourse data
          if(user[username].source != source) {
            user[username].source = source;
            user[username].completed_list = completed_list;
            user[username].all_completed = all_completed_challenge;
            $('#fcc #' + username + ' span').text(source);
          }
        }
        for (var j = 0; j < fcc_info[i].challenge.length; j++) {
          compele_list.push(username + ' completed "' + fcc_info[i].challenge[j] + '"');
        };
      };
    })

    $(document).on('click', '.description', function(){
      var username = $(this).parent('.content').parent('.ui').parent('.column').attr('id');
      console.log(username);
      $('.ui.modal').modal('show');
      //   showlist(username, user[username].all_completed);
      showlist(username, user[username].completed_list);
    })
  });

  // init sematic-ui modal
  $('.ui.modal').modal();

  // add user on table
  function adduser(info) {
    var html = '<div class="column" id="' + info.username + '"><div class="ui card"><div class="image"><img src="' + info.img + '"></div><div class="content"><a class="header" href="https://www.freecodecamp.com/' + info.username + '" target="_blank">' + info.username + '</a><div class="description"><p><span>' + info.all_completed.length + '</span>題</p></div></div></div></div>';
    $('#fcc').append(html);
  }
  function showlist(username, info) {
    var html;
    $('.info-window table').empty();
    $('.info-window .header').text(username + " 的解題紀錄");
    for (var i = 0; i < info.length; i++) {
      html = '<tr><td>' + info[i] + '</td></tr>'
      $('.info-window table').append(html);
    };
  }
});

