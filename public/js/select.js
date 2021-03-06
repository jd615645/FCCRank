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
        if($('table #' + username).length == 0) {
          user[username] = { username: username, img: fcc_info[i].img, source: source,all_completed: all_completed_challenge ,
            completed_list: completed_list };
          adduser(user[username]);
          $('table #' + username + ' .compelebar').progress({
            percent: user[username].source / MAX * 100
          });
        }
        // already have this user's data
        else {
          // have new sourse data
          if(user[username].source != source) {
            user[username].source = source;
            user[username].completed_list = completed_list;
            user[username].all_completed = all_completed_challenge;
            $('table #' + username + ' .challenges .label').text('(' + source + '/' + MAX + ')');
            $('table #' + username + ' .source .value').html(source);
            $('table #' + username + ' .compelebar').progress({
              percent: user[username].source / MAX * 100
            });
          }
        }
        for (var j = 0; j < fcc_info[i].challenge.length; j++) {
          compele_list.push(username + ' completed "' + fcc_info[i].challenge[j] + '"');
        };
      };
    })

    $(document).on('click', '.source', function(){
      var username = $(this).parent('tr').attr('id');
      $('.ui.modal').modal('show');
      var which = parseInt($('.ui.menu a.active').attr('value'));
      if(which == 0) {
        showlist(username, user[username].all_completed);
      }
      else {
        showlist(username, user[username].completed_list);
      }
    })
    $('.ui.menu a').click(function() {
      var $before = $('.ui.menu').find('.active');
      $before.removeClass('active');
      $(this).addClass('active');
      var which = parseInt($before.attr('value'));
      $('table[value='+ which +']').hide();
      which = parseInt($(this).attr('value'));
      $('table[value='+ which +']').show();
    });
  });

  function timeout() {
    setTimeout(function () {
      var $text = $('.completedlist h3');
      var randnum = Math.floor((Math.random() * compele_list.length) + 1);
      $text.hide();
      $text.text(compele_list[randnum])
      $text.fadeIn();
      timeout();
    }, 1500);
  }

  // init sematic-ui modal
  $('.ui.modal').modal();
  timeout();
  $('table[value="1"]').hide();

  // sort rank
  function sortrank() {
    $.each(user, function(key, val) {
      console.log(key + ': ' + val);
    });
  }

  // add user on table
  function adduser(info) {
    var html = '<tr id="' + info.username + '"><td width="25%" class="userpic"><img src="' + info.img + '" class="userpic"></td><td width="50%" class="challenges"><a href="https://www.freecodecamp.com/' + info.username + '" target="_blank"><h3 class="username">' + info.username + '</h3></a></td><td width="25%" class="source"><div class="ui statistic"><div class="value">' + info.all_completed.length + '</div><div class="label">題</div></div></td></tr>';
    $('#fcc-info table[value="0"]').append(html);
    html = '<tr id="' + info.username + '"><td width="25%" class="userpic"><img src="' + info.img + '" class="userpic"></td><td width="50%" class="challenges"><a href="https://www.freecodecamp.com/' + info.username + '" target="_blank"><h3 class="username">' + info.username + '</h3></a><div class="ui indicating progress compelebar" data-percent="22"><div class="bar" style="transition-duration: 300ms; width: 22%;"></div><div class="label">(' + info.source + '/' + MAX + ')</div></div></td><td width="25%" class="source"><div class="ui statistic"><div class="value">' + info.source + '</div><div class="label">題</div></div></td></tr>';
    $('#fcc-info table[value="1"]').append(html);
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