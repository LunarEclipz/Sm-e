$('#petPicUpload').on('change', function(){
	let image = $("#petPicUpload")[0].files[0];
	let formdata = new FormData();
	formdata.append('petPicUpload', image);
	$.ajax({
		url: '/adminAvatar/upload',
		data: formdata,
		contentType: false,
		processData: false,
		type: 'POST',
		'success':(data) => {
			$('#petPic').attr('src', data.file);
			$('#petPicURL').attr('value', data.file);	// sets petPicURL hidden field
			if(data.err){
				$('#petPicErr').show();
				$('#petPicErr').text(data.err.message);
			} else{
				$('#petPicErr').hide();
			}
		}
	});
});

$('#firstUpload').on('change', function(){
	let image = $("#firstUpload")[0].files[0];
	let formdata = new FormData();
	formdata.append('firstUpload', image);
	$.ajax({
		url: '/adminAvatar/firstUpload',
		data: formdata,
		contentType: false,
		processData: false,
		type: 'POST',
		'success':(data) => {
			$('#first').attr('src', data.file);
			$('#firstURL').attr('value', data.file);	// sets firstURL hidden field
			if(data.err){
				$('#firstErr').show();
				$('#firstErr').text(data.err.message);
			} else{
				$('#firstErr').hide();
			}
		}
	});
});

$('#secondUpload').on('change', function(){
	let image = $("#secondUpload")[0].files[0];
	let formdata = new FormData();
	formdata.append('secondUpload', image);
	$.ajax({
		url: '/adminAvatar/secondUpload',
		data: formdata,
		contentType: false,
		processData: false,
		type: 'POST',
		'success':(data) => {
			$('#second').attr('src', data.file);
			$('#secondURL').attr('value', data.file);	// sets secondURL hidden field
			if(data.err){
				$('#secondErr').show();
				$('#secondErr').text(data.err.message);
			} else{
				$('#secondErr').hide();
			}
		}
	});
});

$('#thirdUpload').on('change', function(){
	let image = $("#thirdUpload")[0].files[0];
	let formdata = new FormData();
	formdata.append('thirdUpload', image);
	$.ajax({
		url: '/adminAvatar/thirdUpload',
		data: formdata,
		contentType: false,
		processData: false,
		type: 'POST',
		'success':(data) => {
			$('#third').attr('src', data.file);
			$('#thirdURL').attr('value', data.file);	// sets thirdURL hidden field
			if(data.err){
				$('#thirdErr').show();
				$('#thirdErr').text(data.err.message);
			} else{
				$('#thirdErr').hide();
			}
		}
	});
});
