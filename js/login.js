$(document).ready(function(){
  $('.login-form').on('click', function() {
    $('.alert').remove();

    let $btn = $(this);
    let data = {};
    let action = $btn.data('action');

    let isError = false;
    if (action != 'deleteUser') {
      $btn.closest('form').find('input:not([type="checkbox"]), textarea').each((i, el) => {
        let name = $(el).attr('name');
        let val = $(el).val();

        let func = isValid;
        if (name == 'email') func = isMail;
        if (name == 'phone') func = isPhone;
        if (name == 'discord') func = isDiscord;

        if (!func($(el))) {
          isError = true;
          toValid($(el), false);
          if (name == 'discord') addAlert('Discord должен быть в формате имя#0000', [$(el)]);
        } else {
          toValid($(el), true);
        }

        data[name] = val;
      });
    }

    if (isError || !action) return;

    if ($('.time-check').length > 0) {
      data['time-check'] = [];
      $('.time-check:checked').each((i, el) => { 
        data['time-check'].push($(el).val());
      });
    }

    let id = '';
    if ($btn.data('id')) {
      id = $btn.data('id');
    } else {
      id = $btn.closest('form').data('id');
    }
    data['id'] = id;

    let sendData = {
      action: action
    };

    let location = '';
    if (action == 'Registration') {
      sendData['data'] = [
        data.name,
        data.phone,
        data.email,
        data.password 
      ];
      location = 'lk/';
      if (data.isAdmin) location = 'admin/users.php';
    } else if (action == 'Autorization') {
      sendData['data'] = [
        data.email,
        data.password 
      ];
      location = 'lk/';
    } else if (action == 'is_admin') {
      sendData['data'] = [
        data.name,
        data.password
      ];
      location = 'admin/users.php';
    } else if (action == 'updateUser') {
      sendData['data'] = [
        data.id,
        data.phone,
        data.password,
        data.name,
        data.email,
      ];
      location = 'admin/users.php';
    } else if (action == 'deleteUser') {
      sendData['data'] = [
        id
      ];
      location = 'admin/users.php';
    } else if (action == 'addReviews') {
      sendData['data'] = [
        data.name,
        data.text
      ];
      location = 'admin/reviews.php';
    } else if (action == 'deleteReview') {
      sendData['data'] = [
        data.id
      ];
      $btn.closest('tr').remove();
    } else if (action == 'deleteLesson') {
      data.trainer_id = $btn.data('trainer_id');
      let dateAndTime = $btn.data('date').split(' ');
      data.date = dateAndTime[0];
      data.time = dateAndTime[1];
      sendData['data'] = [
        data.id,
        data.trainer_id,
        data.date,
        data.time
      ];
      $btn.closest('tr').remove();
    } else if (action == 'addLesson') {
      sendData['data'] = [
        data.name,
        data.trainer_id,
        data.user_id,
        data.date,
        data.time,
        data.discord
      ];
      if (data.isAdmin) location = 'admin/lessons.php';
    } else if (action == 'PasswordRecovery') {
      sendData['data'] = [
        data.email
      ];

      $btn.addClass('d-none');
      $('.checkCode-btn').removeClass('d-none');
      $('#code').attr('required', 'required').parent().removeClass('d-none');
    } else if (action == 'CheckCode') {
      sendData['data'] = [
        data.email,
        data.code
      ];
    } else if (action == 'UpdatePassword') {
      sendData['data'] = [
        data.email,
        data.password
      ];
      location = '/login.php';
    } else if (action == 'UpdateSchedule') {
      sendData['data'] = [
        data.trainer_id,
        data.date,
        data['time-check']
      ];
    }

    console.log(sendData);
    $.ajax({
      type: 'POST',
      url: 'https://tobecomepro.ru/action.php',
      data: sendData,
      error: data => {
        console.log(data);
      },
      success: data => { 
        console.log(data);
        if (action == 'Registration' || action == 'Autorization') {
          if (data == true && document.referrer) {
            // window.history.back();
            window.location.href = document.referrer;
            return;
          }
          if (data != true) {
            addAlert(data, [$('#email'), $('#password')]);
          }
        }
        if (action == 'CheckCode') {
          if (data == true) {
            $btn.addClass('d-none');
            $('.updatePassword-btn').removeClass('d-none');
            $('#code').parent().addClass('d-none');
            $('#password').attr('required', 'required').parent().removeClass('d-none');
          } else {
            toValid($('#code'), false);
          }
        }
        if (data == true && location) {
          console.log(1);
          window.location.href = 'https://tobecomepro.ru/' + location;
        }
      }
    });
  });
});

function isValid($input) {
  let isReq = $input.attr('required');
  return $input.val() || !isReq;
}

function isMail($input) {
  let isReq = $input.attr('required');
  if ($input.val().trim() == '' && !isReq) return true;

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test($input.val().trim());
}

function isPhone($input) {
  let isReq = $input.attr('required');
  if ($input.val().trim() == '' && !isReq) return true;

  let re = /^[+]*7{0,1}[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
  return re.test($input.val().trim().replaceAll(' ', ''));
}

function isDiscord($input) {
  let isReq = $input.attr('required');
  if ($input.val().trim() == '' && !isReq) return true;

  let re = /^.+#[0-9]{4}$/g
  return re.test($input.val().trim());
}

function toValid($input, isValid) {
  $input.removeClass('is-invalid is-valid');
  if (isValid) $input.addClass('is-valid');
  else $input.addClass('is-invalid');
}

function addAlert(text='', inputs=[]) {
  $('form').prepend(`
    <div class="alert alert-danger">${text}</div>
  `);
  inputs.forEach($input => {
    toValid($input, false);
  });
  $('#password').val('');
}