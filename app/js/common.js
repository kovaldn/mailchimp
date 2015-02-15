(function() {

	var app = {
		
		// Инициализация
		initialize : function () {	
			this.setUpListeners();			
		},

		setUpListeners: function () {
			$('#mc-embedded-subscribe-form').on('submit', app.mailchimp);
			$('form').on('keydown', '.has-error', app.removeError);
		},

		mailchimp: function (e) {

			e.preventDefault();

			var form = $(this),	
				url = form.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
				data = {},
				dataArray = form.serializeArray(),
				divClass;

            /*TODO - в новой версии mailchimp ответы уже не такие и этот подход вообще не будет работать*/    
			var responses = {
	            'We have sent you a confirmation email'                                             : 'Мы выслали вам письмо для подтверждения',
	            'Please enter a value'                                                              : 'Пожалуйста, заполните все поля',
	            'An email address must contain a single @'                                          : 'Email адрес должен содержать @',
	            'The domain portion of the email address is invalid (the portion after the @: )'    : 'Ошибка в email адресе (после @: )',
	            'The username portion of the email address is invalid (the portion before the @: )' : 'Ошибка в email адресе (до @: )',
	            'This email address looks fake or invalid. Please enter a real email address'       : 'Пожалуйста, введите настоящий email адрес'
	        };	

	        form.find('.alert').remove();

			// приведем данные к виду Object {EMAIL: "", FNAME: "", LNAME: ""}	
            $.each(dataArray, function (index, item) {
                data[item.name] = item.value;
            });
         
            // jsonp запрос 
			$.ajax({
                url: url,
                data: data,
                dataType: 'jsonp',
                success: successCallback,
                error: errorCallback
            });

			// обрабатываем успех
            function successCallback(resp) {
            	
            	if (resp.result === 'success') {
                    msg = 'Мы отправили вам письмо. Пожалуйста, подтвердите подписку.';
                    divClass="alert alert-success";
                } else {
                	divClass="alert alert-danger";
                    var index = -1;
                    try {
                        var parts = resp.msg.split(' - ', 2);
                        if (parts[1] === undefined) {
                            msg = resp.msg;
                        } else {
                            var i = parseInt(parts[0], 10);
                            if (i.toString() === parts[0]) {
                                index = parts[0];
                                msg = parts[1];
                            } else {
                                index = -1;
                                msg = resp.msg;
                            }
                        }
                    }
                    catch (e) {
                        index = -1;
                        msg = resp.msg;
                    }
                }

                if (responses[msg]) {msg = responses[msg]};

                var mydiv = $('<div/>', {
				    class:  divClass,
				    text: 	msg
				});
				form.prepend(mydiv);
            };

            // обрабатываем ошибку
            function errorCallback(resp, text) {
            	
            	var mydiv = $('<div/>', {
				    class:  'alert alert-danger',
				    text: 	'ошибка сервера, пожалуйста сообщите об этом по адресу: kovaldn@gmail.com'
				});
				form.prepend(mydiv);
            };
	
		},
		
	}

	app.initialize();

}());