jQuery(document).ready(function($) {
  var socket = io.connect();    
  var MAX = 100;
  var compele_list = [];

  socket.on('fcc_info', function(fcc_info) {
    $('#fcc_info table').html('');
    compele_list = [];
    for (var i = 0; i < fcc_info.length; i++) {
      adduser(fcc_info[i]);
      for (var j = 0; j < fcc_info[i].challenge.length; j++) {
        compele_list.push(fcc_info[i].username + ' completed "' + fcc_info[i].challenge[j] + '"');
      };
      $('tr:nth-child(' + (i+1) + ') .compelebar').progress({
        percent: fcc_info[i].source / MAX * 100
      });
    };
  })

  function timeout() {
    setTimeout(function () {
      var $text = $('.completedlist h3');
      var randnum = Math.floor((Math.random() * compele_list.length) + 1);
      $text.hide();
      $text.text(compele_list[randnum])
      $text.fadeIn();
      timeout();
    }, 2000);
  }

  timeout();

  function adduser(info) {
    var html = ('<tr><td width="25%" class="userpic"><img src="' + info.img + '" class="userpic"></td><td width="50%" class="challenges"><a href="https://github.com/' + info.username + '" target="_blank"><h3 class="username">' + info.username + '</h3></a><div class="ui indicating progress compelebar" data-percent="22"><div class="bar" style="transition-duration: 300ms; width: 22%;"></div><div class="label">(' + info.source + '/100)</div></div></td><td width="25%" class="source"><div class="ui statistic"><div class="value">' + info.source + '</div><div class="label">題</div></div></td></tr>');
    $('#fcc_info table').append(html);

  }
});