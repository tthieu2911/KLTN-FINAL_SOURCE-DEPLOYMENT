var userSchema = require('./../../data/models/user')

var isloggedIn = async (req,res,next)=>
{
    if(!req.session.userId){
        return next();
    }
    else {
        var check_type;
        await check_type_id(req.session.userId,(value)=>{
            check_type=value;
        })
        if(check_type==='supplier'){
            res.redirect('/supplier');
        }
           
        else if(check_type==='customer'){
            res.redirect('/customer');
        }
        else{
            res.redirect('/shipper');
        }
    }
    
}

async function requiresLoginCustom(req, res, next){
    
    if (req.session && req.session.userId) {
        var check_type;
        await check_type_id(req.session.userId,(value)=>{
            check_type=value;
        })
        if (check_type == 'customer')
            return next();
        else {
            var err = new Error('You must be logged in to view this page.');
            err.status = 401;
            return next(err);
        }
    } else {
      var err = new Error('You must be logged in to view this page.');
      err.status = 401;
      return next(err);
    }
  }
async function requiresLoginSupplier(req, res, next){
    
    if (req.session && req.session.userId) {
        var check_type;
        await check_type_id(req.session.userId,(value)=>{
            check_type=value;
        })
        if (check_type == 'supplier')
            return next();
        else {
            var err = new Error('You must be logged in to view this page.');
            err.status = 401;
            return next(err);
        }
    } else {
      var err = new Error('You must be logged in to view this page.');
      err.status = 401;
      return next(err);
    }
  }
async function requiresLoginShipper(req, res, next){
    
    if (req.session && req.session.userId) {
        var check_type;
        await check_type_id(req.session.userId,(value)=>{
            check_type=value;
        })
        if (check_type == 'shipper')
            return next();
        else {
            var err = new Error('You must be logged in to view this page.');
            err.status = 401;
            return next(err);
        }
    } else {
      var err = new Error('You must be logged in to view this page.');
      err.status = 401;
      return next(err);
    }
  }
var check_type_id = async(id,callback)=>{
    var value =null;
    await userSchema.findById(id,(err,data)=>{
        if (err) return (err);
        value = data.type;
    })

    return callback(value);
}
// Hàm xử lí phân trang
var createPagination = function (pagination, options) {
    if (!pagination) {
        return '';
    }

    var limit = pagination.limit;
    var queryParams='';
    var page = pagination.page;
    var leftText = ' Prev ';
    var rightText = ' Next ';
    var paginationClass = 'pagination pagination-sm';

    if (options.hash.limit) limit = +options.hash.limit;
    if (options.hash.leftText) leftText = options.hash.leftText;
    if (options.hash.rightText) rightText = options.hash.rightText;
    if (options.hash.paginationClass) paginationClass = options.hash.paginationClass;

    // var pageCount = Math.ceil(pagination.totalRows / pagination.limit);
    var pageCount =  pagination.limit;
    //query params 
    if(pagination.queryParams){
        queryParams = '&';
        for (var key in pagination.queryParams) {
            if (pagination.queryParams.hasOwnProperty(key) && key !== 'page') {
                queryParams += key+"="+pagination.queryParams[key]+"&";
            }
        }
        var lastCharacterOfQueryParams = queryParams.substr(queryParams.length-1,1);

        if(lastCharacterOfQueryParams === "&"){
            //trim off last & character
            queryParams = queryParams.substring(0,queryParams.length-1);
        }
    }


    var template = '<ul class="' + paginationClass + '">';

    // ========= Previous Button ===============
    if (page === 1) {
        n = 1;
        template = template + '<li  class="page-item" class="disabled"><a class="page-link" href="#">'+ leftText +'</a></li>';
    }
    else {
        n = page - 1;
        template = template + '<li  class="page-item"><a class="page-link"  href="?page=' + n + queryParams + '">'+ leftText +'</a></li>';
    }

    // ========= Page Numbers Middle ======

    var i = 0;
    var leftCount = Math.ceil(limit / 2) - 1;
    var rightCount = limit - leftCount - 1;
    if (page + rightCount > pageCount) {
        leftCount = limit - (pageCount - page) - 1;
    }
    if (page - leftCount < 1) {
        leftCount = page - 1;
    }
    var start = page - leftCount;

    while (i < limit && i < pageCount) {
        n = start;
        if (start === page) {
            template = template + '<li class="page-item"  class="active"><a class="page-link" href="?page=' + n + queryParams + '">' + n + '</a></li>';
        } else {
            template = template + '<li class="page-item" ><a class="page-link" href="?page=' + n + queryParams + '">' + n + '</a></li>';
        }

        start++;
        i++;
    }

    // ========== Next Button ===========
    if (page === pageCount || pageCount === 0) {
        n = pageCount;
        template = template + '<li class="page-item" class="disabled"><a class="page-link" href="#">'+ rightText +'</i></a></li>';
    }
    else {
        n = page + 1;
        template = template + '<li class="page-item"><a  class="page-link" href="?page=' + n + queryParams + '">'+ rightText +'</a></li>';
    }
    template = template + '</ul>';
    return template;
}
;
module.exports={
    requiresLoginCustom,
    requiresLoginSupplier,
    requiresLoginShipper,
    isloggedIn,
    createPagination,
}