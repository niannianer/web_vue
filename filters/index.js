/**
 * Created by DELL on 2017/6/6.
 */
export let textToHtml =(input)=>{
    if (!input) {
        return '';
    }
    return input.replace(/\n/g,'<br>');
};
