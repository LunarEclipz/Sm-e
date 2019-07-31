module.exports= {
    selectCheck: function(value, selectValue){
        if(value == selectValue){
            return 'selected';
        }
        else{
            return '';
        }
    }
}
