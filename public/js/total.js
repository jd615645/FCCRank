jQuery(document).ready(function($) {
  var socket = io.connect();    
  var MAX = 100;
  var compele_list = [];
  var user = [];

  // listen socker emit 'fcc_info'
  socket.on('fcc_info', function(fcc_info) {
    // 計算完成題目
    compele_list = [];
    for (var i = 0; i < fcc_info.length; i++) {
      /* 
        username: fcc's username
        source: 完成指定的題目數量
        completed_list: 完成的的題目
       */
      var username = fcc_info[i].username,
          source = fcc_info[i].source,
          completed_list = fcc_info[i].challenge;

      // first get user's data
      if($('table #' + username).length == 0) {
        adduser(fcc_info[i]);
        user[username] = {source: source, completed_list: completed_list}
        $('table #' + username + ' .compelebar').progress({
          percent: fcc_info[i].source / MAX * 100
        });
      }
      // already have this user's data
      else {
        // have new sourse data
        if(user[username].source != source) {
          user[username].source = source;
          user[username].completed_list = completed_list;
          $('table #' + username + ' .challenges .label').text('(' + source + '/' + MAX + ')');
          $('table #' + username + ' .source .value').html(source);
          $('table #' + username + ' .compelebar').progress({
            percent: fcc_info[i].source / MAX * 100
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
    showlist(username, user[username].completed_list);
  })

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

  function adduser(info) {
    var html = '<tr id="' + info.username + '"><td width="25%" class="userpic"><img src="' + info.img + '" class="userpic"></td><td width="50%" class="challenges"><a href="https://github.com/' + info.username + '" target="_blank"><h3 class="username">' + info.username + '</h3></a><div class="ui indicating progress compelebar" data-percent="22"><div class="bar" style="transition-duration: 300ms; width: 22%;"></div><div class="label">(' + info.source + '/' + MAX + ')</div></div></td><td width="25%" class="source"><div class="ui statistic"><div class="value">' + info.source + '</div><div class="label">題</div></div></td></tr>';
    $('#fcc-info table').append(html);
  }
  function showlist(username, info) {
    var html;
    // console.log(username);
    $('.info-window .header').text(username + "的解題紀錄");
    for (var i = 0; i < info.length; i++) {
      html = '<tr><td>' + info[i] + '</td></tr>'
      $('.info-window table').append(html);
    };
  }
  function refuse(username, source) {
    $('table #' + username + ' .compelebar').progress({
      percent: fcc_info[i].source / MAX * 100
    });
  }
});