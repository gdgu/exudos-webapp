var blobInput = document.querySelector('input[name=blob]')
blobInput.value = ''

var fileInput = document.querySelector('input[name=file]')
fileInput.addEventListener('change', function() {
    var file = this.files[0]
    var fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    
    fileReader.addEventListener('load', function() {
        blobInput.value = fileReader.result
    })
})